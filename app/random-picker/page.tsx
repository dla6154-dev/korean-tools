import type { Metadata } from "next";
import RandomPickerClient from "./random-picker-client";

export const metadata: Metadata = {
  title: "랜덤 뽑기 / 복불복",
  description: "이름, 번호, 팀을 랜덤으로 뽑아드립니다. 당번 정하기, 팀 나누기, 복불복 게임에 바로 활용하세요.",
  alternates: { canonical: "/random-picker" },
};

export default function RandomPickerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "랜덤 뽑기 / 복불복",
    "url": "https://rate-snap.com/random-picker",
    "description": "이름, 번호, 팀을 랜덤으로 뽑아드립니다. 당번 정하기, 팀 나누기, 복불복 게임에 바로 활용하세요.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
    "inLanguage": "ko"
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RandomPickerClient />
    </>
  );
}
