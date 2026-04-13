import type { Metadata } from "next";
import ImageToBase64Client from "./image-to-base64-client";

export const metadata: Metadata = {
  title: "이미지 → Base64",
  description: "이미지 파일을 Data URL 또는 순수 Base64 문자열로 변환합니다.",
  alternates: {
    canonical: "/image-to-base64",
  },
};

export default function ImageToBase64Page() {
  return <ImageToBase64Client />;
}
