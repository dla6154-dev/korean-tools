"use client";

import { useState } from "react";
import type { Metadata } from "next";

export default function CharactersPage() {
  const [text, setText] = useState("");

  const totalChars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const bytes = new TextEncoder().encode(text).length;
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const sentences = text.trim() === "" ? 0 : text.split(/[.!?。]+/).filter((s) => s.trim().length > 0).length;
  const lines = text === "" ? 0 : text.split("\n").length;
  const paragraphs = text.trim() === "" ? 0 : text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;

  function handleClear() {
    setText("");
  }

  function handleCopy() {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-slate-800">글자수 세기</h1>
        <p className="text-slate-500 text-sm mt-1">자기소개서, 이력서, SNS 글자 수를 바로 확인하세요</p>
      </div>

      {/* 입력 영역 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-600">텍스트 입력</label>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              disabled={!text}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              복사
            </button>
            <button
              onClick={handleClear}
              disabled={!text}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              지우기
            </button>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="여기에 텍스트를 입력하거나 붙여넣으세요..."
          className="w-full h-52 border border-slate-200 rounded-xl px-4 py-3 text-base resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-slate-300"
        />
        <div className="text-right text-xs text-slate-400 mt-1">
          {totalChars.toLocaleString()}자
        </div>
      </div>

      {/* 결과 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-500 rounded-2xl p-5 text-white text-center">
          <div className="text-4xl font-bold">{totalChars.toLocaleString()}</div>
          <div className="text-blue-100 text-sm mt-1">전체 글자수 (공백 포함)</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 text-center">
          <div className="text-4xl font-bold text-slate-700">{charsNoSpace.toLocaleString()}</div>
          <div className="text-slate-400 text-sm mt-1">글자수 (공백 제외)</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-slate-700">{words.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">단어수</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-slate-700">{bytes.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">바이트 (UTF-8)</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-slate-700">{sentences.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">문장수</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-slate-700">{lines.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">줄수</div>
        </div>
      </div>

      {/* 자주 쓰는 글자수 기준 */}
      <div className="bg-slate-50 rounded-2xl p-5">
        <p className="text-xs font-semibold text-slate-400 mb-3">자주 쓰는 글자수 기준</p>
        <div className="space-y-2">
          {[
            { label: "트위터 / X", limit: 280 },
            { label: "인스타그램 캡션", limit: 2200 },
            { label: "카카오톡 상태메시지", limit: 60 },
            { label: "공기업 자기소개서 (항목당)", limit: 500 },
            { label: "대기업 자기소개서 (항목당)", limit: 1000 },
          ].map(({ label, limit }) => {
            const over = totalChars > limit;
            const pct = Math.min((totalChars / limit) * 100, 100);
            return (
              <div key={label}>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>{label}</span>
                  <span className={over ? "text-red-500 font-semibold" : "text-slate-400"}>
                    {totalChars.toLocaleString()} / {limit.toLocaleString()}
                    {over && " (초과)"}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${over ? "bg-red-400" : "bg-blue-400"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
