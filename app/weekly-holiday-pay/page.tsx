import type { Metadata } from "next";
import WeeklyHolidayPayClient from "./weekly-holiday-pay-client";

export const metadata: Metadata = {
  title: "주휴수당 계산기",
  description:
    "시급과 주 근무시간을 기준으로 주휴수당 지급 여부와 주·월 예상 금액을 계산합니다.",
  alternates: {
    canonical: "/weekly-holiday-pay",
  },
};

export default function WeeklyHolidayPayPage() {
  return <WeeklyHolidayPayClient />;
}
