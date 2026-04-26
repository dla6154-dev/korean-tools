import type { Metadata } from "next";
import SeveranceClient from "./severance-client";

export const metadata: Metadata = {
  title: "퇴직금 계산기 — 입사일·퇴사일 입력하면 예상 퇴직금 즉시 계산",
  description: "입사일, 퇴사일, 월급여만 입력하면 근로기준법 기준 예상 퇴직금과 산정 근거를 30초 안에 확인할 수 있습니다. 상여금·연차수당 반영 가능.",
  alternates: { canonical: "/severance" },
};

export default function SeverancePage() {
  return <SeveranceClient />;
}
