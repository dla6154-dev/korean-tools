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
            {children}
          </main>
          <footer className="bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-400">
            © {new Date().getFullYear()} Korean Tools. 생활에 유용한 도구 모음.
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
