import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  outputFileTracingExcludes: {
    '*': [
      'node_modules/next/dist/compiled/@vercel/og/**',
      'node_modules/sharp/**',
      'public/data/mhwilds/**',
      'public/img/**',
      'public/**/*.webm',
      'public/**/*.mp4',
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      '@radix-ui/react-icons',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-popover',
      '@radix-ui/react-tabs',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-separator',
      '@hello-pangea/dnd',
      'motion',
      'zustand',
      'fast-xml-parser',
      'swiper',
    ],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "static.thanhnien.com.vn" },
      { protocol: "https", hostname: "*.vnecdn.net" },
      { protocol: "https", hostname: "dantri.com.vn" },
      { protocol: "https", hostname: "*.dantri.com.vn" },
      { protocol: "https", hostname: "icdn.dantri.com.vn" },
      { protocol: "https", hostname: "thanhnien.vn" },
      { protocol: "https", hostname: "*.thanhnien.com.vn" },
      { protocol: "https", hostname: "tuoitre.vn" },
      { protocol: "https", hostname: "*.tuoitre.vn" },
      { protocol: "https", hostname: "vnexpress.net" },
      { protocol: "https", hostname: "*.vnexpress.net" },
      { protocol: "https", hostname: "*.plo.vn" },
      { protocol: "https", hostname: "image.plo.vn" },
      { protocol: "https", hostname: "cdn.mos.cms.futurecdn.net" },
      { protocol: "https", hostname: "w.soundcloud.com" },
      { protocol: "https", hostname: "wolfsgamingblog.com" },
      { protocol: "https", hostname: "*.wolfsgamingblog.com" },
      { protocol: "https", hostname: "*.wp.com" },
      { protocol: "https", hostname: "*.wordpress.com" },
      { protocol: "https", hostname: "*.pcgamer.com" },
      { protocol: "https", hostname: "*.playstation.com" },
      { protocol: "https", hostname: "*.gamespot.com" },
      { protocol: "https", hostname: "*.vg247.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
