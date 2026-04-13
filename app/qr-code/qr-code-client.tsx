"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import {
  EmptyToolState,
  RelatedToolsSection,
  ToolPageShell,
  ToolPanel,
} from "../components/tool-page-shell";
import { useLanguage } from "../language-context";
import { buildRelatedToolItems } from "../text-tool-utils";

const SIZES = [128, 256, 512] as const;
type Size = (typeof SIZES)[number];

const ERROR_LEVELS = [
  { value: "L", label: "L — 낮음 (7%)", labelEn: "L — Low (7%)" },
  { value: "M", label: "M — 보통 (15%)", labelEn: "M — Medium (15%)" },
  { value: "Q", label: "Q — 높음 (25%)", labelEn: "Q — High (25%)" },
  { value: "H", label: "H — 최고 (30%)", labelEn: "H — Highest (30%)" },
] as const;

const T = {
  ko: {
    breadcrumbs: ["전체 도구", "텍스트", "QR코드 생성기"],
    title: "QR코드 생성기",
    description: "URL, 텍스트, 전화번호 등을 QR코드로 변환합니다. 크기·색상·오류 복구 수준을 직접 설정할 수 있습니다.",
    badges: [
      { label: "텍스트", tone: "green" as const },
      { label: "QR코드", tone: "blue" as const },
      { label: "무료", tone: "amber" as const },
    ],
    inputTitle: "QR코드 설정",
    inputDescription: "변환할 내용과 옵션을 설정하세요.",
    outputTitle: "QR코드 미리보기",
    outputDescription: "입력값에 따라 QR코드가 실시간 생성됩니다.",
    urlLabel: "URL 또는 텍스트",
    urlPlaceholder: "https://example.com",
    sizeLabel: "크기",
    errorLabel: "오류 복구 수준",
    fgLabel: "QR 색상",
    bgLabel: "배경색",
    download: "⬇ 다운로드",
    copy: "📋 복사",
    emptyTitle: "텍스트를 입력하세요",
    emptyDescription: "URL이나 텍스트를 입력하면 QR코드가 바로 생성됩니다.",
    errorMsg: "QR코드를 생성할 수 없습니다. 입력값을 확인하세요.",
    infoItems: [
      "모든 처리는 브라우저에서 이루어지며 서버로 데이터가 전송되지 않습니다.",
      "오류 복구 수준이 높을수록 QR코드가 일부 손상되어도 인식이 가능합니다.",
      "로고나 이미지를 QR코드 위에 올릴 경우 H 수준을 권장합니다.",
    ],
    relatedTitle: "같이 쓰면 좋은 텍스트 도구",
    relatedDescription: "URL 인코딩이나 Base64 변환이 필요하면 이어서 사용할 수 있습니다.",
    relatedAction: "도구 열기",
  },
  en: {
    breadcrumbs: ["All tools", "Text", "QR Code Generator"],
    title: "QR Code Generator",
    description: "Convert URLs, text, or phone numbers into QR codes instantly. Customize size, colors, and error correction level.",
    badges: [
      { label: "Text", tone: "green" as const },
      { label: "QR Code", tone: "blue" as const },
      { label: "Free", tone: "amber" as const },
    ],
    inputTitle: "QR Code Settings",
    inputDescription: "Set the content and options for your QR code.",
    outputTitle: "QR Code Preview",
    outputDescription: "Your QR code is generated in real time as you type.",
    urlLabel: "URL or Text",
    urlPlaceholder: "https://example.com",
    sizeLabel: "Size",
    errorLabel: "Error Correction Level",
    fgLabel: "QR Color",
    bgLabel: "Background",
    download: "⬇ Download",
    copy: "📋 Copy",
    emptyTitle: "Enter some text",
    emptyDescription: "Type a URL or text and your QR code will appear instantly.",
    errorMsg: "Unable to generate QR code. Please check your input.",
    infoItems: [
      "All processing happens in your browser — no data is sent to any server.",
      "Higher error correction levels allow the QR code to be read even if partially damaged.",
      "If you plan to place a logo over the QR code, level H is recommended.",
    ],
    relatedTitle: "Related text tools",
    relatedDescription: "Continue with URL encoding or Base64 conversion tools.",
    relatedAction: "Open tool",
  },
};

export default function QrCodeClient() {
  const { lang } = useLanguage();
  const t = T[lang];

  const [text, setText] = useState("");
  const [size, setSize] = useState<Size>(256);
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [genError, setGenError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const relatedItems = buildRelatedToolItems(lang, [
    "/url-encoder",
    "/base64",
    "/json-formatter",
    "/characters",
  ]);

  useEffect(() => {
    if (!text.trim()) {
      setDataUrl(null);
      setGenError(null);
      return;
    }
    QRCode.toDataURL(text, {
      width: size,
      margin: 2,
      errorCorrectionLevel: errorLevel,
      color: { dark: fgColor, light: bgColor },
    })
      .then((url) => {
        setDataUrl(url);
        setGenError(null);
      })
      .catch(() => {
        setGenError(t.errorMsg);
        setDataUrl(null);
      });
  }, [text, size, errorLevel, fgColor, bgColor, t.errorMsg]);

  function handleDownload() {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `qrcode-${Date.now()}.png`;
    a.click();
  }

  function handleCopy() {
    if (!dataUrl) return;
    fetch(dataUrl)
      .then((r) => r.blob())
      .then((blob) => {
        const item = new ClipboardItem({ "image/png": blob });
        return navigator.clipboard.write([item]);
      })
      .catch(() => {});
  }

  return (
    <ToolPageShell
      breadcrumbs={t.breadcrumbs}
      icon="📷"
      title={t.title}
      description={t.description}
      badges={t.badges}
    >
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* 설정 패널 */}
        <ToolPanel title={t.inputTitle} description={t.inputDescription}>
          <div className="space-y-5">
            {/* URL/텍스트 입력 */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[var(--foreground)]">
                {t.urlLabel}
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t.urlPlaceholder}
                rows={3}
                className="w-full rounded-[20px] border border-[var(--card-border)] bg-[var(--muted-bg)] px-4 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none transition"
              />
            </div>

            {/* 크기 선택 */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[var(--foreground)]">
                {t.sizeLabel}
              </label>
              <div className="flex gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition ${
                      size === s
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-[var(--card-border)] bg-[var(--card)] text-[var(--foreground)] hover:border-blue-300"
                    }`}
                  >
                    {s}px
                  </button>
                ))}
              </div>
            </div>

            {/* 오류 복구 수준 */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[var(--foreground)]">
                {t.errorLabel}
              </label>
              <select
                value={errorLevel}
                onChange={(e) => setErrorLevel(e.target.value as "L" | "M" | "Q" | "H")}
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-blue-400 transition"
              >
                {ERROR_LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {lang === "ko" ? l.label : l.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* 색상 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[var(--foreground)]">
                  {t.fgLabel}
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                  <span className="font-mono text-sm text-[var(--muted)]">{fgColor}</span>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[var(--foreground)]">
                  {t.bgLabel}
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                  <span className="font-mono text-sm text-[var(--muted)]">{bgColor}</span>
                </div>
              </div>
            </div>
          </div>
        </ToolPanel>

        {/* 미리보기 패널 */}
        <ToolPanel title={t.outputTitle} description={t.outputDescription}>
          {text.trim() ? (
            <div className="flex flex-col items-center gap-5">
              <div className="flex h-64 w-64 items-center justify-center rounded-2xl border-2 border-dashed border-[var(--card-border)] bg-[var(--muted-bg)] overflow-hidden">
                {dataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={dataUrl} alt="QR코드" className="h-full w-full object-contain p-2" />
                ) : genError ? (
                  <p className="px-4 text-center text-xs text-red-500">{genError}</p>
                ) : null}
              </div>

              <div className="flex w-full gap-2">
                <button
                  onClick={handleDownload}
                  disabled={!dataUrl}
                  className="flex-1 rounded-xl bg-blue-500 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {t.download}
                </button>
                <button
                  onClick={handleCopy}
                  disabled={!dataUrl}
                  className="flex-1 rounded-xl border border-[var(--card-border)] bg-[var(--card)] py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted-bg)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {t.copy}
                </button>
              </div>

              {/* 안내 */}
              <div className="w-full rounded-2xl border border-[var(--card-border)] bg-[var(--muted-bg)] p-4 text-sm text-[var(--muted)] space-y-1">
                {t.infoItems.map((item, i) => (
                  <p key={i}>• {item}</p>
                ))}
              </div>
            </div>
          ) : (
            <EmptyToolState icon="📷" title={t.emptyTitle} description={t.emptyDescription} />
          )}
        </ToolPanel>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="mt-10">
        <RelatedToolsSection
          title={t.relatedTitle}
          description={t.relatedDescription}
          items={relatedItems}
          actionLabel={t.relatedAction}
        />
      </div>
    </ToolPageShell>
  );
}
