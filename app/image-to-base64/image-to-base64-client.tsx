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
import { formatBytes, loadImageFile } from "../image-tool-utils";
import { buildRelatedToolItems } from "../text-tool-utils";

type ConvertedImage = {
  name: string;
  size: number;
  width: number;
  height: number;
  dataUrl: string;
  base64: string;
};

const T = {
  ko: {
    breadcrumbs: ["전체 도구", "이미지", "이미지 → Base64"],
    title: "이미지 → Base64",
    description:
      "이미지 파일을 Data URL과 순수 Base64 문자열로 변환합니다. 코드 삽입, 테스트 데이터, 임베드 작업에 바로 사용할 수 있습니다.",
    badges: [
      { label: "이미지", tone: "amber" as const },
      { label: "코드 변환", tone: "blue" as const },
      { label: "브라우저 처리", tone: "green" as const },
    ],
    inputTitle: "이미지 선택",
    inputDescription: "PNG, JPG, WebP 이미지를 하나 올려 Base64로 변환합니다.",
    outputTitle: "변환 결과",
    outputDescription: "Data URL과 순수 Base64 텍스트를 각각 복사할 수 있습니다.",
    select: "이미지 업로드",
    clear: "초기화",
    copy: "복사",
    copied: "복사됨",
    imageInfo: "이미지 정보",
    dataUrl: "Data URL",
    rawBase64: "순수 Base64",
    emptyTitle: "아직 변환된 이미지가 없습니다",
    emptyDescription: "이미지를 업로드하면 코드에 넣을 수 있는 문자열을 바로 만들어 줍니다.",
    relatedTitle: "같이 쓰기 좋은 도구",
    relatedDescription: "텍스트 Base64 디코드, URL 인코딩, WebP 변환 같은 작업으로 이어질 수 있습니다.",
    relatedAction: "도구 열기",
  },
  en: {
    breadcrumbs: ["All tools", "Image", "Image to Base64"],
    title: "Image to Base64",
    description:
      "Convert an image file into a Data URL and raw Base64 string for embeds, quick tests, or code snippets.",
    badges: [
      { label: "Image", tone: "amber" as const },
      { label: "Code conversion", tone: "blue" as const },
      { label: "Browser only", tone: "green" as const },
    ],
    inputTitle: "Select an image",
    inputDescription: "Upload one PNG, JPG, or WebP image and convert it into Base64.",
    outputTitle: "Base64 output",
    outputDescription: "Copy the Data URL or the raw Base64 string.",
    select: "Upload image",
    clear: "Reset",
    copy: "Copy",
    copied: "Copied",
    imageInfo: "Image info",
    dataUrl: "Data URL",
    rawBase64: "Raw Base64",
    emptyTitle: "No image converted yet",
    emptyDescription: "Upload an image to generate a string you can paste into code.",
    relatedTitle: "Related tools",
    relatedDescription: "Continue with text Base64 decoding, URL encoding, or image conversion.",
    relatedAction: "Open tool",
  },
};

export default function ImageToBase64Client() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [copiedKey, setCopiedKey] = useState("");
  const [item, setItem] = useState<ConvertedImage | null>(null);
  const relatedItems = buildRelatedToolItems(lang, [
    "/base64",
    "/url-encoder",
    "/image-to-webp",
    "/markdown-to-html",
  ]);

  async function handleFile(file: File | null) {
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    const source = await loadImageFile(file);

    setItem({
      name: file.name,
      size: file.size,
      width: source.width,
      height: source.height,
      dataUrl: source.dataUrl,
      base64: source.dataUrl.split(",")[1] ?? "",
    });
    setCopiedKey("");
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
      icon="🧬"
      title={t.title}
      description={t.description}
      badges={t.badges}
    >
      <div className="mt-6 space-y-6">
        <ToolPanel title={t.inputTitle} description={t.inputDescription}>
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
        </ToolPanel>

        <ToolPanel title={t.outputTitle} description={t.outputDescription}>
          {item ? (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <NextImage
                  src={item.dataUrl}
                  alt={item.name}
                  width={item.width}
                  height={item.height}
                  unoptimized
                  className="h-auto w-full rounded-2xl object-cover"
                />
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                  <p className="text-xs font-semibold text-slate-400">{t.imageInfo}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{item.name}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.width} × {item.height}px · {formatBytes(item.size)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">{t.dataUrl}</p>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.dataUrl, "data-url")}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      {copiedKey === "data-url" ? t.copied : t.copy}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={item.dataUrl}
                    className="mt-3 min-h-[140px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-mono text-xs leading-6 text-slate-700 outline-none"
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">{t.rawBase64}</p>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.base64, "raw-base64")}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      {copiedKey === "raw-base64" ? t.copied : t.copy}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={item.base64}
                    className="mt-3 min-h-[180px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-mono text-xs leading-6 text-slate-700 outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setItem(null);
                    setCopiedKey("");
                  }}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  {t.clear}
                </button>
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
