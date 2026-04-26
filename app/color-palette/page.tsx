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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "색상 팔레트 추출",
    "url": "https://rate-snap.com/color-palette",
    "description": "이미지에서 주요 색상을 추출하고 HEX, RGB 값을 확인합니다.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
    "inLanguage": "ko"
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ColorPaletteClient />
    </>
  );
}
