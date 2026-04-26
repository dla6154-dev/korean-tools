import type { Metadata } from "next";
import MarkdownToHtmlClient from "./markdown-to-html-client";

export const metadata: Metadata = {
  title: "마크다운 → HTML",
  description:
    "마크다운 텍스트를 HTML로 변환하고 실시간 미리보기로 결과를 확인할 수 있습니다.",
  alternates: {
    canonical: "/markdown-to-html",
  },
};

export default function MarkdownToHtmlPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "마크다운 → HTML",
    "url": "https://rate-snap.com/markdown-to-html",
    "description": "마크다운 텍스트를 HTML로 변환하고 실시간 미리보기로 결과를 확인할 수 있습니다.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
    "inLanguage": "ko"
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MarkdownToHtmlClient />
    </>
  );
}
