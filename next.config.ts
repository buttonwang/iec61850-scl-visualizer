import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // 优化生产构建
  productionBrowserSourceMaps: false,
  // 图片优化 - 使用新的remotePatterns格式
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'trae-api-sg.mchost.guru',
        pathname: '/**',
      },
    ],
  },
  // 实验性功能
  experimental: {
    // 优化CSS
    optimizeCss: true,
  },
};

export default nextConfig;
