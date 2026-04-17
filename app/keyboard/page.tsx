import type { Metadata } from "next";
import KeyboardClient from "./keyboard-client";

export const metadata: Metadata = {
  title: "키보드 오타 변환기 - 영어 한글 오타 자동 교정",
  description: "한/영 전환 없이 잘못 입력한 키보드 오타를 올바른 언어로 변환합니다. dkssudgktpdy를 안녕하세요로 즉시 변환해드립니다.",
  alternates: { canonical: "/keyboard" },
};

export default function KeyboardPage() {
  return <KeyboardClient />;
}
