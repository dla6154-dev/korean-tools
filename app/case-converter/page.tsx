import type { Metadata } from "next";
import CaseConverterClient from "./case-converter-client";

export const metadata: Metadata = {
  title: "대소문자 변환기",
  description:
    "영문 텍스트를 upper, lower, Title Case, Sentence case로 한 번에 변환합니다.",
  alternates: {
    canonical: "/case-converter",
  },
};

export default function CaseConverterPage() {
  return <CaseConverterClient />;
}
