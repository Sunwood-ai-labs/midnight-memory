from __future__ import annotations

from scripts import extract_subtitle_gap


def test_detect_gap_bounds_for_intro_and_outro() -> None:
    cues = [
        {"start_seconds": 12.0, "end_seconds": 15.0, "text": "first"},
        {"start_seconds": 20.0, "end_seconds": 24.0, "text": "second"},
    ]

    assert extract_subtitle_gap.detect_gap_bounds(cues, audio_duration=30.0, part="intro") == (0.0, 12.0)
    assert extract_subtitle_gap.detect_gap_bounds(cues, audio_duration=30.0, part="outro") == (24.0, 30.0)


def test_normalize_gap_cues_clamps_and_keeps_order() -> None:
    result = extract_subtitle_gap.normalize_gap_cues(
        [
            {"text": "Ah", "start_seconds": -1.0, "end_seconds": 1.0},
            {"text": "Ooh", "start_seconds": 0.4, "end_seconds": 5.0},
        ],
        duration=3.0,
    )

    assert result == [
        {"start_seconds": 0.0, "end_seconds": 1.0, "text": "Ah"},
        {"start_seconds": 1.0, "end_seconds": 3.0, "text": "Ooh"},
    ]


def test_rebase_cues_adds_offset() -> None:
    result = extract_subtitle_gap.rebase_cues(
        [{"text": "Ah", "start_seconds": 1.25, "end_seconds": 2.0}],
        offset_seconds=64.5,
    )

    assert result == [
        {"start_seconds": 65.75, "end_seconds": 66.5, "text": "Ah"},
    ]


def test_build_gap_prompt_mentions_part_and_adlibs() -> None:
    prompt = extract_subtitle_gap.build_gap_prompt(["alpha", "beta"], clip_duration=12.0, part="outro")

    assert "uncovered outro section" in prompt
    assert "Ah, Ooh, Oh, or Yeah" in prompt
    assert "1. alpha" in prompt


def test_parse_reference_srt_reads_utf8_sig(tmp_path) -> None:
    srt_path = tmp_path / "sample.srt"
    srt_path.write_text(
        "\n".join(
            [
                "1",
                "00:00:01,250 --> 00:00:03,500",
                "hello",
                "",
                "2",
                "00:00:04,000 --> 00:00:05,500",
                "world",
                "",
            ]
        ),
        encoding="utf-8-sig",
    )

    result = extract_subtitle_gap.parse_reference_srt(srt_path)

    assert result == [
        {"start_seconds": 1.25, "end_seconds": 3.5, "text": "hello"},
        {"start_seconds": 4.0, "end_seconds": 5.5, "text": "world"},
    ]
