import type { Metadata } from "next";
import ImageCompressClient from "./image-compress-client";

export const metadata: Metadata = {
  title: "이미지 압축기",
  description:
    "JPG, PNG, WebP 이미지를 브라우저에서 바로 압축합니다. 서버 업로드 없이 용량을 줄이고 PNG를 JPG로 변환합니다.",
  alternates: { canonical: "/image-compress" },
};

export default function ImageCompressPage() {
  return <ImageCompressClient />;
}
