import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';

// 번들 분석기 설정 (ANALYZE 환경변수가 true일 때만 활성화)
const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // 이미지 최적화 설정
  images: {
    // 외부 이미지 도메인 허용 (Notion 이미지 CDN)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.notion.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.notionusercontent.com',
        pathname: '/**',
      },
    ],
    // WebP 형식 지원
    formats: ['image/avif', 'image/webp'],
    // 캐시 설정 (60초마다 재검증)
    minimumCacheTTL: 60,
  },

  // 성능 최적화
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // 헤더 설정 (캐싱, 보안)
  async headers() {
    return [
      {
        source: '/public/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          // XSS 및 Clickjacking 방지
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },

          // HTTPS 강제 (HSTS)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },

          // 레퍼러 정책
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },

          // 기능 정책
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // ISR 설정 (Incremental Static Regeneration)
  // 정적 생성 후 지정된 시간마다 재검증
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-label'],
  },
};

export default withAnalyzer(nextConfig);
