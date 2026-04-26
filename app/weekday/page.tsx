import type { Metadata } from "next";
import WeekdayClient from "./weekday-client";

export const metadata: Metadata = {
  title: "요일 계산기 — 날짜 입력하면 요일 즉시 확인",
  description:
    "생년월일·기념일·약속 날짜의 요일을 바로 확인합니다. 몇 번째 주인지, 연중 몇 번째 날인지도 함께 계산해드립니다. 설치 없이 무료.",
  keywords: [
    "요일 계산기 — 날짜 입력하면 요일 즉시 확인",
    "무슨 요일",
    "특정 날짜 요일",
    "요일 확인",
    "day of week calculator",
  ],
  alternates: {
    canonical: "/weekday",
  },
};

export default function WeekdayPage() {
  return <WeekdayClient />;
}
