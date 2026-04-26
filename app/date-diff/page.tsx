import type { Metadata } from "next";
import DateDiffClient from "./date-diff-client";

export const metadata: Metadata = {
  title: "날짜 차이 계산기 — 두 날짜 사이 며칠인지 바로 확인",
  description:
    "시작일과 종료일을 입력하면 총 일수·주수·개월수를 한번에 계산합니다. 근무 기간, 계약 기간, 연애 기간 계산에 바로 사용하세요. 무료.",
  keywords: [
    "날짜 차이 계산기 — 두 날짜 사이 며칠인지 바로 확인",
    "두 날짜 차이",
    "기간 계산",
    "며칠 차이",
    "days between dates",
  ],
  alternates: {
    canonical: "/date-diff",
  },
};

export default function DateDiffPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "날짜 차이 계산기 — 두 날짜 사이 며칠인지 바로 확인",
    "url": "https://rate-snap.com/date-diff",
    "description": "시작일과 종료일을 입력하면 총 일수·주수·개월수를 한번에 계산합니다. 근무 기간, 계약 기간, 연애 기간 계산에 바로 사용하세요. 무료.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
    "inLanguage": "ko"
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DateDiffClient />
    </>
  );
}
