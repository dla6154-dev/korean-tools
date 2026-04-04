"use client";

import { useState } from "react";
import { useLanguage } from "../language-context";

const CHOSUNG = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];

const T = {
  ko: {
    title: "초성 추출기",
    sub: "한글 텍스트에서 초성만 뽑아드려요",
    inputLabel: "텍스트 입력",
    placeholder: "예) 안녕하세요 반갑습니다",
    withLabel: "초성 포함 변환 결과",
    onlyLabel: "초성만 추출",
    copy: "복사",
    distLabel: "초성 분포",
    countUnit: "개",
    empty: "텍스트를 입력하면 초성이 추출됩니다",
  },
  en: {
    title: "Korean Initial Consonant Extractor",
    sub: "Extract the initial consonants (초성) from Korean text",
    inputLabel: "Enter text",
    placeholder: "e.g. 안녕하세요 반갑습니다",
    withLabel: "Full conversion result",
    onlyLabel: "Initial consonants only",
    copy: "Copy",
    distLabel: "Consonant distribution",
    countUnit: "",
    empty: "Enter Korean text to extract initial consonants",
  },
};

function extractChosung(text: string): string {
  return text.split("").map((ch) => {
    const code = ch.charCodeAt(0);
    if (code >= 0xAC00 && code <= 0xD7A3) return CHOSUNG[Math.floor((code - 0xAC00) / 28 / 21)];
    return ch;
  }).join("");
}

export default function ChosungPage() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [input, setInput] = useState("");

  const result = extractChosung(input);
  const onlyChosung = input.split("").filter((ch) => {
    const code = ch.charCodeAt(0);
    return code >= 0xAC00 && code <= 0xD7A3;
  }).map((ch) => {
    const code = ch.charCodeAt(0);
    return CHOSUNG[Math.floor((code - 0xAC00) / 28 / 21)];
  }).join("");

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-slate-800">{t.title}</h1>
        <p className="text-slate-500 text-sm mt-1">{t.sub}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <label className="block text-sm font-medium text-slate-600 mb-1">{t.inputLabel}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.placeholder}
          rows={4}
          className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-slate-300 resize-none"
        />
      </div>

      {input && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-400">{t.withLabel}</p>
              <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs text-blue-500 hover:text-blue-700 font-medium">{t.copy}</button>
            </div>
            <p className="text-lg font-bold text-slate-700 tracking-widest break-all">{result}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-400">{t.onlyLabel}</p>
              <button onClick={() => navigator.clipboard.writeText(onlyChosung)} className="text-xs text-blue-500 hover:text-blue-700 font-medium">{t.copy}</button>
            </div>
            <p className="text-lg font-bold text-slate-700 tracking-widest break-all">{onlyChosung || "-"}</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5">
            <p className="text-xs font-semibold text-slate-400 mb-3">{t.distLabel}</p>
            <div className="flex flex-wrap gap-2">
              {CHOSUNG.map((ch) => {
                const count = onlyChosung.split("").filter((c) => c === ch).length;
                if (count === 0) return null;
                return (
                  <div key={ch} className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-center">
                    <div className="text-base font-bold text-slate-700">{ch}</div>
                    <div className="text-xs text-slate-400">{count}{t.countUnit ? t.countUnit : ""}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {!input && (
        <div className="text-center py-10 text-slate-300 text-sm">{t.empty}</div>
      )}
    </div>
  );
}
