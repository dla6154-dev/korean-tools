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
  formatBytes,
  loadImageFile,
  renderImageVariant,
  replaceExtension,
  scaleToFit,
  downloadDataUrl,
  type LoadedImageFile,
} from "../image-tool-utils";
import { buildRelatedToolItems } from "../text-tool-utils";

type ResizeMode = "pixels" | "ratio";

type ResizeResult = {
  name: string;
  size: number;
  width: number;
  height: number;
  dataUrl: string;
};

const T = {
  ko: {
    breadcrumbs: ["전체 도구", "이미지", "이미지 리사이즈"],
    title: "이미지 리사이즈",
    description:
      "이미지 크기를 픽셀 기준 또는 비율 기준으로 줄이거나 늘립니다. 비율 유지 여부도 바로 선택할 수 있습니다.",
    badges: [
      { label: "이미지", tone: "amber" as const },
      { label: "픽셀/비율 조절", tone: "blue" as const },
      { label: "브라우저 처리", tone: "green" as const },
    ],
    inputTitle: "원본 이미지",
    inputDescription: "리사이즈할 이미지를 업로드하고 원하는 기준을 선택하세요.",
    outputTitle: "리사이즈 결과",
    outputDescription: "원본과 결과 이미지를 비교하고 바로 다운로드할 수 있습니다.",
    select: "이미지 업로드",
    mode: "조절 방식",
    pixels: "픽셀",
    ratio: "비율",
    width: "가로",
    height: "세로",
    ratioLabel: "배율",
    keepAspect: "비율 유지",
    apply: "리사이즈 적용",
    clear: "초기화",
    download: "다운로드",
    emptyTitle: "아직 리사이즈한 이미지가 없습니다",
    emptyDescription: "이미지를 올리고 리사이즈 조건을 적용하면 결과를 여기에서 보여줍니다.",
    relatedTitle: "같이 쓰기 좋은 이미지 도구",
    relatedDescription: "리사이즈 뒤 WebP 변환, PDF 묶기, Base64 변환으로 이어질 수 있습니다.",
    relatedAction: "도구 열기",
  },
  en: {
    breadcrumbs: ["All tools", "Image", "Image Resize"],
    title: "Image Resize",
    description:
      "Resize an image by exact pixels or by scale percentage, with optional aspect-ratio locking.",
    badges: [
      { label: "Image", tone: "amber" as const },
      { label: "Pixels or ratio", tone: "blue" as const },
      { label: "Browser only", tone: "green" as const },
    ],
    inputTitle: "Source image",
    inputDescription: "Upload one image and choose how you want to resize it.",
    outputTitle: "Resized image",
    outputDescription: "Compare the original and resized versions and download the result.",
    select: "Upload image",
    mode: "Resize mode",
    pixels: "Pixels",
    ratio: "Ratio",
    width: "Width",
    height: "Height",
    ratioLabel: "Scale",
    keepAspect: "Keep aspect ratio",
    apply: "Apply resize",
    clear: "Reset",
    download: "Download",
    emptyTitle: "No resized image yet",
    emptyDescription: "Upload an image and apply resize settings to see the result here.",
    relatedTitle: "Related image tools",
    relatedDescription: "Continue into WebP conversion, PDF export, or Base64 conversion.",
    relatedAction: "Open tool",
  },
};

export default function ImageResizeClient() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [source, setSource] = useState<LoadedImageFile | null>(null);
  const [result, setResult] = useState<ResizeResult | null>(null);
  const [mode, setMode] = useState<ResizeMode>("pixels");
  const [targetWidth, setTargetWidth] = useState(1280);
  const [targetHeight, setTargetHeight] = useState(1280);
  const [scalePercent, setScalePercent] = useState(50);
  const [keepAspect, setKeepAspect] = useState(true);
  const [processing, setProcessing] = useState(false);
  const relatedItems = buildRelatedToolItems(lang, [
    "/image-to-webp",
    "/image-to-pdf",
    "/image-to-base64",
    "/image-compress",
  ]);

  async function handleFile(file: File | null) {
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    const loaded = await loadImageFile(file);
    setSource(loaded);
    setResult(null);
    setTargetWidth(loaded.width);
    setTargetHeight(loaded.height);
  }

  async function handleResize() {
    if (!source) {
      return;
    }

    setProcessing(true);

    try {
      const size =
        mode === "pixels"
          ? keepAspect
            ? scaleToFit(source.width, source.height, Math.max(1, targetWidth), Math.max(1, targetHeight))
            : { width: Math.max(1, targetWidth), height: Math.max(1, targetHeight) }
          : {
              width: Math.max(1, Math.round(source.width * (scalePercent / 100))),
              height: Math.max(1, Math.round(source.height * (scalePercent / 100))),
            };
      const targetType =
        source.type === "image/png"
          ? "image/png"
          : source.type === "image/webp"
            ? "image/webp"
            : "image/jpeg";
      const resized = await renderImageVariant(source, {
        width: size.width,
        height: size.height,
        type: targetType,
        quality: 0.92,
      });

      setResult({
        name:
          targetType === "image/jpeg"
            ? replaceExtension(source.name, "jpg")
            : targetType === "image/png"
              ? replaceExtension(source.name, "png")
              : replaceExtension(source.name, "webp"),
        size: resized.blob.size,
        width: resized.width,
        height: resized.height,
        dataUrl: resized.dataUrl,
      });
    } finally {
      setProcessing(false);
    }
  }

  return (
    <ToolPageShell
      breadcrumbs={t.breadcrumbs}
      icon="📐"
      title={t.title}
      description={t.description}
      badges={t.badges}
    >
      <div className="mt-6 space-y-6">
        <ToolPanel title={t.inputTitle} description={t.inputDescription}>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
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

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-600">{t.mode}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {(["pixels", "ratio"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setMode(value)}
                      className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                        mode === value
                          ? "border-blue-200 bg-blue-50 text-blue-600"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {value === "pixels" ? t.pixels : t.ratio}
                    </button>
                  ))}
                </div>
              </div>

              {mode === "pixels" ? (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-medium text-slate-600">{t.width}</span>
                      <input
                        type="number"
                        min={1}
                        value={targetWidth}
                        onChange={(event) => setTargetWidth(Number(event.target.value) || 1)}
                        className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-100"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-slate-600">{t.height}</span>
                      <input
                        type="number"
                        min={1}
                        value={targetHeight}
                        onChange={(event) => setTargetHeight(Number(event.target.value) || 1)}
                        className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-100"
                      />
                    </label>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={keepAspect}
                      onChange={(event) => setKeepAspect(event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-500"
                    />
                    <span>{t.keepAspect}</span>
                  </label>
                </>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-slate-600">{t.ratioLabel}</p>
                    <p className="text-sm font-semibold text-blue-600">{scalePercent}%</p>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={200}
                    step={5}
                    value={scalePercent}
                    onChange={(event) => setScalePercent(Number(event.target.value))}
                    className="mt-3 w-full accent-blue-500"
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleResize}
                  disabled={!source || processing}
                  className="rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {processing ? "Processing..." : t.apply}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSource(null);
                    setResult(null);
                  }}
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  {t.clear}
                </button>
              </div>
            </div>
          </div>
        </ToolPanel>

        <ToolPanel title={t.outputTitle} description={t.outputDescription}>
          {source && result ? (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_220px]">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="mb-3 text-xs font-semibold text-slate-400">
                  {lang === "ko" ? "원본" : "Original"}
                </p>
                <NextImage
                  src={source.dataUrl}
                  alt={source.name}
                  width={source.width}
                  height={source.height}
                  unoptimized
                  className="h-44 w-full rounded-xl object-cover"
                />
                <p className="mt-3 text-sm font-semibold text-slate-900">
                  {source.width} × {source.height}px
                </p>
                <p className="mt-1 text-sm text-slate-500">{formatBytes(source.file.size)}</p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3">
                <p className="mb-3 text-xs font-semibold text-emerald-700">
                  {lang === "ko" ? "리사이즈 결과" : "Resized"}
                </p>
                <NextImage
                  src={result.dataUrl}
                  alt={result.name}
                  width={result.width}
                  height={result.height}
                  unoptimized
                  className="h-44 w-full rounded-xl object-cover"
                />
                <p className="mt-3 text-sm font-semibold text-slate-900">
                  {result.width} × {result.height}px
                </p>
                <p className="mt-1 text-sm text-slate-500">{formatBytes(result.size)}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold text-slate-400">{result.name}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {Math.round((result.width / source.width) * 100)}%
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  {mode === "pixels"
                    ? `${targetWidth} × ${targetHeight}px box`
                    : `${scalePercent}% scale`}
                </p>
                <button
                  type="button"
                  onClick={() => downloadDataUrl(result.dataUrl, result.name)}
                  className="mt-5 w-full rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                >
                  {t.download}
                </button>
              </div>
            </div>
          ) : (
            <EmptyToolState icon="📏" title={t.emptyTitle} description={t.emptyDescription} />
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
