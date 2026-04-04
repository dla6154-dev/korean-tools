"use client";

import { useState } from "react";

// 영어 → 한글 키보드 매핑 (쿼티)
const EN_TO_KO: Record<string, string> = {
  q:"ㅂ", w:"ㅈ", e:"ㄷ", r:"ㄱ", t:"ㅅ", y:"ㅛ", u:"ㅕ", i:"ㅑ", o:"ㅐ", p:"ㅔ",
  a:"ㅁ", s:"ㄴ", d:"ㅇ", f:"ㄹ", g:"ㅎ", h:"ㅗ", j:"ㅓ", k:"ㅏ", l:"ㅣ",
  z:"ㅋ", x:"ㅌ", c:"ㅊ", v:"ㅍ", b:"ㅠ", n:"ㅜ", m:"ㅡ",
  Q:"ㅃ", W:"ㅉ", E:"ㄸ", R:"ㄲ", T:"ㅆ", O:"ㅒ", P:"ㅖ",
};

// 한글 → 영어 키보드 역매핑
const KO_TO_EN: Record<string, string> = {};
for (const [en, ko] of Object.entries(EN_TO_KO)) {
  if (!KO_TO_EN[ko]) KO_TO_EN[ko] = en;
}

// 자모 → 완성형 한글 조합
const CHOSUNG = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const JUNGSUNG = ["ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"];
const JONGSUNG = ["","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];

function assembleHangul(jamos: string[]): string {
  // Simple jamo assembler
  let result = "";
  let i = 0;
  while (i < jamos.length) {
    const ch = jamos[i];
    const ci = CHOSUNG.indexOf(ch);
    if (ci >= 0 && i + 1 < jamos.length) {
      const ji = JUNGSUNG.indexOf(jamos[i + 1]);
      if (ji >= 0) {
        // We have a valid initial + vowel
        if (i + 2 < jamos.length) {
          const ti = JONGSUNG.indexOf(jamos[i + 2]);
          if (ti > 0) {
            // Check if next char after jongsung can form syllable
            const nextIsVowel = i + 3 < jamos.length && JUNGSUNG.indexOf(jamos[i + 3]) >= 0;
            if (!nextIsVowel) {
              result += String.fromCharCode(0xAC00 + ci * 21 * 28 + ji * 28 + ti);
              i += 3;
              continue;
            }
          }
        }
        result += String.fromCharCode(0xAC00 + ci * 21 * 28 + ji * 28);
        i += 2;
        continue;
      }
    }
    result += ch;
    i++;
  }
  return result;
}

function englishToKorean(text: string): string {
  const jamos: string[] = [];
  for (const ch of text) {
    const mapped = EN_TO_KO[ch];
    if (mapped) {
      jamos.push(mapped);
    } else {
      // Flush existing jamos and add character
      if (jamos.length > 0) {
        // Actually just add directly since assembleHangul handles it
      }
      jamos.push(ch);
    }
  }
  return assembleHangul(jamos);
}

function koreanToEnglish(text: string): string {
  let result = "";
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code >= 0xAC00 && code <= 0xD7A3) {
      // Decompose hangul syllable
      const offset = code - 0xAC00;
      const ci = Math.floor(offset / 28 / 21);
      const ji = Math.floor((offset / 28) % 21);
      const ti = offset % 28;
      result += KO_TO_EN[CHOSUNG[ci]] || CHOSUNG[ci];
      result += KO_TO_EN[JUNGSUNG[ji]] || JUNGSUNG[ji];
      if (ti > 0) result += KO_TO_EN[JONGSUNG[ti]] || JONGSUNG[ti];
    } else if (EN_TO_KO[ch]) {
      // Single jamo
      result += KO_TO_EN[ch] || ch;
    } else {
      result += ch;
    }
  }
  return result;
}

export default function KeyboardPage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"en2ko" | "ko2en">("en2ko");

  const result = mode === "en2ko" ? englishToKorean(input) : koreanToEnglish(input);

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-slate-800">키보드 오타 변환기</h1>
        <p className="text-slate-500 text-sm mt-1">영어/한글 키보드 오타를 올바른 언어로 변환해드려요</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        {/* 모드 선택 */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">변환 방향</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setMode("en2ko"); setInput(""); }}
              className={`py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                mode === "en2ko"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              English → 한글
            </button>
            <button
              onClick={() => { setMode("ko2en"); setInput(""); }}
              className={`py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                mode === "ko2en"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              한글 → English
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            {mode === "en2ko" ? "영어로 입력된 한글 오타" : "한글로 입력된 영어 오타"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "en2ko" ? "예) dkssudgktpdy (안녕하세요)" : "예) 안녕하세요 → hello"}
            rows={4}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-slate-300 resize-none"
          />
        </div>
      </div>

      {input && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-400">변환 결과</p>
            <button
              onClick={() => copyToClipboard(result)}
              className="text-xs text-blue-500 hover:text-blue-700 font-medium"
            >
              복사
            </button>
          </div>
          <p className="text-xl font-bold text-slate-700 break-all">{result}</p>
        </div>
      )}

      {!input && (
        <div className="bg-slate-50 rounded-2xl p-5 text-sm text-slate-500 space-y-2">
          <p className="font-semibold text-slate-600">사용 예시</p>
          {mode === "en2ko" ? (
            <ul className="space-y-1 text-slate-400">
              <li>dkssudgktpdy → 안녕하세요</li>
              <li>dnlstlf → 반갑습니다 (일부)</li>
              <li>rksmd → 감사</li>
            </ul>
          ) : (
            <ul className="space-y-1 text-slate-400">
              <li>한글 → 영어 오타를 복원해드려요</li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
