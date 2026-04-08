const FULL_WIDTH_SPACE = "\u3000";

const PUNCTUATION_MARKERS = [
  " ",
  FULL_WIDTH_SPACE,
  "\u3001",
  "\u3002",
  "\u30fb",
  "\uff01",
  "\uff1f",
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const LARGE_MANUAL_LINES_BY_ID = new Map([
  [1, ["変わらない"]],
  [2, ["Ooh"]],
  [3, ["Ooh"]],
  [4, ["Ooh"]],
  [5, ["Ooh"]],
  [6, ["変わらない街は", "今日も"]],
  [7, ["誰かの記憶"]],
  [8, ["忘れかけた", "メロディが"]],
  [9, ["心を揺らしてる"]],
  [10, ["ふとした瞬間", "浮かんで"]],
  [11, ["今でもまだ", "消せなくて"]],
  [12, ["夜風が頬を", "撫でたとき"]],
  [13, ["名前を", "呼びそうになる"]],
  [14, ["Midnight memory", "あなたの影が"]],
  [15, ["胸の奥で", "揺れてる"]],
  [16, ["Silent feeling", "届かない"]],
  [17, ["まだ感じてるの"]],
  [18, ["Stay with me tonight"]],
  [19, ["Stay forever", "in my heart"]],
]);

export const normalizeLyricWhitespace = (text) => {
  return text.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
};

const splitOnNearestWhitespace = (text) => {
  const matches = [...text.matchAll(/[ \t\u3000]+/g)];
  if (matches.length === 0) {
    return null;
  }

  const midpoint = Math.floor(text.length / 2);
  const splitIndex = matches.reduce((closest, match) => {
    const candidate = match.index ?? 0;
    return Math.abs(candidate - midpoint) < Math.abs(closest - midpoint)
      ? candidate
      : closest;
  }, matches[0].index ?? 0);

  return `${text.slice(0, splitIndex).trim()}\n${text.slice(splitIndex).trim()}`;
};

const splitOnNearestPunctuation = (text) => {
  const midpoint = Math.floor(text.length / 2);
  const candidates = [];

  for (let index = 4; index < text.length - 4; index += 1) {
    if (PUNCTUATION_MARKERS.includes(text[index])) {
      candidates.push(text[index] === " " || text[index] === FULL_WIDTH_SPACE ? index : index + 1);
    }
  }

  if (candidates.length === 0) {
    return null;
  }

  const splitIndex = candidates.reduce((closest, candidate) => {
    return Math.abs(candidate - midpoint) < Math.abs(closest - midpoint)
      ? candidate
      : closest;
  }, candidates[0]);

  return `${text.slice(0, splitIndex).trim()}\n${text.slice(splitIndex).trim()}`;
};

export const formatLyricCueText = (caption, options = {}) => {
  const normalized = normalizeLyricWhitespace(caption.text);

  if (options.large) {
    const manualLines = LARGE_MANUAL_LINES_BY_ID.get(caption.id);
    if (manualLines) {
      return manualLines.join("\n");
    }
  }

  if (normalized.includes("\n")) {
    return normalized;
  }

  if (normalized.length <= (options.large ? 10 : 18)) {
    return normalized;
  }

  const splitOnSpace = splitOnNearestWhitespace(normalized);
  if (splitOnSpace) {
    return splitOnSpace;
  }

  const splitOnPunctuation = splitOnNearestPunctuation(normalized);
  if (splitOnPunctuation) {
    return splitOnPunctuation;
  }

  const midpoint = clamp(Math.floor(normalized.length / 2), 1, normalized.length - 1);
  return `${normalized.slice(0, midpoint).trim()}\n${normalized.slice(midpoint).trim()}`;
};
