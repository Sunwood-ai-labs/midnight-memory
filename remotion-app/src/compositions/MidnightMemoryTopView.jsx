import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {Video} from "@remotion/media";
import {CreditOutro} from "../components/CreditOutro.jsx";
import {LyricOverlayMv, clamp, fontFamily, getPalette} from "../components/LyricOverlayMv.jsx";

const CREDIT_PAGES = [
  {
    eyebrow: "Lyric Workflow",
    anchor: "left",
    blocks: [
      {
        label: "Subtitle source",
        value: "midnight-memory",
        note: "timing + split subtitle workflow repository",
        valueFontSize: 72,
      },
    ],
  },
  {
    eyebrow: "Visual Credit",
    anchor: "right",
    blocks: [
      {
        label: "Base visual",
        value: "TopView / SeeDance 2.0",
        note: "used as the source visual for this lyric motion cut",
        valueFontSize: 62,
        noteFontSize: 22,
      },
      {
        label: "Motion finish",
        value: "Remotion",
        note: "lyric compositing and outro credits",
        valueFontSize: 54,
        noteFontSize: 22,
      },
    ],
  },
];

const IntroTitleCard = ({endMs, startMs, videoMetadata}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentTimeMs = (frame / fps) * 1000;

  if (currentTimeMs < startMs || currentTimeMs >= endMs) {
    return null;
  }

  const palette = getPalette(1);
  const enterProgress = interpolate(currentTimeMs, [startMs, startMs + 1400], [0.24, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitProgress = interpolate(currentTimeMs, [endMs - 1400, endMs], [1, 0], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = enterProgress * exitProgress;
  const shimmer = clamp((currentTimeMs - startMs) / Math.max(endMs - startMs, 1), 0, 1);
  const localFrame = Math.max(0, frame - Math.round((startMs / 1000) * fps));
  const rootSpring = spring({
    fps,
    frame: localFrame,
    config: {
      damping: 15,
      mass: 0.76,
      stiffness: 90,
    },
  });
  const driftX = Math.sin((currentTimeMs - startMs) / 1800) * 10;
  const driftY = Math.cos((currentTimeMs - startMs) / 1400) * 6 - interpolate(rootSpring, [0, 1], [28, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(rootSpring, [0, 1], [1.08, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cardWidth = Math.min(videoMetadata.width * 0.72, 1180);
  const glowTravel = interpolate(shimmer, [0, 1], [-16, 108], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 44%, ${palette.ambientWash} 0%, ${palette.ambient} 20%, rgba(255, 255, 255, 0) 60%)`,
          mixBlendMode: "screen",
          opacity: 0.44 * opacity,
        }}
      />
      <div
        style={{
          alignItems: "center",
          color: palette.main,
          display: "flex",
          flexDirection: "column",
          opacity,
          position: "relative",
          textAlign: "center",
          transform: `translate(${Math.round(driftX)}px, ${Math.round(-72 + driftY)}px) scale(${scale})`,
          width: cardWidth,
        }}
      >
        <div
          style={{
            background: `radial-gradient(circle at 50% 38%, ${palette.ambientWash} 0%, ${palette.ambient} 28%, rgba(255, 255, 255, 0) 74%)`,
            filter: "blur(24px)",
            height: Math.round(videoMetadata.height * 0.24),
            left: "50%",
            opacity: 0.42 * opacity,
            position: "absolute",
            top: Math.round(videoMetadata.height * 0.01),
            transform: "translate(-50%, 0)",
            width: Math.round(cardWidth * 0.76),
            zIndex: 0,
          }}
        />
        <div
          style={{
            background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${palette.edge} 18%, rgba(255,255,255,0.18) 56%, rgba(255,255,255,0) 100%)`,
            height: 1,
            left: "50%",
            opacity: 0.38 * opacity,
            position: "absolute",
            top: 0,
            transform: "translateX(-50%)",
            width: "48%",
            zIndex: 1,
          }}
        />
        <div
          style={{
            background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${palette.secondary} 52%, rgba(255,255,255,0) 100%)`,
            filter: "blur(9px)",
            height: 3,
            left: `${glowTravel}%`,
            opacity: 0.30 * opacity,
            position: "absolute",
            top: "32%",
            transform: "translateX(-50%) rotate(-6deg)",
            width: "46%",
            zIndex: 1,
          }}
        />
        <div
          style={{
            color: palette.main,
            fontFamily,
            fontSize: Math.round(videoMetadata.height * 0.132),
            fontStyle: "italic",
            fontWeight: 700,
            letterSpacing: "0.06em",
            lineHeight: 0.92,
            position: "relative",
            textShadow: `0 0 22px ${palette.accent}, 0 0 54px ${palette.ambient}`,
            WebkitTextStroke: `1px ${palette.edge}`,
            whiteSpace: "nowrap",
            zIndex: 2,
          }}
        >
          Midnight Memory
        </div>
        <div
          style={{
            color: palette.ghost,
            filter: "blur(14px)",
            fontFamily,
            fontSize: Math.round(videoMetadata.height * 0.132),
            fontStyle: "italic",
            fontWeight: 700,
            left: "50%",
            letterSpacing: "0.06em",
            lineHeight: 0.92,
            opacity: 0.26 * opacity,
            position: "absolute",
            top: 0,
            transform: "translate(-50%, 8px) scale(1.03)",
            whiteSpace: "nowrap",
            zIndex: 1,
          }}
        >
          Midnight Memory
        </div>
        <div
          style={{
            color: palette.secondary,
            fontFamily,
            fontSize: 46,
            fontWeight: 600,
            letterSpacing: "0.08em",
            lineHeight: 1.1,
            marginTop: 22,
            position: "relative",
            textShadow: `0 0 18px ${palette.ambient}`,
            whiteSpace: "nowrap",
            zIndex: 2,
          }}
        >
          夢のつづき / TopView Lyric Motion
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const MidnightMemoryTopView = ({captions, videoMetadata, videoSrc}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentTimeMs = (frame / fps) * 1000;
  const firstCueStartMs = captions[0]?.startMs ?? 0;
  const lastCueEndMs = captions[captions.length - 1]?.endMs ?? 0;
  const introEndMs = Math.max(5600, firstCueStartMs - 420);
  const creditStartMs = Math.min(
    Math.max(lastCueEndMs + 280, introEndMs + 3000),
    Math.max(videoMetadata.durationInSeconds * 1000 - 1800, lastCueEndMs + 280),
  );

  return (
    <AbsoluteFill style={{backgroundColor: "#04060a"}}>
      <Video
        src={staticFile(videoSrc)}
        style={{height: "100%", objectFit: "cover", width: "100%"}}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 72%, rgba(248, 170, 128, 0.18) 0%, rgba(248, 170, 128, 0.06) 22%, rgba(5, 7, 12, 0) 56%), linear-gradient(180deg, rgba(4, 6, 10, 0.24) 0%, rgba(4, 6, 10, 0.02) 30%, rgba(4, 6, 10, 0.10) 58%, rgba(4, 6, 10, 0.34) 100%)",
          mixBlendMode: "screen",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 24%, rgba(247, 241, 234, 0.06) 0%, rgba(247, 241, 234, 0) 34%), radial-gradient(circle at 50% 82%, rgba(247, 241, 234, 0.08) 0%, rgba(247, 241, 234, 0) 38%)",
        }}
      />
      <IntroTitleCard
        endMs={introEndMs}
        startMs={0}
        videoMetadata={videoMetadata}
      />
      <LyricOverlayMv captions={captions} videoMetadata={videoMetadata} />
      {currentTimeMs >= creditStartMs ? (
        <CreditOutro
          endMs={videoMetadata.durationInSeconds * 1000}
          pages={CREDIT_PAGES}
          startMs={creditStartMs}
          videoMetadata={videoMetadata}
        />
      ) : null}
    </AbsoluteFill>
  );
};
