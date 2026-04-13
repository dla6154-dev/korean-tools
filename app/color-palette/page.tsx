import type { Metadata } from "next";
import ColorPaletteClient from "./color-palette-client";

export const metadata: Metadata = {
  title: "색상 팔레트 추출",
  description: "이미지에서 주요 색상을 추출하고 HEX, RGB 값을 확인합니다.",
  alternates: {
    canonical: "/color-palette",
  },
};

export default function ColorPalettePage() {
  return <ColorPaletteClient />;
}
