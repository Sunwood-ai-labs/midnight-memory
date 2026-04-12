from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from scripts import create_stub_audio, split_audio_by_srt


MANIFEST_PATH = ROOT / "assets" / "manifest.json"
OUTPUT_ROOT = ROOT / "private-assets" / "ltx-segment-splits"


def ensure_stub_audio(duration: float = 120.0, sample_rate: int = 8000) -> int:
    created = 0
    for path in create_stub_audio.iter_audio_paths():
        if path.exists():
            continue
        create_stub_audio.write_silence(path, duration, sample_rate)
        created += 1
        print(f"created {path.relative_to(ROOT)}")
    if not created:
        print("no stub audio needed")
    return created


def iter_timeline_srt_paths() -> list[Path]:
    data = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    tracks = data.get("tracks", [])
    resolved_paths: list[Path] = []
    for track in tracks:
        if not isinstance(track, dict):
            continue
        timeline_entries = track.get("timelineSubtitles")
        if not isinstance(timeline_entries, list):
            continue
        for entry in timeline_entries:
            if not isinstance(entry, dict):
                continue
            raw_path = entry.get("path")
            if isinstance(raw_path, str) and raw_path.strip():
                resolved_paths.append(split_audio_by_srt.resolve_repo_path(raw_path, ROOT))
    return resolved_paths


def main() -> None:
    ensure_stub_audio()
    audio_map = split_audio_by_srt.load_manifest_audio_map(MANIFEST_PATH, ROOT)
    srt_paths = iter_timeline_srt_paths()
    if not srt_paths:
        print("no timeline subtitles found")
        return

    for srt_path in srt_paths:
        audio_path = split_audio_by_srt.resolve_audio_path(
            srt_path,
            root=ROOT,
            manifest_path=MANIFEST_PATH,
            audio_override=None,
            cached_audio_map=audio_map,
        )
        output_dir = split_audio_by_srt.default_output_dir(OUTPUT_ROOT, srt_path)
        split_audio_by_srt.split_track_by_srt(
            srt_path,
            audio_path,
            output_dir,
            overwrite=True,
        )
        print(f"prepared {output_dir.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
