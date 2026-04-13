import type { Metadata } from "next";
import WeekdayClient from "./weekday-client";

export const metadata: Metadata = {
  title: "요일 계산기",
  description:
    "특정 날짜가 무슨 요일인지 계산하고 주차와 연중 일수까지 함께 확인합니다. 생일, 기념일, 일정 날짜의 요일 확인에 바로 사용할 수 있습니다.",
  keywords: [
    "요일 계산기",
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
