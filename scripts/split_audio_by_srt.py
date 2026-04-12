from __future__ import annotations

import argparse
import json
import re
import sys
import wave
from dataclasses import asdict, dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from scripts.segment_ltx_audio import Cue, parse_srt, resolve_repo_path

LTX_SUFFIX_RE = re.compile(r"\.ltx_segments$", re.IGNORECASE)


@dataclass(frozen=True)
class SplitFile:
    index: int
    start_seconds: float
    end_seconds: float
    text: str
    kind: str
    output_path: Path

    @property
    def duration_seconds(self) -> float:
        return round(self.end_seconds - self.start_seconds, 3)


@dataclass(frozen=True)
class SplitResult:
    srt_path: Path
    audio_path: Path
    output_dir: Path
    files: tuple[SplitFile, ...]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Split WAV audio into per-cue files using an SRT timeline such as *.ltx_segments.srt."
    )
    parser.add_argument(
        "srt_paths",
        nargs="+",
        type=Path,
        help="One or more SRT files used as the split timeline.",
    )
    parser.add_argument(
        "--audio",
        type=Path,
        help="Override audio path for a single SRT input.",
    )
    parser.add_argument(
        "--manifest",
        type=Path,
        help="Manifest JSON used to resolve audio paths when --audio is not provided. Defaults to assets/manifest.json.",
    )
    parser.add_argument(
        "--output-root",
        type=Path,
        default=Path("private-assets/ltx-segment-splits"),
        help="Directory that receives one subdirectory per input SRT.",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Overwrite existing split WAV files and metadata.",
    )
    return parser.parse_args()


def resolve_cli_path(path: Path, root: Path) -> Path:
    expanded = path.expanduser()
    if expanded.is_absolute():
        return expanded.resolve()
    return (root / expanded).resolve()


def repo_relative_path(path: Path, root: Path) -> str | None:
    try:
        return path.resolve().relative_to(root.resolve()).as_posix()
    except ValueError:
        return None


def load_manifest_audio_map(manifest_path: Path, root: Path) -> dict[Path, Path]:
    data = json.loads(manifest_path.read_text(encoding="utf-8"))
    raw_tracks = data.get("tracks")
    if not isinstance(raw_tracks, list):
        raise ValueError(f"Manifest does not contain a tracks list: {manifest_path}")

    audio_map: dict[Path, Path] = {}
    for track_number, raw_track in enumerate(raw_tracks, start=1):
        if not isinstance(raw_track, dict):
            raise ValueError(f"Track #{track_number} is not an object.")

        raw_audio = raw_track.get("audio")
        if not isinstance(raw_audio, str) or not raw_audio.strip():
            continue
        audio_path = resolve_repo_path(raw_audio, root)

        for candidate in iter_track_subtitle_paths(raw_track, root):
            existing = audio_map.get(candidate)
            if existing is not None and existing != audio_path:
                raise ValueError(f"Subtitle path is mapped to multiple audio files: {candidate}")
            audio_map[candidate] = audio_path

    return audio_map


def iter_track_subtitle_paths(track: dict[str, object], root: Path) -> list[Path]:
    paths: list[Path] = []

    raw_subtitle = track.get("subtitle")
    if isinstance(raw_subtitle, str) and raw_subtitle.strip():
        paths.append(resolve_repo_path(raw_subtitle, root))

    for key in ("subtitles", "timelineSubtitles"):
        raw_entries = track.get(key)
        if not isinstance(raw_entries, list):
            continue
        for entry_number, raw_entry in enumerate(raw_entries, start=1):
            if not isinstance(raw_entry, dict):
                raise ValueError(f"Track {track.get('id', 'unknown')} {key} #{entry_number} is not an object.")
            raw_path = raw_entry.get("path")
            if isinstance(raw_path, str) and raw_path.strip():
                paths.append(resolve_repo_path(raw_path, root))

    return paths


def resolve_audio_path(
    srt_path: Path,
    *,
    root: Path,
    manifest_path: Path | None,
    audio_override: Path | None,
    cached_audio_map: dict[Path, Path] | None = None,
) -> Path:
    if audio_override is not None:
        return resolve_cli_path(audio_override, root)

    resolved_manifest_path = manifest_path
    if resolved_manifest_path is None:
        default_manifest = root / "assets" / "manifest.json"
        if default_manifest.exists():
            resolved_manifest_path = default_manifest
    if resolved_manifest_path is None:
        raise ValueError("Use --audio or provide a manifest with matching subtitle paths.")

    audio_map = cached_audio_map
    if audio_map is None:
        audio_map = load_manifest_audio_map(resolve_cli_path(resolved_manifest_path, root), root)

    try:
        return audio_map[srt_path.resolve()]
    except KeyError as exc:
        raise ValueError(f"No audio mapping was found for SRT: {srt_path}") from exc


def cue_kind(cue: Cue) -> str:
    flattened = " ".join(part.strip() for part in cue.text.splitlines()).strip()
    if re.fullmatch(r"\[\s*melody\s*\]", flattened, re.IGNORECASE):
        return "melody"
    return "lyric"


def timestamp_slug(seconds: float) -> str:
    total_ms = int(round(seconds * 1000))
    hours, remainder = divmod(total_ms, 3_600_000)
    minutes, remainder = divmod(remainder, 60_000)
    secs, millis = divmod(remainder, 1000)
    return f"{hours:02}-{minutes:02}-{secs:02}_{millis:03}"


def split_wav_interval(source_path: Path, start_seconds: float, end_seconds: float, output_path: Path) -> None:
    with wave.open(str(source_path), "rb") as src:
        params = src.getparams()
        frame_rate = src.getframerate()
        total_frames = src.getnframes()
        start_frame = min(total_frames, max(0, int(round(start_seconds * frame_rate))))
        end_frame = min(total_frames, max(start_frame, int(round(end_seconds * frame_rate))))
        src.setpos(start_frame)
        data = src.readframes(end_frame - start_frame)

    with wave.open(str(output_path), "wb") as dst:
        dst.setparams(params)
        dst.writeframes(data)


def prepare_output_dir(path: Path, *, overwrite: bool) -> None:
    path.mkdir(parents=True, exist_ok=True)
    if not overwrite:
        return

    for existing_wav in path.glob("*.wav"):
        existing_wav.unlink()

    metadata_path = path / "segments.json"
    if metadata_path.exists():
        metadata_path.unlink()


def split_track_by_srt(
    srt_path: Path,
    audio_path: Path,
    output_dir: Path,
    *,
    overwrite: bool = False,
) -> SplitResult:
    resolved_srt_path = srt_path.resolve()
    resolved_audio_path = audio_path.resolve()
    resolved_output_dir = output_dir.resolve()

    if not resolved_srt_path.exists():
        raise FileNotFoundError(f"SRT file was not found: {resolved_srt_path}")
    if not resolved_audio_path.exists():
        raise FileNotFoundError(f"Audio file was not found: {resolved_audio_path}")

    cues = parse_srt(resolved_srt_path)
    prepare_output_dir(resolved_output_dir, overwrite=overwrite)

    split_files: list[SplitFile] = []
    for cue in cues:
        output_name = (
            f"{cue.index:03d}__{timestamp_slug(cue.start_seconds)}__"
            f"{timestamp_slug(cue.end_seconds)}__{cue_kind(cue)}.wav"
        )
        output_path = resolved_output_dir / output_name
        if output_path.exists() and not overwrite:
            raise FileExistsError(f"Refusing to overwrite existing segment file: {output_path}")
        split_wav_interval(resolved_audio_path, cue.start_seconds, cue.end_seconds, output_path)
        split_files.append(
            SplitFile(
                index=cue.index,
                start_seconds=cue.start_seconds,
                end_seconds=cue.end_seconds,
                text=cue.text,
                kind=cue_kind(cue),
                output_path=output_path,
            )
        )

    metadata_path = resolved_output_dir / "segments.json"
    if metadata_path.exists() and not overwrite:
        raise FileExistsError(f"Refusing to overwrite existing metadata file: {metadata_path}")
    metadata = {
        "srt_path": str(resolved_srt_path),
        "srt_repo_path": repo_relative_path(resolved_srt_path, ROOT),
        "audio_path": str(resolved_audio_path),
        "audio_repo_path": repo_relative_path(resolved_audio_path, ROOT),
        "output_dir": str(resolved_output_dir),
        "output_dir_repo_path": repo_relative_path(resolved_output_dir, ROOT),
        "segment_count": len(split_files),
        "segments": [
            {
                "index": split_file.index,
                "start_seconds": split_file.start_seconds,
                "end_seconds": split_file.end_seconds,
                "duration_seconds": split_file.duration_seconds,
                "text": split_file.text,
                "kind": split_file.kind,
                "file": split_file.output_path.name,
                "output_path": str(split_file.output_path),
                "output_repo_path": repo_relative_path(split_file.output_path, ROOT),
            }
            for split_file in split_files
        ],
    }
    metadata_path.write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    return SplitResult(
        srt_path=resolved_srt_path,
        audio_path=resolved_audio_path,
        output_dir=resolved_output_dir,
        files=tuple(split_files),
    )


def default_output_dir(output_root: Path, srt_path: Path) -> Path:
    stripped_stem = LTX_SUFFIX_RE.sub("", srt_path.stem)
    return output_root / (stripped_stem or srt_path.stem)


def main() -> None:
    args = parse_args()
    root = Path(__file__).resolve().parent.parent
    if args.audio is not None and len(args.srt_paths) != 1:
        raise ValueError("--audio can only be used with a single SRT path.")

    resolved_output_root = resolve_cli_path(args.output_root, root)
    resolved_srt_paths = [resolve_cli_path(path, root) for path in args.srt_paths]

    cached_audio_map: dict[Path, Path] | None = None
    if args.audio is None:
        manifest_path = args.manifest
        if manifest_path is None:
            default_manifest = root / "assets" / "manifest.json"
            manifest_path = default_manifest if default_manifest.exists() else None
        if manifest_path is not None:
            cached_audio_map = load_manifest_audio_map(resolve_cli_path(manifest_path, root), root)

    results: list[SplitResult] = []
    for srt_path in resolved_srt_paths:
        audio_path = resolve_audio_path(
            srt_path,
            root=root,
            manifest_path=args.manifest,
            audio_override=args.audio,
            cached_audio_map=cached_audio_map,
        )
        output_dir = default_output_dir(resolved_output_root, srt_path)
        result = split_track_by_srt(srt_path, audio_path, output_dir, overwrite=args.overwrite)
        results.append(result)

    for result in results:
        print(
            f"Wrote {len(result.files)} files to {result.output_dir} "
            f"from {result.audio_path.name} using {result.srt_path.name}"
        )


if __name__ == "__main__":
    main()
