from pathlib import Path

from scripts import segment_ltx_audio


def make_cue(index: int, start: float, end: float, text: str) -> segment_ltx_audio.Cue:
    return segment_ltx_audio.Cue(
        index=index,
        start_seconds=start,
        end_seconds=end,
        text=text,
    )


def test_parse_srt_supports_multiline_cues(tmp_path: Path) -> None:
    srt_path = tmp_path / "sample.srt"
    srt_path.write_text(
        "\n".join(
            [
                "1",
                "00:00:00,000 --> 00:00:03,500",
                "first line",
                "second line",
                "",
                "2",
                "00:00:04,000 --> 00:00:08,200",
                "third line",
                "",
            ]
        ),
        encoding="utf-8",
    )

    cues = segment_ltx_audio.parse_srt(srt_path)

    assert [cue.text for cue in cues] == ["first line\nsecond line", "third line"]
    assert cues[1].start_seconds == 4.0


def test_parse_manifest_groups_split_track_parts(tmp_path: Path) -> None:
    assets_dir = tmp_path / "assets"
    assets_dir.mkdir()
    manifest_path = assets_dir / "manifest.json"
    manifest_path.write_text(
        """
{
  "tracks": [
    {
      "id": "bridge-final-chorus",
      "section": "Bridge - Final Chorus",
      "subtitle": "assets/song.srt",
      "subtitles": [
        { "id": "main", "path": "assets/song.main.srt" },
        { "id": "outro", "path": "assets/song.outro.srt" }
      ]
    }
  ]
}
""".strip(),
        encoding="utf-8",
    )

    tracks = segment_ltx_audio.parse_manifest(manifest_path, tmp_path)

    assert len(tracks) == 1
    assert tracks[0].source_paths == (
        (tmp_path / "assets" / "song.main.srt").resolve(),
        (tmp_path / "assets" / "song.outro.srt").resolve(),
    )
    assert tracks[0].output_base_path == (tmp_path / "assets" / "song.srt").resolve()


def test_load_track_cues_combines_files_in_order(tmp_path: Path) -> None:
    main_srt = tmp_path / "song.main.srt"
    outro_srt = tmp_path / "song.outro.srt"
    main_srt.write_text(
        "1\n00:00:00,000 --> 00:00:03,000\nalpha\n\n2\n00:00:03,500 --> 00:00:06,500\nbeta\n",
        encoding="utf-8",
    )
    outro_srt.write_text(
        "1\n00:00:08,000 --> 00:00:10,500\ngamma\n",
        encoding="utf-8",
    )
    track = segment_ltx_audio.Track(
        track_id="song",
        label="song",
        source_paths=(main_srt, outro_srt),
        output_base_path=tmp_path / "song.srt",
    )

    cues = segment_ltx_audio.load_track_cues(track)

    assert [cue.index for cue in cues] == [1, 2, 3]
    assert [cue.text for cue in cues] == ["alpha", "beta", "gamma"]


def test_normalize_gapless_segments_removes_gaps() -> None:
    raw_segments = [
        segment_ltx_audio.Segment(
            index=1,
            start_seconds=0.0,
            end_seconds=7.0,
            cue_start_index=1,
            cue_end_index=2,
            lines=["alpha", "beta"],
        ),
        segment_ltx_audio.Segment(
            index=2,
            start_seconds=10.0,
            end_seconds=17.0,
            cue_start_index=3,
            cue_end_index=4,
            lines=["gamma", "delta"],
        ),
    ]

    normalized = segment_ltx_audio.normalize_gapless_segments(raw_segments)

    assert normalized[0].end_seconds == 8.5
    assert normalized[1].start_seconds == 8.5


def test_run_for_track_builds_gapless_srt_from_multiple_parts(tmp_path: Path) -> None:
    main_srt = tmp_path / "song.main.srt"
    outro_srt = tmp_path / "song.outro.srt"
    main_srt.write_text(
        "\n".join(
            [
                "1",
                "00:00:00,000 --> 00:00:03,000",
                "alpha",
                "",
                "2",
                "00:00:03,200 --> 00:00:07,200",
                "beta",
                "",
            ]
        ),
        encoding="utf-8",
    )
    outro_srt.write_text(
        "\n".join(
            [
                "1",
                "00:00:10,000 --> 00:00:13,000",
                "gamma",
                "",
                "2",
                "00:00:13,200 --> 00:00:16,200",
                "delta",
                "",
            ]
        ),
        encoding="utf-8",
    )
    track = segment_ltx_audio.Track(
        track_id="song",
        label="song",
        source_paths=(main_srt, outro_srt),
        output_base_path=tmp_path / "song.srt",
    )

    result = segment_ltx_audio.run_for_track(
        track,
        min_seconds=7.0,
        max_seconds=15.0,
        target_seconds=None,
    )

    assert len(result.segments) == 2
    assert result.segments[0].end_seconds == 8.6
    assert result.segments[1].start_seconds == 8.6
    assert result.srt_text == (
        "1\n"
        "00:00:00,000 --> 00:00:08,600\n"
        "alpha\n"
        "beta\n\n"
        "2\n"
        "00:00:08,600 --> 00:00:16,200\n"
        "gamma\n"
        "delta\n"
    )


def test_run_for_track_raises_when_out_of_range_segment_is_not_allowed(tmp_path: Path) -> None:
    source = tmp_path / "song.srt"
    source.write_text(
        "1\n00:00:00,000 --> 00:00:18,000\nsolo line\n",
        encoding="utf-8",
    )
    track = segment_ltx_audio.Track(
        track_id="song",
        label="song",
        source_paths=(source,),
        output_base_path=source,
    )

    try:
        segment_ltx_audio.run_for_track(
            track,
            min_seconds=7.0,
            max_seconds=15.0,
            target_seconds=None,
        )
    except ValueError as exc:
        assert "--allow-out-of-range" in str(exc)
    else:
        raise AssertionError("Expected ValueError for out-of-range segment")


def test_run_for_track_allows_warning_only_output_when_requested(tmp_path: Path) -> None:
    source = tmp_path / "song.srt"
    source.write_text(
        "1\n00:00:00,000 --> 00:00:18,000\nsolo line\n",
        encoding="utf-8",
    )
    track = segment_ltx_audio.Track(
        track_id="song",
        label="song",
        source_paths=(source,),
        output_base_path=source,
    )

    result = segment_ltx_audio.run_for_track(
        track,
        min_seconds=7.0,
        max_seconds=15.0,
        target_seconds=None,
        allow_out_of_range=True,
    )

    assert result.warnings
    assert result.segments[0].duration_seconds == 18.0


def test_resolve_tracks_prefers_manifest_for_assets_directory(tmp_path: Path) -> None:
    assets_dir = tmp_path / "assets"
    assets_dir.mkdir()
    (assets_dir / "manifest.json").write_text(
        """
{
  "tracks": [
    {
      "id": "intro-chorus-1",
      "subtitle": "assets/song.srt",
      "subtitles": [
        { "id": "intro", "path": "assets/song.intro.srt" },
        { "id": "main", "path": "assets/song.main.srt" }
      ]
    }
  ]
}
""".strip(),
        encoding="utf-8",
    )

    tracks = segment_ltx_audio.resolve_tracks(assets_dir, tmp_path)

    assert len(tracks) == 1
    assert tracks[0].track_id == "intro-chorus-1"
