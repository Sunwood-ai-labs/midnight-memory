const repoRootUrl = new URL("../../", window.location.href);
const manifestUrl = new URL("assets/manifest.json", repoRootUrl).toString();
const requestedTrackId = new URLSearchParams(window.location.search).get("track");

const state = {
  tracks: [],
  selectedIndex: -1,
  clips: [],
  currentClipIndex: -1,
  filter: "all",
  rawMetadata: "",
  manifestRequestId: 0,
  trackRequestId: 0,
  metadataUrl: "",
  probeRan: false,
};

const elements = {
  subtitleViewLink: document.getElementById("subtitleViewLink"),
  manifestStatus: document.getElementById("manifestStatus"),
  trackCount: document.getElementById("trackCount"),
  clipCount: document.getElementById("clipCount"),
  trackHint: document.getElementById("trackHint"),
  trackList: document.getElementById("trackList"),
  readyBadge: document.getElementById("readyBadge"),
  statusHeadline: document.getElementById("statusHeadline"),
  statusDetail: document.getElementById("statusDetail"),
  deckTitle: document.getElementById("deckTitle"),
  deckSubtitle: document.getElementById("deckSubtitle"),
  reloadButton: document.getElementById("reloadButton"),
  previousClipButton: document.getElementById("previousClipButton"),
  playPauseButton: document.getElementById("playPauseButton"),
  playPauseIcon: document.getElementById("playPauseIcon"),
  restartClipButton: document.getElementById("restartClipButton"),
  backButton: document.getElementById("backButton"),
  forwardButton: document.getElementById("forwardButton"),
  nextClipButton: document.getElementById("nextClipButton"),
  timeSlider: document.getElementById("timeSlider"),
  timeReadout: document.getElementById("timeReadout"),
  metadataStateChip: document.getElementById("metadataStateChip"),
  audioStateChip: document.getElementById("audioStateChip"),
  selectedClipLabel: document.getElementById("selectedClipLabel"),
  selectedClipRange: document.getElementById("selectedClipRange"),
  selectedClipDuration: document.getElementById("selectedClipDuration"),
  selectedClipKind: document.getElementById("selectedClipKind"),
  selectedClipFile: document.getElementById("selectedClipFile"),
  currentClipTitle: document.getElementById("currentClipTitle"),
  currentClipText: document.getElementById("currentClipText"),
  currentClipRange: document.getElementById("currentClipRange"),
  selectedClipMeter: document.getElementById("selectedClipMeter"),
  clipAudio: document.getElementById("clipAudio"),
  filterPills: document.getElementById("filterPills"),
  clipList: document.getElementById("clipList"),
  metadataSourceLabel: document.getElementById("metadataSourceLabel"),
  clipSourceManifest: document.getElementById("clipSourceManifest"),
  timelineSourceLabel: document.getElementById("timelineSourceLabel"),
  audioSourceLabel: document.getElementById("audioSourceLabel"),
  rawMetadata: document.getElementById("rawMetadata"),
  commandHint: document.getElementById("commandHint"),
  statusMessage: document.getElementById("statusMessage"),
};

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

function setStatus(headline, detail, badge = "Ready") {
  elements.statusHeadline.textContent = headline;
  elements.statusDetail.textContent = detail;
  elements.readyBadge.textContent = badge;
  elements.statusMessage.textContent = detail;
}

function basename(value) {
  return String(value || "").split(/[\\/]/).pop() || "";
}

function trackLabel(track) {
  return [track.title, track.section].filter(Boolean).join(" - ") || track.id || "Untitled";
}

function pickTimelineSource(track) {
  if (Array.isArray(track.timelineSubtitles) && track.timelineSubtitles.length) {
    return (
      track.timelineSubtitles.find((source) => source && typeof source.id === "string" && source.id === "ltx")
      || track.timelineSubtitles.find((source) => source && typeof source.path === "string" && source.path.trim())
      || null
    );
  }
  if (typeof track.segmentSubtitle === "string" && track.segmentSubtitle.trim()) {
    return { id: "ltx-segments", label: "LTX", path: track.segmentSubtitle };
  }
  return null;
}

function clipDirectoryName(path) {
  return basename(path).replace(/\.ltx_segments\.srt$/i, "").replace(/\.srt$/i, "");
}

function resolveRepoPath(path) {
  return new URL(path, repoRootUrl).toString();
}

function resolveMetadataPath(track) {
  const source = pickTimelineSource(track);
  if (!source || typeof source.path !== "string") {
    return null;
  }
  return `private-assets/ltx-segment-splits/${clipDirectoryName(source.path)}/segments.json`;
}

function summarizeText(value) {
  const normalized = String(value || "").trim();
  if (!normalized) {
    return "(empty line)";
  }
  const singleLine = normalized.replace(/\s+/g, " ");
  return singleLine.length > 88 ? `${singleLine.slice(0, 85)}...` : singleLine;
}

function normalizeClips(metadata, metadataUrl) {
  const rawSegments = Array.isArray(metadata.segments) ? metadata.segments : [];
  return rawSegments.map((segment, index) => {
    const fileName = basename(segment.file || segment.file_name || segment.output_path || `segment-${index + 1}.wav`);
    const start = Number(segment.start_seconds) || 0;
    const end = Number(segment.end_seconds) || 0;
    return {
      index: Number(segment.index) || (index + 1),
      start,
      end,
      duration: Number(segment.duration_seconds) || Math.max(0, end - start),
      text: String(segment.text || ""),
      kind: String(segment.kind || (fileName.includes("__melody") ? "melody" : "lyric")).trim(),
      fileName,
      clipUrl: new URL(fileName, metadataUrl).toString(),
    };
  });
}

function getVisibleClips() {
  if (state.filter === "all") {
    return state.clips;
  }
  return state.clips.filter((clip) => clip.kind === state.filter);
}

function currentClip() {
  return state.clips[state.currentClipIndex] || null;
}

function ensureCurrentClipVisible() {
  const visibleClips = getVisibleClips();
  if (!visibleClips.length) {
    state.currentClipIndex = -1;
    return;
  }
  if (!visibleClips.some((clip) => clip === currentClip())) {
    state.currentClipIndex = state.clips.findIndex((clip) => clip.index === visibleClips[0].index);
  }
}

function renderTrackList() {
  elements.trackList.innerHTML = "";
  if (!state.tracks.length) {
    elements.trackList.innerHTML = "<div class=\"empty-state\">Clip decks will appear here.</div>";
    return;
  }

  state.tracks.forEach((track, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "clip-track-button";
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", index === state.selectedIndex ? "true" : "false");
    button.innerHTML = `
      <div class="clip-track-top">
        <span class="clip-track-section">${track.section || track.id || "Track"}</span>
        <span class="clip-track-status clip-track-status--ready">Ready</span>
      </div>
      <div class="clip-track-title">${track.title || trackLabel(track)}</div>
      <div class="clip-track-bottom">
        <span class="clip-track-count">${clipDirectoryName(pickTimelineSource(track)?.path || "") || "no ltx source"}</span>
      </div>
    `;
    button.addEventListener("click", () => {
      void selectTrack(index);
    });
    elements.trackList.appendChild(button);
  });
}

function renderClipList() {
  const visibleClips = getVisibleClips();
  if (!visibleClips.length) {
    elements.clipList.innerHTML = "<div class=\"empty-state\">Clip segments will appear here.</div>";
    elements.clipCount.textContent = "0";
    return;
  }

  elements.clipList.innerHTML = "";
  visibleClips.forEach((clip) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `clip-button${clip === currentClip() ? " active" : ""}`;
    button.dataset.kind = clip.kind;
    button.innerHTML = `
      <div class="clip-button-top">
        <span class="clip-index">Clip ${String(clip.index).padStart(2, "0")}</span>
        <span class="clip-button-range">${formatCueStamp(clip.start)} -> ${formatCueStamp(clip.end)}</span>
      </div>
      <div class="clip-button-text">${summarizeText(clip.text)}</div>
      <div class="clip-button-meta">
        <span class="clip-button-duration">${clip.duration.toFixed(3)}s</span>
        <span class="clip-file">${clip.fileName}</span>
      </div>
    `;
    button.addEventListener("click", () => {
      const actualIndex = state.clips.findIndex((candidate) => candidate.index === clip.index);
      selectClip(actualIndex, true);
    });
    elements.clipList.appendChild(button);
  });
  elements.clipCount.textContent = String(visibleClips.length);
}

function resetSelectedClipView() {
  elements.selectedClipLabel.textContent = "0 / 0";
  elements.selectedClipRange.textContent = "00:00.000 -> 00:00.000";
  elements.selectedClipDuration.textContent = "--.-s";
  elements.selectedClipKind.textContent = "Clip";
  elements.selectedClipKind.dataset.kind = "";
  elements.selectedClipFile.textContent = "No file loaded";
  elements.currentClipTitle.textContent = "Select a clip deck";
  elements.currentClipText.textContent = "The selected clip text will appear here.";
  elements.currentClipRange.textContent = "00:00.000 -> 00:00.000";
  elements.selectedClipMeter.style.left = "0%";
  elements.selectedClipMeter.style.width = "0%";
}

function renderSelectedClip() {
  const track = state.tracks[state.selectedIndex] || null;
  const clip = currentClip();
  const totalDuration = state.clips.length ? state.clips[state.clips.length - 1].end : 0;

  if (!track) {
    elements.deckTitle.textContent = "Preparing clip audit deck";
    elements.deckSubtitle.textContent = "Loading segment metadata and split WAV paths.";
    resetSelectedClipView();
    elements.clipAudio.removeAttribute("src");
    elements.clipAudio.load();
    return;
  }

  elements.deckTitle.textContent = trackLabel(track);
  elements.deckSubtitle.textContent = clipDirectoryName(pickTimelineSource(track)?.path || "");
  elements.subtitleViewLink.href = track.id ? `../?track=${encodeURIComponent(track.id)}` : "../";

  if (!clip) {
    resetSelectedClipView();
    elements.clipAudio.removeAttribute("src");
    elements.clipAudio.load();
    return;
  }

  const left = totalDuration > 0 ? (clip.start / totalDuration) * 100 : 0;
  const width = totalDuration > 0 ? ((clip.end - clip.start) / totalDuration) * 100 : 0;
  const visibleClips = getVisibleClips();
  const visibleIndex = visibleClips.findIndex((candidate) => candidate === clip);
  elements.selectedClipLabel.textContent = `${visibleIndex + 1} / ${visibleClips.length}`;
  elements.selectedClipRange.textContent = `${formatCueStamp(clip.start)} -> ${formatCueStamp(clip.end)}`;
  elements.selectedClipDuration.textContent = `${clip.duration.toFixed(3)}s`;
  elements.selectedClipKind.textContent = clip.kind;
  elements.selectedClipKind.dataset.kind = clip.kind;
  elements.selectedClipFile.textContent = clip.fileName;
  elements.currentClipTitle.textContent = `Clip ${clip.index} • ${clip.fileName}`;
  elements.currentClipText.textContent = clip.text || "(empty line)";
  elements.currentClipRange.textContent = `${formatCueStamp(clip.start)} -> ${formatCueStamp(clip.end)}`;
  elements.selectedClipMeter.style.left = `${left}%`;
  elements.selectedClipMeter.style.width = `${Math.max(width, 4)}%`;
  elements.clipAudio.src = clip.clipUrl;
  elements.clipAudio.load();
}

function updateTransport() {
  const duration = Number.isFinite(elements.clipAudio.duration) ? elements.clipAudio.duration : 0;
  elements.timeSlider.max = String(duration);
  elements.timeSlider.value = String(Math.min(elements.clipAudio.currentTime || 0, duration));
  elements.timeReadout.textContent = `${formatClock(elements.clipAudio.currentTime || 0)} / ${formatClock(duration)}`;
}

function syncFilterPills() {
  elements.filterPills.querySelectorAll(".filter-pill").forEach((button) => {
    const isActive = button.dataset.filter === state.filter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function selectClip(index, autoPlay = false) {
  if (!state.clips.length) {
    return;
  }
  const safeIndex = Math.max(0, Math.min(index, state.clips.length - 1));
  state.currentClipIndex = safeIndex;
  ensureCurrentClipVisible();
  renderClipList();
  renderSelectedClip();
  updateTransport();
  if (autoPlay) {
    void elements.clipAudio.play().catch(() => {});
  }
}

async function fetchJson(path) {
  const response = await fetch(resolveRepoPath(path), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }
  return response.json();
}

async function maybeRunProbe() {
  if (state.probeRan || new URLSearchParams(window.location.search).get("testClipAudit") !== "1") {
    return;
  }
  const visibleClips = getVisibleClips();
  if (!visibleClips.length) {
    return;
  }
  state.probeRan = true;
  const clip = currentClip() || visibleClips[0];
  document.body.setAttribute(
    "data-probe-clip-audit",
    [
      state.tracks[state.selectedIndex]?.section || "",
      String(visibleClips.length),
      clip?.fileName || "",
    ].join("|"),
  );
}

async function selectTrack(index) {
  const track = state.tracks[index];
  if (!track) {
    return;
  }

  state.selectedIndex = index;
  state.currentClipIndex = -1;
  state.filter = "all";
  state.clips = [];
  state.trackRequestId += 1;
  const requestId = state.trackRequestId;
  renderTrackList();
  syncFilterPills();
  renderClipList();
  renderSelectedClip();

  const metadataPath = resolveMetadataPath(track);
  const source = pickTimelineSource(track);
  elements.trackHint.textContent = source?.path || "segments.json source";
  elements.timelineSourceLabel.textContent = source?.path || "No LTX source";
  elements.audioSourceLabel.textContent = track.audio || "No audio source";

  if (!metadataPath) {
    elements.metadataSourceLabel.textContent = "No LTX source";
    elements.clipSourceManifest.textContent = "No metadata path";
    elements.rawMetadata.textContent = "timelineSubtitles are required for WAV clip audit.";
    setStatus("No clip bundle for this track.", "Add timelineSubtitles to the manifest to enable clip review.", "Attention");
    return;
  }

  elements.metadataSourceLabel.textContent = metadataPath;
  elements.clipSourceManifest.textContent = metadataPath;
  elements.rawMetadata.textContent = "Loading segment metadata.";
  elements.metadataStateChip.textContent = "Metadata loading";
  setStatus("Loading clip deck.", `${trackLabel(track)} segment metadata is being fetched.`, "Loading");

  try {
    const metadata = await fetchJson(metadataPath);
    if (requestId !== state.trackRequestId || state.selectedIndex !== index) {
      return;
    }
    state.metadataUrl = resolveRepoPath(metadataPath);
    state.rawMetadata = JSON.stringify(metadata, null, 2);
    state.clips = normalizeClips(metadata, state.metadataUrl);
    state.currentClipIndex = state.clips.length ? 0 : -1;
    elements.rawMetadata.textContent = state.rawMetadata;
    elements.metadataStateChip.textContent = `${state.clips.length} clips`;
    elements.commandHint.textContent = `Deck ready at ${metadataPath}`;
    ensureCurrentClipVisible();
    renderClipList();
    renderSelectedClip();
    setStatus("Clip deck loaded.", `${trackLabel(track)} loaded with ${state.clips.length} clips.`, "Ready");
    await maybeRunProbe();
  } catch (error) {
    if (requestId !== state.trackRequestId || state.selectedIndex !== index) {
      return;
    }
    const command = source
      ? `uv run python scripts/split_audio_by_srt.py --overwrite "${source.path}"`
      : "uv run python scripts/split_audio_by_srt.py --overwrite";
    elements.rawMetadata.textContent = [String(error), "", "Hint:", command].join("\n");
    elements.metadataStateChip.textContent = "Metadata missing";
    elements.commandHint.textContent = command;
    renderClipList();
    renderSelectedClip();
    setStatus("Clip deck is missing.", `Generate the split bundle with: ${command}`, "Attention");
  }
}

async function loadManifest() {
  state.manifestRequestId += 1;
  const requestId = state.manifestRequestId;
  elements.manifestStatus.textContent = "Loading";
  setStatus("Loading clip decks.", "Fetching tracks from the manifest.", "Loading");

  try {
    const response = await fetch(manifestUrl, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`manifest fetch failed: ${response.status}`);
    }
    const manifest = await response.json();
    if (requestId !== state.manifestRequestId) {
      return;
    }
    state.tracks = (Array.isArray(manifest.tracks) ? manifest.tracks : [])
      .filter((track) => Boolean(resolveMetadataPath(track)));
    elements.manifestStatus.textContent = manifest.generatedAt || "Loaded";
    elements.trackCount.textContent = String(state.tracks.length);
    renderTrackList();

    if (!state.tracks.length) {
      setStatus("No clip decks found.", "No manifest tracks expose timelineSubtitles.", "Attention");
      return;
    }

    const preferredIndex = requestedTrackId
      ? state.tracks.findIndex((track) => track.id === requestedTrackId)
      : 0;
    await selectTrack(preferredIndex >= 0 ? preferredIndex : 0);
  } catch (error) {
    elements.manifestStatus.textContent = "Failed";
    elements.trackCount.textContent = "0";
    elements.trackList.innerHTML = "<div class=\"empty-state\">Manifest loading failed.</div>";
    elements.rawMetadata.textContent = String(error);
    setStatus("Manifest loading failed.", "Start the local HTTP server and retry.", "Attention");
  }
}

function togglePlayback() {
  if (!elements.clipAudio.src) {
    return;
  }
  if (elements.clipAudio.paused) {
    void elements.clipAudio.play();
  } else {
    elements.clipAudio.pause();
  }
}

function seekBy(delta) {
  const duration = Number.isFinite(elements.clipAudio.duration) ? elements.clipAudio.duration : 0;
  const nextTime = Math.max(0, Math.min(duration, (elements.clipAudio.currentTime || 0) + delta));
  elements.clipAudio.currentTime = nextTime;
  updateTransport();
}

elements.reloadButton.addEventListener("click", async () => {
  await loadManifest();
});

elements.previousClipButton.addEventListener("click", () => selectClip(state.currentClipIndex - 1, false));
elements.playPauseButton.addEventListener("click", togglePlayback);
elements.restartClipButton.addEventListener("click", () => {
  elements.clipAudio.currentTime = 0;
  updateTransport();
});
elements.backButton.addEventListener("click", () => seekBy(-10));
elements.forwardButton.addEventListener("click", () => seekBy(10));
elements.nextClipButton.addEventListener("click", () => selectClip(state.currentClipIndex + 1, false));
elements.timeSlider.addEventListener("input", () => {
  elements.clipAudio.currentTime = Number(elements.timeSlider.value);
  updateTransport();
});

elements.filterPills.addEventListener("click", (event) => {
  const button = event.target.closest(".filter-pill");
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }
  state.filter = button.dataset.filter || "all";
  syncFilterPills();
  ensureCurrentClipVisible();
  renderClipList();
  renderSelectedClip();
  void maybeRunProbe();
});

elements.clipAudio.addEventListener("play", () => {
  elements.playPauseIcon.textContent = "pause";
  elements.playPauseButton.setAttribute("aria-label", "Pause clip");
  elements.playPauseButton.setAttribute("aria-pressed", "true");
  elements.audioStateChip.textContent = "Playing";
});

elements.clipAudio.addEventListener("pause", () => {
  elements.playPauseIcon.textContent = "play_arrow";
  elements.playPauseButton.setAttribute("aria-label", "Play clip");
  elements.playPauseButton.setAttribute("aria-pressed", "false");
  elements.audioStateChip.textContent = "Paused";
});

elements.clipAudio.addEventListener("loadedmetadata", () => {
  updateTransport();
  elements.audioStateChip.textContent = "Audio ready";
});
elements.clipAudio.addEventListener("timeupdate", updateTransport);
elements.clipAudio.addEventListener("ended", () => {
  const nextIndex = state.currentClipIndex + 1;
  if (nextIndex < state.clips.length) {
    selectClip(nextIndex, false);
  }
});
elements.clipAudio.addEventListener("error", () => {
  elements.audioStateChip.textContent = "Audio error";
  setStatus("Clip playback failed.", "The split WAV file could not be opened.", "Attention");
});

document.addEventListener("keydown", (event) => {
  if (
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLSelectElement ||
    event.target.closest(".track-list, .clip-list")
  ) {
    return;
  }
  if (event.code === "Space") {
    event.preventDefault();
    togglePlayback();
  } else if (event.code === "ArrowLeft") {
    event.preventDefault();
    selectClip(state.currentClipIndex - 1, false);
  } else if (event.code === "ArrowRight") {
    event.preventDefault();
    selectClip(state.currentClipIndex + 1, false);
  }
});

syncFilterPills();
void loadManifest();
