from __future__ import annotations

import argparse
import json
from pathlib import Path
import wave


ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT / "assets" / "manifest.json"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Create silent WAV placeholders for viewer tests.")
    parser.add_argument("--duration", type=float, default=120.0, help="Duration of each generated WAV in seconds.")
    parser.add_argument("--sample-rate", type=int, default=8000, help="Sample rate for generated WAV files.")
    return parser.parse_args()


def iter_audio_paths() -> list[Path]:
    data = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    tracks = data.get("tracks", [])
    paths: list[Path] = []
    for track in tracks:
        audio = track.get("audio")
        if isinstance(audio, str) and audio.strip():
            paths.append(ROOT / audio)
    return paths


def write_silence(path: Path, duration: float, sample_rate: int) -> None:
    frame_count = int(duration * sample_rate)
    silence_chunk = b"\x00\x00" * min(frame_count, sample_rate)

    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)

        remaining = frame_count
        while remaining > 0:
            chunk_frames = min(remaining, sample_rate)
            wav_file.writeframes(silence_chunk[: chunk_frames * 2])
            remaining -= chunk_frames


def main() -> None:
    args = parse_args()
    created = 0
    for path in iter_audio_paths():
        if path.exists():
            continue
        write_silence(path, args.duration, args.sample_rate)
        created += 1
        print(f"created {path.relative_to(ROOT)}")

    if not created:
        print("no stub audio needed")


if __name__ == "__main__":
    main()
