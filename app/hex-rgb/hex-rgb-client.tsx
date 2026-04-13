"use client";

import { useState } from "react";
import {
  RelatedToolsSection,
  ToolPageShell,
  ToolPanel,
} from "../components/tool-page-shell";
import { useLanguage } from "../language-context";
import { buildRelatedToolItems } from "../text-tool-utils";
import {
  hexToRgb,
  normalizeHex,
  parseRgbInput,
  rgbToHex,
  rgbToText,
  type RgbColor,
} from "../image-tool-utils";

const DEFAULT_RGB = { r: 37, g: 99, b: 235 };

const T = {
  ko: {
    breadcrumbs: ["전체 도구", "이미지", "HEX ↔ RGB 변환기"],
    title: "HEX ↔ RGB 변환기",
    description:
      "HEX 색상 코드와 RGB 값을 서로 변환합니다. 컬러 피커와 숫자 입력을 함께 써서 바로 복사할 수 있습니다.",
    badges: [
      { label: "색상", tone: "amber" as const },
      { label: "개발 보조", tone: "blue" as const },
      { label: "브라우저 처리", tone: "green" as const },
    ],
    hexTitle: "HEX 입력",
    hexDescription: "3자리 또는 6자리 HEX 코드를 넣을 수 있습니다.",
    rgbTitle: "RGB 입력",
    rgbDescription: "각 채널 값을 직접 입력하거나 한 줄로 붙여넣을 수 있습니다.",
    pickerTitle: "색상 미리보기",
    pickerDescription: "컬러 피커에서 선택하면 HEX와 RGB가 동시에 갱신됩니다.",
    hexLabel: "HEX 코드",
    rgbLabel: "RGB 문자열",
    channels: ["Red", "Green", "Blue"],
    invalidHex: "올바른 HEX 코드를 입력하세요. 예: #2563EB",
    invalidRgb: "올바른 RGB 값을 입력하세요. 예: 37, 99, 235",
    copy: "복사",
    copied: "복사됨",
    relatedTitle: "색상 작업 이어서 하기",
    relatedDescription: "팔레트 추출이나 보색 계산으로 바로 이어갈 수 있습니다.",
    relatedAction: "도구 열기",
  },
  en: {
    breadcrumbs: ["All tools", "Image", "HEX to RGB Converter"],
    title: "HEX to RGB Converter",
    description:
      "Convert HEX color codes and RGB values in both directions, with a live color picker and copy shortcuts.",
    badges: [
      { label: "Color", tone: "amber" as const },
      { label: "Developer helper", tone: "blue" as const },
      { label: "Browser only", tone: "green" as const },
    ],
    hexTitle: "HEX input",
    hexDescription: "Enter either a 3-digit or 6-digit HEX code.",
    rgbTitle: "RGB input",
    rgbDescription: "Edit each channel directly or paste a full rgb string.",
    pickerTitle: "Color preview",
    pickerDescription: "Choosing a color updates both HEX and RGB values.",
    hexLabel: "HEX code",
    rgbLabel: "RGB text",
    channels: ["Red", "Green", "Blue"],
    invalidHex: "Enter a valid HEX code. Example: #2563EB",
    invalidRgb: "Enter a valid RGB value. Example: 37, 99, 235",
    copy: "Copy",
    copied: "Copied",
    relatedTitle: "Continue with color tools",
    relatedDescription: "Move next to palette extraction or complementary color work.",
    relatedAction: "Open tool",
  },
};

export default function HexRgbClient() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [rgb, setRgb] = useState<RgbColor>(DEFAULT_RGB);
  const [hexInput, setHexInput] = useState(rgbToHex(DEFAULT_RGB));
  const [rgbInput, setRgbInput] = useState(rgbToText(DEFAULT_RGB));
  const [copiedKey, setCopiedKey] = useState("");
  const [message, setMessage] = useState("");
  const relatedItems = buildRelatedToolItems(lang, [
    "/color-palette",
    "/complementary-color",
    "/image-to-base64",
    "/markdown-to-html",
  ]);

  function updateFromRgb(nextRgb: RgbColor) {
    const nextHex = rgbToHex(nextRgb);
    setRgb(nextRgb);
    setHexInput(nextHex);
    setRgbInput(rgbToText(nextRgb));
    setMessage("");
  }

  function handleHexChange(value: string) {
    setHexInput(value);
    const nextRgb = hexToRgb(value);

    if (!nextRgb) {
      setMessage(t.invalidHex);
      return;
    }

    updateFromRgb(nextRgb);
  }

  function handleRgbTextChange(value: string) {
    setRgbInput(value);
    const nextRgb = parseRgbInput(value);

    if (!nextRgb) {
      setMessage(t.invalidRgb);
      return;
    }

    updateFromRgb(nextRgb);
  }

  async function handleCopy(value: string, key: string) {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    window.setTimeout(() => {
      setCopiedKey((current) => (current === key ? "" : current));
    }, 1200);
  }

  return (
    <ToolPageShell
      breadcrumbs={t.breadcrumbs}
      icon="🎨"
      title={t.title}
      description={t.description}
      badges={t.badges}
    >
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <ToolPanel title={t.hexTitle} description={t.hexDescription}>
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-600">{t.hexLabel}</span>
              <input
                value={hexInput}
                onChange={(event) => handleHexChange(event.target.value)}
                className="mt-2 h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-semibold text-slate-900 outline-none transition focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <button
              type="button"
              onClick={() => handleCopy(normalizeHex(hexInput) ?? rgbToHex(rgb), "hex")}
              className="rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              {copiedKey === "hex" ? t.copied : t.copy}
            </button>
          </div>
        </ToolPanel>

        <ToolPanel title={t.rgbTitle} description={t.rgbDescription}>
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-600">{t.rgbLabel}</span>
              <input
                value={rgbInput}
                onChange={(event) => handleRgbTextChange(event.target.value)}
                className="mt-2 h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-semibold text-slate-900 outline-none transition focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-3">
              {(["r", "g", "b"] as const).map((channel, index) => (
                <label key={channel} className="block">
                  <span className="text-sm font-medium text-slate-600">{t.channels[index]}</span>
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={rgb[channel]}
                    onChange={(event) =>
                      updateFromRgb({
                        ...rgb,
                        [channel]: Math.max(0, Math.min(255, Number(event.target.value) || 0)),
                      })
                    }
                    className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleCopy(rgbToText(rgb), "rgb")}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              {copiedKey === "rgb" ? t.copied : t.copy}
            </button>
          </div>
        </ToolPanel>
      </div>

      <div className="mt-6 space-y-6">
        <ToolPanel title={t.pickerTitle} description={t.pickerDescription}>
          <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)]">
            <div
              className="rounded-[28px] border border-slate-200"
              style={{ backgroundColor: normalizeHex(hexInput) ?? rgbToHex(rgb) }}
            >
              <div className="flex h-full min-h-[220px] items-end rounded-[28px] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(15,23,42,0.12))] p-5">
                <div className="rounded-2xl bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 backdrop-blur">
                  {normalizeHex(hexInput) ?? rgbToHex(rgb)}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <input
                type="color"
                value={normalizeHex(hexInput) ?? rgbToHex(rgb)}
                onChange={(event) => updateFromRgb(hexToRgb(event.target.value) ?? DEFAULT_RGB)}
                className="h-16 w-full rounded-2xl border border-slate-200 bg-white p-2"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-xs font-semibold text-slate-400">{t.hexLabel}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {normalizeHex(hexInput) ?? rgbToHex(rgb)}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-xs font-semibold text-slate-400">{t.rgbLabel}</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">{rgbToText(rgb)}</p>
                </div>
              </div>

              {message ? (
                <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
                  {message}
                </div>
              ) : null}
            </div>
          </div>
        </ToolPanel>

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
