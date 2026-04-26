import type { Metadata } from "next";
import CaseConverterClient from "./case-converter-client";

export const metadata: Metadata = {
  title: "대소문자 변환기",
  description:
    "영문 텍스트를 upper, lower, Title Case, Sentence case로 한 번에 변환합니다.",
  alternates: {
    canonical: "/case-converter",
  },
};

export default function CaseConverterPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "대소문자 변환기",
    "url": "https://rate-snap.com/case-converter",
    "description": "영문 텍스트를 upper, lower, Title Case, Sentence case로 한 번에 변환합니다.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
    "inLanguage": "ko"
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CaseConverterClient />
    </>
  );
}
