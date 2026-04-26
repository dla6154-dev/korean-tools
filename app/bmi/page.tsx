import type { Metadata } from "next";
import BmiClient from "./bmi-client";

export const metadata: Metadata = {
  title: "BMI 계산기 — 체질량지수 + 하루 필요 칼로리 무료 계산",
  description: "키와 몸무게만 입력하면 BMI와 하루 권장 칼로리를 동시에 계산합니다. 저체중·정상·과체중·비만 기준과 활동량별 칼로리 섭취량을 무료로 확인하세요.",
  alternates: { canonical: "/bmi" },
};

export default function BmiPage() {
  return <BmiClient />;
}
