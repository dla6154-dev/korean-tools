"use client";

import { useState } from "react";
import type { Metadata } from "next";

const CHOSUNG = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];

function extractChosung(text: string): string {
  return text
    .split("")
    .map((ch) => {
      const code = ch.charCodeAt(0);
      if (code >= 0xAC00 && code <= 0xD7A3) {
        return CHOSUNG[Math.floor((code - 0xAC00) / 28 / 21)];
      }
      return ch;
    })
    .join("");
}

export default function ChosungPage() {
  const [input, setInput] = useState("");
  const result = extractChosung(input);
  const onlyChosung = input
    .split("")
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code >= 0xAC00 && code <= 0xD7A3;
    })
    .map((ch) => {
      const code = ch.charCodeAt(0);
      return CHOSUNG[Math.floor((code - 0xAC00) / 28 / 21)];
    })
    .join("");

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-slate-800">초성 추출기</h1>
        <p className="text-slate-500 text-sm mt-1">한글 텍스트에서 초성만 뽑아드려요</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">텍스트 입력</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="예) 안녕하세요 반갑습니다"
            rows={4}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-slate-300 resize-none"
          />
        </div>
      </div>

      {input && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-400">초성 포함 변환 결과</p>
              <button
                onClick={() => copyToClipboard(result)}
                className="text-xs text-blue-500 hover:text-blue-700 font-medium"
              >
                복사
              </button>
            </div>
            <p className="text-lg font-bold text-slate-700 tracking-widest break-all">{result}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-400">초성만 추출</p>
              <button
                onClick={() => copyToClipboard(onlyChosung)}
                className="text-xs text-blue-500 hover:text-blue-700 font-medium"
              >
                복사
              </button>
            </div>
            <p className="text-lg font-bold text-slate-700 tracking-widest break-all">{onlyChosung || "-"}</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5">
            <p className="text-xs font-semibold text-slate-400 mb-3">초성 분포</p>
            <div className="flex flex-wrap gap-2">
              {CHOSUNG.map((ch) => {
                const count = onlyChosung.split("").filter((c) => c === ch).length;
                if (count === 0) return null;
                return (
                  <div key={ch} className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-center">
                    <div className="text-base font-bold text-slate-700">{ch}</div>
                    <div className="text-xs text-slate-400">{count}개</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {!input && (
        <div className="text-center py-10 text-slate-300 text-sm">
          텍스트를 입력하면 초성이 추출됩니다
        </div>
      )}
    </div>
  );
}
