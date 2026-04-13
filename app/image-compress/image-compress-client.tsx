"use client";

import NextImage from "next/image";
import {
  EmptyToolState,
  RelatedToolsSection,
  ToolFaqSection,
  ToolPageShell,
  ToolPanel,
} from "../components/tool-page-shell";
import { tools } from "../tool-content";
import { useLanguage } from "../language-context";
import { useRef, useState } from "react";

const T = {
  ko: {
    breadcrumbs: ["전체 도구", "이미지", "이미지 압축기"],
    title: "이미지 압축기",
    description:
      "JPG, PNG, WebP 이미지를 브라우저 안에서 바로 압축합니다. 원본은 서버로 전송하지 않습니다.",
    badges: ["무료", "업로드 후 브라우저 처리", "서버 저장 없음"],
    uploadTitle: "이미지 업로드",
    uploadDescription:
      "파일을 끌어놓거나 버튼을 눌러 여러 장을 한 번에 올릴 수 있습니다.",
    qualityLabel: "압축 품질",
    qualityMin: "최대 압축",
    qualityMax: "원본 품질",
    maxWidthLabel: "최대 가로폭",
    dropTitle: "이미지를 드래그하거나 클릭해서 업로드",
    dropSub: "JPG, PNG, WebP, GIF 지원 · 최대 10MB 권장",
    loading: "압축 중...",
    selectFile: "파일 선택",
    saved: "절약",
    noSaving: "원본이 더 작음",
    images: "개 이미지",
    downloadAll: "압축 파일 다운로드",
    reset: "초기화",
    download: "다운로드",
    delete: "삭제",
    privacy:
      "모든 처리는 브라우저 안에서 이루어지며, 이미지가 서버에 저장되지 않습니다.",
    privacyLabel: "개인정보 처리",
    resultsTitle: "압축 결과",
    resultsDescription: "원본 대비 얼마나 줄었는지 바로 비교할 수 있습니다.",
    emptyTitle: "아직 업로드한 이미지가 없습니다",
    emptyDescription:
      "이미지를 올리면 원본과 압축본의 크기 차이를 한 번에 보여줍니다.",
    faqTitle: "자주 묻는 질문",
    faqDescription: "이미지 업로드 전에 많이 묻는 핵심 질문만 먼저 정리했습니다.",
    faqs: [
      {
        question: "압축한 이미지 품질이 많이 떨어지나요?",
        answer:
          "품질 슬라이더를 높일수록 화질 보존이 좋아집니다. 보통 웹 업로드용이라면 70~85% 구간이 가장 균형이 좋습니다.",
      },
      {
        question: "업로드한 이미지는 서버에 저장되나요?",
        answer:
          "아니요. 압축과 변환은 브라우저 안에서 처리되고, 파일은 사용 중인 기기 메모리에서만 다뤄집니다.",
      },
      {
        question: "여러 장을 한 번에 압축할 수 있나요?",
        answer:
          "가능합니다. 여러 장을 한 번에 올리면 각 파일별로 압축 결과를 생성하고, 전체 다운로드 버튼으로 모아서 받을 수 있습니다.",
      },
    ],
    relatedTitle: "관련 도구",
    relatedDescription: "이미지와 파일 작업에 자주 같이 쓰는 도구를 이어서 열 수 있습니다.",
    relatedAction: "바로 열기",
  },
  en: {
    breadcrumbs: ["All tools", "Image", "Image compressor"],
    title: "Image Compressor",
    description:
      "Compress JPG, PNG, and WebP images directly in the browser. Originals are not uploaded to a server.",
    badges: ["Free", "Browser processing", "No server storage"],
    uploadTitle: "Upload images",
    uploadDescription:
      "Drag files in or use the button to upload multiple images at once.",
    qualityLabel: "Quality",
    qualityMin: "Max compression",
    qualityMax: "Original quality",
    maxWidthLabel: "Max width",
    dropTitle: "Drag files here or click to upload",
    dropSub: "Supports JPG, PNG, WebP, GIF · Up to 10MB recommended",
    loading: "Compressing...",
    selectFile: "Choose file",
    saved: "saved",
    noSaving: "Original is smaller",
    images: "images",
    downloadAll: "Download compressed files",
    reset: "Reset",
    download: "Download",
    delete: "Remove",
    privacy:
      "All processing happens in your browser and uploaded images are not stored on a server.",
    privacyLabel: "Privacy",
    resultsTitle: "Compression results",
    resultsDescription: "Compare the original and compressed size at a glance.",
    emptyTitle: "No images uploaded yet",
    emptyDescription:
      "Upload an image to see the before/after file size difference in one place.",
    faqTitle: "Frequently asked questions",
    faqDescription: "The main questions people ask before uploading images.",
    faqs: [
      {
        question: "Will the image quality drop too much?",
        answer:
          "Higher quality preserves more detail. For most web uploads, the 70-85% range gives the best balance.",
      },
      {
        question: "Are uploaded images stored on a server?",
        answer:
          "No. Compression runs entirely in the browser, and files remain in the memory of the current device.",
      },
      {
        question: "Can I compress multiple images at once?",
        answer:
          "Yes. Upload several images together and the tool will generate a result for each file, plus a download-all action.",
      },
    ],
    relatedTitle: "Related tools",
    relatedDescription: "Open other image and everyday tools people often use next.",
    relatedAction: "Open now",
  },
};

interface CompressedImage {
  id: number;
  name: string;
  originalSize: number;
  compressedSize: number;
  originalUrl: string;
  compressedUrl: string;
  width: number;
  height: number;
}

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }

  return `${(bytes / 1024).toFixed(1)} KB`;
}

function compressImage(file: File, quality: number, maxWidth: number): Promise<CompressedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);

        const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Compression failed"));
              return;
            }

            const useOriginal = blob.size >= file.size;
            const finalBlob = useOriginal ? file : blob;

            resolve({
              id: Date.now() + Math.random(),
              name: file.name,
              originalSize: file.size,
              compressedSize: finalBlob.size,
              originalUrl: URL.createObjectURL(file),
              compressedUrl: URL.createObjectURL(finalBlob),
              width,
              height,
            });
          },
          mimeType,
          quality / 100,
        );
      };

      img.onerror = reject;
      img.src = event.target?.result as string;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageCompressClient() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function processFiles(files: FileList | File[]) {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      return;
    }

    setLoading(true);

    try {
      const results = await Promise.all(
        imageFiles.map((file) => compressImage(file, quality, maxWidth)),
      );
      setImages((current) => [...results, ...current]);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  function downloadAll() {
    images.forEach((image) => {
      const a = document.createElement("a");
      a.href = image.compressedUrl;
      const ext = image.name.split(".").pop();
      a.download = image.name.replace(`.${ext}`, `_compressed.${ext}`);
      a.click();
    });
  }

  const totalSaved = images.reduce(
    (sum, image) => sum + (image.originalSize - image.compressedSize),
    0,
  );
  const totalOriginal = images.reduce((sum, image) => sum + image.originalSize, 0);
  const relatedItems = ["/complementary-color", "/characters", "/unit-price", "/keyboard"]
    .map((href) => tools.find((tool) => tool.href === href))
    .filter((tool): tool is NonNullable<(typeof tools)[number]> => Boolean(tool))
    .map((tool) => ({
      href: tool.href,
      icon: tool.icon,
      title: tool.title[lang],
      description: tool.description[lang],
      badge: tool.badge[lang],
    }));

  return (
    <ToolPageShell
      breadcrumbs={t.breadcrumbs}
      icon="🖼️"
      title={t.title}
      description={t.description}
      badges={t.badges.map((label, index) => ({
        label,
        tone: index === 0 ? "green" : index === 1 ? "blue" : "amber",
      }))}
    >
      <div className="mt-8 space-y-6">
        <ToolPanel title={t.uploadTitle} description={t.uploadDescription}>
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              processFiles(event.dataTransfer.files);
            }}
            onClick={() => inputRef.current?.click()}
            className={`rounded-[24px] border-2 border-dashed p-8 text-center transition md:p-12 ${
              dragging
                ? "border-blue-400 bg-blue-50"
                : "border-blue-200 bg-[var(--card)] hover:border-blue-300 hover:bg-[var(--muted-bg)]"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => event.target.files && processFiles(event.target.files)}
            />
            <div className="text-4xl">{loading ? "⏳" : "📤"}</div>
            <p className="mt-4 text-base font-semibold text-[var(--foreground)]">
              {loading ? t.loading : t.dropTitle}
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">{t.dropSub}</p>
            <button
              type="button"
              className="mt-5 rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white"
            >
              {t.selectFile}
            </button>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--muted-bg)] px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <label className="text-sm font-medium text-[var(--muted)]">{t.qualityLabel}</label>
                <span className="text-sm font-semibold text-blue-600">{quality}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={(event) => setQuality(Number.parseInt(event.target.value, 10))}
                className="mt-3 w-full accent-blue-500"
              />
              <div className="mt-2 flex justify-between text-xs text-[var(--muted)]">
                <span>{t.qualityMin}</span>
                <span>{t.qualityMax}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--muted-bg)] px-4 py-4">
              <label className="text-sm font-medium text-[var(--muted)]">{t.maxWidthLabel}</label>
              <div className="mt-3 flex flex-wrap gap-2">
                {[800, 1280, 1920, 2560].map((width) => (
                  <button
                    key={width}
                    type="button"
                    onClick={() => setMaxWidth(width)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      maxWidth === width
                        ? "bg-blue-500 text-white"
                        : "bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--muted-bg)]"
                    }`}
                  >
                    {width}px
                  </button>
                ))}
                <div className="relative">
                  <input
                    type="number"
                    value={maxWidth}
                    onChange={(event) =>
                      setMaxWidth(Number.parseInt(event.target.value, 10) || 1920)
                    }
                    className="w-24 rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-3 py-1.5 pr-8 text-xs outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]">
                    px
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ToolPanel>

        <ToolPanel
          title={t.resultsTitle}
          description={t.resultsDescription}
          className={images.length > 0 ? "border-emerald-200 bg-emerald-50/60" : ""}
        >
          {images.length > 0 ? (
            <>
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-200 bg-[var(--card)] px-4 py-4 dark:border-emerald-800">
                    <div className="text-xs font-medium text-[var(--muted)]">
                      {lang === "ko"
                        ? `${images.length}${t.images}`
                        : `${images.length} ${t.images}`}
                    </div>
                    <div className="mt-2 text-2xl font-bold text-[var(--foreground)]">
                      {formatSize(totalSaved)}
                    </div>
                    <div className="mt-1 text-sm text-emerald-600">
                      {t.saved} ({totalOriginal > 0 ? Math.round((totalSaved / totalOriginal) * 100) : 0}%)
                    </div>
                  </div>
                  <div className="rounded-2xl border border-emerald-200 bg-[var(--card)] px-4 py-4 dark:border-emerald-800">
                    <div className="text-xs font-medium text-[var(--muted)]">{t.privacyLabel}</div>
                    <div className="mt-2 text-sm leading-6 text-[var(--muted)]">{t.privacy}</div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={downloadAll}
                    className="rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                  >
                    {t.downloadAll}
                  </button>
                  <button
                    type="button"
                    onClick={() => setImages([])}
                    className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-3 text-sm font-semibold text-[var(--muted)] transition hover:bg-[var(--muted-bg)]"
                  >
                    {t.reset}
                  </button>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {images.map((image) => {
                  const savings = image.originalSize - image.compressedSize;
                  const pct = Math.round((savings / image.originalSize) * 100);

                  return (
                    <div
                      key={image.id}
                      className="grid gap-4 rounded-[24px] border border-emerald-200 bg-[var(--card)] p-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_220px] dark:border-emerald-800"
                    >
                      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--muted-bg)] p-3">
                        <div className="mb-3 text-xs font-semibold text-[var(--muted)]">
                          {lang === "ko" ? "원본" : "Before"}
                        </div>
                        <NextImage
                          src={image.originalUrl}
                          alt={image.name}
                          width={image.width}
                          height={image.height}
                          unoptimized
                          className="h-40 w-full rounded-xl object-cover"
                        />
                        <div className="mt-3 text-sm font-medium text-[var(--muted)]">{image.name}</div>
                        <div className="mt-1 text-xs text-[var(--muted)]">{formatSize(image.originalSize)}</div>
                      </div>

                      <div className="hidden items-center justify-center text-2xl text-blue-500 lg:flex">
                        →
                      </div>

                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3">
                        <div className="mb-3 text-xs font-semibold text-emerald-600">
                          {lang === "ko" ? "압축 후" : "After"}
                        </div>
                        <NextImage
                          src={image.compressedUrl}
                          alt={`${image.name} compressed`}
                          width={image.width}
                          height={image.height}
                          unoptimized
                          className="h-40 w-full rounded-xl object-cover"
                        />
                        <div className="mt-3 text-sm font-medium text-[var(--muted)]">{image.name}</div>
                        <div className="mt-1 text-xs text-[var(--muted)]">
                          {formatSize(image.compressedSize)}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-emerald-200 bg-[var(--card)] p-4 dark:border-emerald-800">
                        <div className="text-lg font-bold text-[var(--foreground)]">
                          {pct > 0 ? `${pct}%` : "0%"}
                        </div>
                        <div className="mt-1 text-sm text-emerald-600">
                          {pct > 0 ? `${t.saved} ${formatSize(savings)}` : t.noSaving}
                        </div>
                        <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                          <p>
                            {image.width} × {image.height}px
                          </p>
                        </div>
                        <div className="mt-5 flex gap-2">
                          <a
                            href={image.compressedUrl}
                            download={image.name.replace(/(\.[^.]+)$/, "_compressed$1")}
                            className="flex-1 rounded-xl bg-blue-500 px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-600"
                          >
                            {t.download}
                          </a>
                          <button
                            type="button"
                            onClick={() =>
                              setImages((current) => current.filter((item) => item.id !== image.id))
                            }
                            className="rounded-xl border border-[var(--card-border)] px-3 py-2 text-sm font-semibold text-[var(--muted)] transition hover:bg-[var(--muted-bg)]"
                          >
                            {t.delete}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <EmptyToolState
              icon="🖼️"
              title={t.emptyTitle}
              description={t.emptyDescription}
            />
          )}
        </ToolPanel>

        <ToolFaqSection
          title={t.faqTitle}
          description={t.faqDescription}
          items={t.faqs}
        />

        <RelatedToolsSection
          title={t.relatedTitle}
          description={t.relatedDescription}
          actionLabel={t.relatedAction}
          items={relatedItems}
        />
      </div>
    </ToolPageShell>
  );
}
