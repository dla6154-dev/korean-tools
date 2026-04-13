"use client";

import { useState } from "react";
import {
  EmptyToolState,
  RelatedToolsSection,
  ToolPageShell,
  ToolPanel,
} from "../components/tool-page-shell";
import { useLanguage } from "../language-context";
import { buildRelatedToolItems } from "../text-tool-utils";

type Mode = "encode" | "decode";

const T = {
  ko: {
    breadcrumbs: ["전체 도구", "텍스트", "Base64 인코더/디코더"],
    title: "Base64 인코더/디코더",
    description:
      "한글 텍스트도 안전하게 Base64로 변환하고, 다시 원문으로 복원할 수 있습니다.",
    badges: [
      { label: "텍스트", tone: "green" as const },
      { label: "인코딩", tone: "blue" as const },
      { label: "한글 지원", tone: "amber" as const },
    ],
    inputTitle: "입력값",
    inputDescription: "인코딩하거나 디코딩할 텍스트를 입력하세요.",
    outputTitle: "변환 결과",
    outputDescription: "모드에 따라 Base64 또는 원문 결과가 표시됩니다.",
    modes: {
      encode: "텍스트 → Base64",
      decode: "Base64 → 텍스트",
    },
    placeholder: {
      encode: "인코딩할 텍스트를 입력하세요.",
      decode: "디코딩할 Base64 문자열을 입력하세요.",
    },
    copy: "복사",
    clear: "지우기",
    emptyTitle: "텍스트를 입력해보세요",
    emptyDescription: "인코딩 또는 디코딩 결과가 여기 표시됩니다.",
    error: "디코딩에 실패했습니다. Base64 문자열인지 확인하세요.",
    relatedTitle: "같이 쓰면 좋은 텍스트 도구",
    relatedDescription: "URL 인코딩이나 JSON 포매팅이 필요하면 이어서 사용할 수 있습니다.",
    relatedAction: "도구 열기",
  },
  en: {
    breadcrumbs: ["All tools", "Text", "Base64 Encoder / Decoder"],
    title: "Base64 Encoder / Decoder",
    description:
      "Encode text into Base64 or decode Base64 strings back into readable text, including Unicode.",
    badges: [
      { label: "Text", tone: "green" as const },
      { label: "Encoding", tone: "blue" as const },
      { label: "Unicode safe", tone: "amber" as const },
    ],
    inputTitle: "Input",
    inputDescription: "Enter text to encode or a Base64 string to decode.",
    outputTitle: "Result",
    outputDescription: "The converted Base64 or decoded text appears here.",
    modes: {
      encode: "Text → Base64",
      decode: "Base64 → Text",
    },
    placeholder: {
      encode: "Enter text to encode.",
      decode: "Enter a Base64 string to decode.",
    },
    copy: "Copy",
    clear: "Clear",
    emptyTitle: "Enter some text",
    emptyDescription: "The encoded or decoded result will appear here.",
    error: "Failed to decode. Please check whether the string is valid Base64.",
    relatedTitle: "Related text tools",
    relatedDescription: "Continue with URL encoding and JSON formatting tools.",
    relatedAction: "Open tool",
  },
};

function encodeBase64(input: string) {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decodeBase64(input: string) {
  const binary = atob(input);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export default function Base64Client() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const relatedItems = buildRelatedToolItems(lang, [
    "/url-encoder",
    "/json-formatter",
    "/characters",
    "/line-break-remover",
  ]);

  let output = "";
  let error = "";
  if (input) {
    try {
      output = mode === "encode" ? encodeBase64(input) : decodeBase64(input.trim());
    } catch {
      error = t.error;
    }
  }

  return (
    <ToolPageShell
      breadcrumbs={t.breadcrumbs}
      icon="🔐"
      title={t.title}
      description={t.description}
      badges={t.badges}
    >
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <ToolPanel title={t.inputTitle} description={t.inputDescription}>
          <div className="space-y-5">
            <div className="grid gap-2 sm:grid-cols-2">
              {(Object.keys(t.modes) as Mode[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setMode(value);
                    setInput("");
                  }}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    mode === value
                      ? "border-blue-200 bg-blue-50 text-blue-600"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {t.modes[value]}
                </button>
              ))}
            </div>

            <textarea
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
              }}
              placeholder={t.placeholder[mode]}
              className="min-h-[280px] w-full rounded-[24px] border border-slate-200 bg-slate-50/70 px-4 py-4 font-mono text-sm leading-6 text-slate-700 outline-none transition focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="button"
              onClick={() => {
                setInput("");
              }}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              {t.clear}
            </button>
          </div>
        </ToolPanel>

        <ToolPanel title={t.outputTitle} description={t.outputDescription}>
          {input ? (
            <div className="space-y-4">
              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
                  {error}
                </div>
              ) : null}

              <textarea
                readOnly
                value={error ? "" : output}
                className="min-h-[280px] w-full rounded-[24px] border border-slate-200 bg-slate-50/70 px-4 py-4 font-mono text-sm leading-6 text-slate-700 outline-none"
              />

              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(output)}
                disabled={Boolean(error) || !output}
                className="rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {t.copy}
              </button>
            </div>
          ) : (
            <EmptyToolState icon="🔤" title={t.emptyTitle} description={t.emptyDescription} />
          )}
        </ToolPanel>
      </div>

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
