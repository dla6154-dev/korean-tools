import type { Metadata } from "next";
import SeveranceClient from "./severance-client";

export const metadata: Metadata = {
  title: "퇴직금 계산기 - 근무 기간 평균 임금 기준 계산",
  description: "입사일, 퇴사일, 월 급여를 입력하면 퇴직금 예상액을 계산합니다. 근로기준법 기준 퇴직금 계산식을 적용하여 정확한 금액을 안내합니다.",
  alternates: { canonical: "/severance" },
};

export default function SeverancePage() {
  return <SeveranceClient />;
}
