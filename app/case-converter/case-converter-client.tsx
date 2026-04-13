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

const T = {
  ko: {
    breadcrumbs: ["전체 도구", "텍스트", "대소문자 변환기"],
    title: "대소문자 변환기",
    description:
      "영문 문장을 UPPERCASE, lowercase, Title Case, Sentence case로 빠르게 변환합니다.",
    badges: [
      { label: "텍스트", tone: "green" as const },
      { label: "영문 변환", tone: "blue" as const },
      { label: "실시간 처리", tone: "amber" as const },
    ],
    inputTitle: "원본 텍스트",
    inputDescription: "영문 텍스트를 입력하면 여러 형식으로 즉시 변환됩니다.",
    placeholder: "변환할 영문 텍스트를 입력하세요.",
    outputTitle: "변환 결과",
    outputDescription: "원하는 형식을 골라 바로 복사할 수 있습니다.",
    copy: "복사",
    clear: "지우기",
    emptyTitle: "텍스트를 입력해보세요",
    emptyDescription: "입력한 문장이 여러 대소문자 형식으로 정리됩니다.",
    relatedTitle: "같이 쓰면 좋은 텍스트 도구",
    relatedDescription: "텍스트 정리와 인코딩 작업까지 이어서 할 수 있습니다.",
    relatedAction: "도구 열기",
    outputs: {
      upper: "모두 대문자",
      lower: "모두 소문자",
      title: "단어 첫 글자 대문자",
      sentence: "문장 첫 글자 대문자",
    },
  },
  en: {
    breadcrumbs: ["All tools", "Text", "Case Converter"],
    title: "Case Converter",
    description:
      "Convert English text into uppercase, lowercase, Title Case, and Sentence case instantly.",
    badges: [
      { label: "Text", tone: "green" as const },
      { label: "English cases", tone: "blue" as const },
      { label: "Instant", tone: "amber" as const },
    ],
    inputTitle: "Input text",
    inputDescription: "Type English text to convert it into several case styles.",
    placeholder: "Enter English text to convert.",
    outputTitle: "Converted results",
    outputDescription: "Copy the format you need right away.",
    copy: "Copy",
    clear: "Clear",
    emptyTitle: "Enter some text",
    emptyDescription: "Your text will be converted into multiple case styles here.",
    relatedTitle: "Related text tools",
    relatedDescription: "Continue with cleanup, encoding, and formatting tools.",
    relatedAction: "Open tool",
    outputs: {
      upper: "UPPERCASE",
      lower: "lowercase",
      title: "Title Case",
      sentence: "Sentence case",
    },
  },
};

function toTitleCase(input: string) {
  return input.replace(/\w\S*/g, (word) => word[0].toUpperCase() + word.slice(1).toLowerCase());
}

function toSentenceCase(input: string) {
  return input
    .toLowerCase()
    .replace(/(^\s*[a-z]|[.!?]\s+[a-z])/g, (match) => match.toUpperCase());
}

export default function CaseConverterClient() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [input, setInput] = useState("");
  const relatedItems = buildRelatedToolItems(lang, [
    "/line-break-remover",
    "/characters",
    "/url-encoder",
    "/base64",
  ]);

  const outputs = [
    { key: "upper", label: t.outputs.upper, value: input.toUpperCase() },
    { key: "lower", label: t.outputs.lower, value: input.toLowerCase() },
    { key: "title", label: t.outputs.title, value: toTitleCase(input) },
    { key: "sentence", label: t.outputs.sentence, value: toSentenceCase(input) },
  ];

  return (
    <ToolPageShell
      breadcrumbs={t.breadcrumbs}
      icon="🔤"
      title={t.title}
      description={t.description}
      badges={t.badges}
    >
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
        <ToolPanel title={t.inputTitle} description={t.inputDescription}>
          <div className="space-y-4">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t.placeholder}
              className="min-h-[280px] w-full rounded-[24px] border border-slate-200 bg-slate-50/70 px-4 py-4 text-sm leading-6 text-slate-700 outline-none transition focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={() => setInput("")}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              {t.clear}
            </button>
          </div>
        </ToolPanel>

        <ToolPanel title={t.outputTitle} description={t.outputDescription}>
          {input ? (
            <div className="grid gap-4 md:grid-cols-2">
              {outputs.map((item) => (
                <div
                  key={item.key}
                  className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard?.writeText(item.value)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50"
                    >
                      {t.copy}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={item.value}
                    className="mt-3 min-h-[150px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-700 outline-none"
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyToolState icon="🔡" title={t.emptyTitle} description={t.emptyDescription} />
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
