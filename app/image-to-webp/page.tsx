import type { Metadata } from "next";
import ImageToWebpClient from "./image-to-webp-client";

export const metadata: Metadata = {
  title: "이미지 → WebP 변환",
  description: "JPG와 PNG 이미지를 브라우저에서 바로 WebP로 변환하고 다운로드합니다.",
  alternates: {
    canonical: "/image-to-webp",
  },
};

export default function ImageToWebpPage() {
  return <ImageToWebpClient />;
}
