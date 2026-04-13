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

type Mode = "space" | "compact" | "none";

const T = {
  ko: {
    breadcrumbs: ["전체 도구", "텍스트", "줄바꿈 제거기"],
    title: "줄바꿈 제거기",
    description:
      "메일, 문서, PDF에서 복사한 텍스트의 줄바꿈을 한 번에 정리해 한 줄 문장이나 깔끔한 문단으로 바꿉니다.",
    badges: [
      { label: "텍스트", tone: "green" as const },
      { label: "브라우저 처리", tone: "blue" as const },
      { label: "복붙 정리", tone: "amber" as const },
    ],
    inputTitle: "원본 텍스트",
    inputDescription: "줄바꿈을 정리할 텍스트를 붙여넣으세요.",
    outputTitle: "정리 결과",
    outputDescription: "원하는 방식으로 줄바꿈을 제거한 결과입니다.",
    placeholder:
      "여러 줄로 나뉜 텍스트를 붙여넣으세요.\n예) PDF에서 복사한 문장\n줄이 중간에서\n자주 끊기는 경우",
    modeLabel: "정리 방식",
    modes: {
      space: "줄바꿈을 공백으로",
      compact: "공백까지 깔끔하게",
      none: "줄바꿈 완전 제거",
    },
    removedBreaks: "제거한 줄바꿈",
    originalLines: "원본 줄 수",
    copy: "결과 복사",
    clear: "입력 지우기",
    emptyTitle: "줄바꿈을 정리해보세요",
    emptyDescription: "텍스트를 붙여넣으면 결과가 여기 표시됩니다.",
    relatedTitle: "같이 쓰면 좋은 텍스트 도구",
    relatedDescription: "텍스트 정리와 변환 작업을 연달아 진행할 수 있습니다.",
    relatedAction: "도구 열기",
  },
  en: {
    breadcrumbs: ["All tools", "Text", "Line Break Remover"],
    title: "Line Break Remover",
    description:
      "Clean up copied text from PDFs, emails, and documents by removing unwanted line breaks in one step.",
    badges: [
      { label: "Text", tone: "green" as const },
      { label: "Browser only", tone: "blue" as const },
      { label: "Paste cleanup", tone: "amber" as const },
    ],
    inputTitle: "Input text",
    inputDescription: "Paste the text whose line breaks you want to remove.",
    outputTitle: "Cleaned text",
    outputDescription: "The result after removing line breaks using the selected mode.",
    placeholder:
      "Paste multi-line text here.\nFor example, text copied from a PDF\nthat breaks lines\nin awkward places.",
    modeLabel: "Cleanup mode",
    modes: {
      space: "Replace breaks with spaces",
      compact: "Compact whitespace too",
      none: "Remove breaks completely",
    },
    removedBreaks: "Removed line breaks",
    originalLines: "Original lines",
    copy: "Copy result",
    clear: "Clear",
    emptyTitle: "Remove line breaks",
    emptyDescription: "Paste text to see the cleaned result here.",
    relatedTitle: "Related text tools",
    relatedDescription: "Continue with text cleanup and conversion tools.",
    relatedAction: "Open tool",
  },
};

function transformText(input: string, mode: Mode) {
  switch (mode) {
    case "space":
      return input.replace(/\r?\n+/g, " ");
    case "compact":
      return input.replace(/\s*\r?\n\s*/g, " ").replace(/\s{2,}/g, " ").trim();
    case "none":
      return input.replace(/\r?\n+/g, "");
    default:
      return input;
  }
}

export default function LineBreakRemoverClient() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("compact");
  const output = transformText(input, mode);
  const relatedItems = buildRelatedToolItems(lang, [
    "/characters",
    "/case-converter",
    "/url-encoder",
    "/markdown-to-html",
  ]);
  const originalLines = input === "" ? 0 : input.split(/\r?\n/).length;
  const removedBreaks = input === "" ? 0 : Math.max(originalLines - 1, 0);

  return (
    <ToolPageShell
      breadcrumbs={t.breadcrumbs}
      icon="🧹"
      title={t.title}
      description={t.description}
      badges={t.badges}
    >
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <ToolPanel title={t.inputTitle} description={t.inputDescription}>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-600">{t.modeLabel}</label>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {(Object.keys(t.modes) as Mode[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setMode(value)}
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
            </div>

            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t.placeholder}
              className="min-h-[260px] w-full rounded-[24px] border border-slate-200 bg-slate-50/70 px-4 py-4 text-sm leading-6 text-slate-700 outline-none transition focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-xs font-semibold text-slate-400">{t.originalLines}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{originalLines}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-xs font-semibold text-slate-400">{t.removedBreaks}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{removedBreaks}</p>
              </div>
            </div>
          </div>
        </ToolPanel>

        <ToolPanel title={t.outputTitle} description={t.outputDescription}>
          {input ? (
            <div className="space-y-4">
              <textarea
                readOnly
                value={output}
                className="min-h-[260px] w-full rounded-[24px] border border-emerald-200 bg-emerald-50/60 px-4 py-4 text-sm leading-6 text-slate-700 outline-none"
              />
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(output)}
                  className="rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                >
                  {t.copy}
                </button>
                <button
                  type="button"
                  onClick={() => setInput("")}
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  {t.clear}
                </button>
              </div>
            </div>
          ) : (
            <EmptyToolState icon="📝" title={t.emptyTitle} description={t.emptyDescription} />
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
