import type { Metadata } from "next";
import HexRgbClient from "./hex-rgb-client";

export const metadata: Metadata = {
  title: "HEX ↔ RGB 변환기",
  description: "HEX 색상 코드와 RGB 값을 양방향으로 변환합니다.",
  alternates: {
    canonical: "/hex-rgb",
  },
};

export default function HexRgbPage() {
  return <HexRgbClient />;
}
