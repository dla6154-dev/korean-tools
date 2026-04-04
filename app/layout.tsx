import type { Metadata } from "next";
import Script from "next/script";
import { LanguageProvider } from "./language-context";
import Nav from "./nav";
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
        <LanguageProvider>
          <Nav />
          <main className="flex-1">
            <div className="flex">
              {/* 왼쪽 광고 영역 */}
              <aside className="hidden xl:flex flex-col items-center pt-10 w-40 flex-shrink-0 sticky top-16 self-start h-[calc(100vh-4rem)]">
                <div className="w-36 h-[600px] bg-slate-100 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 text-xs text-center leading-relaxed">
                  광고<br/>160×600
                </div>
              </aside>

              {/* 페이지 콘텐츠 */}
              <div className="flex-1 min-w-0">
                {children}
              </div>

              {/* 오른쪽 광고 영역 */}
              <aside className="hidden xl:flex flex-col items-center pt-10 w-40 flex-shrink-0 sticky top-16 self-start h-[calc(100vh-4rem)]">
                <div className="w-36 h-[600px] bg-slate-100 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 text-xs text-center leading-relaxed">
                  광고<br/>160×600
                </div>
              </aside>
            </div>
          </main>
          <footer className="bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-400">
            © {new Date().getFullYear()} Korean Tools. 생활에 유용한 도구 모음.
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
