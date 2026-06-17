import type { NextConfig } from 'next';

// On GitHub Pages project sites the app is served from /<repo>, so we build with
// NEXT_PUBLIC_BASE_PATH="/portfolio". Empty locally and on root deploys (Vercel).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const config: NextConfig = {
  output: 'export', // static HTML export -> /out
  trailingSlash: true, // emit /route/index.html so Pages serves clean URLs
  images: { unoptimized: true }, // no Image Optimization server on Pages
  pageExtensions: ['ts', 'tsx', 'mdx'],
  experimental: {
    mdxRs: true,
  },
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default config;
