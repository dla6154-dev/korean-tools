import type { Metadata } from "next";
import DateDiffClient from "./date-diff-client";

export const metadata: Metadata = {
  title: "날짜 차이 계산기",
  description:
    "두 날짜 사이가 며칠인지, 몇 주인지, 몇 개월인지 계산합니다. 기간 계산, 날짜 차이 확인, 디데이 준비에 바로 사용할 수 있습니다.",
  keywords: [
    "날짜 차이 계산기",
    "두 날짜 차이",
    "기간 계산",
    "며칠 차이",
    "days between dates",
  ],
  alternates: {
    canonical: "/date-diff",
  },
};

export default function DateDiffPage() {
  return <DateDiffClient />;
}
