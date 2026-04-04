import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Korean Tools - 생활 계산기 모음",
    template: "%s | Korean Tools",
  },
  description: "만 나이, BMI, 대출 이자, 퇴직금, 음주측정, 디데이, 글자수, 이미지 압축 등 생활에 유용한 도구 모음",
  keywords: ["만 나이 계산기", "기념일 계산기", "BMI 계산기", "대출 이자 계산기", "퇴직금 계산기", "음주측정 계산기", "디데이", "글자수 세기", "이미지 압축"],
  verification: {
    google: "MonEK12xkfiRwDS7Uxw6iCZaroYf1GHztTivnR7fDwQ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-YX6R9QFS05" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-YX6R9QFS05');
        `}</Script>
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
              Korean Tools
            </Link>
            <nav className="flex gap-4 text-sm font-medium text-slate-600 items-center">
              <Link href="/age" className="hover:text-blue-600 transition-colors">만 나이</Link>
              <Link href="/anniversary" className="hover:text-blue-600 transition-colors">기념일</Link>
              <Link href="/dday" className="hover:text-blue-600 transition-colors">디데이</Link>
              <Link href="/characters" className="hover:text-blue-600 transition-colors">글자수</Link>
              <Link href="/bmi" className="hover:text-blue-600 transition-colors">BMI</Link>
              <Link href="/loan" className="hover:text-blue-600 transition-colors">대출</Link>
              <Link href="/alcohol" className="hover:text-blue-600 transition-colors">음주</Link>
              <Link href="/severance" className="hover:text-blue-600 transition-colors">퇴직금</Link>
              <Link href="/chosung" className="hover:text-blue-600 transition-colors">초성</Link>
              <Link href="/image-compress" className="hover:text-blue-600 transition-colors">이미지</Link>
              <Link href="/en" className="text-xs bg-slate-100 hover:bg-blue-100 hover:text-blue-600 px-2 py-1 rounded-full transition-colors">EN</Link>
              <Link href="/" className="text-xs bg-slate-100 hover:bg-blue-100 hover:text-blue-600 px-2 py-1 rounded-full transition-colors">KO</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} Korean Tools. 생활에 유용한 도구 모음.
        </footer>
      </body>
    </html>
  );
}
