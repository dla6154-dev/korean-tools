import type { Metadata } from "next";
import CharactersClient from "./characters-client";

export const metadata: Metadata = {
  title: "글자수 세기 - 공백 포함/제외, 단어수, 바이트 계산",
  description: "자기소개서, 이력서, SNS 게시글의 글자 수를 즉시 확인합니다. 공백 포함/제외, 단어수, 바이트, 문장수, 트위터 인스타그램 글자 제한 비교 기능 제공.",
  alternates: { canonical: "/characters" },
};

export default function CharactersPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "글자수 세기 - 공백 포함/제외, 단어수, 바이트 계산",
    "url": "https://rate-snap.com/characters",
    "description": "자기소개서, 이력서, SNS 게시글의 글자 수를 즉시 확인합니다. 공백 포함/제외, 단어수, 바이트, 문장수, 트위터 인스타그램 글자 제한 비교 기능 제공.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
    "inLanguage": "ko"
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CharactersClient />
    </>
  );
}
