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
  return <MarkdownToHtmlClient />;
}
