import type { Metadata } from "next";
import DdayClient from "./dday-client";

export const metadata: Metadata = {
  title: "디데이 계산기 - 중요한 날까지 D-day 계산",
  description: "수능, 시험, 여행, 생일 등 중요한 날까지 며칠 남았는지 계산합니다. 여러 디데이를 동시에 등록해 한눈에 관리하세요.",
  alternates: { canonical: "/dday" },
};

export default function DdayPage() {
  return <DdayClient />;
}
