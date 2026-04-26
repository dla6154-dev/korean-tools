import type { Metadata } from "next";
import ImageToPdfClient from "./image-to-pdf-client";

export const metadata: Metadata = {
  title: "이미지 → PDF",
  description: "여러 이미지를 한 개의 PDF 문서로 묶어서 다운로드합니다.",
  alternates: {
    canonical: "/image-to-pdf",
  },
};

export default function ImageToPdfPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "이미지 → PDF",
    "url": "https://rate-snap.com/image-to-pdf",
    "description": "여러 이미지를 한 개의 PDF 문서로 묶어서 다운로드합니다.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
    "inLanguage": "ko"
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ImageToPdfClient />
    </>
  );
}
