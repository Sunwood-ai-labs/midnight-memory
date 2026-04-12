import { defineConfig } from 'vitepress';

const nav = [
  { text: 'Home', link: '/' },
  { text: 'Intro / Outro', link: '/intro-outro-subtitle-workflow' },
  { text: 'LTX Segments', link: '/ltx-segment-workflow' },
  { text: 'Remotion Lyric Motion', link: '/remotion-lyric-motion-workflow' },
  { text: 'GitHub', link: 'https://github.com/Sunwood-ai-labs/midnight-memory' },
];

const navJa = [
  { text: 'ホーム', link: '/ja/' },
  { text: '前奏 / 後奏', link: '/ja/intro-outro-subtitle-workflow' },
  { text: 'LTX セグメント', link: '/ja/ltx-segment-workflow' },
  { text: 'Remotion 動画', link: '/ja/remotion-lyric-motion-workflow' },
  { text: 'GitHub', link: 'https://github.com/Sunwood-ai-labs/midnight-memory' },
];

export default defineConfig({
  title: 'midnight-memory',
  description: 'Lyric-aligned SRT generation, split subtitles, LTX segments, Remotion lyric motion, and viewer docs.',
  base: '/midnight-memory/',
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', href: '/midnight-memory/favicon.svg' }],
  ],
  themeConfig: {
    logo: '/favicon.svg',
    siteTitle: 'midnight-memory',
    nav,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Sunwood-ai-labs/midnight-memory' },
    ],
    sidebar: {
      '/': [
        {
          text: 'Guides',
          items: [
            { text: 'Docs Home', link: '/' },
            { text: 'Intro / Outro Subtitle Workflow', link: '/intro-outro-subtitle-workflow' },
            { text: 'LTX Segment Workflow', link: '/ltx-segment-workflow' },
            { text: 'Remotion Lyric Motion Workflow', link: '/remotion-lyric-motion-workflow' },
          ],
        },
      ],
      '/ja/': [
        {
          text: 'ガイド',
          items: [
            { text: 'ドキュメントハブ', link: '/ja/' },
            { text: '前奏 / 後奏 split subtitle フロー', link: '/ja/intro-outro-subtitle-workflow' },
            { text: 'LTX セグメント運用', link: '/ja/ltx-segment-workflow' },
            { text: 'Remotion lyric motion フロー', link: '/ja/remotion-lyric-motion-workflow' },
          ],
        },
      ],
    },
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav,
      },
    },
    ja: {
      label: '日本語',
      lang: 'ja',
      themeConfig: {
        nav: navJa,
      },
    },
  },
});
