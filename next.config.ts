import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "static.thanhnien.com.vn" },
      { protocol: "https", hostname: "s1.vnecdn.net" },
      { protocol: "https", hostname: "vcdn1-ictnews.vnecdn.net" },
      { protocol: "https", hostname: "vcdn1-phim.vnecdn.net" },
      { protocol: "https", hostname: "vcdn1-kinhdoanh.vnecdn.net" },
      { protocol: "https", hostname: "vcdn1-giadinh.vnecdn.net" },
      { protocol: "https", hostname: "vcdn1-dulich.vnecdn.net" },
      { protocol: "https", hostname: "vcdn1-suckhoe.vnecdn.net" },
      { protocol: "https", hostname: "vcdn1-thethao.vnecdn.net" },
      { protocol: "https", hostname: "vcdn1-giaitri.vnecdn.net" },
      { protocol: "https", hostname: "vcdn1-phongsu.vnecdn.net" },
      { protocol: "https", hostname: "vcdn-giaitri.vnecdn.net" },
      { protocol: "https", hostname: "vcdn-kinhdoanh.vnecdn.net" },
      { protocol: "https", hostname: "vcdn-thethao.vnecdn.net" },
      { protocol: "https", hostname: "vcdn-suckhoe.vnecdn.net" },
      { protocol: "https", hostname: "vcdn-giadinh.vnecdn.net" },
      { protocol: "https", hostname: "vcdn-dulich.vnecdn.net" },
      { protocol: "https", hostname: "dantri.com.vn" },
      { protocol: "http", hostname: "dantri.com.vn" },
      { protocol: "https", hostname: "*.dantri.com.vn" },
      { protocol: "http", hostname: "*.dantri.com.vn" },
      { protocol: "https", hostname: "icdn.dantri.com.vn" },
      { protocol: "http", hostname: "icdn.dantri.com.vn" },
      { protocol: "https", hostname: "thanhnien.vn" },
      { protocol: "https", hostname: "*.thanhnien.vn" },
      { protocol: "https", hostname: "*.thanhnien.com.vn" },
      { protocol: "https", hostname: "tuoitre.vn" },
      { protocol: "https", hostname: "*.tuoitre.vn" },
      { protocol: "https", hostname: "vnexpress.net" },
      { protocol: "https", hostname: "*.vnexpress.net" },
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
