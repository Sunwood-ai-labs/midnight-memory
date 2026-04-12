from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
import wave


ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT / "assets" / "manifest.json"

if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from scripts import split_audio_by_srt


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Create silent WAV placeholders and split clip outputs for viewer tests.")
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


def iter_split_jobs() -> list[tuple[Path, Path, Path]]:
    data = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    tracks = data.get("tracks", [])
    output_root = ROOT / "private-assets" / "ltx-segment-splits"
    jobs: list[tuple[Path, Path, Path]] = []

    for track in tracks:
        if not isinstance(track, dict):
            continue
        raw_audio = track.get("audio")
        if not isinstance(raw_audio, str) or not raw_audio.strip():
            continue
        audio_path = ROOT / raw_audio
        timeline_sources = track.get("timelineSubtitles")
        if not isinstance(timeline_sources, list):
            continue
        for raw_source in timeline_sources:
            if not isinstance(raw_source, dict):
                continue
            raw_path = raw_source.get("path")
            if not isinstance(raw_path, str) or not raw_path.strip():
                continue
            srt_path = ROOT / raw_path
            output_dir = split_audio_by_srt.default_output_dir(output_root, srt_path)
            jobs.append((audio_path, srt_path, output_dir))

    return jobs


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

    prepared_segments = 0
    for audio_path, srt_path, output_dir in iter_split_jobs():
        if not audio_path.exists() or not srt_path.exists():
            continue
        split_audio_by_srt.split_track_by_srt(
            srt_path,
            audio_path,
            output_dir,
            overwrite=True,
        )
        prepared_segments += 1
        print(f"prepared {output_dir.relative_to(ROOT)}")

    if not prepared_segments:
        print("no split audio prepared")


if __name__ == "__main__":
    main()
