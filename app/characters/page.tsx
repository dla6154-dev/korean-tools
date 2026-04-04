"use client";

import { useState } from "react";
import { useLanguage } from "../language-context";

const T = {
  ko: {
    title: "글자수 세기",
    sub: "자기소개서, 이력서, SNS 글자 수를 바로 확인하세요",
    inputLabel: "텍스트 입력",
    copy: "복사", clear: "지우기",
    placeholder: "여기에 텍스트를 입력하거나 붙여넣으세요...",
    totalChars: "전체 글자수 (공백 포함)",
    noSpaceChars: "글자수 (공백 제외)",
    words: "단어수", bytes: "바이트 (UTF-8)", sentences: "문장수", lines: "줄수",
    limitsTitle: "자주 쓰는 글자수 기준",
    over: " (초과)",
    limits: [
      { label: "트위터 / X", limit: 280 },
      { label: "인스타그램 캡션", limit: 2200 },
      { label: "카카오톡 상태메시지", limit: 60 },
      { label: "공기업 자기소개서 (항목당)", limit: 500 },
      { label: "대기업 자기소개서 (항목당)", limit: 1000 },
    ],
    charUnit: "자",
  },
  en: {
    title: "Character Counter",
    sub: "Count characters for résumés, cover letters, and social media posts",
    inputLabel: "Enter text",
    copy: "Copy", clear: "Clear",
    placeholder: "Type or paste your text here...",
    totalChars: "Total Characters (with spaces)",
    noSpaceChars: "Characters (no spaces)",
    words: "Words", bytes: "Bytes (UTF-8)", sentences: "Sentences", lines: "Lines",
    limitsTitle: "Common character limits",
    over: " (over)",
    limits: [
      { label: "Twitter / X", limit: 280 },
      { label: "Instagram caption", limit: 2200 },
      { label: "KakaoTalk status", limit: 60 },
      { label: "Cover letter (per section)", limit: 500 },
      { label: "Cover letter (per section)", limit: 1000 },
    ],
    charUnit: " chars",
  },
};

export default function CharactersPage() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [text, setText] = useState("");

  const totalChars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const bytes = new TextEncoder().encode(text).length;
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const sentences = text.trim() === "" ? 0 : text.split(/[.!?。]+/).filter((s) => s.trim().length > 0).length;
  const lines = text === "" ? 0 : text.split("\n").length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-slate-800">{t.title}</h1>
        <p className="text-slate-500 text-sm mt-1">{t.sub}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-600">{t.inputLabel}</label>
          <div className="flex gap-2">
            <button onClick={() => navigator.clipboard.writeText(text)} disabled={!text} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors">{t.copy}</button>
            <button onClick={() => setText("")} disabled={!text} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors">{t.clear}</button>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.placeholder}
          className="w-full h-52 border border-slate-200 rounded-xl px-4 py-3 text-base resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-slate-300"
        />
        <div className="text-right text-xs text-slate-400 mt-1">
          {totalChars.toLocaleString()}{t.charUnit}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-500 rounded-2xl p-5 text-white text-center">
          <div className="text-4xl font-bold">{totalChars.toLocaleString()}</div>
          <div className="text-blue-100 text-sm mt-1">{t.totalChars}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 text-center">
          <div className="text-4xl font-bold text-slate-700">{charsNoSpace.toLocaleString()}</div>
          <div className="text-slate-400 text-sm mt-1">{t.noSpaceChars}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { value: words, label: t.words },
          { value: bytes, label: t.bytes },
          { value: sentences, label: t.sentences },
          { value: lines, label: t.lines },
        ].map(({ value, label }) => (
          <div key={label} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 text-center">
            <div className="text-2xl font-bold text-slate-700">{value.toLocaleString()}</div>
            <div className="text-xs text-slate-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 rounded-2xl p-5">
        <p className="text-xs font-semibold text-slate-400 mb-3">{t.limitsTitle}</p>
        <div className="space-y-2">
          {t.limits.map(({ label, limit }) => {
            const over = totalChars > limit;
            const pct = Math.min((totalChars / limit) * 100, 100);
            return (
              <div key={label + limit}>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>{label}</span>
                  <span className={over ? "text-red-500 font-semibold" : "text-slate-400"}>
                    {totalChars.toLocaleString()} / {limit.toLocaleString()}{over && t.over}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${over ? "bg-red-400" : "bg-blue-400"}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
