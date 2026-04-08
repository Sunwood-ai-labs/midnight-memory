import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {formatLyricCueText} from "../lib/lyric-format.jsx";

export const fontFamily =
  '"Yu Mincho", "Hiragino Mincho ProN", "BIZ UDPMincho", "MS PMincho", serif';

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const PALETTES = [
  {
    accent: "#ffbe8f",
    ambient: "rgba(255, 190, 143, 0.20)",
    ambientWash: "rgba(255, 190, 143, 0.12)",
    edge: "rgba(255, 248, 240, 0.94)",
    ghost: "rgba(255, 240, 228, 0.18)",
    main: "#fff4ea",
    secondary: "#ffd7af",
    shadow: "rgba(53, 22, 6, 0.48)",
  },
  {
    accent: "#ff8f90",
    ambient: "rgba(255, 143, 144, 0.22)",
    ambientWash: "rgba(255, 143, 144, 0.14)",
    edge: "rgba(255, 244, 240, 0.94)",
    ghost: "rgba(255, 229, 229, 0.18)",
    main: "#fff1f2",
    secondary: "#ffc6cb",
    shadow: "rgba(66, 14, 19, 0.48)",
  },
  {
    accent: "#89bfff",
    ambient: "rgba(137, 191, 255, 0.20)",
    ambientWash: "rgba(137, 191, 255, 0.12)",
    edge: "rgba(244, 249, 255, 0.94)",
    ghost: "rgba(231, 241, 255, 0.18)",
    main: "#f4f9ff",
    secondary: "#c9e0ff",
    shadow: "rgba(10, 34, 70, 0.48)",
  },
  {
    accent: "#8bdcc2",
    ambient: "rgba(139, 220, 194, 0.20)",
    ambientWash: "rgba(139, 220, 194, 0.12)",
    edge: "rgba(243, 255, 250, 0.94)",
    ghost: "rgba(231, 247, 241, 0.18)",
    main: "#f1fff8",
    secondary: "#c4eedf",
    shadow: "rgba(6, 47, 36, 0.48)",
  },
  {
    accent: "#ffd780",
    ambient: "rgba(255, 215, 128, 0.20)",
    ambientWash: "rgba(255, 215, 128, 0.12)",
    edge: "rgba(255, 248, 230, 0.96)",
    ghost: "rgba(255, 241, 212, 0.18)",
    main: "#fff8ec",
    secondary: "#ffe8b4",
    shadow: "rgba(74, 50, 10, 0.48)",
  },
];

const SCENE_PRESETS = {
  1: {anchor: "center", top: 0.72, width: 0.32, scale: 0.62},
  2: {anchor: "center", top: 0.78, width: 0.24, scale: 0.48},
  3: {anchor: "center", top: 0.78, width: 0.24, scale: 0.48},
  4: {anchor: "center", top: 0.78, width: 0.24, scale: 0.48},
  5: {anchor: "center", top: 0.78, width: 0.24, scale: 0.48},
  6: {anchor: "left", top: 0.61, width: 0.50, scale: 0.92},
  7: {anchor: "right", top: 0.46, width: 0.44, scale: 0.88},
  8: {anchor: "left", top: 0.54, width: 0.50, scale: 0.92},
  9: {anchor: "right", top: 0.62, width: 0.42, scale: 0.90},
  10: {anchor: "left", top: 0.50, width: 0.50, scale: 0.94},
  11: {anchor: "right", top: 0.56, width: 0.46, scale: 0.92},
  12: {anchor: "left", top: 0.43, width: 0.52, scale: 0.96},
  13: {anchor: "right", top: 0.51, width: 0.42, scale: 0.96},
  14: {anchor: "left", top: 0.50, width: 0.58, scale: 1.02},
  15: {anchor: "right", top: 0.62, width: 0.46, scale: 1.02},
  16: {anchor: "left", top: 0.43, width: 0.56, scale: 1.04},
  17: {anchor: "right", top: 0.52, width: 0.44, scale: 1.04},
  18: {anchor: "center", top: 0.69, width: 0.76, scale: 1.08},
  19: {anchor: "center", top: 0.62, width: 0.78, scale: 1.10},
};

export const getPalette = (captionId) => {
  if (captionId <= 5) {
    return PALETTES[0];
  }

  if (captionId <= 9) {
    return PALETTES[1];
  }

  if (captionId <= 13) {
    return PALETTES[2];
  }

  if (captionId <= 17) {
    return PALETTES[3];
  }

  return PALETTES[4];
};

export const findActiveCaptionIndex = (captions, currentTimeMs) => {
  for (let index = 0; index < captions.length; index += 1) {
    const caption = captions[index];
    if (currentTimeMs >= caption.startMs && currentTimeMs < caption.endMs) {
      return index;
    }
  }

  return -1;
};

const estimateLineWidthUnits = (line) => {
  return Array.from(line).reduce((total, character) => {
    if (character === " ") {
      return total + 0.36;
    }

    if (/[A-Za-z0-9]/.test(character)) {
      return total + 0.62;
    }

    if (/[.,!?'"-]/.test(character)) {
      return total + 0.42;
    }

    return total + 1;
  }, 0);
};

const getAdaptiveFontSize = (baseSize, lines, maxWidth) => {
  const longestUnits = lines.reduce((longest, line) => {
    return Math.max(longest, estimateLineWidthUnits(line));
  }, 0);
  const fitLimit = Math.floor((maxWidth * 0.92) / Math.max(longestUnits, 1));
  const balance = clamp(1.12 - (longestUnits - 6) * 0.045, 0.70, 1.06);
  return Math.round(Math.min(baseSize * balance, fitLimit));
};

const getSceneStyle = (captionId, width, height, lines) => {
  const preset = SCENE_PRESETS[captionId] ?? {
    anchor: "center",
    top: 0.60,
    width: 0.68,
    scale: 1,
  };
  const lineCount = lines.length;
  const baseFontSize = height * (lineCount > 1 ? 0.168 : 0.186) * preset.scale;
  const x = Math.round(width * 0.075);
  const centered = preset.anchor === "center";
  const leftAligned = preset.anchor === "left";

  return {
    alignItems: centered ? "center" : leftAligned ? "flex-start" : "flex-end",
    anchor: preset.anchor,
    baseFontSize,
    entryRotate: centered ? -1.8 : leftAligned ? -4.2 : 4.2,
    entryX: centered ? 0 : leftAligned ? -170 : 170,
    entryY: 92,
    floatX: centered ? 0 : leftAligned ? -22 : 22,
    floatY: -18,
    glowSide: centered ? "center" : leftAligned ? "left" : "right",
    maxWidth: Math.round(width * preset.width),
    textAlign: centered ? "center" : leftAligned ? "left" : "right",
    top: Math.round(height * preset.top - (lineCount - 1) * height * 0.045),
    x,
  };
};

export const getLineAlignmentStyle = (textAlign) => {
  if (textAlign === "left") {
    return {alignItems: "flex-start"};
  }

  if (textAlign === "right") {
    return {alignItems: "flex-end"};
  }

  return {alignItems: "center"};
};

const RenderLine = ({
  cueDurationFrames,
  frameFromCueStart,
  index,
  line,
  lineFontSize,
  palette,
  scene,
}) => {
  const stagger = index * 5;
  const effectiveFrame = Math.max(0, frameFromCueStart - stagger);
  const enterSpring = spring({
    fps: cueDurationFrames.fps,
    frame: effectiveFrame,
    config: {
      damping: 14,
      mass: 0.72,
      stiffness: 104,
    },
  });
  const exitFrames = Math.min(14, Math.max(8, Math.floor(cueDurationFrames.total * 0.2)));
  const exitProgress = interpolate(
    frameFromCueStart,
    [cueDurationFrames.total - exitFrames, cueDurationFrames.total],
    [1, 0],
    {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const opacity = enterSpring * exitProgress;
  const translateX = interpolate(enterSpring, [0, 1], [scene.entryX * 0.22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(enterSpring, [0, 1], [70 + index * 18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(enterSpring, [0, 1], [1.24, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rotate = interpolate(enterSpring, [0, 1], [scene.entryRotate * 0.38, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blur = interpolate(enterSpring, [0, 1], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const isEnglish = /[A-Za-z]/.test(line);
  const tracking = isEnglish ? "0.06em" : "0.035em";
  const gradient =
    scene.textAlign === "left"
      ? `linear-gradient(92deg, ${palette.accent} 0%, ${palette.secondary} 42%, ${palette.main} 100%)`
      : scene.textAlign === "right"
        ? `linear-gradient(268deg, ${palette.accent} 0%, ${palette.secondary} 42%, ${palette.main} 100%)`
        : `linear-gradient(90deg, ${palette.accent} 0%, ${palette.secondary} 46%, ${palette.main} 100%)`;

  return (
    <div
      style={{
        ...getLineAlignmentStyle(scene.textAlign),
        display: "flex",
        flexDirection: "column",
        opacity,
        position: "relative",
        transform: `translate(${Math.round(translateX)}px, ${Math.round(translateY)}px) scale(${scale}) rotate(${rotate}deg)`,
      }}
    >
      <div
        style={{
          background:
            scene.glowSide === "left"
              ? `linear-gradient(90deg, ${palette.ambientWash} 0%, ${palette.ambient} 40%, rgba(255, 255, 255, 0) 100%)`
              : scene.glowSide === "right"
                ? `linear-gradient(270deg, ${palette.ambientWash} 0%, ${palette.ambient} 40%, rgba(255, 255, 255, 0) 100%)`
                : `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${palette.ambient} 35%, ${palette.edge} 56%, rgba(255,255,255,0) 100%)`,
          filter: "blur(16px)",
          height: Math.max(20, Math.round(lineFontSize * 0.20)),
          left: scene.textAlign === "right" ? "auto" : "-2%",
          opacity: 0.46 * opacity,
          position: "absolute",
          right: scene.textAlign === "left" ? "auto" : "-2%",
          top: Math.round(lineFontSize * 0.45),
          width: scene.textAlign === "center" ? "74%" : "58%",
          zIndex: 0,
        }}
      />
      <div
        style={{
          color: palette.ambient,
          filter: "blur(20px)",
          fontFamily,
          fontSize: lineFontSize,
          fontStyle: isEnglish ? "italic" : "normal",
          fontWeight: 700,
          letterSpacing: tracking,
          lineHeight: 0.92,
          position: "absolute",
          textAlign: scene.textAlign,
          textShadow: `0 0 24px ${palette.ambient}`,
          transform: "translate(16px, 20px) scale(1.03)",
          whiteSpace: "pre-wrap",
          wordBreak: "keep-all",
          overflowWrap: "normal",
          zIndex: 1,
        }}
      >
        {line}
      </div>
      <div
        style={{
          color: palette.ghost,
          filter: "blur(6px)",
          fontFamily,
          fontSize: lineFontSize,
          fontStyle: isEnglish ? "italic" : "normal",
          fontWeight: 700,
          letterSpacing: tracking,
          lineHeight: 0.92,
          position: "absolute",
          textAlign: scene.textAlign,
          transform: "translate(8px, 10px) scale(1.02)",
          whiteSpace: "pre-wrap",
          wordBreak: "keep-all",
          overflowWrap: "normal",
          zIndex: 2,
        }}
      >
        {line}
      </div>
      <div
        style={{
          backgroundImage: gradient,
          filter: `drop-shadow(0 0 28px ${palette.shadow}) drop-shadow(0 18px 44px rgba(0, 0, 0, 0.26)) blur(${blur}px)`,
          fontFamily,
          fontSize: lineFontSize,
          fontStyle: isEnglish ? "italic" : "normal",
          fontWeight: 700,
          letterSpacing: tracking,
          lineHeight: 0.92,
          position: "relative",
          textAlign: scene.textAlign,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          WebkitTextStroke: `1px ${palette.edge}`,
          whiteSpace: "pre-wrap",
          wordBreak: "keep-all",
          overflowWrap: "normal",
          zIndex: 3,
        }}
      >
        {line}
      </div>
    </div>
  );
};

export const LyricOverlayMv = ({captions, videoMetadata}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentTimeMs = (frame / fps) * 1000;
  const activeCaptionIndex = findActiveCaptionIndex(captions, currentTimeMs);

  if (activeCaptionIndex === -1) {
    return null;
  }

  const caption = captions[activeCaptionIndex];
  const previousCaption = activeCaptionIndex > 0 ? captions[activeCaptionIndex - 1] : null;
  const formattedText = formatLyricCueText(caption, {large: true});
  const lines = formattedText.split("\n");
  const scene = getSceneStyle(caption.id, videoMetadata.width, videoMetadata.height, lines);
  const palette = getPalette(caption.id);
  const cueDurationFrames = {
    fps,
    total: Math.max(8, Math.round(((caption.endMs - caption.startMs) / 1000) * fps)),
  };
  const cueStartFrame = Math.round((caption.startMs / 1000) * fps);
  const frameFromCueStart = Math.max(0, frame - cueStartFrame);
  const rootEnter = spring({
    fps,
    frame: frameFromCueStart,
    config: {
      damping: 15,
      mass: 0.72,
      stiffness: 96,
    },
  });
  const rootExit = interpolate(
    frameFromCueStart,
    [cueDurationFrames.total - 16, cueDurationFrames.total],
    [1, 0],
    {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const currentProgress = clamp(
    (currentTimeMs - caption.startMs) / Math.max(caption.endMs - caption.startMs, 1),
    0,
    1,
  );
  const driftX = interpolate(currentProgress, [0, 1], [0, scene.floatX], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const driftY = interpolate(currentProgress, [0, 1], [22, scene.floatY], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const motionX = interpolate(rootEnter, [0, 1], [scene.entryX, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const motionY = interpolate(rootEnter, [0, 1], [scene.entryY, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rootScale = interpolate(rootEnter, [0, 1], [1.30, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rootRotate = interpolate(rootEnter, [0, 1], [scene.entryRotate, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineFontSize = getAdaptiveFontSize(scene.baseFontSize, lines, scene.maxWidth);
  const rootOpacity = rootEnter * rootExit;
  const ghostText =
    previousCaption && caption.startMs - previousCaption.endMs <= 260
      ? formatLyricCueText(previousCaption, {large: true})
      : null;
  const anchorOffset =
    scene.anchor === "center"
      ? `translate(calc(-50% + ${Math.round(motionX + driftX)}px), ${Math.round(motionY + driftY)}px)`
      : `translate(${Math.round(motionX + driftX)}px, ${Math.round(motionY + driftY)}px)`;

  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      {ghostText ? (
        <div
          style={{
            color: palette.ghost,
            filter: "blur(18px)",
            fontFamily,
            fontSize: Math.max(74, Math.round(lineFontSize * 0.52)),
            fontStyle: /[A-Za-z]/.test(ghostText) ? "italic" : "normal",
            fontWeight: 700,
            left: scene.anchor === "left" ? scene.x : scene.anchor === "center" ? "50%" : "auto",
            letterSpacing: "0.05em",
            maxWidth: scene.maxWidth,
            opacity: interpolate(currentTimeMs, [caption.startMs, caption.startMs + 340], [0.24, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            position: "absolute",
            right: scene.anchor === "right" ? scene.x : "auto",
            textAlign: scene.textAlign,
            top: scene.top - Math.round(lineFontSize * 0.18),
            transform: scene.anchor === "center" ? "translate(-50%, 0)" : "translate(0, 0)",
            whiteSpace: "pre-wrap",
            wordBreak: "keep-all",
            overflowWrap: "normal",
            width: scene.maxWidth,
            zIndex: 0,
          }}
        >
          {ghostText}
        </div>
      ) : null}
      <AbsoluteFill
        style={{
          background:
            scene.anchor === "center"
              ? `radial-gradient(circle at 50% 62%, ${palette.ambientWash} 0%, ${palette.ambient} 20%, rgba(255, 255, 255, 0) 56%)`
              : scene.anchor === "left"
                ? `radial-gradient(circle at 24% 58%, ${palette.ambientWash} 0%, ${palette.ambient} 18%, rgba(255, 255, 255, 0) 54%)`
                : `radial-gradient(circle at 76% 58%, ${palette.ambientWash} 0%, ${palette.ambient} 18%, rgba(255, 255, 255, 0) 54%)`,
          mixBlendMode: "screen",
          opacity: interpolate(rootEnter, [0, 1], [0.12, 0.30], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }) * rootExit,
        }}
      />
      <div
        style={{
          alignItems: scene.alignItems,
          display: "flex",
          flexDirection: "column",
          left: scene.anchor === "left" ? scene.x : scene.anchor === "center" ? "50%" : "auto",
          maxWidth: scene.maxWidth,
          opacity: rootOpacity,
          position: "absolute",
          right: scene.anchor === "right" ? scene.x : "auto",
          top: scene.top,
          transform: `${anchorOffset} scale(${rootScale}) rotate(${rootRotate}deg)`,
          transformOrigin:
            scene.anchor === "left"
              ? "left center"
              : scene.anchor === "right"
                ? "right center"
                : "center center",
          width: scene.maxWidth,
          zIndex: 1,
        }}
      >
        <div
          style={{
            ...getLineAlignmentStyle(scene.textAlign),
            display: "flex",
            flexDirection: "column",
            gap: Math.max(8, Math.round(lineFontSize * 0.1)),
            position: "relative",
            width: "100%",
          }}
        >
          {lines.map((line, index) => {
            return (
              <RenderLine
                key={`${caption.id}-${index}`}
                cueDurationFrames={cueDurationFrames}
                frameFromCueStart={frameFromCueStart}
                index={index}
                line={line}
                lineFontSize={lineFontSize}
                palette={palette}
                scene={scene}
              />
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
