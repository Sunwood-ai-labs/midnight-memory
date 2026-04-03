from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT / "assets" / "manifest.json"


def ensure(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(message)


def validate_subtitle_path(track_number: int, path_text: str, label: str) -> None:
    ensure(path_text.strip(), f"track #{track_number} {label} must be a non-empty path.")
    path = ROOT / path_text
    ensure(path.exists(), f"track #{track_number} {label} does not exist: {path_text}")


def validate_source_list(track_number: int, sources: object, label: str) -> None:
    ensure(isinstance(sources, list) and bool(sources), f"track #{track_number} {label} must be a non-empty list.")
    for source_number, source in enumerate(sources, start=1):
        ensure(isinstance(source, dict), f"track #{track_number} {label}[{source_number}] must be an object.")
        path_text = source.get("path")
        ensure(isinstance(path_text, str), f"track #{track_number} {label}[{source_number}] must have a string path.")
        validate_subtitle_path(track_number, path_text, f"{label}[{source_number}]")


def main() -> None:
    data = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    tracks = data.get("tracks", [])
    ensure(isinstance(tracks, list), "manifest tracks must be a list.")
    ensure(tracks, "manifest must contain at least one track.")

    for track_number, track in enumerate(tracks, start=1):
        ensure(isinstance(track, dict), f"track #{track_number} must be an object.")

        audio = track.get("audio")
        ensure(isinstance(audio, str) and audio.strip(), f"track #{track_number} requires a non-empty audio path.")

        has_subtitle = isinstance(track.get("subtitle"), str) and track["subtitle"].strip()
        subtitles = track.get("subtitles")
        has_subtitles = isinstance(subtitles, list) and bool(subtitles)
        ensure(has_subtitle or has_subtitles, f"track #{track_number} requires subtitle or subtitles.")

        if has_subtitle:
            validate_subtitle_path(track_number, track["subtitle"], "subtitle")

        if has_subtitles:
            validate_source_list(track_number, subtitles, "subtitles")

        timeline_subtitles = track.get("timelineSubtitles")
        if timeline_subtitles is not None:
            validate_source_list(track_number, timeline_subtitles, "timelineSubtitles")

    print(f"manifest OK: {len(tracks)} track(s)")


if __name__ == "__main__":
    main()
