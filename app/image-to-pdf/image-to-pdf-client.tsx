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
import { buildRelatedToolItems } from "../text-tool-utils";
import { formatBytes, loadImageFile, renderImageVariant, type LoadedImageFile } from "../image-tool-utils";

type PageMode = "a4" | "original";

const A4_PORTRAIT = { width: 595.28, height: 841.89 };
const A4_LANDSCAPE = { width: 841.89, height: 595.28 };

const T = {
  ko: {
    breadcrumbs: ["전체 도구", "이미지", "이미지 → PDF"],
    title: "이미지 → PDF",
    description:
      "여러 이미지를 한 개의 PDF 문서로 묶습니다. 각 이미지는 한 페이지씩 들어가며, A4 기준 또는 원본 비율 기준으로 저장할 수 있습니다.",
    badges: [
      { label: "이미지", tone: "amber" as const },
      { label: "PDF 내보내기", tone: "blue" as const },
      { label: "브라우저 처리", tone: "green" as const },
    ],
    inputTitle: "이미지 목록",
    inputDescription: "PDF로 묶을 이미지를 순서대로 업로드하세요.",
    outputTitle: "PDF 내보내기",
    outputDescription: "한 번에 하나의 PDF 파일로 저장합니다.",
    select: "이미지 선택",
    pageMode: "페이지 기준",
    a4: "A4 맞춤",
    original: "원본 크기",
    margin: "여백",
    createPdf: "PDF 만들기",
    clear: "목록 비우기",
    emptyTitle: "아직 추가된 이미지가 없습니다",
    emptyDescription: "여러 이미지를 올리면 하나의 PDF 문서로 묶을 수 있습니다.",
    eachPage: "각 이미지는 PDF의 한 페이지로 들어갑니다.",
    relatedTitle: "이미지 작업 이어서 하기",
    relatedDescription: "PDF 만들기 전 리사이즈, WebP 변환, Base64 변환으로 이어갈 수 있습니다.",
    relatedAction: "도구 열기",
  },
  en: {
    breadcrumbs: ["All tools", "Image", "Image to PDF"],
    title: "Image to PDF",
    description:
      "Bundle several images into a single PDF document. Each image becomes its own page, either fit to A4 or kept at its original size.",
    badges: [
      { label: "Image", tone: "amber" as const },
      { label: "PDF export", tone: "blue" as const },
      { label: "Browser only", tone: "green" as const },
    ],
    inputTitle: "Image list",
    inputDescription: "Upload the images you want to combine into one PDF.",
    outputTitle: "PDF export",
    outputDescription: "Save everything into one PDF file.",
    select: "Choose images",
    pageMode: "Page mode",
    a4: "Fit to A4",
    original: "Original size",
    margin: "Margin",
    createPdf: "Create PDF",
    clear: "Clear list",
    emptyTitle: "No images added yet",
    emptyDescription: "Upload multiple images to bundle them into a single PDF document.",
    eachPage: "Each image becomes one page in the PDF.",
    relatedTitle: "Continue with image tools",
    relatedDescription: "Resize or convert images before creating the final PDF.",
    relatedAction: "Open tool",
  },
};

function getPageSize(item: LoadedImageFile, mode: PageMode) {
  if (mode === "original") {
    return { width: item.width, height: item.height };
  }

  return item.width >= item.height ? A4_LANDSCAPE : A4_PORTRAIT;
}

export default function ImageToPdfClient() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [items, setItems] = useState<LoadedImageFile[]>([]);
  const [pageMode, setPageMode] = useState<PageMode>("a4");
  const [margin, setMargin] = useState(24);
  const [creating, setCreating] = useState(false);
  const relatedItems = buildRelatedToolItems(lang, [
    "/image-resize",
    "/image-to-webp",
    "/image-to-base64",
    "/image-compress",
  ]);

  async function handleFiles(files: FileList | File[]) {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      return;
    }

    const loaded = await Promise.all(imageFiles.map((file) => loadImageFile(file)));
    setItems((current) => [...current, ...loaded]);
  }

  async function createPdf() {
    if (items.length === 0) {
      return;
    }

    setCreating(true);

    try {
      const { jsPDF } = await import("jspdf");
      const firstPage = getPageSize(items[0], pageMode);
      const firstOrientation = firstPage.width >= firstPage.height ? "landscape" : "portrait";
      const pdf = new jsPDF({
        unit: "pt",
        format: [firstPage.width, firstPage.height],
        orientation: firstOrientation,
        compress: true,
      });

      for (const [index, item] of items.entries()) {
        const page = getPageSize(item, pageMode);
        const orientation = page.width >= page.height ? "landscape" : "portrait";

        if (index > 0) {
          pdf.addPage([page.width, page.height], orientation);
        }

        const exportImage = await renderImageVariant(item, {
          width: item.width,
          height: item.height,
          type: item.type === "image/png" ? "image/png" : "image/jpeg",
          quality: 0.92,
          backgroundColor: item.type === "image/png" ? undefined : "#FFFFFF",
        });
        const usableWidth = Math.max(1, page.width - margin * 2);
        const usableHeight = Math.max(1, page.height - margin * 2);
        const scale = Math.min(usableWidth / item.width, usableHeight / item.height);
        const drawWidth = item.width * scale;
        const drawHeight = item.height * scale;
        const drawX = (page.width - drawWidth) / 2;
        const drawY = (page.height - drawHeight) / 2;

        pdf.addImage(
          exportImage.dataUrl,
          exportImage.dataUrl.startsWith("data:image/png") ? "PNG" : "JPEG",
          drawX,
          drawY,
          drawWidth,
          drawHeight,
          undefined,
          "FAST",
        );
      }

      pdf.save(`rate-snap-images-${Date.now()}.pdf`);
    } finally {
      setCreating(false);
    }
  }

  return (
    <ToolPageShell
      breadcrumbs={t.breadcrumbs}
      icon="📄"
      title={t.title}
      description={t.description}
      badges={t.badges}
    >
      <div className="mt-6 space-y-6">
        <ToolPanel title={t.inputTitle} description={t.inputDescription}>
          <div className="grid gap-5 xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
            <label className="block cursor-pointer rounded-[24px] border-2 border-dashed border-blue-200 bg-slate-50/80 p-8 text-center transition hover:border-blue-300 hover:bg-white">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) => event.target.files && handleFiles(event.target.files)}
              />
              <div className="text-4xl">🖼️</div>
              <p className="mt-4 text-base font-semibold text-slate-900">{t.select}</p>
            </label>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-600">{t.pageMode}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {(["a4", "original"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setPageMode(value)}
                      className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                        pageMode === value
                          ? "border-blue-200 bg-blue-50 text-blue-600"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {value === "a4" ? t.a4 : t.original}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-600">{t.margin}</p>
                  <p className="text-sm font-semibold text-blue-600">{margin}px</p>
                </div>
                <input
                  type="range"
                  min={0}
                  max={64}
                  step={4}
                  value={margin}
                  onChange={(event) => setMargin(Number(event.target.value))}
                  className="mt-3 w-full accent-blue-500"
                />
              </div>

              <p className="text-sm leading-6 text-slate-500">{t.eachPage}</p>
            </div>
          </div>
        </ToolPanel>

        <ToolPanel title={t.outputTitle} description={t.outputDescription}>
          {items.length > 0 ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-4">
                <div>
                  <p className="text-xs font-semibold text-emerald-700">
                    {lang === "ko" ? `${items.length}개 이미지` : `${items.length} images`}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {items.reduce((sum, item) => sum + item.file.size, 0) > 0
                      ? formatBytes(items.reduce((sum, item) => sum + item.file.size, 0))
                      : "0 KB"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={createPdf}
                    disabled={creating}
                    className="rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {creating ? "Processing..." : t.createPdf}
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

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="rounded-[24px] border border-slate-200 bg-white p-4"
                  >
                    <NextImage
                      src={item.dataUrl}
                      alt={item.name}
                      width={item.width}
                      height={item.height}
                      unoptimized
                      className="h-48 w-full rounded-2xl object-cover"
                    />
                    <p className="mt-4 text-xs font-semibold text-slate-400">
                      {lang === "ko" ? `${index + 1}페이지 예정` : `Page ${index + 1}`}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.width} × {item.height}px · {formatBytes(item.file.size)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyToolState icon="🗂️" title={t.emptyTitle} description={t.emptyDescription} />
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
