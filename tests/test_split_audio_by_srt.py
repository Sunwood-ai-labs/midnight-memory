from pathlib import Path
import json
import wave

from scripts import split_audio_by_srt


def write_silence_wav(path: Path, duration_seconds: float, sample_rate: int = 8000) -> None:
    frame_count = int(round(duration_seconds * sample_rate))
    with wave.open(str(path), "wb") as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(b"\x00\x00" * frame_count)


def wav_duration_seconds(path: Path) -> float:
    with wave.open(str(path), "rb") as wav_file:
        return wav_file.getnframes() / float(wav_file.getframerate())


def test_load_manifest_audio_map_includes_timeline_subtitles(tmp_path: Path) -> None:
    assets_dir = tmp_path / "assets"
    assets_dir.mkdir()
    manifest_path = assets_dir / "manifest.json"
    manifest_path.write_text(
        """
{
  "tracks": [
    {
      "id": "intro-chorus-1",
      "audio": "private-assets/song.wav",
      "timelineSubtitles": [
        { "id": "ltx", "path": "assets/ltx-segments/song.ltx_segments.srt" }
      ]
    }
  ]
}
""".strip(),
        encoding="utf-8",
    )

    audio_map = split_audio_by_srt.load_manifest_audio_map(manifest_path, tmp_path)

    assert audio_map[(tmp_path / "assets" / "ltx-segments" / "song.ltx_segments.srt").resolve()] == (
        tmp_path / "private-assets" / "song.wav"
    ).resolve()


def test_split_track_by_srt_writes_segment_files_and_metadata(tmp_path: Path) -> None:
    srt_path = tmp_path / "song.ltx_segments.srt"
    audio_path = tmp_path / "song.wav"
    output_dir = tmp_path / "splits"
    srt_path.write_text(
        "\n".join(
            [
                "1",
                "00:00:00,000 --> 00:00:01,250",
                "[melody]",
                "",
                "2",
                "00:00:01,250 --> 00:00:03,000",
                "Alpha",
                "Beta",
                "",
            ]
        ),
        encoding="utf-8",
    )
    write_silence_wav(audio_path, 3.0)

    result = split_audio_by_srt.split_track_by_srt(srt_path, audio_path, output_dir)

    assert len(result.files) == 2
    assert result.files[0].kind == "melody"
    assert result.files[1].kind == "lyric"
    assert result.files[0].output_path.name == "001__00-00-00_000__00-00-01_250__melody.wav"
    assert result.files[1].output_path.name == "002__00-00-01_250__00-00-03_000__lyric.wav"
    assert wav_duration_seconds(result.files[0].output_path) == 1.25
    assert wav_duration_seconds(result.files[1].output_path) == 1.75

    metadata = json.loads((output_dir / "segments.json").read_text(encoding="utf-8"))
    assert metadata["segment_count"] == 2
    assert metadata["segments"][1]["text"] == "Alpha\nBeta"
    assert metadata["segments"][1]["file"] == "002__00-00-01_250__00-00-03_000__lyric.wav"


def test_default_output_dir_strips_ltx_suffix_and_overwrite_cleans_stale_files(tmp_path: Path) -> None:
    srt_path = tmp_path / "dream-track.ltx_segments.srt"
    audio_path = tmp_path / "dream-track.wav"
    output_root = tmp_path / "exports"
    output_dir = split_audio_by_srt.default_output_dir(output_root, srt_path)
    srt_path.write_text(
        "\n".join(
            [
                "1",
                "00:00:00,000 --> 00:00:01,000",
                "[melody]",
                "",
                "2",
                "00:00:01,000 --> 00:00:02,000",
                "Alpha",
                "",
            ]
        ),
        encoding="utf-8",
    )
    write_silence_wav(audio_path, 2.0)

    output_dir.mkdir(parents=True)
    (output_dir / "stale.wav").write_bytes(b"stale")
    (output_dir / "segments.json").write_text("{}", encoding="utf-8")

    result = split_audio_by_srt.split_track_by_srt(
        srt_path,
        audio_path,
        output_dir,
        overwrite=True,
    )

    assert output_dir.name == "dream-track"
    assert not (output_dir / "stale.wav").exists()
    assert len(list(output_dir.glob("*.wav"))) == 2
    assert result.files[1].output_path.name == "002__00-00-01_000__00-00-02_000__lyric.wav"


def test_resolve_audio_path_uses_manifest_mapping(tmp_path: Path) -> None:
    assets_dir = tmp_path / "assets"
    ltx_dir = assets_dir / "ltx-segments"
    assets_dir.mkdir()
    ltx_dir.mkdir()
    manifest_path = assets_dir / "manifest.json"
    srt_path = ltx_dir / "song.ltx_segments.srt"
    srt_path.write_text("1\n00:00:00,000 --> 00:00:01,000\n[melody]\n", encoding="utf-8")
    manifest_path.write_text(
        """
{
  "tracks": [
    {
      "id": "song",
      "audio": "private-assets/song.wav",
      "timelineSubtitles": [
        { "id": "ltx", "path": "assets/ltx-segments/song.ltx_segments.srt" }
      ]
    }
  ]
}
""".strip(),
        encoding="utf-8",
    )

    resolved = split_audio_by_srt.resolve_audio_path(
        srt_path.resolve(),
        root=tmp_path,
        manifest_path=manifest_path,
        audio_override=None,
    )

    assert resolved == (tmp_path / "private-assets" / "song.wav").resolve()
