# Remotion Lyric Motion Workflow

Use this workflow when you need a rendered lyric motion video from the TopView source clip and the synchronized subtitle parts in this repository.

## What The Remotion Project Does

`remotion-app/` packages the lyric motion pipeline for the TopView cut.

It currently:

- syncs `assets/Midnight Memory_TopV.mp4` into the Remotion `public/` workspace
- reads `assets/Midnight Memory 夢のつづき  Intro - Chorus 1.intro.srt`
- reads `assets/Midnight Memory 夢のつづき  Intro - Chorus 1.main.srt`
- combines those cues into generated caption metadata
- renders a lyric motion composition with an intro title card and credit outro
- includes the source credits `midnight-memory` and `TopView / SeeDance 2.0` in the outro

## Commands

Install the local Remotion dependencies first:

```powershell
cd D:\midnight-memory\remotion-app
npm install
```

Open the composition in Remotion Studio:

```powershell
npm run preview
```

Render the current output:

```powershell
npm run render
```

## Generated Output

The current render target is:

- `remotion-app/out/midnight-memory-topview-lyric-motion.mp4`

Asset preparation also writes generated metadata under:

- `remotion-app/src/generated/captions.jsx`
- `remotion-app/src/generated/video-metadata.jsx`

## Asset Assumptions

- the source video stays in `assets/Midnight Memory_TopV.mp4`
- the lyric timing source stays in the `Intro - Chorus 1` split subtitle files
- output video files under `remotion-app/out/` are generated artifacts and should stay out of git unless explicitly requested

## Validation

```powershell
cd D:\midnight-memory\remotion-app
npm run prepare:assets
npm run render
```
