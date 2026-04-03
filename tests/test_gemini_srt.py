from scripts import gemini_srt


def test_parse_json_array_accepts_fenced_json() -> None:
    payload = """```json
    [{"line_number": 1, "start_seconds": 1.2, "end_seconds": 2.4}]
    ```"""

    result = gemini_srt.parse_json_array(payload)

    assert result == [{"line_number": 1, "start_seconds": 1.2, "end_seconds": 2.4}]


def test_parse_json_array_accepts_intro_text_before_fenced_json() -> None:
    payload = """Here is the timing data:

```json
[{"line_number": 1, "start_seconds": 1.2, "end_seconds": 2.4}]
```"""

    result = gemini_srt.parse_json_array(payload)

    assert result == [{"line_number": 1, "start_seconds": 1.2, "end_seconds": 2.4}]


def test_clamp_cues_supports_line_numbers_and_free_text() -> None:
    result = gemini_srt.clamp_cues(
        [
            {"line_number": 1, "start_seconds": 0.0, "end_seconds": 1.0},
            {"text": "spoken intro", "start_seconds": 0.5, "end_seconds": 1.4},
        ],
        duration=3.0,
        lyrics=["first line"],
    )

    assert result[0]["text"] == "first line"
    assert result[0]["line_number"] == 1
    assert result[1]["text"] == "spoken intro"
    assert result[1]["start_seconds"] == 1.0


def test_clamp_cues_raises_value_error_when_timestamps_are_missing() -> None:
    try:
        gemini_srt.clamp_cues(
            [{"text": "spoken intro", "end_seconds": 1.4}],
            duration=3.0,
            lyrics=[],
        )
    except ValueError as exc:
        assert "Missing start_seconds" in str(exc)
    else:
        raise AssertionError("Expected ValueError for missing start_seconds")


def test_build_prompt_switches_when_extra_text_is_allowed() -> None:
    strict_prompt = gemini_srt.build_prompt(["hello"], duration=12.0, allow_extra_text=False)
    flexible_prompt = gemini_srt.build_prompt(["hello"], duration=12.0, allow_extra_text=True)

    assert "line_number, start_seconds, end_seconds" in strict_prompt
    assert "exactly one of line_number or text" in flexible_prompt
    assert "free-text cues sparingly" in flexible_prompt


def test_cues_to_srt_formats_blocks() -> None:
    srt = gemini_srt.cues_to_srt(
        [
            {"start_seconds": 1.25, "end_seconds": 2.5, "text": "hello world"},
        ]
    )

    assert srt == "1\n00:00:01,250 --> 00:00:02,500\nhello world\n"
