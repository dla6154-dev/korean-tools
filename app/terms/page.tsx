import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관",
  description: "Korean Tools 이용 시 기본 약관을 안내합니다.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-950">이용약관</h1>
      <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
        <p>본 서비스는 누구나 무료로 사용할 수 있는 공개 도구 사이트입니다.</p>
        <p>
          서비스에서 제공하는 계산 결과와 정보는 참고용으로 활용해야 하며, 법률, 세무,
          금융, 의료 등 중요한 판단은 공식 자료와 함께 확인하는 것을 권장합니다.
        </p>
        <p>
          운영자는 서비스 품질 향상을 위해 기능, 구조, 제공 범위를 사전 고지 없이 조정할
          수 있습니다.
        </p>
      </div>
    </div>
  );
}
