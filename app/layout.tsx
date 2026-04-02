import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Korean Tools - 만 나이 계산기, 기념일 계산기",
    template: "%s | Korean Tools",
  },
  description: "만 나이 계산기, 기념일 계산기 등 생활에 유용한 도구 모음",
  keywords: ["만 나이 계산기", "기념일 계산기", "나이 계산", "디데이 계산"],
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
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
              Korean Tools
            </Link>
            <nav className="flex gap-4 text-sm font-medium text-slate-600">
              <Link href="/age" className="hover:text-blue-600 transition-colors">만 나이</Link>
              <Link href="/anniversary" className="hover:text-blue-600 transition-colors">기념일</Link>
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
