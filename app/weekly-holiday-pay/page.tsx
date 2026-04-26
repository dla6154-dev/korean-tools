import type { Metadata } from "next";
import WeeklyHolidayPayClient from "./weekly-holiday-pay-client";

export const metadata: Metadata = {
  title: "주휴수당 계산기",
  description:
    "시급과 주 근무시간을 기준으로 주휴수당 지급 여부와 주·월 예상 금액을 계산합니다.",
  alternates: {
    canonical: "/weekly-holiday-pay",
  },
};

export default function WeeklyHolidayPayPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "주휴수당 계산기",
    "url": "https://rate-snap.com/weekly-holiday-pay",
    "description": "시급과 주 근무시간을 기준으로 주휴수당 지급 여부와 주·월 예상 금액을 계산합니다.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
    "inLanguage": "ko"
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <WeeklyHolidayPayClient />
    </>
  );
}
