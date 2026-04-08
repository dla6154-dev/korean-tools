import type { Metadata } from "next";
import ColorComplementClient from "./color-complement-client";

export const metadata: Metadata = {
  title: "보색 찾기",
  description:
    "화면 스포이드나 이미지 업로드로 색을 선택하고 보색, HEX, RGB 값을 바로 확인할 수 있습니다.",
};

export default function ComplementaryColorPage() {
  return <ColorComplementClient />;
}
