import type { Metadata } from "next";
import DateCalcClient from "./date-calc-client";

export const metadata: Metadata = {
  title: "날짜 계산기 — 며칠 후·전 날짜, 100일 기념일 계산",
  description:
    "기준 날짜에서 며칠 후·전 날짜를 바로 계산합니다. 100일 기념일, 계약 만기일, 납기일 등 중요한 날짜를 즉시 확인하세요. 무료, 설치 없음.",
  keywords: [
    "날짜 더하기",
    "날짜 빼기",
    "날짜 계산기",
    "100일 계산",
    "며칠 후 날짜",
    "며칠 전 날짜",
  ],
  alternates: {
    canonical: "/date-calc",
  },
};

export default function DateCalcPage() {
  return <DateCalcClient />;
}
