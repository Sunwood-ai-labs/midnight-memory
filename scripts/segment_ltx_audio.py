from __future__ import annotations

import argparse
import json
import math
import re
from dataclasses import dataclass
from pathlib import Path


TIMESTAMP_RE = re.compile(r"^(?P<hours>\d+):(?P<minutes>\d{2}):(?P<seconds>\d{2})[,.](?P<millis>\d{3})$")
PART_SUFFIX_RE = re.compile(r"\.(intro|main|outro)$", re.IGNORECASE)


@dataclass(frozen=True)
class Cue:
    index: int
    start_seconds: float
    end_seconds: float
    text: str


@dataclass(frozen=True)
class Segment:
    index: int
    start_seconds: float
    end_seconds: float
    cue_start_index: int
    cue_end_index: int
    lines: list[str]

    @property
    def duration_seconds(self) -> float:
        return round(self.end_seconds - self.start_seconds, 3)


@dataclass(frozen=True)
class Track:
    track_id: str
    label: str
    source_paths: tuple[Path, ...]
    output_base_path: Path


@dataclass(frozen=True)
class TrackOutput:
    track: Track
    segments: tuple[Segment, ...]
    warnings: tuple[str, ...]
    srt_text: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Segment lyric SRT cues into per-song 7-15 second SRT chunks."
    )
    parser.add_argument(
        "input_path",
        nargs="?",
        type=Path,
        help="Manifest JSON, directory, or SRT file. Defaults to assets/manifest.json when present.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        help="Output SRT path for a single resolved track.",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        help="Directory for generated *.ltx_segments.srt files.",
    )
    parser.add_argument("--min-seconds", type=float, default=7.0)
    parser.add_argument("--max-seconds", type=float, default=15.0)
    parser.add_argument(
        "--target-seconds",
        type=float,
        default=None,
        help="Preferred segment length inside the min/max window. Defaults to a lower-third value.",
    )
    parser.add_argument(
        "--allow-out-of-range",
        action="store_true",
        help="Allow segments outside the requested duration window and report them as warnings.",
    )
    return parser.parse_args()


def default_target_seconds(min_seconds: float, max_seconds: float) -> float:
    return round(min_seconds + (max_seconds - min_seconds) / 3, 3)


def validate_duration_settings(
    min_seconds: float, max_seconds: float, target_seconds: float | None
) -> float:
    if min_seconds <= 0:
        raise ValueError("--min-seconds must be greater than 0.")
    if max_seconds < min_seconds:
        raise ValueError("--max-seconds must be greater than or equal to --min-seconds.")
    resolved_target = target_seconds
    if resolved_target is None:
        resolved_target = default_target_seconds(min_seconds, max_seconds)
    if not min_seconds <= resolved_target <= max_seconds:
        raise ValueError("--target-seconds must be within the min/max duration range.")
    return resolved_target


def parse_srt_timestamp(value: str) -> float:
    match = TIMESTAMP_RE.match(value.strip())
    if match is None:
        raise ValueError(f"Invalid SRT timestamp: {value!r}")
    hours = int(match.group("hours"))
    minutes = int(match.group("minutes"))
    seconds = int(match.group("seconds"))
    millis = int(match.group("millis"))
    return hours * 3600 + minutes * 60 + seconds + millis / 1000


def format_srt_timestamp(seconds: float) -> str:
    total_ms = int(round(seconds * 1000))
    hours, remainder = divmod(total_ms, 3_600_000)
    minutes, remainder = divmod(remainder, 60_000)
    secs, millis = divmod(remainder, 1000)
    return f"{hours:02}:{minutes:02}:{secs:02},{millis:03}"


def parse_srt(path: Path) -> list[Cue]:
    raw_text = path.read_text(encoding="utf-8-sig").strip()
    if not raw_text:
        raise ValueError(f"SRT file is empty: {path}")

    cues: list[Cue] = []
    for block_number, block in enumerate(re.split(r"\r?\n\r?\n+", raw_text), start=1):
        lines = [line.rstrip() for line in block.splitlines() if line.strip()]
        if len(lines) < 3:
            raise ValueError(f"Invalid SRT block #{block_number} in {path}")

        try:
            cue_index = int(lines[0].strip())
        except ValueError as exc:
            raise ValueError(f"Invalid cue index in block #{block_number}: {lines[0]!r}") from exc

        if "-->" not in lines[1]:
            raise ValueError(f"Missing cue timing arrow in block #{block_number}: {lines[1]!r}")
        raw_start, raw_end = [part.strip() for part in lines[1].split("-->", 1)]
        start = parse_srt_timestamp(raw_start.split()[0])
        end = parse_srt_timestamp(raw_end.split()[0])
        if end <= start:
            raise ValueError(f"End timestamp must be greater than start timestamp in block #{block_number}")

        text = "\n".join(lines[2:]).strip()
        if not text:
            raise ValueError(f"Missing cue text in block #{block_number}")

        cues.append(
            Cue(
                index=cue_index,
                start_seconds=round(start, 3),
                end_seconds=round(end, 3),
                text=text,
            )
        )

    last_end = -math.inf
    for cue in cues:
        if cue.start_seconds < last_end:
            raise ValueError("SRT cues must be sorted and non-overlapping.")
        last_end = cue.end_seconds

    return cues


def resolve_repo_path(path_text: str, root: Path) -> Path:
    raw_path = Path(path_text)
    if raw_path.is_absolute():
        return raw_path.resolve()
    return (root / raw_path).resolve()


def derive_output_base_path(source_paths: tuple[Path, ...], track_id: str, root: Path) -> Path:
    first_source = source_paths[0]
    stripped_stem = PART_SUFFIX_RE.sub("", first_source.stem)
    if stripped_stem != first_source.stem:
        return first_source.with_name(f"{stripped_stem}.srt")
    return (root / "assets" / f"{track_id}.srt").resolve()


def parse_manifest(manifest_path: Path, root: Path) -> list[Track]:
    data = json.loads(manifest_path.read_text(encoding="utf-8"))
    raw_tracks = data.get("tracks")
    if not isinstance(raw_tracks, list) or not raw_tracks:
        raise ValueError(f"Manifest does not contain tracks: {manifest_path}")

    tracks: list[Track] = []
    for track_number, raw_track in enumerate(raw_tracks, start=1):
        if not isinstance(raw_track, dict):
            raise ValueError(f"Track #{track_number} in manifest is not an object.")

        track_id = str(raw_track.get("id") or f"track-{track_number}")
        title = str(raw_track.get("title") or "").strip()
        section = str(raw_track.get("section") or "").strip()
        label = " - ".join(part for part in [title, section] if part) or track_id

        source_paths_list: list[Path] = []
        raw_subtitles = raw_track.get("subtitles")
        if isinstance(raw_subtitles, list) and raw_subtitles:
            for part_number, raw_part in enumerate(raw_subtitles, start=1):
                if not isinstance(raw_part, dict):
                    raise ValueError(f"Track {track_id} part #{part_number} is not an object.")
                part_path = raw_part.get("path")
                if not isinstance(part_path, str) or not part_path.strip():
                    raise ValueError(f"Track {track_id} part #{part_number} is missing a path.")
                source_paths_list.append(resolve_repo_path(part_path, root))
        else:
            raw_subtitle = raw_track.get("subtitle")
            if not isinstance(raw_subtitle, str) or not raw_subtitle.strip():
                raise ValueError(f"Track {track_id} is missing subtitle/subtitles paths.")
            source_paths_list.append(resolve_repo_path(raw_subtitle, root))

        source_paths = tuple(source_paths_list)
        raw_output_base = raw_track.get("subtitle")
        if isinstance(raw_output_base, str) and raw_output_base.strip():
            output_base_path = resolve_repo_path(raw_output_base, root)
        else:
            output_base_path = derive_output_base_path(source_paths, track_id, root)

        tracks.append(
            Track(
                track_id=track_id,
                label=label,
                source_paths=source_paths,
                output_base_path=output_base_path,
            )
        )

    return tracks


def track_from_srt_path(source_path: Path) -> Track:
    resolved = source_path.resolve()
    return Track(
        track_id=resolved.stem,
        label=resolved.stem,
        source_paths=(resolved,),
        output_base_path=resolved,
    )


def resolve_tracks(input_path: Path | None, root: Path) -> list[Track]:
    resolved_input = input_path
    if resolved_input is None:
        default_manifest = root / "assets" / "manifest.json"
        if default_manifest.exists():
            resolved_input = default_manifest
        else:
            resolved_input = root / "assets"

    resolved = resolved_input.expanduser()
    if not resolved.is_absolute():
        resolved = (Path.cwd() / resolved).resolve()
    else:
        resolved = resolved.resolve()

    if not resolved.exists():
        raise FileNotFoundError(f"Input path was not found: {resolved}")

    if resolved.is_dir():
        manifest_path = resolved / "manifest.json"
        if manifest_path.exists():
            return parse_manifest(manifest_path, root)
        sources = sorted(path for path in resolved.glob("*.srt") if path.is_file())
        if not sources:
            raise FileNotFoundError(f"No .srt files were found in {resolved}")
        return [track_from_srt_path(path) for path in sources]

    if resolved.suffix.lower() == ".json":
        return parse_manifest(resolved, root)

    if resolved.suffix.lower() == ".srt":
        return [track_from_srt_path(resolved)]

    raise ValueError(f"Input path must be a manifest JSON, directory, or .srt file: {resolved}")


def load_track_cues(track: Track) -> list[Cue]:
    merged: list[Cue] = []
    last_end = -math.inf
    for source_path in track.source_paths:
        if not source_path.exists():
            raise FileNotFoundError(f"Missing subtitle file for track {track.track_id}: {source_path}")
        for cue in parse_srt(source_path):
            if cue.start_seconds < last_end:
                raise ValueError(
                    f"Track {track.track_id} has overlapping or unsorted cues across source files."
                )
            merged.append(
                Cue(
                    index=len(merged) + 1,
                    start_seconds=cue.start_seconds,
                    end_seconds=cue.end_seconds,
                    text=cue.text,
                )
            )
            last_end = cue.end_seconds

    if not merged:
        raise ValueError(f"Track {track.track_id} did not resolve to any cues.")

    return merged


def segment_penalty(
    duration: float, min_seconds: float, max_seconds: float, target_seconds: float
) -> float:
    if min_seconds <= duration <= max_seconds:
        return abs(duration - target_seconds)
    if duration < min_seconds:
        delta = min_seconds - duration
        return 1_000.0 + delta * delta * 100.0
    delta = duration - max_seconds
    return 1_000.0 + delta * delta * 100.0


def segment_cues(
    cues: list[Cue],
    min_seconds: float = 7.0,
    max_seconds: float = 15.0,
    target_seconds: float | None = None,
) -> list[Segment]:
    target_seconds = validate_duration_settings(min_seconds, max_seconds, target_seconds)
    if not cues:
        raise ValueError("No cues were found.")

    cue_count = len(cues)
    best_costs = [math.inf] * (cue_count + 1)
    next_break = [-1] * cue_count
    best_costs[cue_count] = 0.0

    for start in range(cue_count - 1, -1, -1):
        segment_start = cues[start].start_seconds
        for end in range(start, cue_count):
            duration = cues[end].end_seconds - segment_start
            cost = segment_penalty(duration, min_seconds, max_seconds, target_seconds)
            total_cost = cost + best_costs[end + 1] + 0.01
            if total_cost < best_costs[start]:
                best_costs[start] = total_cost
                next_break[start] = end + 1

    segments: list[Segment] = []
    cursor = 0
    while cursor < cue_count:
        end_cursor = next_break[cursor]
        if end_cursor <= cursor:
            raise RuntimeError("Failed to resolve cue segmentation.")
        slice_cues = cues[cursor:end_cursor]
        segments.append(
            Segment(
                index=len(segments) + 1,
                start_seconds=round(slice_cues[0].start_seconds, 3),
                end_seconds=round(slice_cues[-1].end_seconds, 3),
                cue_start_index=slice_cues[0].index,
                cue_end_index=slice_cues[-1].index,
                lines=[cue.text for cue in slice_cues],
            )
        )
        cursor = end_cursor

    return segments


def normalize_gapless_segments(segments: list[Segment]) -> list[Segment]:
    if not segments:
        return []

    normalized: list[Segment] = []
    for index, segment in enumerate(segments):
        start_seconds = segment.start_seconds if index == 0 else normalized[-1].end_seconds
        if index == len(segments) - 1:
            end_seconds = segment.end_seconds
        else:
            next_segment = segments[index + 1]
            end_seconds = round((segment.end_seconds + next_segment.start_seconds) / 2, 3)
        if end_seconds <= start_seconds:
            end_seconds = round(start_seconds + 0.001, 3)
        normalized.append(
            Segment(
                index=segment.index,
                start_seconds=round(start_seconds, 3),
                end_seconds=end_seconds,
                cue_start_index=segment.cue_start_index,
                cue_end_index=segment.cue_end_index,
                lines=segment.lines,
            )
        )

    return normalized


def segment_status(duration: float, min_seconds: float, max_seconds: float) -> str:
    if duration < min_seconds:
        return "short"
    if duration > max_seconds:
        return "long"
    return "ok"


def build_track_warnings(track: Track, segments: list[Segment], min_seconds: float, max_seconds: float) -> list[str]:
    warnings: list[str] = []
    for segment in segments:
        status = segment_status(segment.duration_seconds, min_seconds, max_seconds)
        if status == "ok":
            continue
        warnings.append(
            f"Track {track.track_id} segment {segment.index} is {segment.duration_seconds:.3f}s "
            f"and falls outside the requested {min_seconds:.1f}-{max_seconds:.1f}s window."
        )
    return warnings


def segments_to_srt(segments: list[Segment]) -> str:
    blocks: list[str] = []
    for segment in segments:
        blocks.append(
            "\n".join(
                [
                    str(segment.index),
                    f"{format_srt_timestamp(segment.start_seconds)} --> {format_srt_timestamp(segment.end_seconds)}",
                    "\n".join(segment.lines),
                ]
            )
        )
    return "\n\n".join(blocks) + "\n"


def validate_track_output(
    track: Track, warnings: list[str], *, allow_out_of_range: bool
) -> None:
    if allow_out_of_range or not warnings:
        return

    warning_lines = "\n".join(f"- {warning}" for warning in warnings)
    raise ValueError(
        "One or more segments fell outside the requested duration window for "
        f"{track.track_id}.\n"
        "Use --allow-out-of-range if you want to keep warning-only output.\n"
        f"{warning_lines}"
    )


def default_output_path(track: Track, output_dir: Path | None) -> Path:
    base_dir = output_dir.resolve() if output_dir is not None else track.output_base_path.parent
    return base_dir / f"{track.output_base_path.stem}.ltx_segments.srt"


def run_for_track(
    track: Track,
    min_seconds: float,
    max_seconds: float,
    target_seconds: float | None,
    *,
    allow_out_of_range: bool = False,
) -> TrackOutput:
    target_seconds = validate_duration_settings(min_seconds, max_seconds, target_seconds)
    cues = load_track_cues(track)
    raw_segments = segment_cues(
        cues,
        min_seconds=min_seconds,
        max_seconds=max_seconds,
        target_seconds=target_seconds,
    )
    segments = normalize_gapless_segments(raw_segments)
    warnings = build_track_warnings(track, segments, min_seconds, max_seconds)
    validate_track_output(track, warnings, allow_out_of_range=allow_out_of_range)
    return TrackOutput(
        track=track,
        segments=tuple(segments),
        warnings=tuple(warnings),
        srt_text=segments_to_srt(segments),
    )


def main() -> None:
    args = parse_args()
    root = Path(__file__).resolve().parent.parent
    target_seconds = validate_duration_settings(args.min_seconds, args.max_seconds, args.target_seconds)
    tracks = resolve_tracks(args.input_path, root)

    if len(tracks) > 1 and args.output is not None:
        raise ValueError("--output can only be used when the input resolves to a single track.")
    if args.output is not None and args.output_dir is not None:
        raise ValueError("Use either --output or --output-dir, not both.")

    output_jobs: list[tuple[Path, TrackOutput]] = []
    for track in tracks:
        result = run_for_track(
            track=track,
            min_seconds=args.min_seconds,
            max_seconds=args.max_seconds,
            target_seconds=target_seconds,
            allow_out_of_range=args.allow_out_of_range,
        )
        destination = args.output.resolve() if args.output is not None else default_output_path(track, args.output_dir)
        output_jobs.append((destination, result))

    for destination, result in output_jobs:
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(result.srt_text, encoding="utf-8")
        warning_suffix = "" if not result.warnings else f", {len(result.warnings)} warnings"
        print(f"Wrote {destination} ({len(result.segments)} segments{warning_suffix})")


if __name__ == "__main__":
    main()
