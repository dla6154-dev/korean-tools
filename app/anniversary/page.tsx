import type { Metadata } from "next";
import AnniversaryClient from "./anniversary-client";

export const metadata: Metadata = {
  title: "기념일 계산기 - 100일, 1주년 자동 계산",
  description: "시작일을 입력하면 100일, 200일, 1주년 등 주요 기념일을 자동으로 계산합니다. 연인, 결혼, 입사일 등 모든 기념일에 활용하세요.",
  alternates: { canonical: "/anniversary" },
};

export default function AnniversaryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "기념일 계산기 - 100일, 1주년 자동 계산",
    "url": "https://rate-snap.com/anniversary",
    "description": "시작일을 입력하면 100일, 200일, 1주년 등 주요 기념일을 자동으로 계산합니다. 연인, 결혼, 입사일 등 모든 기념일에 활용하세요.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
    "inLanguage": "ko"
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AnniversaryClient />
    </>
  );
}
