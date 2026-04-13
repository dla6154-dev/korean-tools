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
    breadcrumbs: ["전체 도구", "텍스트", "URL 인코더/디코더"],
    title: "URL 인코더/디코더",
    description:
      "한글 URL 파라미터, 쿼리 문자열, 외부 링크 조각을 안전하게 인코딩하거나 디코딩합니다.",
    badges: [
      { label: "텍스트", tone: "green" as const },
      { label: "URL 처리", tone: "blue" as const },
      { label: "한글 지원", tone: "amber" as const },
    ],
    inputTitle: "입력값",
    inputDescription: "인코딩하거나 디코딩할 문자열을 넣으세요.",
    outputTitle: "변환 결과",
    outputDescription: "encodeURIComponent 기준 결과입니다.",
    modes: {
      encode: "문자열 → URL 인코딩",
      decode: "URL 인코딩 → 문자열",
    },
    placeholder: {
      encode: "예) 만 나이 계산기?이름=홍길동",
      decode: "예) %EB%A7%8C%20%EB%82%98%EC%9D%B4",
    },
    error: "디코딩에 실패했습니다. 올바른 URL 인코딩 문자열인지 확인하세요.",
    copy: "복사",
    clear: "지우기",
    emptyTitle: "문자열을 입력해보세요",
    emptyDescription: "URL 인코딩 또는 디코딩 결과가 여기 표시됩니다.",
    relatedTitle: "같이 쓰면 좋은 텍스트 도구",
    relatedDescription: "Base64, JSON, 줄바꿈 정리 도구와 이어서 사용할 수 있습니다.",
    relatedAction: "도구 열기",
  },
  en: {
    breadcrumbs: ["All tools", "Text", "URL Encoder / Decoder"],
    title: "URL Encoder / Decoder",
    description:
      "Safely encode or decode Korean URLs, query strings, and link fragments.",
    badges: [
      { label: "Text", tone: "green" as const },
      { label: "URL", tone: "blue" as const },
      { label: "Unicode safe", tone: "amber" as const },
    ],
    inputTitle: "Input",
    inputDescription: "Enter the string you want to encode or decode.",
    outputTitle: "Result",
    outputDescription: "The output follows encodeURIComponent behavior.",
    modes: {
      encode: "String → URL encoded",
      decode: "URL encoded → String",
    },
    placeholder: {
      encode: "e.g. Korean name or query parameter",
      decode: "e.g. %EB%A7%8C%20%EB%82%98%EC%9D%B4",
    },
    error: "Failed to decode. Please check whether the string is valid URL encoding.",
    copy: "Copy",
    clear: "Clear",
    emptyTitle: "Enter a string",
    emptyDescription: "The encoded or decoded result will appear here.",
    relatedTitle: "Related text tools",
    relatedDescription: "Continue with Base64, JSON, and cleanup utilities.",
    relatedAction: "Open tool",
  },
};

export default function UrlEncoderClient() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const relatedItems = buildRelatedToolItems(lang, [
    "/base64",
    "/json-formatter",
    "/line-break-remover",
    "/characters",
  ]);

  let output = "";
  let error = "";
  if (input) {
    try {
      output = mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input);
    } catch {
      error = t.error;
    }
  }

  return (
    <ToolPageShell
      breadcrumbs={t.breadcrumbs}
      icon="🔗"
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
            <EmptyToolState icon="🌐" title={t.emptyTitle} description={t.emptyDescription} />
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
