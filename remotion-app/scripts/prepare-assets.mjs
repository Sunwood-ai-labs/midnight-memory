import {
  copyFile,
  link,
  mkdir,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {parseSrt} from "@remotion/captions";
import {ALL_FORMATS, FilePathSource, Input} from "mediabunny";

const TARGET_FPS = 24;
const FALLBACK_METADATA = {
  width: 1920,
  height: 1080,
  durationInSeconds: 90.389333,
  durationInFrames: Math.ceil(90.389333 * TARGET_FPS),
  fps: TARGET_FPS,
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(appRoot, "..");
const publicDir = path.join(appRoot, "public");
const generatedDir = path.join(appRoot, "src", "generated");

const sourceVideoPath = path.join(repoRoot, "assets", "Midnight Memory_TopV.mp4");
const targetVideoName = "Midnight Memory_TopV.mp4";
const targetVideoPath = path.join(publicDir, targetVideoName);

const sourceSubtitleDefinitions = [
  {
    section: "intro",
    path: path.join(
      repoRoot,
      "assets",
      "Midnight Memory 夢のつづき  Intro - Chorus 1.intro.srt",
    ),
  },
  {
    section: "main",
    path: path.join(
      repoRoot,
      "assets",
      "Midnight Memory 夢のつづき  Intro - Chorus 1.main.srt",
    ),
  },
];

const formatNumber = (value, precision = 6) => Number(value.toFixed(precision));

const writeModule = async (targetPath, exportName, payload) => {
  const source = `export const ${exportName} = ${JSON.stringify(payload, null, 2)};\n`;
  await writeFile(targetPath, source, "utf8");
};

const ensureSyncedVideo = async () => {
  await mkdir(publicDir, {recursive: true});

  let destinationMatchesSource = false;
  try {
    const [sourceStats, targetStats] = await Promise.all([
      stat(sourceVideoPath),
      stat(targetVideoPath),
    ]);
    destinationMatchesSource =
      sourceStats.size === targetStats.size &&
      targetStats.mtimeMs >= sourceStats.mtimeMs;
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }

  if (destinationMatchesSource) {
    return targetVideoName;
  }

  await rm(targetVideoPath, {force: true});

  try {
    await link(sourceVideoPath, targetVideoPath);
  } catch {
    await copyFile(sourceVideoPath, targetVideoPath);
  }

  return targetVideoName;
};

const loadVideoMetadata = async () => {
  try {
    const input = new Input({
      formats: ALL_FORMATS,
      source: new FilePathSource(sourceVideoPath),
    });
    const durationInSeconds = await input.computeDuration();
    const videoTrack = await input.getPrimaryVideoTrack();

    if (!videoTrack) {
      throw new Error("Primary video track not found.");
    }

    return {
      width: videoTrack.displayWidth,
      height: videoTrack.displayHeight,
      durationInSeconds: formatNumber(durationInSeconds),
      durationInFrames: Math.ceil(durationInSeconds * TARGET_FPS),
      fps: TARGET_FPS,
    };
  } catch (error) {
    console.warn("[prepare-assets] Falling back to known metadata:", error);
    return FALLBACK_METADATA;
  }
};

const loadCaptions = async () => {
  const captionGroups = await Promise.all(
    sourceSubtitleDefinitions.map(async ({path: subtitlePath, section}) => {
      const text = await readFile(subtitlePath, "utf8");
      const {captions} = parseSrt({input: text});

      return captions.map((caption) => ({
        confidence: caption.confidence,
        endMs: caption.endMs,
        section,
        startMs: caption.startMs,
        text: caption.text.replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").trim(),
        timestampMs: caption.timestampMs,
      }));
    }),
  );

  return captionGroups
    .flat()
    .filter((caption) => caption.text.length > 0)
    .sort((left, right) => left.startMs - right.startMs)
    .map((caption, index) => ({
      ...caption,
      durationMs: Math.max(1, caption.endMs - caption.startMs),
      id: index + 1,
    }));
};

await mkdir(generatedDir, {recursive: true});

const [videoSrc, videoMetadata, captions] = await Promise.all([
  ensureSyncedVideo(),
  loadVideoMetadata(),
  loadCaptions(),
]);

await Promise.all([
  writeModule(path.join(generatedDir, "captions.jsx"), "captions", captions),
  writeModule(path.join(generatedDir, "video-metadata.jsx"), "videoMetadata", {
    ...videoMetadata,
    videoSrc,
  }),
]);

console.log(
  `[prepare-assets] Ready: ${captions.length} cues, ${videoMetadata.width}x${videoMetadata.height}, ${videoMetadata.durationInSeconds}s.`,
);
