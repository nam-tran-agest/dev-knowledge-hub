import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    '*': [
      'node_modules/next/dist/compiled/@vercel/og/**',
      'node_modules/sharp/**',
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
      'react-syntax-highlighter',
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
