import type { Metadata } from "next";
import Base64Client from "./base64-client";

export const metadata: Metadata = {
  title: "Base64 인코더/디코더",
  description:
    "텍스트를 Base64로 인코딩하거나 Base64 문자열을 다시 평문으로 디코딩합니다.",
  alternates: {
    canonical: "/base64",
  },
};

export default function Base64Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Base64 인코더/디코더",
    "url": "https://rate-snap.com/base64",
    "description": "텍스트를 Base64로 인코딩하거나 Base64 문자열을 다시 평문으로 디코딩합니다.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
    "inLanguage": "ko"
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Base64Client />
    </>
  );
}
