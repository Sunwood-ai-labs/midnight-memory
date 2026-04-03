from __future__ import annotations

import argparse
import json
import re
import tempfile
import wave
from pathlib import Path

from google import genai
from google.genai import types

from scripts import gemini_srt


TIMESTAMP_RE = re.compile(r"^(?P<hours>\d+):(?P<minutes>\d{2}):(?P<seconds>\d{2})[,.](?P<millis>\d{3})$")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Extract uncovered intro/outro subtitle candidates from a track segment with Gemini."
    )
    parser.add_argument("--audio", required=True, type=Path)
    parser.add_argument("--lyrics", required=True, type=Path)
    parser.add_argument(
        "--reference-srt",
        required=True,
        type=Path,
        help="Combined or main SRT used to detect the uncovered intro/outro gap.",
    )
    parser.add_argument("--part", required=True, choices=["intro", "outro"])
    parser.add_argument("--report-output", required=True, type=Path)
    parser.add_argument(
        "--srt-output",
        type=Path,
        help="Optional SRT path written from the selected primary model.",
    )
    parser.add_argument(
        "--model",
        dest="models",
        action="append",
        help="Repeat to query multiple Gemini models. Defaults to gemini-3-pro-preview and gemini-3.1-pro-preview.",
    )
    parser.add_argument(
        "--primary-model",
        help="Model name used for --srt-output. Defaults to the first --model entry.",
    )
    return parser.parse_args()


def parse_reference_srt(path: Path) -> list[dict[str, object]]:
    raw_text = path.read_text(encoding="utf-8-sig").strip()
    if not raw_text:
        raise ValueError(f"SRT file is empty: {path}")

    cues: list[dict[str, object]] = []
    for block in re.split(r"\r?\n\r?\n+", raw_text):
        lines = [line.rstrip() for line in block.splitlines() if line.strip()]
        if len(lines) < 3:
            raise ValueError(f"Invalid SRT block in {path}: {block!r}")
        _, timing, *text_lines = lines
        if "-->" not in timing:
            raise ValueError(f"Missing SRT timing arrow in {path}: {timing!r}")
        raw_start, raw_end = [part.strip() for part in timing.split("-->", 1)]
        cues.append(
            {
                "start_seconds": parse_srt_timestamp(raw_start),
                "end_seconds": parse_srt_timestamp(raw_end),
                "text": "\n".join(text_lines).strip(),
            }
        )

    cues.sort(key=lambda cue: float(cue["start_seconds"]))
    return cues


def detect_gap_bounds(
    cues: list[dict[str, object]], audio_duration: float, part: str
) -> tuple[float, float]:
    if not cues:
        raise ValueError("At least one cue is required to detect a gap.")

    if part == "intro":
        start = 0.0
        end = float(cues[0]["start_seconds"])
    else:
        start = float(cues[-1]["end_seconds"])
        end = audio_duration

    start = round(max(0.0, min(start, audio_duration)), 3)
    end = round(max(start, min(end, audio_duration)), 3)
    if end - start < 0.05:
        raise ValueError(f"No uncovered {part} gap was found.")
    return start, end


def parse_srt_timestamp(value: str) -> float:
    match = TIMESTAMP_RE.match(value.strip())
    if match is None:
        raise ValueError(f"Invalid SRT timestamp: {value!r}")
    hours = int(match.group("hours"))
    minutes = int(match.group("minutes"))
    seconds = int(match.group("seconds"))
    millis = int(match.group("millis"))
    return hours * 3600 + minutes * 60 + seconds + millis / 1000


def slice_wav(source_path: Path, start_seconds: float, end_seconds: float, output_path: Path) -> None:
    with wave.open(str(source_path), "rb") as src:
        frame_rate = src.getframerate()
        src.setpos(int(start_seconds * frame_rate))
        frames = max(0, int((end_seconds - start_seconds) * frame_rate))
        params = src.getparams()
        data = src.readframes(frames)

    with wave.open(str(output_path), "wb") as dst:
        dst.setparams(params)
        dst.writeframes(data)


def normalize_gap_cues(cues: list[dict[str, object]], duration: float) -> list[dict[str, object]]:
    normalized: list[dict[str, object]] = []
    last_end = 0.0
    for cue in cues:
        raw_text = cue.get("text")
        if not isinstance(raw_text, str) or not raw_text.strip():
            raise ValueError("Each gap cue must include non-empty text.")
        start = gemini_srt.require_cue_seconds(cue, "start_seconds")
        end = gemini_srt.require_cue_seconds(cue, "end_seconds")
        start = max(0.0, min(start, duration))
        end = max(start + 0.05, min(end, duration))
        if start < last_end:
            start = last_end
            end = max(start + 0.05, end)
        normalized.append(
            {
                "start_seconds": round(start, 3),
                "end_seconds": round(min(end, duration), 3),
                "text": raw_text.strip(),
            }
        )
        last_end = normalized[-1]["end_seconds"]  # type: ignore[assignment]
    return normalized


def rebase_cues(cues: list[dict[str, object]], offset_seconds: float) -> list[dict[str, object]]:
    return [
        {
            "start_seconds": round(float(cue["start_seconds"]) + offset_seconds, 3),
            "end_seconds": round(float(cue["end_seconds"]) + offset_seconds, 3),
            "text": str(cue["text"]),
        }
        for cue in cues
    ]


def build_gap_prompt(lyrics: list[str], clip_duration: float, part: str) -> str:
    lyric_block = "\n".join(f"{index}. {line}" for index, line in enumerate(lyrics, start=1))
    return f"""
You are transcribing the uncovered {part} section of a song clip.

Full-song lyric candidates for reference only:
{lyric_block}

Rules:
- Return a JSON array only.
- Each item must have: text, start_seconds, end_seconds.
- Use seconds from the start of this clip.
- Keep times in ascending order and do not overlap cues.
- Keep every timestamp within 0 and {clip_duration:.3f}.
- Preserve clearly audible words when they are stable.
- For repeated ad-libs or vocalizations, use a short stable label such as Ah, Ooh, Oh, or Yeah only when that sound is clear.
- If a lyric fragment clearly matches the song lyric list, return the actual heard text.
- If wording is too unstable to trust, omit the cue instead of guessing a full sentence.
- Leave purely instrumental spans uncovered.
""".strip()


def transcribe_gap(
    client: genai.Client,
    clip_path: Path,
    models: list[str],
    prompt: str,
    clip_duration: float,
) -> dict[str, list[dict[str, object]]]:
    uploaded_file = client.files.upload(file=clip_path)
    uploaded_file = gemini_srt.wait_until_active(client, uploaded_file)

    results: dict[str, list[dict[str, object]]] = {}
    for model in models:
        response = client.models.generate_content(
            model=model,
            contents=[uploaded_file, prompt],
            config=types.GenerateContentConfig(
                temperature=0.0,
                response_mime_type="application/json",
            ),
        )
        cues = gemini_srt.parse_json_array(response.text or "")
        results[model] = normalize_gap_cues(cues, clip_duration)
    return results


def build_report(
    audio_path: Path,
    lyrics_path: Path,
    reference_srt_path: Path,
    part: str,
    gap_start: float,
    gap_end: float,
    model_results: dict[str, list[dict[str, object]]],
) -> dict[str, object]:
    return {
        "audio": str(audio_path),
        "lyrics": str(lyrics_path),
        "reference_srt": str(reference_srt_path),
        "part": part,
        "gap_start_seconds": gap_start,
        "gap_end_seconds": gap_end,
        "clip_duration_seconds": round(gap_end - gap_start, 3),
        "models": [
            {
                "model": model,
                "relative_cues": cues,
                "absolute_cues": rebase_cues(cues, gap_start),
            }
            for model, cues in model_results.items()
        ],
    }


def main() -> None:
    args = parse_args()
    models = args.models or ["gemini-3-pro-preview", "gemini-3.1-pro-preview"]
    primary_model = args.primary_model or models[0]
    if primary_model not in models:
        raise ValueError("--primary-model must also appear in --model.")

    root = Path(__file__).resolve().parent.parent
    audio_path = args.audio.resolve()
    lyrics_path = args.lyrics.resolve()
    reference_srt_path = args.reference_srt.resolve()
    report_output = args.report_output.resolve()
    report_output.parent.mkdir(parents=True, exist_ok=True)

    lyrics = gemini_srt.load_lyrics(lyrics_path)
    audio_duration = gemini_srt.audio_duration_seconds(audio_path)
    reference_cues = parse_reference_srt(reference_srt_path)
    gap_start, gap_end = detect_gap_bounds(reference_cues, audio_duration, args.part)
    clip_duration = round(gap_end - gap_start, 3)

    api_key = gemini_srt.load_api_key(root)
    client = genai.Client(api_key=api_key)
    prompt = build_gap_prompt(lyrics, clip_duration, args.part)

    with tempfile.TemporaryDirectory() as tmp_dir:
        clip_path = Path(tmp_dir) / f"{args.part}_gap.wav"
        slice_wav(audio_path, gap_start, gap_end, clip_path)
        model_results = transcribe_gap(client, clip_path, models, prompt, clip_duration)

    report = build_report(
        audio_path=audio_path,
        lyrics_path=lyrics_path,
        reference_srt_path=reference_srt_path,
        part=args.part,
        gap_start=gap_start,
        gap_end=gap_end,
        model_results=model_results,
    )
    report_output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    if args.srt_output is not None:
        absolute_cues = rebase_cues(model_results[primary_model], gap_start)
        srt_output = args.srt_output.resolve()
        srt_output.parent.mkdir(parents=True, exist_ok=True)
        srt_output.write_text(gemini_srt.cues_to_srt(absolute_cues), encoding="utf-8")

    print(f"Wrote {report_output}")
    if args.srt_output is not None:
        print(f"Wrote {srt_output}")


if __name__ == "__main__":
    main()
