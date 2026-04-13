import type { Metadata } from "next";
import ImageResizeClient from "./image-resize-client";

export const metadata: Metadata = {
  title: "이미지 리사이즈",
  description: "이미지 크기를 픽셀 또는 비율 기준으로 조절합니다.",
  alternates: {
    canonical: "/image-resize",
  },
};

export default function ImageResizePage() {
  return <ImageResizeClient />;
}
