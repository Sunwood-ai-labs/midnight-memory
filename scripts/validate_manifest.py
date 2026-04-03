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
            for subtitle_number, subtitle in enumerate(subtitles, start=1):
                ensure(isinstance(subtitle, dict), f"track #{track_number} subtitles[{subtitle_number}] must be an object.")
                path_text = subtitle.get("path")
                ensure(isinstance(path_text, str), f"track #{track_number} subtitles[{subtitle_number}] must have a string path.")
                validate_subtitle_path(track_number, path_text, f"subtitles[{subtitle_number}]")

    print(f"manifest OK: {len(tracks)} track(s)")


if __name__ == "__main__":
    main()
