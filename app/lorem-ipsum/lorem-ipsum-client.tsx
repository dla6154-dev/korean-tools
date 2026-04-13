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

type IpsumLang = "ko" | "latin";

const T = {
  ko: {
    breadcrumbs: ["전체 도구", "텍스트", "Lorem Ipsum 생성기"],
    title: "Lorem Ipsum 생성기",
    description:
      "디자인 시안과 UI 테스트에 쓸 더미 문단을 영문 또는 한국어 스타일로 빠르게 생성합니다.",
    badges: [
      { label: "텍스트", tone: "green" as const },
      { label: "더미 문장", tone: "blue" as const },
      { label: "한국어 지원", tone: "amber" as const },
    ],
    inputTitle: "생성 옵션",
    inputDescription: "언어와 문단 수를 고르면 바로 더미 텍스트를 만들 수 있습니다.",
    outputTitle: "생성 결과",
    outputDescription: "시안용 텍스트를 복사해서 바로 사용할 수 있습니다.",
    languageLabel: "언어",
    languages: { ko: "한국어", latin: "Lorem Ipsum" },
    paragraphLabel: "문단 수",
    sentenceLabel: "문단당 문장 수",
    generate: "새로 생성",
    copy: "복사",
    emptyTitle: "더미 텍스트를 만들어보세요",
    emptyDescription: "옵션을 정하고 생성 버튼을 누르면 결과가 여기 표시됩니다.",
    relatedTitle: "같이 쓰면 좋은 텍스트 도구",
    relatedDescription: "마크다운 변환이나 줄바꿈 정리와 함께 쓰기 좋습니다.",
    relatedAction: "도구 열기",
  },
  en: {
    breadcrumbs: ["All tools", "Text", "Lorem Ipsum Generator"],
    title: "Lorem Ipsum Generator",
    description:
      "Generate filler paragraphs in classic Latin or Korean-style dummy copy for mockups and UI tests.",
    badges: [
      { label: "Text", tone: "green" as const },
      { label: "Dummy copy", tone: "blue" as const },
      { label: "Korean ready", tone: "amber" as const },
    ],
    inputTitle: "Generation options",
    inputDescription: "Choose a language and paragraph count to create filler text.",
    outputTitle: "Generated text",
    outputDescription: "Copy the generated paragraphs into your mockups right away.",
    languageLabel: "Language",
    languages: { ko: "Korean style", latin: "Lorem Ipsum" },
    paragraphLabel: "Paragraphs",
    sentenceLabel: "Sentences per paragraph",
    generate: "Generate again",
    copy: "Copy",
    emptyTitle: "Generate filler text",
    emptyDescription: "Pick options and generate text to see the result here.",
    relatedTitle: "Related text tools",
    relatedDescription: "Useful together with markdown and cleanup tools.",
    relatedAction: "Open tool",
  },
};

const KOREAN_SENTENCES = [
  "이 문장은 화면 배치와 간격을 점검하기 위한 예시 문장입니다.",
  "서비스 소개 영역에서 실제 문구 대신 자연스러운 흐름을 확인할 수 있습니다.",
  "버튼 주변의 여백과 카드 높이를 맞추는 데 활용하기 좋습니다.",
  "모바일 화면에서도 줄 수와 문단 길이가 적절한지 테스트할 수 있습니다.",
  "랜딩 페이지나 상세 페이지 초안을 빠르게 채우는 용도로 자주 사용됩니다.",
  "콘텐츠가 길어질 때 레이아웃이 어떻게 반응하는지 확인할 때 유용합니다.",
  "디자이너와 개발자가 동일한 기준으로 시안을 검토할 수 있도록 돕습니다.",
];

const LATIN_SENTENCES = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Integer posuere erat a ante venenatis dapibus posuere velit aliquet.",
  "Donec ullamcorper nulla non metus auctor fringilla.",
];

function buildParagraphs(source: string[], paragraphs: number, sentencesPerParagraph: number) {
  const blocks: string[] = [];
  let cursor = 0;

  for (let i = 0; i < paragraphs; i += 1) {
    const sentences: string[] = [];
    for (let j = 0; j < sentencesPerParagraph; j += 1) {
      sentences.push(source[cursor % source.length]);
      cursor += 1;
    }
    blocks.push(sentences.join(" "));
  }

  return blocks;
}

export default function LoremIpsumClient() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [ipsumLang, setIpsumLang] = useState<IpsumLang>("ko");
  const [paragraphs, setParagraphs] = useState(3);
  const [sentencesPerParagraph, setSentencesPerParagraph] = useState(4);
  const [generated, setGenerated] = useState<string[]>([]);
  const relatedItems = buildRelatedToolItems(lang, [
    "/markdown-to-html",
    "/line-break-remover",
    "/characters",
    "/case-converter",
  ]);

  function generate() {
    const source = ipsumLang === "ko" ? KOREAN_SENTENCES : LATIN_SENTENCES;
    setGenerated(buildParagraphs(source, paragraphs, sentencesPerParagraph));
  }

  return (
    <ToolPageShell
      breadcrumbs={t.breadcrumbs}
      icon="📄"
      title={t.title}
      description={t.description}
      badges={t.badges}
    >
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <ToolPanel title={t.inputTitle} description={t.inputDescription}>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-600">{t.languageLabel}</label>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {(Object.keys(t.languages) as IpsumLang[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setIpsumLang(value)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      ipsumLang === value
                        ? "border-blue-200 bg-blue-50 text-blue-600"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {t.languages[value]}
                  </button>
                ))}
              </div>
            </div>

            <label className="block text-sm text-slate-600">
              <span className="font-medium">{t.paragraphLabel}</span>
              <input
                type="range"
                min={1}
                max={8}
                value={paragraphs}
                onChange={(event) => setParagraphs(Number(event.target.value))}
                className="mt-3 w-full accent-blue-500"
              />
              <span className="mt-2 block text-sm font-semibold text-slate-900">{paragraphs}</span>
            </label>

            <label className="block text-sm text-slate-600">
              <span className="font-medium">{t.sentenceLabel}</span>
              <input
                type="range"
                min={2}
                max={8}
                value={sentencesPerParagraph}
                onChange={(event) => setSentencesPerParagraph(Number(event.target.value))}
                className="mt-3 w-full accent-blue-500"
              />
              <span className="mt-2 block text-sm font-semibold text-slate-900">
                {sentencesPerParagraph}
              </span>
            </label>

            <button
              type="button"
              onClick={generate}
              className="rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              {t.generate}
            </button>
          </div>
        </ToolPanel>

        <ToolPanel title={t.outputTitle} description={t.outputDescription}>
          {generated.length > 0 ? (
            <div className="space-y-4">
              <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/50 px-5 py-5 text-sm leading-7 text-slate-700">
                {generated.map((paragraph, index) => (
                  <p key={`${paragraph}-${index}`} className={index === 0 ? "" : "mt-4"}>
                    {paragraph}
                  </p>
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(generated.join("\n\n"))}
                className="rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                {t.copy}
              </button>
            </div>
          ) : (
            <EmptyToolState icon="✍️" title={t.emptyTitle} description={t.emptyDescription} />
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
