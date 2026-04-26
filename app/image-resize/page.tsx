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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "이미지 리사이즈",
    "url": "https://rate-snap.com/image-resize",
    "description": "이미지 크기를 픽셀 또는 비율 기준으로 조절합니다.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
    "inLanguage": "ko"
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ImageResizeClient />
    </>
  );
}
