from pathlib import Path
import wave

from scripts import segment_ltx_audio


def write_silence_wav(path: Path, duration_seconds: float, sample_rate: int = 8000) -> None:
    frame_count = int(round(duration_seconds * sample_rate))
    with wave.open(str(path), "wb") as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(b"\x00\x00" * frame_count)


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


def test_parse_manifest_groups_split_track_parts_and_audio(tmp_path: Path) -> None:
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
      "audio": "private-assets/song.wav",
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
    assert tracks[0].audio_path == (tmp_path / "private-assets" / "song.wav").resolve()


def test_split_interval_bounds_balances_long_melody_gap() -> None:
    bounds = segment_ltx_audio.split_interval_bounds(
        0.0,
        17.6,
        min_seconds=7.0,
        max_seconds=15.0,
        target_seconds=9.667,
    )

    assert bounds == [(0.0, 8.8), (8.8, 17.6)]


def test_build_gapless_track_segments_covers_from_zero_and_to_track_end() -> None:
    lyric_segments = [
        segment_ltx_audio.Segment(
            index=1,
            start_seconds=8.0,
            end_seconds=17.0,
            cue_start_index=1,
            cue_end_index=2,
            lines=["alpha", "beta"],
        )
    ]

    segments = segment_ltx_audio.build_gapless_track_segments(
        lyric_segments,
        track_end=20.0,
        min_seconds=7.0,
        max_seconds=15.0,
        target_seconds=9.667,
        melody_text="[melody]",
    )

    assert [(segment.start_seconds, segment.end_seconds) for segment in segments] == [
        (0.0, 8.0),
        (8.0, 20.0),
    ]
    assert segments[0].lines == ["[melody]"]
    assert segments[1].lines == ["alpha", "beta", "[melody]"]


def test_run_for_track_uses_audio_duration_and_melody_segments(tmp_path: Path) -> None:
    source = tmp_path / "song.srt"
    audio = tmp_path / "song.wav"
    source.write_text(
        "\n".join(
            [
                "1",
                "00:00:08,000 --> 00:00:11,000",
                "alpha",
                "",
                "2",
                "00:00:11,200 --> 00:00:17,000",
                "beta",
                "",
            ]
        ),
        encoding="utf-8",
    )
    write_silence_wav(audio, 20.0)
    track = segment_ltx_audio.Track(
        track_id="song",
        label="song",
        source_paths=(source,),
        output_base_path=source,
        audio_path=audio,
    )

    result = segment_ltx_audio.run_for_track(
        track,
        min_seconds=7.0,
        max_seconds=15.0,
        target_seconds=None,
    )

    assert len(result.segments) == 2
    assert result.segments[0].start_seconds == 0.0
    assert result.segments[0].end_seconds == 8.0
    assert result.segments[0].lines == ["[melody]"]
    assert result.segments[-1].end_seconds == 20.0
    assert "00:00:00,000 --> 00:00:08,000" in result.srt_text
    assert "alpha\nbeta\n[melody]" in result.srt_text


def test_run_for_track_merges_split_files_and_stays_gapless(tmp_path: Path) -> None:
    main_srt = tmp_path / "song.main.srt"
    outro_srt = tmp_path / "song.outro.srt"
    audio = tmp_path / "song.wav"
    main_srt.write_text(
        "\n".join(
            [
                "1",
                "00:00:17,500 --> 00:00:21,000",
                "alpha",
                "",
                "2",
                "00:00:21,200 --> 00:00:27,000",
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
                "00:00:30,000 --> 00:00:33,000",
                "gamma",
                "",
                "2",
                "00:00:33,200 --> 00:00:39,000",
                "delta",
                "",
            ]
        ),
        encoding="utf-8",
    )
    write_silence_wav(audio, 46.5)
    track = segment_ltx_audio.Track(
        track_id="song",
        label="song",
        source_paths=(main_srt, outro_srt),
        output_base_path=tmp_path / "song.srt",
        audio_path=audio,
    )

    result = segment_ltx_audio.run_for_track(
        track,
        min_seconds=7.0,
        max_seconds=15.0,
        target_seconds=None,
    )

    assert result.segments[0].lines == ["[melody]"]
    assert result.segments[0].start_seconds == 0.0
    assert all(
        result.segments[index].end_seconds == result.segments[index + 1].start_seconds
        for index in range(len(result.segments) - 1)
    )
    assert result.segments[-1].end_seconds == 46.5


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
        audio_path=None,
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
        audio_path=None,
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
      "audio": "private-assets/song.wav",
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
