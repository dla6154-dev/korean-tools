import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "서비스 소개",
  description: "Korean Tools의 목적과 운영 방향을 소개합니다.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-950">서비스 소개</h1>
      <p className="mt-5 text-base leading-8 text-slate-600">
        Korean Tools는 한국 사용자가 자주 찾는 계산기, 변환기, 경량 유틸리티를 한곳에서
        빠르게 사용할 수 있도록 정리한 도구 사이트입니다.
      </p>
      <p className="mt-5 text-base leading-8 text-slate-600">
        날짜 계산, 텍스트 처리, 이미지 최적화, 생활 계산을 중심으로 필요한 기능을 계속
        확장해 나가고 있습니다. 복잡한 회원가입이나 불필요한 단계 없이 바로 사용하는
        경험을 우선합니다.
      </p>
    </div>
  );
}
