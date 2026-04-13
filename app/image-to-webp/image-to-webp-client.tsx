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
  downloadDataUrl,
} from "../image-tool-utils";
import { buildRelatedToolItems } from "../text-tool-utils";

type ConvertedItem = {
  id: string;
  name: string;
  originalSize: number;
  convertedSize: number;
  width: number;
  height: number;
  originalDataUrl: string;
  convertedDataUrl: string;
};

const T = {
  ko: {
    breadcrumbs: ["전체 도구", "이미지", "이미지 → WebP 변환"],
    title: "이미지 → WebP 변환",
    description:
      "JPG, PNG 이미지를 브라우저 안에서 바로 WebP로 바꿉니다. 품질을 조절하고 여러 장을 한 번에 저장할 수 있습니다.",
    badges: [
      { label: "이미지", tone: "amber" as const },
      { label: "브라우저 처리", tone: "blue" as const },
      { label: "WebP 변환", tone: "green" as const },
    ],
    inputTitle: "이미지 업로드",
    inputDescription: "JPG나 PNG 파일을 올리면 WebP로 즉시 변환합니다.",
    outputTitle: "변환 결과",
    outputDescription: "원본 크기와 WebP 결과 크기를 함께 비교할 수 있습니다.",
    dropTitle: "이미지를 끌어오거나 클릭해서 업로드",
    dropSub: "여러 장을 한 번에 올릴 수 있습니다.",
    select: "이미지 선택",
    quality: "WebP 품질",
    downloadAll: "WebP 전체 다운로드",
    clear: "초기화",
    download: "다운로드",
    emptyTitle: "아직 변환한 이미지가 없습니다",
    emptyDescription: "이미지를 올리면 WebP 결과와 용량 차이를 바로 보여줍니다.",
    saved: "절약",
    increased: "증가",
    relatedTitle: "같이 쓰기 좋은 이미지 도구",
    relatedDescription: "변환 뒤 리사이즈, PDF 묶기, 색상 작업까지 이어서 처리할 수 있습니다.",
    relatedAction: "도구 열기",
  },
  en: {
    breadcrumbs: ["All tools", "Image", "Image to WebP"],
    title: "Image to WebP",
    description:
      "Convert JPG and PNG images into WebP directly in the browser. Adjust quality and export several files at once.",
    badges: [
      { label: "Image", tone: "amber" as const },
      { label: "Browser only", tone: "blue" as const },
      { label: "WebP export", tone: "green" as const },
    ],
    inputTitle: "Upload images",
    inputDescription: "Upload JPG or PNG files and convert them into WebP.",
    outputTitle: "Converted images",
    outputDescription: "Compare the original file size with the WebP result.",
    dropTitle: "Drag images here or click to upload",
    dropSub: "You can upload multiple images together.",
    select: "Choose images",
    quality: "WebP quality",
    downloadAll: "Download all WebP files",
    clear: "Reset",
    download: "Download",
    emptyTitle: "No images converted yet",
    emptyDescription: "Upload an image to see the WebP result and file size difference.",
    saved: "saved",
    increased: "larger",
    relatedTitle: "Related image tools",
    relatedDescription: "Resize, bundle into PDF, or continue with other image helpers.",
    relatedAction: "Open tool",
  },
};

export default function ImageToWebpClient() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [quality, setQuality] = useState(82);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ConvertedItem[]>([]);
  const relatedItems = buildRelatedToolItems(lang, [
    "/image-resize",
    "/image-to-pdf",
    "/image-to-base64",
    "/image-compress",
  ]);
  const totalDelta = items.reduce((sum, item) => sum + (item.originalSize - item.convertedSize), 0);

  async function handleFiles(files: FileList | File[]) {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      return;
    }

    setLoading(true);

    try {
      const converted = await Promise.all(
        imageFiles.map(async (file, index) => {
          const source = await loadImageFile(file);
          const result = await renderImageVariant(source, {
            width: source.width,
            height: source.height,
            type: "image/webp",
            quality: quality / 100,
          });

          return {
            id: `${file.name}-${Date.now()}-${index}`,
            name: replaceExtension(file.name, "webp"),
            originalSize: file.size,
            convertedSize: result.blob.size,
            width: result.width,
            height: result.height,
            originalDataUrl: source.dataUrl,
            convertedDataUrl: result.dataUrl,
          };
        }),
      );

      setItems((current) => [...converted, ...current]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPageShell
      breadcrumbs={t.breadcrumbs}
      icon="🪄"
      title={t.title}
      description={t.description}
      badges={t.badges}
    >
      <div className="mt-6 space-y-6">
        <ToolPanel title={t.inputTitle} description={t.inputDescription}>
          <label className="block cursor-pointer rounded-[24px] border-2 border-dashed border-blue-200 bg-slate-50/80 p-8 text-center transition hover:border-blue-300 hover:bg-white">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(event) => event.target.files && handleFiles(event.target.files)}
            />
            <div className="text-4xl">{loading ? "⏳" : "🖼️"}</div>
            <p className="mt-4 text-base font-semibold text-slate-900">
              {loading ? "Processing..." : t.dropTitle}
            </p>
            <p className="mt-2 text-sm text-slate-500">{t.dropSub}</p>
            <span className="mt-5 inline-flex rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white">
              {t.select}
            </span>
          </label>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm font-medium text-slate-600">{t.quality}</label>
              <span className="text-sm font-semibold text-blue-600">{quality}%</span>
            </div>
            <input
              type="range"
              min={35}
              max={100}
              value={quality}
              onChange={(event) => setQuality(Number.parseInt(event.target.value, 10))}
              className="mt-3 w-full accent-blue-500"
            />
          </div>
        </ToolPanel>

        <ToolPanel title={t.outputTitle} description={t.outputDescription}>
          {items.length > 0 ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-4">
                <div>
                  <p className="text-xs font-semibold text-emerald-700">
                    {lang === "ko" ? `${items.length}개 파일` : `${items.length} files`}
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {totalDelta >= 0
                      ? `${formatBytes(totalDelta)} ${t.saved}`
                      : `${formatBytes(Math.abs(totalDelta))} ${t.increased}`}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => items.forEach((item) => downloadDataUrl(item.convertedDataUrl, item.name))}
                    className="rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                  >
                    {t.downloadAll}
                  </button>
                  <button
                    type="button"
                    onClick={() => setItems([])}
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    {t.clear}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {items.map((item) => {
                  const delta = item.originalSize - item.convertedSize;
                  const pct = Math.round((Math.abs(delta) / item.originalSize) * 100);

                  return (
                    <div
                      key={item.id}
                      className="grid gap-4 rounded-[24px] border border-slate-200 bg-white p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_220px]"
                    >
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <p className="mb-3 text-xs font-semibold text-slate-400">
                          {lang === "ko" ? "원본" : "Original"}
                        </p>
                        <NextImage
                          src={item.originalDataUrl}
                          alt={item.name}
                          width={item.width}
                          height={item.height}
                          unoptimized
                          className="h-40 w-full rounded-xl object-cover"
                        />
                        <p className="mt-3 text-sm font-semibold text-slate-900">
                          {formatBytes(item.originalSize)}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3">
                        <p className="mb-3 text-xs font-semibold text-emerald-700">WebP</p>
                        <NextImage
                          src={item.convertedDataUrl}
                          alt={`${item.name} preview`}
                          width={item.width}
                          height={item.height}
                          unoptimized
                          className="h-40 w-full rounded-xl object-cover"
                        />
                        <p className="mt-3 text-sm font-semibold text-slate-900">
                          {formatBytes(item.convertedSize)}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-xs font-semibold text-slate-400">{item.name}</p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">
                          {delta >= 0 ? "-" : "+"}
                          {pct}%
                        </p>
                        <p className={`mt-2 text-sm font-semibold ${delta >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                          {delta >= 0
                            ? `${formatBytes(delta)} ${t.saved}`
                            : `${formatBytes(Math.abs(delta))} ${t.increased}`}
                        </p>
                        <p className="mt-4 text-sm text-slate-500">
                          {item.width} × {item.height}px
                        </p>
                        <button
                          type="button"
                          onClick={() => downloadDataUrl(item.convertedDataUrl, item.name)}
                          className="mt-5 w-full rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                        >
                          {t.download}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <EmptyToolState icon="🧾" title={t.emptyTitle} description={t.emptyDescription} />
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
