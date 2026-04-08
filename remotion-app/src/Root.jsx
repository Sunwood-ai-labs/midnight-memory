import React from "react";
import {Composition} from "remotion";
import {MidnightMemoryTopView} from "./compositions/MidnightMemoryTopView";
import {captions} from "./generated/captions.jsx";
import {videoMetadata} from "./generated/video-metadata.jsx";

export const RemotionRoot = () => {
  return (
    <Composition
      id="MidnightMemoryTopView"
      component={MidnightMemoryTopView}
      durationInFrames={videoMetadata.durationInFrames}
      fps={videoMetadata.fps}
      width={videoMetadata.width}
      height={videoMetadata.height}
      defaultProps={{
        captions,
        videoMetadata,
        videoSrc: videoMetadata.videoSrc,
      }}
    />
  );
};
