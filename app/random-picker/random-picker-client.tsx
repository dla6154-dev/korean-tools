"use client";

import { useState, useRef, useCallback } from "react";
import { useLanguage } from "../language-context";

type Mode = "single" | "multi" | "teams";

const T = {
  ko: {
    title: "랜덤 뽑기 / 복불복",
    subtitle: "당번, 순서, 팀 나누기 모두 해결",
    modeSingle: "1명 뽑기",
    modeMulti: "여러 명 뽑기",
    modeTeams: "팀 나누기",
    itemsLabel: "항목 입력",
    itemsPlaceholder: "한 줄에 하나씩 입력\n예) 철수\n영희\n민준",
    itemsHint: "줄바꿈으로 구분해서 입력하세요",
    pickCount: "뽑을 수",
    teamCount: "팀 수",
    pickButton: "뽑기!",
    pickAgain: "다시 뽑기",
    resultLabel: "결과",
    teamLabel: "팀",
    historyLabel: "뽑기 기록",
    clearHistory: "초기화",
    minWarning: "항목을 최소 2개 이상 입력해 주세요.",
    countWarning: "뽑을 수가 항목 수보다 많을 수 없어요.",
    copyResult: "결과 복사",
    copied: "복사됨",
    removeItem: "삭제",
    quickAdd: "빠른 추가",
    quickItems: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    quickNumbers: "1~10 숫자",
    quickWeekdays: "월~금",
    quickWeekdayItems: ["월요일", "화요일", "수요일", "목요일", "금요일"],
    totalItems: "개 항목",
    shuffle: "전체 순서 섞기",
  },
  en: {
    title: "Random Picker",
    subtitle: "Draw names, pick orders, split teams",
    modeSingle: "Pick 1",
    modeMulti: "Pick multiple",
    modeTeams: "Split teams",
    itemsLabel: "Enter items",
    itemsPlaceholder: "One item per line\ne.g. Alice\nBob\nCarol",
    itemsHint: "Separate each item with a new line",
    pickCount: "How many to pick",
    teamCount: "Number of teams",
    pickButton: "Pick!",
    pickAgain: "Pick again",
    resultLabel: "Result",
    teamLabel: "Team",
    historyLabel: "History",
    clearHistory: "Clear",
    minWarning: "Please enter at least 2 items.",
    countWarning: "Pick count can't exceed the number of items.",
    copyResult: "Copy",
    copied: "Copied!",
    removeItem: "Remove",
    quickAdd: "Quick add",
    quickItems: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    quickNumbers: "Numbers 1–10",
    quickWeekdays: "Mon–Fri",
    quickWeekdayItems: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    totalItems: "items",
    shuffle: "Shuffle all",
  },
};

function parseItems(text: string) {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export default function RandomPickerClient() {
  const { lang } = useLanguage();
  const t = T[lang];

  const [mode, setMode] = useState<Mode>("single");
  const [inputText, setInputText] = useState("");
  const [pickCount, setPickCount] = useState(1);
  const [teamCount, setTeamCount] = useState(2);
  const [result, setResult] = useState<string[] | null>(null);
  const [teams, setTeams] = useState<string[][] | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [warning, setWarning] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const items = parseItems(inputText);

  function quickAdd(newItems: string[]) {
    const current = parseItems(inputText);
    const merged = [...new Set([...current, ...newItems])];
    setInputText(merged.join("\n"));
  }

  const doSinglePick = useCallback(() => {
    if (items.length < 1) { setWarning(t.minWarning); return; }
    setWarning("");
    setTeams(null);
    setIsAnimating(true);

    let count = 0;
    if (animRef.current) clearInterval(animRef.current);
    animRef.current = setInterval(() => {
      const r = items[Math.floor(Math.random() * items.length)];
      setResult([r]);
      count++;
      if (count >= 15) {
        clearInterval(animRef.current!);
        const final = items[Math.floor(Math.random() * items.length)];
        setResult([final]);
        setIsAnimating(false);
        setHistory((prev) => [`🎯 ${final}`, ...prev].slice(0, 8));
      }
    }, 60);
  }, [items, t.minWarning]);

  function doMultiPick() {
    if (items.length < 2) { setWarning(t.minWarning); return; }
    if (pickCount > items.length) { setWarning(t.countWarning); return; }
    setWarning("");
    setTeams(null);

    const shuffled = [...items].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, pickCount);
    setResult(picked);
    setHistory((prev) => [`🎯 ${picked.join(", ")}`, ...prev].slice(0, 8));
  }

  function doTeams() {
    if (items.length < 2) { setWarning(t.minWarning); return; }
    setWarning("");
    setResult(null);

    const shuffled = [...items].sort(() => Math.random() - 0.5);
    const teamArr: string[][] = Array.from({ length: teamCount }, () => []);
    shuffled.forEach((item, i) => teamArr[i % teamCount].push(item));
    setTeams(teamArr);
    setHistory((prev) => [
      `👥 ${teamArr.map((team, i) => `${t.teamLabel}${i + 1}: ${team.join(",")}`).join(" / ")}`,
      ...prev,
    ].slice(0, 8));
  }

  function doShuffle() {
    if (items.length < 2) { setWarning(t.minWarning); return; }
    setWarning("");
    setTeams(null);
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setResult(shuffled);
    setInputText(shuffled.join("\n"));
  }

  function pick() {
    if (mode === "single") doSinglePick();
    else if (mode === "multi") doMultiPick();
    else doTeams();
  }

  async function copyResult() {
    if (!result && !teams) return;
    let text = "";
    if (teams) {
      text = teams.map((team, i) => `${t.teamLabel}${i + 1}: ${team.join(", ")}`).join("\n");
    } else if (result) {
      text = result.join("\n");
    }
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  const TEAM_COLORS = [
    "border-blue-200 bg-blue-50 text-blue-700",
    "border-rose-200 bg-rose-50 text-rose-700",
    "border-emerald-200 bg-emerald-50 text-emerald-700",
    "border-violet-200 bg-violet-50 text-violet-700",
    "border-amber-200 bg-amber-50 text-amber-700",
    "border-cyan-200 bg-cyan-50 text-cyan-700",
  ];

  return (
    <div className="bg-[radial-gradient(circle_at_top,_rgba(221,214,254,0.6),_rgba(248,250,252,1)_40%)] min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎲</div>
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{t.title}</h1>
          <p className="mt-2 text-slate-500">{t.subtitle}</p>
        </div>

        {/* Mode tabs */}
        <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-white p-1.5">
          {(["single", "multi", "teams"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setResult(null); setTeams(null); setWarning(""); }}
              className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                mode === m
                  ? "bg-violet-500 text-white shadow"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {m === "single" ? t.modeSingle : m === "multi" ? t.modeMulti : t.modeTeams}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
          {/* Left: input */}
          <div className="space-y-4">
            {/* Quick add */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">{t.quickAdd}</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => quickAdd(t.quickItems)}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-violet-100 hover:text-violet-700"
                >
                  {t.quickNumbers}
                </button>
                <button
                  onClick={() => quickAdd(t.quickWeekdayItems)}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-violet-100 hover:text-violet-700"
                >
                  {t.quickWeekdays}
                </button>
              </div>
            </div>

            {/* Textarea */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{t.itemsLabel}</span>
                <span className="text-xs text-slate-400">{items.length} {t.totalItems}</span>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => { setInputText(e.target.value); setWarning(""); setResult(null); setTeams(null); }}
                placeholder={t.itemsPlaceholder}
                rows={8}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 placeholder:text-slate-300"
              />
              <p className="mt-1 text-xs text-slate-400">{t.itemsHint}</p>
            </div>

            {/* Options */}
            {mode === "multi" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">
                  {t.pickCount}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPickCount((n) => Math.max(1, n - 1))}
                    className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 font-bold hover:bg-violet-100"
                  >−</button>
                  <span className="text-2xl font-bold text-slate-900 w-8 text-center">{pickCount}</span>
                  <button
                    onClick={() => setPickCount((n) => n + 1)}
                    className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 font-bold hover:bg-violet-100"
                  >+</button>
                </div>
              </div>
            )}

            {mode === "teams" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">
                  {t.teamCount}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setTeamCount((n) => Math.max(2, n - 1))}
                    className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 font-bold hover:bg-violet-100"
                  >−</button>
                  <span className="text-2xl font-bold text-slate-900 w-8 text-center">{teamCount}</span>
                  <button
                    onClick={() => setTeamCount((n) => Math.min(6, n + 1))}
                    className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 font-bold hover:bg-violet-100"
                  >+</button>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={pick}
                disabled={isAnimating}
                className="rounded-2xl bg-violet-500 py-4 text-base font-bold text-white shadow transition hover:bg-violet-600 disabled:bg-slate-300"
              >
                {isAnimating ? "🎲..." : result || teams ? t.pickAgain : t.pickButton}
              </button>
              {mode === "single" && (
                <button
                  onClick={doShuffle}
                  className="rounded-2xl border-2 border-violet-200 bg-white py-4 text-sm font-bold text-violet-600 hover:bg-violet-50"
                >
                  🔀 {t.shuffle}
                </button>
              )}
            </div>

            {warning && <p className="text-sm text-rose-500 text-center">{warning}</p>}
          </div>

          {/* Right: result */}
          <div className="space-y-4">
            {/* Result panel */}
            <div className={`rounded-[24px] border-2 p-6 min-h-[200px] flex flex-col ${
              result || teams ? "border-violet-200 bg-violet-50" : "border-dashed border-slate-200 bg-white/60"
            }`}>
              {result && mode === "single" && (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className={`text-6xl mb-3 ${isAnimating ? "animate-spin" : ""}`}>🎯</div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-2">{t.resultLabel}</div>
                  <div className={`text-4xl font-bold text-slate-900 transition-all ${isAnimating ? "blur-sm scale-95" : "scale-100"}`}>
                    {result[0]}
                  </div>
                </div>
              )}

              {result && (mode === "multi" || mode === "single" && result.length > 1) && !isAnimating && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-3">{t.resultLabel}</div>
                  {result.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-violet-200 bg-white px-4 py-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500 text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="font-semibold text-slate-800">{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {teams && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-3">{t.resultLabel}</div>
                  {teams.map((team, i) => (
                    <div key={i} className={`rounded-xl border px-4 py-3 ${TEAM_COLORS[i % TEAM_COLORS.length]}`}>
                      <div className="text-xs font-bold mb-1">{t.teamLabel} {i + 1}</div>
                      <div className="flex flex-wrap gap-1">
                        {team.map((member) => (
                          <span key={member} className="rounded-full bg-white/80 px-2 py-0.5 text-sm font-semibold">
                            {member}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!result && !teams && (
                <div className="flex-1 flex items-center justify-center text-slate-300 text-5xl">
                  🎲
                </div>
              )}
            </div>

            {(result || teams) && (
              <button
                onClick={copyResult}
                className="w-full rounded-2xl border border-violet-200 bg-white py-3 text-sm font-semibold text-violet-600 hover:bg-violet-50"
              >
                {copied ? `✓ ${t.copied}` : t.copyResult}
              </button>
            )}

            {/* History */}
            {history.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{t.historyLabel}</span>
                  <button onClick={() => setHistory([])} className="text-xs text-slate-400 hover:text-slate-600">{t.clearHistory}</button>
                </div>
                <div className="space-y-1.5">
                  {history.map((h, i) => (
                    <div key={i} className="truncate text-sm text-slate-600 border-b border-slate-100 pb-1.5 last:border-0 last:pb-0">
                      {h}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
