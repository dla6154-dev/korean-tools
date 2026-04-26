import type { Metadata } from "next";
import AnnualLeaveClient from "./annual-leave-client";

export const metadata: Metadata = {
  title: "연차 계산기",
  description:
    "입사일과 기준일을 바탕으로 근속연수, 부여 연차, 잔여 연차, 다음 연차 부여일을 계산합니다.",
  alternates: {
    canonical: "/annual-leave",
  },
};

export default function AnnualLeavePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "연차 계산기",
    "url": "https://rate-snap.com/annual-leave",
    "description": "입사일과 기준일을 바탕으로 근속연수, 부여 연차, 잔여 연차, 다음 연차 부여일을 계산합니다.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
    "inLanguage": "ko"
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AnnualLeaveClient />
    </>
  );
}
