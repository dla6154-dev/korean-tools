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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "HEX ↔ RGB 변환기",
    "url": "https://rate-snap.com/hex-rgb",
    "description": "HEX 색상 코드와 RGB 값을 양방향으로 변환합니다.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
    "inLanguage": "ko"
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HexRgbClient />
    </>
  );
}
