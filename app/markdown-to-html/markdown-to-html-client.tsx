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
    breadcrumbs: ["전체 도구", "텍스트", "마크다운 → HTML"],
    title: "마크다운 → HTML",
    description:
      "제목, 목록, 링크, 코드 블록 등 기본 마크다운 문법을 HTML로 변환하고 실시간 미리보기로 확인할 수 있습니다.",
    badges: [
      { label: "텍스트", tone: "green" as const },
      { label: "실시간 미리보기", tone: "blue" as const },
      { label: "기본 문법 지원", tone: "amber" as const },
    ],
    inputTitle: "마크다운 입력",
    inputDescription: "왼쪽에 마크다운을 작성하면 HTML과 미리보기가 동시에 갱신됩니다.",
    outputTitle: "HTML 결과와 미리보기",
    outputDescription: "생성된 HTML 코드를 복사하거나 렌더링된 결과를 확인하세요.",
    placeholder:
      "# 제목\n\n- 목록 항목 1\n- 목록 항목 2\n\n**굵게**와 `코드`\n\n[링크](https://rate-snap.com)",
    copy: "HTML 복사",
    clear: "지우기",
    htmlLabel: "생성된 HTML",
    previewLabel: "실시간 미리보기",
    emptyTitle: "마크다운을 입력해보세요",
    emptyDescription: "HTML 코드와 미리보기가 여기 표시됩니다.",
    relatedTitle: "같이 쓰면 좋은 텍스트 도구",
    relatedDescription: "줄바꿈 정리나 대소문자 변환과 이어서 작업할 수 있습니다.",
    relatedAction: "도구 열기",
  },
  en: {
    breadcrumbs: ["All tools", "Text", "Markdown → HTML"],
    title: "Markdown → HTML",
    description:
      "Convert basic markdown syntax into HTML and preview the rendered result in real time.",
    badges: [
      { label: "Text", tone: "green" as const },
      { label: "Live preview", tone: "blue" as const },
      { label: "Basic markdown", tone: "amber" as const },
    ],
    inputTitle: "Markdown input",
    inputDescription: "Write markdown on the left to update HTML and preview instantly.",
    outputTitle: "HTML and preview",
    outputDescription: "Copy the generated HTML or inspect the rendered result.",
    placeholder:
      "# Heading\n\n- Item 1\n- Item 2\n\n**Bold** and `code`\n\n[Link](https://rate-snap.com)",
    copy: "Copy HTML",
    clear: "Clear",
    htmlLabel: "Generated HTML",
    previewLabel: "Live preview",
    emptyTitle: "Enter markdown",
    emptyDescription: "The HTML output and rendered preview will appear here.",
    relatedTitle: "Related text tools",
    relatedDescription: "Continue with cleanup and case conversion tools.",
    relatedAction: "Open tool",
  },
};

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function applyInlineMarkdown(input: string) {
  return input
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

function markdownToHtml(input: string) {
  const escaped = escapeHtml(input);
  const lines = escaped.split(/\r?\n/);
  const html: string[] = [];
  let inList = false;
  let inCodeBlock = false;

  lines.forEach((line) => {
    if (line.trim().startsWith("```")) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }

      html.push(inCodeBlock ? "</code></pre>" : "<pre><code>");
      inCodeBlock = !inCodeBlock;
      return;
    }

    if (inCodeBlock) {
      html.push(line);
      return;
    }

    const trimmed = line.trim();
    if (trimmed === "") {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      return;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }

      html.push(`<li>${applyInlineMarkdown(trimmed.replace(/^[-*]\s+/, ""))}</li>`);
      return;
    }

    if (inList) {
      html.push("</ul>");
      inList = false;
    }

    if (/^###\s+/.test(trimmed)) {
      html.push(`<h3>${applyInlineMarkdown(trimmed.replace(/^###\s+/, ""))}</h3>`);
      return;
    }

    if (/^##\s+/.test(trimmed)) {
      html.push(`<h2>${applyInlineMarkdown(trimmed.replace(/^##\s+/, ""))}</h2>`);
      return;
    }

    if (/^#\s+/.test(trimmed)) {
      html.push(`<h1>${applyInlineMarkdown(trimmed.replace(/^#\s+/, ""))}</h1>`);
      return;
    }

    if (/^>\s+/.test(trimmed)) {
      html.push(`<blockquote>${applyInlineMarkdown(trimmed.replace(/^>\s+/, ""))}</blockquote>`);
      return;
    }

    html.push(`<p>${applyInlineMarkdown(trimmed)}</p>`);
  });

  if (inList) html.push("</ul>");
  if (inCodeBlock) html.push("</code></pre>");

  return html.join("\n");
}

export default function MarkdownToHtmlClient() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [input, setInput] = useState("");
  const html = markdownToHtml(input);
  const relatedItems = buildRelatedToolItems(lang, [
    "/line-break-remover",
    "/case-converter",
    "/json-formatter",
    "/characters",
  ]);

  return (
    <ToolPageShell
      breadcrumbs={t.breadcrumbs}
      icon="🧩"
      title={t.title}
      description={t.description}
      badges={t.badges}
    >
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <ToolPanel title={t.inputTitle} description={t.inputDescription}>
          <div className="space-y-4">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t.placeholder}
              className="min-h-[380px] w-full rounded-[24px] border border-slate-200 bg-slate-50/70 px-4 py-4 font-mono text-sm leading-6 text-slate-700 outline-none transition focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-100"
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
            <div className="space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-700">{t.htmlLabel}</p>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(html)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50"
                  >
                    {t.copy}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={html}
                  className="min-h-[170px] w-full rounded-[24px] border border-slate-200 bg-slate-50/70 px-4 py-4 font-mono text-sm leading-6 text-slate-700 outline-none"
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">{t.previewLabel}</p>
                <div
                  className="max-w-none rounded-[24px] border border-emerald-200 bg-emerald-50/50 px-5 py-5 text-sm leading-7 text-slate-700"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
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
