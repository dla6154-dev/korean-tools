import type { Metadata } from "next";
import LoanClient from "./loan-client";

export const metadata: Metadata = {
  title: "대출 이자 계산기 - 원리금균등 원금균등 만기일시 상환",
  description: "대출 금액, 금리, 기간을 입력하면 상환 방식별 월 납부액과 총 이자를 계산합니다. 원리금균등, 원금균등, 만기일시 상환을 한눈에 비교하세요.",
  alternates: { canonical: "/loan" },
};

export default function LoanPage() {
  return <LoanClient />;
}
