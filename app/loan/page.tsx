import type { Metadata } from "next";
import LoanClient from "./loan-client";

export const metadata: Metadata = {
  title: "대출 계산기 — 원리금균등·원금균등·만기일시 월 상환액 비교",
  description: "대출 금액·금리·기간을 입력하면 3가지 상환 방식의 월 납부액과 총 이자를 즉시 비교합니다. 가장 유리한 상환 방법을 무료로 확인하세요.",
  alternates: { canonical: "/loan" },
};

export default function LoanPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "대출 계산기 — 원리금균등·원금균등·만기일시 월 상환액 비교",
    "url": "https://rate-snap.com/loan",
    "description": "대출 금액·금리·기간을 입력하면 3가지 상환 방식의 월 납부액과 총 이자를 즉시 비교합니다. 가장 유리한 상환 방법을 무료로 확인하세요.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
    "inLanguage": "ko"
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LoanClient />
    </>
  );
}
