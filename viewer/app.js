const manifestUrl = "../assets/manifest.json";

const state = {
  tracks: [],
  selectedIndex: -1,
  cues: [],
  segmentCues: [],
  subtitleSources: [],
  currentCueIndex: -1,
  currentSegmentIndex: -1,
  manifestRequestId: 0,
  trackRequestId: 0,
  subtitleAbortController: null,
  probeRan: false,
};

const elements = {
  manifestStatus: document.getElementById("manifestStatus"),
  trackCount: document.getElementById("trackCount"),
  cueCounter: document.getElementById("cueCounter"),
  deckTitle: document.getElementById("deckTitle"),
  deckSubtitle: document.getElementById("deckSubtitle"),
  reloadButton: document.getElementById("reloadButton"),
  playPauseButton: document.getElementById("playPauseButton"),
  playPauseIcon: document.querySelector("#playPauseButton .material-symbols-outlined"),
  restartButton: document.getElementById("restartButton"),
  backButton: document.getElementById("backButton"),
  forwardButton: document.getElementById("forwardButton"),
  timeSlider: document.getElementById("timeSlider"),
  timeReadout: document.getElementById("timeReadout"),
  speedSelect: document.getElementById("speedSelect"),
  audioStateChip: document.getElementById("audioStateChip"),
  subtitleStateChip: document.getElementById("subtitleStateChip"),
  statusChip: document.getElementById("statusChip"),
  audio: document.getElementById("audioElement"),
  trackList: document.getElementById("trackList"),
  currentTiming: document.getElementById("currentTiming"),
  currentLine: document.getElementById("currentLine"),
  nextLine: document.getElementById("nextLine"),
  segmentList: document.getElementById("segmentList"),
  segmentCounter: document.getElementById("segmentCounter"),
  cueList: document.getElementById("cueList"),
  rawSrt: document.getElementById("rawSrt"),
  statusMessage: document.getElementById("statusMessage"),
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function resolveAssetPath(path) {
  return new URL(`../${path}`, window.location.href).toString();
}

function formatClock(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "00:00";
  }
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60).toString().padStart(2, "0");
  const remainder = (total % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function formatCueStamp(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "00:00.000";
  }
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60).toString().padStart(2, "0");
  const remainder = (total % 60).toString().padStart(2, "0");
  const millis = Math.floor((seconds % 1) * 1000).toString().padStart(3, "0");
  return `${minutes}:${remainder}.${millis}`;
}

function getCuePartVariant(cue) {
  if (!cue) {
    return "";
  }
  if (cue.subtitleKind === "timeline" || cue.subtitleId === "ltx" || cue.subtitleId === "ltx-segments") {
    return "ltx";
  }
  if (cue.subtitleId !== "intro" && cue.subtitleId !== "outro") {
    return "";
  }
  return cue.subtitleId;
}

function getCuePartLabel(cue) {
  if (!cue || !getCuePartVariant(cue)) {
    return "";
  }
  return cue.subtitleLabel || "";
}

function formatCuePreview(cue, prefix = "") {
  if (!cue) {
    return prefix ? `${prefix}: (empty line)` : "(empty line)";
  }
  const partLabel = getCuePartLabel(cue);
  const body = cue.text || "(empty line)";
  if (!partLabel) {
    return prefix ? `${prefix}: ${body}` : body;
  }
  return prefix ? `${prefix} [${partLabel}]: ${body}` : `[${partLabel}] ${body}`;
}

function formatCurrentCueTiming(cue) {
  if (!cue) {
    return formatCueStamp(elements.audio.currentTime || 0);
  }
  const timeRange = `${formatCueStamp(cue.start)} -> ${formatCueStamp(cue.end)}`;
  const partLabel = getCuePartLabel(cue);
  return partLabel ? `${partLabel} · ${timeRange}` : timeRange;
}

function parseSrtTimestamp(value) {
  const match = value.trim().match(/(\d+):(\d+):(\d+),(\d+)/);
  if (!match) {
    return Number.NaN;
  }
  const [, hours, minutes, seconds, millis] = match.map(Number);
  return (hours * 3600) + (minutes * 60) + seconds + (millis / 1000);
}

function parseSrt(text) {
  return text
    .replace(/^\uFEFF/, "")
    .trim()
    .split(/\r?\n\r?\n+/)
    .map((block) => block.split(/\r?\n/))
    .map((lines) => {
      if (lines.length < 2) {
        return null;
      }
      const [indexLine, timeLine, ...textLines] = lines;
      const [startText, endText] = timeLine.split(/\s+-->\s+/);
      const start = parseSrtTimestamp(startText || "");
      const end = parseSrtTimestamp(endText || "");
      if (!Number.isFinite(start) || !Number.isFinite(end)) {
        return null;
      }
      return {
        index: Number.parseInt(indexLine, 10) || 0,
        start,
        end,
        text: textLines.join("\n").trim(),
      };
    })
    .filter(Boolean);
}

function normalizeSubtitleSources(track) {
  const primarySources = Array.isArray(track.subtitles) && track.subtitles.length
    ? track.subtitles
      .map((source, index) => {
        if (!source || typeof source.path !== "string" || !source.path.trim()) {
          return null;
        }
        return {
          id: typeof source.id === "string" && source.id.trim() ? source.id.trim() : `subtitle-${index + 1}`,
          label: typeof source.label === "string" && source.label.trim() ? source.label.trim() : `Subtitle ${index + 1}`,
          path: source.path,
          subtitleKind: "primary",
          subtitlePriority: 200,
        };
      })
      .filter(Boolean)
    : typeof track.subtitle === "string" && track.subtitle.trim()
      ? [
      {
        id: "default",
        label: "Subtitle",
        path: track.subtitle,
        subtitleKind: "primary",
        subtitlePriority: 200,
      },
    ]
      : [];

  return primarySources;
}

function normalizeSegmentSources(track) {
  if (Array.isArray(track.timelineSubtitles) && track.timelineSubtitles.length) {
    return track.timelineSubtitles
      .map((source, index) => {
        if (!source || typeof source.path !== "string" || !source.path.trim()) {
          return null;
        }
        return {
          id: typeof source.id === "string" && source.id.trim() ? source.id.trim() : `segment-${index + 1}`,
          label: typeof source.label === "string" && source.label.trim() ? source.label.trim() : `Segment ${index + 1}`,
          path: source.path,
        };
      })
      .filter(Boolean);
  }

  if (typeof track.segmentSubtitle === "string" && track.segmentSubtitle.trim()) {
    return [
      {
        id: "ltx-segments",
        label: "LTX",
        path: track.segmentSubtitle,
      },
    ];
  }

  return [];
}

function mergeSubtitlePayloads(payloads) {
  return payloads
    .flatMap(({ source, rawSrt }) => parseSrt(rawSrt).map((cue, index) => ({
      ...cue,
      sourceIndex: cue.index || (index + 1),
      subtitleId: source.id,
      subtitleLabel: source.label,
      subtitleKind: source.subtitleKind || "primary",
      subtitlePriority: source.subtitlePriority ?? 200,
    })))
    .sort((left, right) =>
      left.start - right.start
      || (right.subtitlePriority - left.subtitlePriority)
      || ((left.end - left.start) - (right.end - right.start))
      || left.subtitleLabel.localeCompare(right.subtitleLabel)
    )
    .map((cue, index) => ({
      ...cue,
      index: index + 1,
    }));
}

function findCurrentCueIndex(time) {
  let bestIndex = -1;
  let bestPriority = Number.NEGATIVE_INFINITY;
  let bestDuration = Number.POSITIVE_INFINITY;
  let bestStart = Number.NEGATIVE_INFINITY;

  state.cues.forEach((cue, index) => {
    if (time < cue.start || time > cue.end) {
      return;
    }
    const priority = Number.isFinite(cue.subtitlePriority) ? cue.subtitlePriority : 0;
    const duration = cue.end - cue.start;
    const isBetter =
      priority > bestPriority
      || (
        priority === bestPriority
        && (
          duration < bestDuration
          || (duration === bestDuration && cue.start > bestStart)
        )
      );

    if (isBetter) {
      bestIndex = index;
      bestPriority = priority;
      bestDuration = duration;
      bestStart = cue.start;
    }
  });

  return bestIndex;
}

function formatRawSrtDebug(payloads) {
  if (!payloads.length) {
    return "";
  }
  if (payloads.length === 1) {
    return payloads[0].rawSrt;
  }
  return payloads
    .map(({ source, rawSrt }) => `===== ${source.label} =====\n${rawSrt.trim()}`)
    .join("\n\n");
}

function setStatus(message, tone = "Ready") {
  elements.statusMessage.textContent = message;
  elements.statusChip.textContent = tone;
}

function setRovingTabStops(container, selector, activeIndex) {
  const items = [...container.querySelectorAll(selector)];
  if (!items.length) {
    container.removeAttribute("aria-activedescendant");
    return;
  }
  const safeIndex = Math.max(0, Math.min(activeIndex, items.length - 1));
  items.forEach((item, index) => {
    item.tabIndex = index === safeIndex ? 0 : -1;
  });
  container.setAttribute("aria-activedescendant", items[safeIndex].id);
}

function moveFocusInCollection(event, selector) {
  const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
  if (!keys.includes(event.key)) {
    return;
  }
  const items = [...event.currentTarget.parentElement.querySelectorAll(selector)];
  const currentIndex = items.indexOf(event.currentTarget);
  if (currentIndex === -1) {
    return;
  }
  event.preventDefault();
  const nextIndex =
    event.key === "ArrowDown" ? Math.min(currentIndex + 1, items.length - 1)
    : event.key === "ArrowUp" ? Math.max(currentIndex - 1, 0)
    : event.key === "Home" ? 0
    : items.length - 1;
  setRovingTabStops(event.currentTarget.parentElement, selector, nextIndex);
  items[nextIndex].focus();
}

function renderTrackList() {
  elements.trackList.innerHTML = "";
  state.tracks.forEach((track, index) => {
    const button = document.createElement("button");
    button.id = `track-option-${index}`;
    button.type = "button";
    button.className = "track-button";
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", index === state.selectedIndex ? "true" : "false");
    button.innerHTML = `
      <span class="track-section">${track.section}</span>
      <span class="track-title">${track.title}</span>
      <span class="track-file">${track.audio.split("/").pop()}</span>
    `;
    button.addEventListener("click", () => {
      void selectTrack(index);
    });
    button.addEventListener("keydown", (event) => {
      moveFocusInCollection(event, ".track-button");
    });
    elements.trackList.appendChild(button);
  });
  setRovingTabStops(elements.trackList, ".track-button", state.selectedIndex >= 0 ? state.selectedIndex : 0);
}

function renderCueList() {
  if (!state.cues.length) {
    elements.cueList.innerHTML = "<div class=\"empty-state\">字幕を読み込むとここに表示されます。</div>";
    elements.cueCounter.textContent = "0 / 0";
    elements.cueList.removeAttribute("aria-activedescendant");
    return;
  }

  elements.cueList.innerHTML = "";
  state.cues.forEach((cue, index) => {
    const button = document.createElement("button");
    const partVariant = getCuePartVariant(cue);
    const partLabel = getCuePartLabel(cue);
    button.id = `cue-item-${index}`;
    button.type = "button";
    button.className = `cue-button${partVariant ? ` cue-button--${partVariant}` : ""}${index === state.currentCueIndex ? " active" : ""}`;
    button.setAttribute("aria-current", index === state.currentCueIndex ? "true" : "false");

    const meta = document.createElement("span");
    meta.className = "cue-meta";

    const time = document.createElement("span");
    time.className = "cue-time";
    time.textContent = `${formatCueStamp(cue.start)} -> ${formatCueStamp(cue.end)}`;
    meta.appendChild(time);

    if (partLabel) {
      const badge = document.createElement("span");
      badge.className = `cue-part-badge cue-part-badge--${partVariant}`;
      badge.textContent = partLabel;
      meta.appendChild(badge);
    }

    const text = document.createElement("span");
    text.className = "cue-text";
    text.textContent = cue.text || "(empty line)";

    button.appendChild(meta);
    button.appendChild(text);
    button.addEventListener("click", () => {
      elements.audio.currentTime = cue.start;
      syncCue(true);
    });
    button.addEventListener("keydown", (event) => {
      moveFocusInCollection(event, ".cue-button");
    });
    elements.cueList.appendChild(button);
  });
  elements.cueCounter.textContent = `${Math.max(state.currentCueIndex + 1, 0)} / ${state.cues.length}`;
  setRovingTabStops(elements.cueList, ".cue-button", state.currentCueIndex >= 0 ? state.currentCueIndex : 0);
}

function renderSegmentList() {
  if (!elements.segmentList || !elements.segmentCounter) {
    return;
  }
  if (!state.segmentCues.length) {
    elements.segmentList.innerHTML = "<div class=\"empty-state\">LTX segment timeline will appear here.</div>";
    elements.segmentCounter.textContent = "0 segments";
    return;
  }

  elements.segmentList.innerHTML = "";
  state.segmentCues.forEach((cue, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `segment-button${index === state.currentSegmentIndex ? " active" : ""}`;

    const time = document.createElement("span");
    time.className = "segment-time";
    time.textContent = `${formatCueStamp(cue.start)} -> ${formatCueStamp(cue.end)}`;

    const text = document.createElement("span");
    text.className = "segment-text";
    text.textContent = cue.text || "(empty line)";

    button.appendChild(time);
    button.appendChild(text);
    button.addEventListener("click", () => {
      elements.audio.currentTime = cue.start;
      syncCue(true);
    });
    elements.segmentList.appendChild(button);
  });
  elements.segmentCounter.textContent = `${state.segmentCues.length} segments`;
}

function renderCurrentCue() {
  const currentCue = state.cues[state.currentCueIndex] || null;
  const nextCue = state.cues[state.currentCueIndex + 1] || null;

  if (!currentCue) {
    elements.currentLine.textContent = "再生を始めると、現在行がここに表示されます。";
    elements.nextLine.textContent = nextCue ? `Next: ${nextCue.text}` : "次の行がここに表示されます。";
    elements.currentTiming.textContent = formatCueStamp(elements.audio.currentTime || 0);
    elements.cueCounter.textContent = state.cues.length ? `0 / ${state.cues.length}` : "0 / 0";
    return;
  }

  elements.currentLine.textContent = formatCuePreview(currentCue);
  elements.nextLine.textContent = nextCue ? formatCuePreview(nextCue, "Next") : "このトラックの最後の行です。";
  elements.currentTiming.textContent = formatCurrentCueTiming(currentCue);
  elements.cueCounter.textContent = `${state.currentCueIndex + 1} / ${state.cues.length}`;
}

function isCueVisible(item, container) {
  const itemRect = item.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return itemRect.top >= containerRect.top && itemRect.bottom <= containerRect.bottom;
}

async function maybeRunAutomationProbe() {
  if (state.probeRan) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  if (!params.has("testSeek") && params.get("testRace") !== "1") {
    return;
  }

  state.probeRan = true;

  if (params.has("testSeek")) {
    const seekTime = Number(params.get("testSeek"));
    if (Number.isFinite(seekTime)) {
      elements.audio.currentTime = seekTime;
      elements.audio.dispatchEvent(new Event("timeupdate"));
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      document.body.dataset.probeSync = [
        elements.currentLine.textContent.trim(),
        document.querySelector(".cue-button.active .cue-time")?.textContent || "",
        elements.cueCounter.textContent,
      ].join("|");
    }
  }

  if (params.get("testRace") === "1") {
    const original = window.fetchUtf8Text;
    let callCount = 0;
    window.fetchUtf8Text = async (...args) => {
      callCount += 1;
      if (callCount === 1) {
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
      return original(...args);
    };
    const first = window.selectTrack(0);
    const second = window.selectTrack(1);
    await Promise.allSettled([first, second]);
    window.fetchUtf8Text = original;
    document.body.dataset.probeRace = [
      document.querySelector(".track-button[aria-selected=\"true\"] .track-section")?.textContent || "",
      document.querySelector("#deckSubtitle")?.textContent || "",
      document.querySelector(".cue-button .cue-time")?.textContent || "",
    ].join("|");
  }
}

function syncCue(forceScroll = false) {
  const time = elements.audio.currentTime || 0;
  const nextIndex = findCurrentCueIndex(time);
  syncSegment(forceScroll);
  if (nextIndex === state.currentCueIndex) {
    elements.currentTiming.textContent = formatCueStamp(time);
    return;
  }

  state.currentCueIndex = nextIndex;
  renderCurrentCue();

  const items = [...elements.cueList.querySelectorAll(".cue-button")];
  items.forEach((item, index) => {
    item.classList.toggle("active", index === state.currentCueIndex);
    item.setAttribute("aria-current", index === state.currentCueIndex ? "true" : "false");
  });
  if (items.length) {
    setRovingTabStops(elements.cueList, ".cue-button", state.currentCueIndex >= 0 ? state.currentCueIndex : 0);
  }

  if (state.currentCueIndex >= 0) {
    const activeItem = items[state.currentCueIndex];
    if (activeItem && (forceScroll || !isCueVisible(activeItem, elements.cueList))) {
      activeItem.scrollIntoView({ block: "nearest", behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
    }
  }
}

function syncSegment(forceScroll = false) {
  if (!elements.segmentList) {
    return;
  }
  const time = elements.audio.currentTime || 0;
  const nextIndex = state.segmentCues.findIndex((cue) => time >= cue.start && time <= cue.end);
  if (nextIndex === state.currentSegmentIndex) {
    return;
  }

  state.currentSegmentIndex = nextIndex;
  const items = [...elements.segmentList.querySelectorAll(".segment-button")];
  items.forEach((item, index) => {
    item.classList.toggle("active", index === state.currentSegmentIndex);
  });

  if (state.currentSegmentIndex >= 0) {
    const activeItem = items[state.currentSegmentIndex];
    if (activeItem && (forceScroll || !isCueVisible(activeItem, elements.segmentList))) {
      activeItem.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
      });
    }
  }
}

function updateTransport() {
  const duration = Number.isFinite(elements.audio.duration) ? elements.audio.duration : 0;
  elements.timeSlider.max = String(duration);
  elements.timeSlider.value = String(Math.min(elements.audio.currentTime || 0, duration));
  elements.timeReadout.textContent = `${formatClock(elements.audio.currentTime || 0)} / ${formatClock(duration)}`;
  syncCue(false);
}

async function fetchUtf8Text(path, signal) {
  const response = await fetch(resolveAssetPath(path), { signal });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }
  const buffer = await response.arrayBuffer();
  return new TextDecoder("utf-8").decode(buffer);
}

async function selectTrack(index) {
  const track = state.tracks[index];
  if (!track) {
    return;
  }

  state.selectedIndex = index;
  state.currentCueIndex = -1;
  state.currentSegmentIndex = -1;
  state.cues = [];
  state.segmentCues = [];
  state.subtitleSources = [];
  state.trackRequestId += 1;
  const requestId = state.trackRequestId;
  state.subtitleAbortController?.abort();
  state.subtitleAbortController = new AbortController();
  const subtitleSources = normalizeSubtitleSources(track);
  const segmentSources = normalizeSegmentSources(track);

  renderTrackList();
  renderSegmentList();
  renderCueList();
  renderCurrentCue();

  elements.deckTitle.textContent = track.title;
  elements.deckSubtitle.textContent = `${track.section} | ${track.audio.split("/").pop()}`;
  elements.subtitleStateChip.textContent = "Subtitle loading";
  elements.audioStateChip.textContent = "Audio readying";
  elements.rawSrt.textContent = "字幕テキストを読み込んでいます。";
  setStatus(`${track.section} を読み込み中です。`, "Loading");

  elements.audio.pause();
  elements.audio.src = resolveAssetPath(track.audio);
  elements.audio.load();

  if (!subtitleSources.length) {
    elements.subtitleStateChip.textContent = "No subtitle";
    elements.rawSrt.textContent = "字幕設定がありません。";
    setStatus("字幕設定が見つかりません。", "Attention");
    return;
  }

  state.subtitleSources = subtitleSources;

  try {
    const [subtitlePayloads, segmentPayloads] = await Promise.all([
      Promise.all(
        subtitleSources.map(async (source) => ({
          source,
          rawSrt: await fetchUtf8Text(source.path, state.subtitleAbortController.signal),
        })),
      ),
      Promise.all(
        segmentSources.map(async (source) => ({
          source,
          rawSrt: await fetchUtf8Text(source.path, state.subtitleAbortController.signal),
        })),
      ),
    ]);
    if (requestId !== state.trackRequestId || state.selectedIndex !== index) {
      return;
    }
    state.cues = mergeSubtitlePayloads(subtitlePayloads);
    state.segmentCues = mergeSubtitlePayloads(segmentPayloads);
    const debugPayloads = [...subtitlePayloads, ...segmentPayloads];
    elements.rawSrt.textContent = formatRawSrtDebug(debugPayloads) || "字幕ファイルは空でした。";
    elements.subtitleStateChip.textContent = state.cues.length
      ? `${state.cues.length} cues / ${subtitleSources.length} files${state.segmentCues.length ? ` + ${state.segmentCues.length} segments` : ""}`
      : `0 cues / ${subtitleSources.length} files`;
    renderSegmentList();
    renderCueList();
    renderCurrentCue();
    setStatus(`${track.section} を読み込みました。`, "Ready");
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return;
    }
    elements.subtitleStateChip.textContent = "Subtitle error";
    elements.rawSrt.textContent = String(error);
    setStatus("字幕ファイルの読み込みに失敗しました。", "Attention");
  }
}

async function loadManifest(cacheBust = false) {
  const preferredTrackId = state.selectedIndex >= 0 ? state.tracks[state.selectedIndex]?.id : null;
  state.manifestRequestId += 1;
  const requestId = state.manifestRequestId;
  const url = cacheBust ? `${manifestUrl}?t=${Date.now()}` : manifestUrl;

  setStatus("manifest を取得しています。", "Loading");
  elements.manifestStatus.textContent = "Loading";
  elements.trackList.innerHTML = "<div class=\"empty-state\">manifest 読み込み中です。</div>";

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`manifest fetch failed: ${response.status}`);
    }
    const manifest = await response.json();
    if (requestId !== state.manifestRequestId) {
      return;
    }
    state.tracks = Array.isArray(manifest.tracks) ? manifest.tracks : [];
    elements.manifestStatus.textContent = manifest.generatedAt || "Loaded";
    elements.trackCount.textContent = String(state.tracks.length);
    renderTrackList();
    if (state.tracks.length) {
      const nextIndex = preferredTrackId
        ? state.tracks.findIndex((track) => track.id === preferredTrackId)
        : 0;
      await selectTrack(nextIndex >= 0 ? nextIndex : 0);
      await maybeRunAutomationProbe();
    } else {
      setStatus("manifest にトラックがありません。", "Attention");
    }
  } catch (error) {
    elements.manifestStatus.textContent = "Failed";
    elements.trackCount.textContent = "0";
    elements.trackList.innerHTML = "<div class=\"empty-state\">manifest の読み込みに失敗しました。`uv run python -m http.server 8000` で起動してください。</div>";
    elements.rawSrt.textContent = String(error);
    setStatus("manifest の読み込みに失敗しました。", "Attention");
  }
}

function togglePlayback() {
  if (!elements.audio.src) {
    return;
  }
  if (elements.audio.paused) {
    void elements.audio.play();
  } else {
    elements.audio.pause();
  }
}

function seekBy(delta) {
  const nextTime = Math.max(0, Math.min(elements.audio.duration || 0, (elements.audio.currentTime || 0) + delta));
  elements.audio.currentTime = nextTime;
  updateTransport();
}

elements.reloadButton.addEventListener("click", async () => {
  await loadManifest(true);
});

elements.playPauseButton.addEventListener("click", togglePlayback);
elements.restartButton.addEventListener("click", () => {
  elements.audio.currentTime = 0;
  updateTransport();
});
elements.backButton.addEventListener("click", () => seekBy(-10));
elements.forwardButton.addEventListener("click", () => seekBy(10));
elements.speedSelect.addEventListener("change", () => {
  elements.audio.playbackRate = Number(elements.speedSelect.value);
});
elements.timeSlider.addEventListener("input", () => {
  elements.audio.currentTime = Number(elements.timeSlider.value);
  syncCue(true);
  updateTransport();
});

elements.audio.addEventListener("play", () => {
  elements.playPauseIcon.textContent = "pause";
  elements.playPauseButton.setAttribute("aria-label", "一時停止");
  elements.playPauseButton.setAttribute("aria-pressed", "true");
  elements.audioStateChip.textContent = "Playing";
  setStatus("再生中です。", "Ready");
});
elements.audio.addEventListener("pause", () => {
  elements.playPauseIcon.textContent = "play_arrow";
  elements.playPauseButton.setAttribute("aria-label", "再生");
  elements.playPauseButton.setAttribute("aria-pressed", "false");
  elements.audioStateChip.textContent = "Paused";
});
elements.audio.addEventListener("loadedmetadata", () => {
  updateTransport();
  elements.audioStateChip.textContent = "Metadata ready";
});
elements.audio.addEventListener("timeupdate", updateTransport);
elements.audio.addEventListener("seeked", () => syncCue(true));
elements.audio.addEventListener("ended", () => {
  elements.audioStateChip.textContent = "Ended";
  setStatus("トラックの終端に到達しました。", "Ready");
});
elements.audio.addEventListener("error", () => {
  elements.audioStateChip.textContent = "Audio error";
  setStatus("音声ファイルを読み込めませんでした。", "Attention");
});

document.addEventListener("keydown", (event) => {
  if (
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLSelectElement ||
    event.target.closest(".track-list, .cue-list")
  ) {
    return;
  }
  if (event.code === "Space") {
    event.preventDefault();
    togglePlayback();
  } else if (event.code === "ArrowLeft") {
    event.preventDefault();
    seekBy(-5);
  } else if (event.code === "ArrowRight") {
    event.preventDefault();
    seekBy(5);
  }
});

window.fetchUtf8Text = fetchUtf8Text;
window.selectTrack = selectTrack;

void loadManifest(false);
