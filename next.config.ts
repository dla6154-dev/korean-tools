import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 트레일링 슬래시 비활성화 — Search Console "리디렉션이 포함된 페이지" 오류 방지
  trailingSlash: false,
  // www → non-www 리디렉트를 Vercel에서 처리하므로 여기선 불필요
};

export default nextConfig;
