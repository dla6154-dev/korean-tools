import type { Metadata } from "next";
import ChosungClient from "./chosung-client";

export const metadata: Metadata = {
  title: "초성 추출기 - 한글 초성만 뽑기",
  description: "한글 텍스트에서 초성만 추출합니다. 초성 퀴즈, 이니셜 변환, 초성 분포 통계까지 한 번에 확인할 수 있습니다.",
  alternates: { canonical: "/chosung" },
};

export default function ChosungPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "초성 추출기 - 한글 초성만 뽑기",
    "url": "https://rate-snap.com/chosung",
    "description": "한글 텍스트에서 초성만 추출합니다. 초성 퀴즈, 이니셜 변환, 초성 분포 통계까지 한 번에 확인할 수 있습니다.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
    "inLanguage": "ko"
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ChosungClient />
    </>
  );
}
