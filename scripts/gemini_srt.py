from __future__ import annotations

import argparse
import json
import shutil
import tempfile
import time
from pathlib import Path
import wave

from google import genai
from google.genai import types


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate SRT subtitles from audio using Gemini.")
    parser.add_argument("--audio", required=True, type=Path)
    parser.add_argument("--lyrics", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--model", default="gemini-2.5-pro")
    return parser.parse_args()


def load_api_key(root: Path) -> str:
    env_path = root / ".env"
    if not env_path.exists():
        raise FileNotFoundError(f"Missing .env: {env_path}")

    for line in env_path.read_text(encoding="utf-8").splitlines():
        if line.startswith("GEMINI_API_KEY="):
            key = line.split("=", 1)[1].strip()
            if key:
                return key
    raise RuntimeError("GEMINI_API_KEY was not found in .env")


def load_lyrics(path: Path) -> list[str]:
    lines = []
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line:
            continue
        if line.startswith("Midnight Memory - "):
            continue
        lines.append(line)
    if not lines:
        raise RuntimeError("No lyric lines were found.")
    return lines


def audio_duration_seconds(path: Path) -> float:
    with wave.open(str(path), "rb") as wav_file:
        return wav_file.getnframes() / float(wav_file.getframerate())


def wait_until_active(client: genai.Client, uploaded_file: types.File) -> types.File:
    for _ in range(120):
        current = client.files.get(name=uploaded_file.name)
        state = getattr(current, "state", None)
        state_name = getattr(state, "name", str(state))
        if state_name == "ACTIVE":
            return current
        if state_name == "FAILED":
            raise RuntimeError(f"Gemini file processing failed: {current}")
        time.sleep(2)
    raise TimeoutError("Timed out while waiting for Gemini file processing.")


def parse_json_array(raw_text: str) -> list[dict[str, object]]:
    text = raw_text.strip()
    if text.startswith("```"):
        lines = [line for line in text.splitlines() if not line.startswith("```")]
        text = "\n".join(lines).strip()
    data = json.loads(text)
    if not isinstance(data, list):
        raise ValueError("Gemini response was not a JSON array.")
    return data


def clamp_cues(
    cues: list[dict[str, object]], duration: float, lyrics: list[str]
) -> list[dict[str, object]]:
    normalized: list[dict[str, object]] = []
    last_end = 0.0
    for cue in cues:
        line_number = int(cue["line_number"])
        if line_number < 1 or line_number > len(lyrics):
            raise ValueError(f"Invalid lyric line number: {line_number}")
        text = lyrics[line_number - 1]
        start = float(cue["start_seconds"])
        end = float(cue["end_seconds"])
        start = max(0.0, min(start, duration))
        end = max(start + 0.05, min(end, duration))
        if start < last_end:
            start = last_end
            end = max(start + 0.05, end)
        normalized.append(
            {
                "start_seconds": round(start, 3),
                "end_seconds": round(min(end, duration), 3),
                "text": text,
                "line_number": line_number,
            }
        )
        last_end = normalized[-1]["end_seconds"]  # type: ignore[assignment]
    return normalized


def format_srt_timestamp(seconds: float) -> str:
    total_ms = int(round(seconds * 1000))
    hours, remainder = divmod(total_ms, 3_600_000)
    minutes, remainder = divmod(remainder, 60_000)
    secs, millis = divmod(remainder, 1000)
    return f"{hours:02}:{minutes:02}:{secs:02},{millis:03}"


def cues_to_srt(cues: list[dict[str, object]]) -> str:
    blocks = []
    for index, cue in enumerate(cues, start=1):
        blocks.append(
            "\n".join(
                [
                    str(index),
                    f"{format_srt_timestamp(float(cue['start_seconds']))} --> {format_srt_timestamp(float(cue['end_seconds']))}",
                    str(cue["text"]),
                ]
            )
        )
    return "\n\n".join(blocks) + "\n"


def build_prompt(lyrics: list[str], duration: float) -> str:
    lyric_block = "\n".join(f"{index}. {line}" for index, line in enumerate(lyrics, start=1))
    return f"""
You are creating line-level subtitles for a song excerpt.

Use only lyric lines that actually appear in this audio file.
Do not invent or paraphrase lyrics.
Return only line numbers from this candidate list:
{lyric_block}

Rules:
- Return a JSON array only.
- Each item must have: line_number, start_seconds, end_seconds.
- Use seconds from the start of the audio file.
- Keep times in ascending order.
- Do not overlap cues.
- Keep every timestamp within 0 and {duration:.3f}.
- Use one subtitle cue per lyric line whenever practical.
- If a candidate line is not sung in this audio file, omit it.
- If there is instrumental intro or outro, leave it uncovered instead of inventing text.
- Prefer line breaks that reflect the written lyric lines, not arbitrary phrases.
- Do not include the lyric text itself in the JSON. Only the line number and timing.

Example shape:
[
  {{"line_number": 1, "start_seconds": 12.34, "end_seconds": 16.20}},
  {{"line_number": 2, "start_seconds": 16.21, "end_seconds": 19.80}}
]
""".strip()


def main() -> None:
    args = parse_args()
    root = Path(__file__).resolve().parent.parent
    audio_path = args.audio.resolve()
    lyrics_path = args.lyrics.resolve()
    output_path = args.output.resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)

    api_key = load_api_key(root)
    lyrics = load_lyrics(lyrics_path)
    duration = audio_duration_seconds(audio_path)
    client = genai.Client(api_key=api_key)
    prompt = build_prompt(lyrics, duration)

    with tempfile.TemporaryDirectory() as tmp_dir:
        temp_audio_path = Path(tmp_dir) / "audio_input.wav"
        shutil.copy2(audio_path, temp_audio_path)
        uploaded_file = client.files.upload(file=temp_audio_path)
        uploaded_file = wait_until_active(client, uploaded_file)
        response = client.models.generate_content(
            model=args.model,
            contents=[uploaded_file, prompt],
            config=types.GenerateContentConfig(
                temperature=0.2,
                response_mime_type="application/json",
            ),
        )

    cues = parse_json_array(response.text or "")
    cues = clamp_cues(cues, duration, lyrics)
    output_path.write_text(cues_to_srt(cues), encoding="utf-8")


if __name__ == "__main__":
    main()
