import type { Metadata } from "next";
import Script from "next/script";
import Footer from "./footer";
import { LanguageProvider } from "./language-context";
import Nav from "./nav";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_METADATA_BASE,
  SITE_NAME,
  SITE_URL,
} from "./seo";
import { ThemeProvider } from "./theme-context";
import "./globals.css";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: "ko-KR",
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
};

export const metadata: Metadata = {
  metadataBase: SITE_METADATA_BASE,
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  verification: {
    google: "MonEK12xkfiRwDS7Uxw6iCZaroYf1GHztTivnR7fDwQ",
    other: {
      "naver-site-verification": "6acaa4c58d86b46780c844140e5242e6026c4f1b",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full" suppressHydrationWarning>
      <head>
        {/* 다크모드 flash 방지 */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(t==null&&d)){document.documentElement.classList.add('dark');}})();",
          }}
        />
        {/* WebSite 구조화 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-VX6R9QFSQ5"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          var debugSearch = new URLSearchParams(window.location.search);
          var hasDebugSignal = debugSearch.has('gtm_debug') || debugSearch.has('_dbg');
          gtag('js', new Date());
          gtag('config', 'G-VX6R9QFSQ5', hasDebugSignal ? { debug_mode: true } : {});
        `}</Script>
      </head>
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        <ThemeProvider>
          <LanguageProvider>
            <div className="flex min-h-full flex-col">
              <Nav />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
