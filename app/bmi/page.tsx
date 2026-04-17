import type { Metadata } from "next";
import BmiClient from "./bmi-client";

export const metadata: Metadata = {
  title: "BMI 계산기 - 체질량지수 및 일일 칼로리 계산",
  description: "키, 몸무게, 나이를 입력하면 BMI(체질량지수)와 하루 권장 칼로리를 계산합니다. 비만도 기준과 활동량별 칼로리 섭취량을 확인하세요.",
  alternates: { canonical: "/bmi" },
};

export default function BmiPage() {
  return <BmiClient />;
}
