import type { Metadata } from "next";
import ColorComplementClient from "./color-complement-client";

export const metadata: Metadata = {
  title: "보색 찾기",
  description:
    "화면 스포이드나 이미지 업로드로 색을 선택하고 보색, HEX, RGB 값을 바로 확인할 수 있습니다.",
};

export default function ComplementaryColorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "보색 찾기",
    "url": "https://rate-snap.com/complementary-color",
    "description": "화면 스포이드나 이미지 업로드로 색을 선택하고 보색, HEX, RGB 값을 바로 확인할 수 있습니다.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
    "inLanguage": "ko"
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ColorComplementClient />
    </>
  );
}
