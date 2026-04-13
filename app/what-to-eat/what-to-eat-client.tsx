"use client";

import { useState, useRef } from "react";
import { useLanguage } from "../language-context";

const MENU_PRESETS = [
  // 한식 TOP 10 (한국갤럽 2024)
  { emoji: "🍲", ko: "김치찌개", en: "Kimchi Stew", category: "korean" },
  { emoji: "🥩", ko: "불고기", en: "Bulgogi", category: "korean" },
  { emoji: "🫕", ko: "된장찌개", en: "Doenjang Stew", category: "korean" },
  { emoji: "🍚", ko: "비빔밥", en: "Bibimbap", category: "korean" },
  { emoji: "🥓", ko: "삼겹살", en: "Samgyeopsal", category: "korean" },
  { emoji: "🍖", ko: "갈비구이", en: "Galbi Grill", category: "korean" },
  { emoji: "🍖", ko: "갈비찜", en: "Braised Ribs", category: "korean" },
  { emoji: "🍜", ko: "잡채", en: "Japchae", category: "korean" },
  { emoji: "🍜", ko: "냉면", en: "Cold Noodles", category: "korean" },
  { emoji: "🍗", ko: "삼계탕", en: "Samgyetang", category: "korean" },
  // 일식 TOP 10 (빅데이터 검색량)
  { emoji: "🍣", ko: "초밥", en: "Sushi", category: "japanese" },
  { emoji: "🍜", ko: "우동", en: "Udon", category: "japanese" },
  { emoji: "🐟", ko: "회(사시미)", en: "Sashimi", category: "japanese" },
  { emoji: "🍜", ko: "라멘", en: "Ramen", category: "japanese" },
  { emoji: "🍜", ko: "소바", en: "Soba", category: "japanese" },
  { emoji: "🍲", ko: "샤브샤브", en: "Shabu-shabu", category: "japanese" },
  { emoji: "🐙", ko: "타코야키", en: "Takoyaki", category: "japanese" },
  { emoji: "🍱", ko: "돈카츠", en: "Tonkatsu", category: "japanese" },
  { emoji: "🍗", ko: "가라아게", en: "Karaage", category: "japanese" },
  { emoji: "🥞", ko: "오코노미야키", en: "Okonomiyaki", category: "japanese" },
  // 중식 TOP 10
  { emoji: "🍜", ko: "짜장면", en: "Jajangmyeon", category: "chinese" },
  { emoji: "🍜", ko: "짬뽕", en: "Jjamppong", category: "chinese" },
  { emoji: "🥩", ko: "탕수육", en: "Sweet & Sour Pork", category: "chinese" },
  { emoji: "🌶️", ko: "마라탕", en: "Malatang", category: "chinese" },
  { emoji: "🍖", ko: "꿔바로우", en: "Guobaorou", category: "chinese" },
  { emoji: "🍗", ko: "깐풍기", en: "Kanpunggi", category: "chinese" },
  { emoji: "🍚", ko: "볶음밥", en: "Fried Rice", category: "chinese" },
  { emoji: "🦐", ko: "팔보채", en: "Palbo-chae", category: "chinese" },
  { emoji: "🥗", ko: "양장피", en: "Yangjangpi", category: "chinese" },
  { emoji: "🌶️", ko: "마라샹궈", en: "Mala Xiangguo", category: "chinese" },
  // 양식 TOP 10
  { emoji: "🍕", ko: "피자", en: "Pizza", category: "western" },
  { emoji: "🍝", ko: "파스타", en: "Pasta", category: "western" },
  { emoji: "🍔", ko: "햄버거", en: "Burger", category: "western" },
  { emoji: "🥩", ko: "스테이크", en: "Steak", category: "western" },
  { emoji: "🥗", ko: "샐러드", en: "Salad", category: "western" },
  { emoji: "🍚", ko: "리조또", en: "Risotto", category: "western" },
  { emoji: "🥪", ko: "샌드위치", en: "Sandwich", category: "western" },
  { emoji: "🍳", ko: "브런치", en: "Brunch", category: "western" },
  { emoji: "🍜", ko: "수프", en: "Soup", category: "western" },
  { emoji: "🌮", ko: "타코", en: "Tacos", category: "western" },
];

const CATEGORIES = [
  { id: "all", ko: "전체", en: "All" },
  { id: "korean", ko: "한식", en: "Korean" },
  { id: "japanese", ko: "일식", en: "Japanese" },
  { id: "chinese", ko: "중식", en: "Chinese" },
  { id: "western", ko: "양식", en: "Western" },
];

const T = {
  ko: {
    title: "오늘 뭐 먹지?",
    subtitle: "메뉴 고르기 귀찮을 땐 저한테 맡기세요",
    filterLabel: "카테고리",
    selectedCount: "개 선택됨",
    addLabel: "직접 추가",
    addPlaceholder: "메뉴 이름 입력 후 Enter",
    pickButton: "랜덤으로 골라줘!",
    pickAgain: "다시 뽑기",
    resultLabel: "오늘의 메뉴",
    customTag: "직접 추가",
    minWarning: "메뉴를 최소 1개 이상 선택해 주세요.",
    selectAll: "전체 선택",
    deselectAll: "전체 해제",
    threePickLabel: "3번 연속 뽑기",
    threePickResult: "번 중",
    historyLabel: "최근 결과",
    clearHistory: "기록 삭제",
  },
  en: {
    title: "What to eat today?",
    subtitle: "Let us pick your meal when you can't decide",
    filterLabel: "Category",
    selectedCount: "selected",
    addLabel: "Add custom",
    addPlaceholder: "Type a menu item and press Enter",
    pickButton: "Pick for me!",
    pickAgain: "Pick again",
    resultLabel: "Today's pick",
    customTag: "Custom",
    minWarning: "Please select at least one menu item.",
    selectAll: "Select all",
    deselectAll: "Deselect all",
    threePickLabel: "Pick 3 options",
    threePickResult: "of 3",
    historyLabel: "Recent picks",
    clearHistory: "Clear",
  },
};

export default function WhatToEatClient() {
  const { lang } = useLanguage();
  const t = T[lang];

  const [activeCategory, setActiveCategory] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(
    new Set(MENU_PRESETS.map((m) => m.ko))
  );
  const [customItems, setCustomItems] = useState<{ emoji: string; ko: string; en: string }[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [resultEmoji, setResultEmoji] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [warning, setWarning] = useState("");
  const [history, setHistory] = useState<{ emoji: string; name: string }[]>([]);
  const [threeResults, setThreeResults] = useState<{ emoji: string; name: string }[] | null>(null);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const allItems = [...MENU_PRESETS, ...customItems];
  const visibleItems =
    activeCategory === "all"
      ? allItems
      : [...MENU_PRESETS.filter((m) => m.category === activeCategory), ...customItems];

  function toggleItem(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
    setWarning("");
  }

  function selectAll() {
    setSelected(new Set(visibleItems.map((m) => m.ko)));
  }

  function deselectAll() {
    const visibleKo = new Set(visibleItems.map((m) => m.ko));
    setSelected((prev) => new Set([...prev].filter((k) => !visibleKo.has(k))));
  }

  function addCustom() {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    const newItem = { emoji: "🍽️", ko: trimmed, en: trimmed };
    setCustomItems((prev) => [...prev, newItem]);
    setSelected((prev) => new Set([...prev, trimmed]));
    setCustomInput("");
  }

  function getEligible() {
    if (activeCategory !== "all") {
      return MENU_PRESETS.filter((m) => m.category === activeCategory);
    }
    return allItems.filter((m) => selected.has(m.ko));
  }

  function pickRandom() {
    const eligible = getEligible();
    if (eligible.length === 0) {
      setWarning(t.minWarning);
      return;
    }
    setWarning("");
    setThreeResults(null);
    setIsAnimating(true);

    const pool = [...eligible];
    let count = 0;
    if (animRef.current) clearInterval(animRef.current);

    animRef.current = setInterval(() => {
      const random = pool[Math.floor(Math.random() * pool.length)];
      setResult(lang === "ko" ? random.ko : random.en);
      setResultEmoji(random.emoji);
      count++;
      if (count >= 12) {
        clearInterval(animRef.current!);
        const final = pool[Math.floor(Math.random() * pool.length)];
        setResult(lang === "ko" ? final.ko : final.en);
        setResultEmoji(final.emoji);
        setIsAnimating(false);
        setHistory((prev) =>
          [{ emoji: final.emoji, name: lang === "ko" ? final.ko : final.en }, ...prev].slice(0, 5)
        );
      }
    }, 80);
  }

  function pickThree() {
    const eligible = getEligible();
    if (eligible.length === 0) { setWarning(t.minWarning); return; }
    setWarning("");
    setResult(null);

    const shuffled = [...eligible].sort(() => Math.random() - 0.5).slice(0, Math.min(3, eligible.length));
    setThreeResults(shuffled.map((m) => ({ emoji: m.emoji, name: lang === "ko" ? m.ko : m.en })));
  }

  const selectedCount = [...selected].filter((k) => allItems.some((m) => m.ko === k)).length;

  return (
    <div className="bg-[radial-gradient(circle_at_top,_rgba(254,243,199,0.7),_rgba(248,250,252,1)_40%)] min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍽️</div>
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{t.title}</h1>
          <p className="mt-2 text-slate-500">{t.subtitle}</p>
        </div>

        {/* Result */}
        <div
          className={`mb-6 rounded-[28px] border-2 p-8 text-center transition-all duration-300 ${
            result
              ? "border-amber-300 bg-amber-50 shadow-[0_8px_32px_-8px_rgba(251,191,36,0.4)]"
              : "border-dashed border-slate-200 bg-white/60"
          }`}
        >
          {result ? (
            <>
              <div className={`text-6xl mb-3 transition-all ${isAnimating ? "animate-bounce" : "scale-110"}`}>
                {resultEmoji}
              </div>
              <div className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-1">
                {t.resultLabel}
              </div>
              <div className={`text-3xl font-bold text-slate-900 ${isAnimating ? "blur-sm" : ""}`}>
                {result}
              </div>
            </>
          ) : threeResults ? null : (
            <div className="text-slate-300 text-4xl">?</div>
          )}

          {threeResults && (
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3">
                {t.threePickLabel}
              </div>
              {threeResults.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-2xl border border-amber-200 bg-white px-4 py-3"
                >
                  <span className="text-2xl">{r.emoji}</span>
                  <span className="text-lg font-bold text-slate-800">{r.name}</span>
                  <span className="text-xs text-amber-500 font-semibold">
                    {i + 1}{t.threePickResult}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pick buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={pickRandom}
            disabled={isAnimating}
            className="rounded-2xl bg-amber-400 py-4 text-base font-bold text-white shadow transition hover:bg-amber-500 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {isAnimating ? "🎲 ..." : result ? t.pickAgain : t.pickButton}
          </button>
          <button
            onClick={pickThree}
            disabled={isAnimating}
            className="rounded-2xl border-2 border-amber-300 bg-white py-4 text-base font-bold text-amber-600 transition hover:bg-amber-50 disabled:opacity-40"
          >
            🎯 {t.threePickLabel}
          </button>
        </div>

        {warning && (
          <p className="mb-4 text-center text-sm text-rose-500">{warning}</p>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{t.historyLabel}</span>
              <button onClick={() => setHistory([])} className="text-xs text-slate-400 hover:text-slate-600">
                {t.clearHistory}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {history.map((h, i) => (
                <span key={i} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  {h.emoji} {h.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Category filter */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">{t.filterLabel}</div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                  activeCategory === cat.id
                    ? "bg-amber-400 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-amber-100"
                }`}
              >
                {cat[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* Select all / deselect */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-500">
            {selectedCount} {t.selectedCount}
          </span>
          <div className="flex gap-2">
            <button onClick={selectAll} className="text-xs text-blue-500 hover:underline">{t.selectAll}</button>
            <span className="text-slate-300">|</span>
            <button onClick={deselectAll} className="text-xs text-slate-400 hover:underline">{t.deselectAll}</button>
          </div>
        </div>

        {/* Menu grid */}
        <div className="grid grid-cols-3 gap-2 mb-6 sm:grid-cols-4">
          {visibleItems.map((item) => {
            const isSelected = selected.has(item.ko);
            const isCustom = customItems.some((c) => c.ko === item.ko);
            return (
              <button
                key={item.ko}
                onClick={() => toggleItem(item.ko)}
                className={`relative rounded-2xl border-2 p-3 text-center transition-all ${
                  isSelected
                    ? "border-amber-300 bg-amber-50 shadow-sm"
                    : "border-slate-200 bg-white opacity-50"
                }`}
              >
                <div className="text-2xl mb-1">{item.emoji}</div>
                <div className="text-xs font-semibold text-slate-700 leading-tight">
                  {lang === "ko" ? item.ko : item.en}
                </div>
                {isCustom && (
                  <span className="absolute -top-1.5 -right-1.5 rounded-full bg-blue-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    {t.customTag}
                  </span>
                )}
                {isSelected && (
                  <span className="absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] text-white font-bold">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Add custom */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">{t.addLabel}</div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustom()}
              placeholder={t.addPlaceholder}
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            />
            <button
              onClick={addCustom}
              className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
