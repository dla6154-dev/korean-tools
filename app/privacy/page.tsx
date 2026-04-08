import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "Korean Tools의 개인정보 처리 원칙을 안내합니다.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-950">개인정보처리방침</h1>
      <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
        <p>
          Korean Tools는 가능한 한 입력 데이터를 브라우저 안에서 처리하는 방향을
          우선합니다.
        </p>
        <p>
          일부 기능은 외부 요청이나 로그 수집이 필요할 수 있으며, 해당 경우에는 기능
          화면 또는 관련 안내 문구에서 별도로 고지하는 것을 원칙으로 합니다.
        </p>
        <p>
          이 페이지는 기본 정책 안내용이며, 실제 서비스 운영 범위에 따라 추후 더 구체적인
          항목으로 보강될 수 있습니다.
        </p>
      </div>
    </div>
  );
}
