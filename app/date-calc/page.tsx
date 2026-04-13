import type { Metadata } from "next";
import DateCalcClient from "./date-calc-client";

export const metadata: Metadata = {
  title: "날짜 더하기 / 빼기 계산기",
  description:
    "기준 날짜에 일수를 더하거나 빼서 결과 날짜를 계산합니다. 100일 후, 200일 전, 특정 날짜 전후 계산에 바로 사용할 수 있습니다.",
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
