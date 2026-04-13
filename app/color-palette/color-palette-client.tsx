"use client";

import NextImage from "next/image";
import { useState } from "react";
import {
  EmptyToolState,
  RelatedToolsSection,
  ToolPageShell,
  ToolPanel,
} from "../components/tool-page-shell";
import { useLanguage } from "../language-context";
import {
  extractPaletteFromImage,
  loadImageFile,
  rgbToText,
  type LoadedImageFile,
  type PaletteColor,
} from "../image-tool-utils";
import { buildRelatedToolItems } from "../text-tool-utils";

const T = {
  ko: {
    breadcrumbs: ["전체 도구", "이미지", "색상 팔레트 추출"],
    title: "색상 팔레트 추출",
    description:
      "이미지 안에서 비중이 큰 주요 색상을 추출합니다. 브랜드 시안, UI 컬러 정리, 썸네일 분석에 바로 쓸 수 있습니다.",
    badges: [
      { label: "색상", tone: "amber" as const },
      { label: "이미지 분석", tone: "blue" as const },
      { label: "브라우저 처리", tone: "green" as const },
    ],
    inputTitle: "이미지 업로드",
    inputDescription: "팔레트를 뽑을 이미지를 하나 업로드하세요.",
    outputTitle: "추출된 팔레트",
    outputDescription: "주요 색상 순서대로 HEX와 RGB 값을 복사할 수 있습니다.",
    select: "이미지 선택",
    emptyTitle: "아직 분석한 이미지가 없습니다",
    emptyDescription: "이미지를 올리면 주요 색상을 바로 추출합니다.",
    colorCount: "추출 색상 수",
    copy: "복사",
    copied: "복사됨",
    relatedTitle: "색상 도구 이어서 쓰기",
    relatedDescription: "HEX/RGB 변환이나 보색 찾기로 이어서 작업할 수 있습니다.",
    relatedAction: "도구 열기",
  },
  en: {
    breadcrumbs: ["All tools", "Image", "Color Palette Extractor"],
    title: "Color Palette Extractor",
    description:
      "Pull the main colors from an image for UI work, branding, moodboards, or quick thumbnail analysis.",
    badges: [
      { label: "Color", tone: "amber" as const },
      { label: "Image analysis", tone: "blue" as const },
      { label: "Browser only", tone: "green" as const },
    ],
    inputTitle: "Upload an image",
    inputDescription: "Upload one image to extract its dominant palette.",
    outputTitle: "Extracted palette",
    outputDescription: "Copy HEX and RGB values for the most prominent colors.",
    select: "Choose image",
    emptyTitle: "No image analyzed yet",
    emptyDescription: "Upload an image to extract its main colors.",
    colorCount: "Palette size",
    copy: "Copy",
    copied: "Copied",
    relatedTitle: "Continue with color tools",
    relatedDescription: "Jump next to HEX/RGB conversion or complementary color work.",
    relatedAction: "Open tool",
  },
};

export default function ColorPaletteClient() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [copiedKey, setCopiedKey] = useState("");
  const [colorCount, setColorCount] = useState(6);
  const [source, setSource] = useState<LoadedImageFile | null>(null);
  const [palette, setPalette] = useState<PaletteColor[]>([]);
  const relatedItems = buildRelatedToolItems(lang, [
    "/hex-rgb",
    "/complementary-color",
    "/image-to-base64",
    "/image-to-webp",
  ]);

  async function handleFile(file: File | null) {
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    const loaded = await loadImageFile(file);
    setSource(loaded);
    setPalette(extractPaletteFromImage(loaded, colorCount));
    setCopiedKey("");
  }

  async function handleCopy(value: string, key: string) {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    window.setTimeout(() => {
      setCopiedKey((current) => (current === key ? "" : current));
    }, 1200);
  }

  function handleColorCount(nextCount: number) {
    setColorCount(nextCount);

    if (source) {
      setPalette(extractPaletteFromImage(source, nextCount));
    }
  }

  return (
    <ToolPageShell
      breadcrumbs={t.breadcrumbs}
      icon="🧪"
      title={t.title}
      description={t.description}
      badges={t.badges}
    >
      <div className="mt-6 space-y-6">
        <ToolPanel title={t.inputTitle} description={t.inputDescription}>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
            <label className="block cursor-pointer rounded-[24px] border-2 border-dashed border-blue-200 bg-slate-50/80 p-8 text-center transition hover:border-blue-300 hover:bg-white">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
              />
              <div className="text-4xl">🖼️</div>
              <p className="mt-4 text-base font-semibold text-slate-900">{t.select}</p>
            </label>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-600">{t.colorCount}</p>
                <p className="text-sm font-semibold text-blue-600">{colorCount}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {[4, 6, 8].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => handleColorCount(count)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      colorCount === count
                        ? "bg-blue-500 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ToolPanel>

        <ToolPanel title={t.outputTitle} description={t.outputDescription}>
          {source ? (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <NextImage
                  src={source.dataUrl}
                  alt={source.name}
                  width={source.width}
                  height={source.height}
                  unoptimized
                  className="h-auto w-full rounded-2xl object-cover"
                />
                <p className="mt-4 text-sm font-semibold text-slate-900">{source.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {source.width} × {source.height}px
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {palette.map((swatch, index) => (
                  <div
                    key={`${swatch.hex}-${index}`}
                    className="rounded-[24px] border border-slate-200 bg-white p-4"
                  >
                    <div
                      className="h-28 rounded-2xl border border-slate-100"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <div className="mt-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{swatch.hex}</p>
                        <p className="mt-1 text-sm text-slate-500">{rgbToText(swatch.rgb)}</p>
                        <p className="mt-2 text-xs font-semibold text-blue-600">
                          {(swatch.ratio * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(swatch.hex, `${swatch.hex}-hex`)}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          {copiedKey === `${swatch.hex}-hex` ? t.copied : t.copy}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopy(rgbToText(swatch.rgb), `${swatch.hex}-rgb`)}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          {copiedKey === `${swatch.hex}-rgb` ? t.copied : t.copy}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyToolState icon="🎯" title={t.emptyTitle} description={t.emptyDescription} />
          )}
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
