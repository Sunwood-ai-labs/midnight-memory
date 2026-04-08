import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {clamp, fontFamily, getPalette} from "./LyricOverlayMv.jsx";

const parseColor = (value) => {
  if (value.startsWith("#")) {
    const normalized =
      value.length === 4
        ? value
            .slice(1)
            .split("")
            .map((character) => character + character)
            .join("")
        : value.slice(1);

    return {
      a: 1,
      b: Number.parseInt(normalized.slice(4, 6), 16),
      g: Number.parseInt(normalized.slice(2, 4), 16),
      r: Number.parseInt(normalized.slice(0, 2), 16),
    };
  }

  const match = value.match(/rgba?\(([^)]+)\)/);
  if (!match) {
    throw new Error(`Unsupported color format: ${value}`);
  }

  const [r, g, b, alpha = "1"] = match[1].split(",").map((segment) => segment.trim());
  return {
    a: Number.parseFloat(alpha),
    b: Number.parseFloat(b),
    g: Number.parseFloat(g),
    r: Number.parseFloat(r),
  };
};

const mixColor = (from, to, amount) => {
  const start = parseColor(from);
  const end = parseColor(to);
  const t = clamp(amount, 0, 1);
  const mixChannel = (key) => start[key] + (end[key] - start[key]) * t;

  return `rgba(${Math.round(mixChannel("r"))}, ${Math.round(mixChannel("g"))}, ${Math.round(mixChannel("b"))}, ${mixChannel("a").toFixed(3)})`;
};

const getAnchorStyle = ({anchor, videoMetadata}) => {
  const shared = {
    maxWidth: Math.min(videoMetadata.width * 0.60, 960),
    top: Math.round(videoMetadata.height * 0.54),
  };

  if (anchor === "left") {
    return {
      ...shared,
      alignItems: "flex-start",
      left: Math.round(videoMetadata.width * 0.08),
      textAlign: "left",
      transformBase: "translate(0, 0)",
    };
  }

  if (anchor === "right") {
    return {
      ...shared,
      alignItems: "flex-end",
      right: Math.round(videoMetadata.width * 0.08),
      textAlign: "right",
      transformBase: "translate(0, 0)",
    };
  }

  return {
    ...shared,
    alignItems: "center",
    left: "50%",
    textAlign: "center",
    transformBase: "translate(-50%, 0)",
  };
};

const CREDIT_PALETTE_STOPS = [
  {progress: 0, palette: getPalette(14)},
  {progress: 0.5, palette: getPalette(16)},
  {progress: 1, palette: getPalette(19)},
];

const getCreditPalette = (progress) => {
  if (progress <= CREDIT_PALETTE_STOPS[0].progress) {
    return CREDIT_PALETTE_STOPS[0].palette;
  }

  for (let index = 0; index < CREDIT_PALETTE_STOPS.length - 1; index += 1) {
    const currentStop = CREDIT_PALETTE_STOPS[index];
    const nextStop = CREDIT_PALETTE_STOPS[index + 1];

    if (progress <= nextStop.progress) {
      const localProgress =
        (progress - currentStop.progress) /
        Math.max(nextStop.progress - currentStop.progress, 0.0001);

      return {
        accent: mixColor(currentStop.palette.accent, nextStop.palette.accent, localProgress),
        ambient: mixColor(currentStop.palette.ambient, nextStop.palette.ambient, localProgress),
        ambientWash: mixColor(currentStop.palette.ambientWash, nextStop.palette.ambientWash, localProgress),
        edge: mixColor(currentStop.palette.edge, nextStop.palette.edge, localProgress),
        ghost: mixColor(currentStop.palette.ghost, nextStop.palette.ghost, localProgress),
        main: mixColor(currentStop.palette.main, nextStop.palette.main, localProgress),
        secondary: mixColor(currentStop.palette.secondary, nextStop.palette.secondary, localProgress),
        shadow: mixColor(currentStop.palette.shadow, nextStop.palette.shadow, localProgress),
      };
    }
  }

  return CREDIT_PALETTE_STOPS[CREDIT_PALETTE_STOPS.length - 1].palette;
};

export const CreditOutro = ({endMs, pages, startMs, videoMetadata}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  if (!pages?.length || startMs >= endMs) {
    return null;
  }

  const currentTimeMs = (frame / fps) * 1000;
  if (currentTimeMs < startMs || currentTimeMs >= endMs) {
    return null;
  }

  const totalDurationMs = Math.max(endMs - startMs, 1);
  const timelineProgress = clamp((currentTimeMs - startMs) / totalDurationMs, 0, 1);
  const pageDurationMs = totalDurationMs / pages.length;
  const pageIndex = Math.min(
    pages.length - 1,
    Math.floor((currentTimeMs - startMs) / Math.max(pageDurationMs, 1)),
  );
  const page = pages[pageIndex];
  const pageStartMs = startMs + pageIndex * pageDurationMs;
  const pageEndMs = pageIndex === pages.length - 1 ? endMs : pageStartMs + pageDurationMs;
  const localFrame = Math.max(0, frame - Math.round((pageStartMs / 1000) * fps));
  const palette = getCreditPalette(timelineProgress);
  const anchor = getAnchorStyle({anchor: page.anchor ?? "center", videoMetadata});
  const rootSpring = spring({
    fps,
    frame: localFrame,
    config: {
      damping: 16,
      mass: 0.74,
      stiffness: 90,
    },
  });
  const rootOpacity =
    interpolate(rootSpring, [0, 1], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    interpolate(currentTimeMs, [pageEndMs - 760, pageEndMs - 160], [1, 0], {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    interpolate(currentTimeMs, [startMs, startMs + 280, endMs - 220, endMs], [0, 1, 1, 0], {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const driftX = Math.sin((currentTimeMs - pageStartMs) / 1200) * (page.anchor === "center" ? 8 : 14);
  const driftY = Math.cos((currentTimeMs - pageStartMs) / 1400) * 8 - interpolate(rootSpring, [0, 1], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <AbsoluteFill
        style={{
          background:
            page.anchor === "left"
              ? `radial-gradient(circle at 24% 60%, ${palette.ambientWash} 0%, ${palette.ambient} 22%, rgba(255, 255, 255, 0) 62%)`
              : page.anchor === "right"
                ? `radial-gradient(circle at 76% 60%, ${palette.ambientWash} 0%, ${palette.ambient} 22%, rgba(255, 255, 255, 0) 62%)`
                : `radial-gradient(circle at 50% 62%, ${palette.ambientWash} 0%, ${palette.ambient} 24%, rgba(255, 255, 255, 0) 62%)`,
          mixBlendMode: "screen",
          opacity: 0.34 * rootOpacity,
        }}
      />
      <div
        style={{
          alignItems: anchor.alignItems,
          display: "flex",
          flexDirection: "column",
          left: anchor.left,
          maxWidth: anchor.maxWidth,
          position: "absolute",
          right: anchor.right,
          textAlign: anchor.textAlign,
          top: anchor.top,
          transform: `${anchor.transformBase} translate(${Math.round(driftX)}px, ${Math.round(driftY)}px)`,
          width: anchor.maxWidth,
        }}
      >
        <div
          style={{
            background: `linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, ${palette.edge} 18%, rgba(255, 255, 255, 0) 100%)`,
            filter: "blur(3px)",
            height: 2,
            marginBottom: 22,
            opacity: 0.36 * rootOpacity,
            width: Math.min(anchor.maxWidth * 0.42, 320),
          }}
        />
        {page.eyebrow ? (
          <div
            style={{
              color: mixColor(palette.secondary, palette.main, 0.3),
              fontFamily,
              fontSize: 28,
              fontStyle: "italic",
              fontWeight: 600,
              letterSpacing: "0.16em",
              lineHeight: 1.2,
              marginBottom: 24,
              opacity: rootOpacity * 0.96,
              textShadow: `0 0 18px ${palette.ambient}, 0 2px 18px rgba(0, 0, 0, 0.78)`,
            }}
          >
            {page.eyebrow}
          </div>
        ) : null}
        {(page.blocks ?? []).map((block, index) => {
          const blockSpring = spring({
            fps,
            frame: Math.max(0, localFrame - 4 - index * 4),
            config: {
              damping: 15,
              mass: 0.72,
              stiffness: 96,
            },
          });
          const blockOpacity = interpolate(blockSpring, [0, 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }) * rootOpacity;
          const blockY = interpolate(blockSpring, [0, 1], [24, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={`${block.label}-${index}`}
              style={{
                marginBottom: index === (page.blocks ?? []).length - 1 ? 0 : 32,
                opacity: blockOpacity,
                position: "relative",
                transform: `translateY(${Math.round(blockY)}px)`,
                width: "100%",
              }}
            >
              <div
                style={{
                  color: mixColor(palette.secondary, palette.main, 0.26),
                  fontFamily,
                  fontSize: 24,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  lineHeight: 1.3,
                  marginBottom: 10,
                  textShadow: `0 0 14px ${palette.ambient}, 0 2px 18px rgba(0, 0, 0, 0.78)`,
                }}
              >
                {block.label}
              </div>
              <div
                style={{
                  color: palette.ghost,
                  filter: "blur(18px)",
                  fontFamily,
                  fontSize: block.valueFontSize ?? 72,
                  fontStyle: /[A-Za-z0-9]/.test(block.value) ? "italic" : "normal",
                  fontWeight: 700,
                  letterSpacing: /[A-Za-z0-9]/.test(block.value) ? "0.04em" : "0.08em",
                  lineHeight: 0.95,
                  opacity: 0.64,
                  position: "absolute",
                  textAlign: anchor.textAlign,
                  transform: "translate(12px, 16px) scale(1.02)",
                  width: "100%",
                  zIndex: 0,
                }}
              >
                {block.value}
              </div>
              <div
                style={{
                  color: palette.main,
                  fontFamily,
                  fontSize: block.valueFontSize ?? 72,
                  fontStyle: /[A-Za-z0-9]/.test(block.value) ? "italic" : "normal",
                  fontWeight: 700,
                  letterSpacing: /[A-Za-z0-9]/.test(block.value) ? "0.04em" : "0.08em",
                  lineHeight: 0.95,
                  position: "relative",
                  textShadow: `0 0 22px ${mixColor(palette.accent, palette.secondary, 0.48)}, 0 0 48px ${palette.ambient}`,
                  WebkitTextStroke: `1px ${palette.edge}`,
                  zIndex: 2,
                }}
              >
                {block.value}
              </div>
              {block.note ? (
                <div
                  style={{
                    color: mixColor(palette.main, palette.secondary, 0.38),
                    fontFamily,
                    fontSize: block.noteFontSize ?? 24,
                    fontStyle: /[A-Za-z0-9]/.test(block.note) ? "italic" : "normal",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    lineHeight: 1.25,
                    marginTop: 10,
                    textShadow: `0 0 14px ${palette.ambient}, 0 2px 18px rgba(0, 0, 0, 0.82)`,
                    zIndex: 2,
                  }}
                >
                  {block.note}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
