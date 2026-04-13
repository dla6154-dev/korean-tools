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

type IndentSize = 2 | 4;

const T = {
  ko: {
    breadcrumbs: ["전체 도구", "텍스트", "JSON 포매터"],
    title: "JSON 포매터",
    description:
      "JSON을 예쁘게 정렬하거나 압축하고, 파싱 오류를 빠르게 확인할 수 있습니다.",
    badges: [
      { label: "텍스트", tone: "green" as const },
      { label: "개발 도구", tone: "blue" as const },
      { label: "문법 검사", tone: "amber" as const },
    ],
    inputTitle: "JSON 입력",
    inputDescription: "원본 JSON을 붙여넣고 포매팅 방식을 선택하세요.",
    outputTitle: "포매팅 결과",
    outputDescription: "유효한 JSON이면 정리된 결과를 바로 복사할 수 있습니다.",
    placeholder: '{\n  "name": "Korean Tools",\n  "type": "utility"\n}',
    indentLabel: "들여쓰기",
    sortLabel: "객체 키 정렬",
    format: "들여쓰기 적용",
    minify: "압축하기",
    copy: "복사",
    clear: "지우기",
    valid: "유효한 JSON",
    invalid: "JSON 오류",
    emptyTitle: "JSON을 붙여넣어보세요",
    emptyDescription: "포매팅 결과와 오류 메시지가 여기 표시됩니다.",
    relatedTitle: "같이 쓰면 좋은 텍스트 도구",
    relatedDescription: "인코딩이나 Base64 변환이 필요하면 이어서 사용할 수 있습니다.",
    relatedAction: "도구 열기",
  },
  en: {
    breadcrumbs: ["All tools", "Text", "JSON Formatter"],
    title: "JSON Formatter",
    description:
      "Pretty-print or minify JSON and quickly catch parsing errors.",
    badges: [
      { label: "Text", tone: "green" as const },
      { label: "Developer tool", tone: "blue" as const },
      { label: "Validation", tone: "amber" as const },
    ],
    inputTitle: "JSON input",
    inputDescription: "Paste raw JSON and choose how you want to format it.",
    outputTitle: "Formatted result",
    outputDescription: "Copy the cleaned JSON when the input is valid.",
    placeholder: '{\n  "name": "Korean Tools",\n  "type": "utility"\n}',
    indentLabel: "Indentation",
    sortLabel: "Sort object keys",
    format: "Pretty print",
    minify: "Minify",
    copy: "Copy",
    clear: "Clear",
    valid: "Valid JSON",
    invalid: "JSON error",
    emptyTitle: "Paste JSON to begin",
    emptyDescription: "The formatted result or error details will appear here.",
    relatedTitle: "Related text tools",
    relatedDescription: "Continue with encoding and conversion helpers.",
    relatedAction: "Open tool",
  },
};

function sortJsonValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortJsonValue);
  }

  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortJsonValue((value as Record<string, unknown>)[key]);
        return acc;
      }, {});
  }

  return value;
}

export default function JsonFormatterClient() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState<IndentSize>(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const relatedItems = buildRelatedToolItems(lang, [
    "/base64",
    "/url-encoder",
    "/markdown-to-html",
    "/line-break-remover",
  ]);

  function handleFormat(minify = false) {
    try {
      const parsed = JSON.parse(input);
      const normalized = sortKeys ? sortJsonValue(parsed) : parsed;
      setOutput(
        minify
          ? JSON.stringify(normalized)
          : JSON.stringify(normalized, null, indent),
      );
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
      setOutput("");
    }
  }

  return (
    <ToolPageShell
      breadcrumbs={t.breadcrumbs}
      icon="🧾"
      title={t.title}
      description={t.description}
      badges={t.badges}
    >
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <ToolPanel title={t.inputTitle} description={t.inputDescription}>
          <div className="space-y-5">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t.placeholder}
              className="min-h-[280px] w-full rounded-[24px] border border-slate-200 bg-slate-50/70 px-4 py-4 font-mono text-sm leading-6 text-slate-700 outline-none transition focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <span>{t.indentLabel}</span>
                <select
                  value={indent}
                  onChange={(event) => setIndent(Number(event.target.value) as IndentSize)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
                >
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                </select>
              </label>

              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={sortKeys}
                  onChange={(event) => setSortKeys(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-500"
                />
                <span>{t.sortLabel}</span>
              </label>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleFormat(false)}
                className="rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                {t.format}
              </button>
              <button
                type="button"
                onClick={() => handleFormat(true)}
                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                {t.minify}
              </button>
              <button
                type="button"
                onClick={() => {
                  setInput("");
                  setOutput("");
                  setError("");
                }}
                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                {t.clear}
              </button>
            </div>
          </div>
        </ToolPanel>

        <ToolPanel title={t.outputTitle} description={t.outputDescription}>
          {input ? (
            <div className="space-y-4">
              <div
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                  error
                    ? "border-rose-200 bg-rose-50 text-rose-600"
                    : "border-emerald-200 bg-emerald-50 text-emerald-600"
                }`}
              >
                {error ? `${t.invalid}: ${error}` : t.valid}
              </div>

              <textarea
                readOnly
                value={output}
                className="min-h-[280px] w-full rounded-[24px] border border-slate-200 bg-slate-50/70 px-4 py-4 font-mono text-sm leading-6 text-slate-700 outline-none"
              />

              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(output)}
                disabled={!output}
                className="rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {t.copy}
              </button>
            </div>
          ) : (
            <EmptyToolState icon="{}" title={t.emptyTitle} description={t.emptyDescription} />
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
