"use client";

import { useState } from "react";
import { useLanguage } from "../language-context";

const DRINKS_KO = [
  { name: "소주 (1잔, 50ml)", ml: 50, abv: 16.9 },
  { name: "소주 (1병, 360ml)", ml: 360, abv: 16.9 },
  { name: "맥주 (1캔, 355ml)", ml: 355, abv: 4.5 },
  { name: "맥주 (500ml)", ml: 500, abv: 4.5 },
  { name: "와인 (1잔, 150ml)", ml: 150, abv: 12 },
  { name: "와인 (1병, 750ml)", ml: 750, abv: 12 },
  { name: "막걸리 (1잔, 200ml)", ml: 200, abv: 6 },
  { name: "막걸리 (1병, 750ml)", ml: 750, abv: 6 },
  { name: "위스키 (1잔, 45ml)", ml: 45, abv: 40 },
  { name: "직접 입력", ml: 0, abv: 0 },
];

const DRINKS_EN = [
  { name: "Soju (1 shot, 50ml)", ml: 50, abv: 16.9 },
  { name: "Soju (1 bottle, 360ml)", ml: 360, abv: 16.9 },
  { name: "Beer (1 can, 355ml)", ml: 355, abv: 4.5 },
  { name: "Beer (500ml)", ml: 500, abv: 4.5 },
  { name: "Wine (1 glass, 150ml)", ml: 150, abv: 12 },
  { name: "Wine (1 bottle, 750ml)", ml: 750, abv: 12 },
  { name: "Makgeolli (1 cup, 200ml)", ml: 200, abv: 6 },
  { name: "Makgeolli (1 bottle, 750ml)", ml: 750, abv: 6 },
  { name: "Whisky (1 shot, 45ml)", ml: 45, abv: 40 },
  { name: "Custom", ml: 0, abv: 0 },
];

const T = {
  ko: {
    title: "음주측정 계산기",
    sub: "음주 후 혈중 알코올 농도(BAC)를 추정해드려요",
    warning: "⚠️ 본 계산기는 위드마크 공식을 기반으로 한 참고용입니다. 실제 혈중 알코올 농도는 개인 신체 조건에 따라 크게 다를 수 있습니다.",
    gender: "성별", male: "남성", female: "여성",
    weight: "체중", weightUnit: "kg",
    drinksLabel: "마신 음료",
    addDrink: "+ 음료 추가",
    volume: "용량", abv: "도수",
    elapsed: "음주 후 경과 시간", elapsedUnit: "시간",
    calculate: "계산하기",
    currentBac: "현재 추정 혈중 알코올 농도",
    standards: "음주운전 기준",
    standardItems: [
      { label: "단속 기준", bac: "0.03%", color: "bg-yellow-100 text-yellow-700" },
      { label: "면허 정지", bac: "0.03% ~ 0.08%", color: "bg-orange-100 text-orange-700" },
      { label: "면허 취소", bac: "0.08% 이상", color: "bg-red-100 text-red-700" },
    ],
    sleepTitle: "수면 후 예상 BAC",
    sleepUnit: "시간 후",
    recoveryTitle: "예상 회복 시간",
    driveReady: "운전 가능까지", driveReadyNow: "가능",
    sober: "완전 해소까지",
    aboutHours: "약 ",
    hoursUnit: "시간",
    bacLabels: {
      none: { text: "음주 없음", color: "bg-green-100 text-green-700" },
      ok: { text: "운전 가능", color: "bg-yellow-100 text-yellow-700" },
      suspend: { text: "면허정지 수준", color: "bg-orange-100 text-orange-700" },
      revoke: { text: "면허취소 수준", color: "bg-red-100 text-red-700" },
    },
  },
  en: {
    title: "Alcohol Calculator (BAC)",
    sub: "Estimate your blood alcohol concentration after drinking",
    warning: "⚠️ This calculator uses the Widmark formula and is for reference only. Actual BAC can vary significantly by individual.",
    gender: "Gender", male: "Male", female: "Female",
    weight: "Weight", weightUnit: "kg",
    drinksLabel: "Drinks consumed",
    addDrink: "+ Add drink",
    volume: "Volume", abv: "ABV",
    elapsed: "Hours since last drink", elapsedUnit: "hrs",
    calculate: "Calculate",
    currentBac: "Estimated current BAC",
    standards: "DUI thresholds (Korea)",
    standardItems: [
      { label: "DUI threshold", bac: "0.03%", color: "bg-yellow-100 text-yellow-700" },
      { label: "License suspension", bac: "0.03% – 0.08%", color: "bg-orange-100 text-orange-700" },
      { label: "License revocation", bac: "0.08%+", color: "bg-red-100 text-red-700" },
    ],
    sleepTitle: "Estimated BAC after sleep",
    sleepUnit: "hrs later",
    recoveryTitle: "Estimated recovery time",
    driveReady: "Until safe to drive", driveReadyNow: "Safe now",
    sober: "Until fully sober",
    aboutHours: "~",
    hoursUnit: " hrs",
    bacLabels: {
      none: { text: "No alcohol", color: "bg-green-100 text-green-700" },
      ok: { text: "Safe to drive", color: "bg-yellow-100 text-yellow-700" },
      suspend: { text: "Suspension level", color: "bg-orange-100 text-orange-700" },
      revoke: { text: "Revocation level", color: "bg-red-100 text-red-700" },
    },
  },
};

interface DrinkItem { id: number; drinkIndex: number; ml: number; abv: number; count: number; }

export default function AlcoholPage() {
  const { lang } = useLanguage();
  const t = T[lang];
  const DRINKS = lang === "ko" ? DRINKS_KO : DRINKS_EN;

  const [gender, setGender] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState("");
  const [drinks, setDrinks] = useState<DrinkItem[]>([
    { id: 1, drinkIndex: 0, ml: 50, abv: 16.9, count: 1 },
  ]);
  const [drinkingHours, setDrinkingHours] = useState("2");
  const [result, setResult] = useState<{ bac: number; bacAfterSleep: (h: number) => number; soberIn: number; driveIn: number } | null>(null);

  function addDrink() { setDrinks([...drinks, { id: Date.now(), drinkIndex: 0, ml: 50, abv: 16.9, count: 1 }]); }
  function removeDrink(id: number) { setDrinks(drinks.filter((d) => d.id !== id)); }
  function updateDrink(id: number, field: keyof DrinkItem, value: number) {
    setDrinks(drinks.map((d) => {
      if (d.id !== id) return d;
      if (field === "drinkIndex") {
        const preset = DRINKS[value];
        return { ...d, drinkIndex: value, ml: preset.ml, abv: preset.abv };
      }
      return { ...d, [field]: value };
    }));
  }

  function calculate() {
    const w = parseFloat(weight);
    if (!w || w <= 0) return;
    const h = parseFloat(drinkingHours) || 0;
    const widmarkFactor = gender === "male" ? 0.7 : 0.6;
    const totalAlcohol = drinks.reduce((sum, d) => sum + d.ml * (d.abv / 100) * 0.789 * d.count, 0);
    const peakBac = totalAlcohol / (w * widmarkFactor * 10);
    const currentBac = Math.max(0, peakBac - 0.015 * h);
    setResult({
      bac: currentBac,
      bacAfterSleep: (h2: number) => Math.max(0, currentBac - 0.015 * h2),
      soberIn: currentBac / 0.015,
      driveIn: Math.max(0, (currentBac - 0.03) / 0.015),
    });
  }

  function getBacColor(bac: number) {
    if (bac <= 0) return "text-green-500";
    if (bac < 0.03) return "text-yellow-500";
    if (bac < 0.08) return "text-orange-500";
    return "text-red-500";
  }

  function getBacLabel(bac: number) {
    if (bac <= 0) return t.bacLabels.none;
    if (bac < 0.03) return t.bacLabels.ok;
    if (bac < 0.08) return t.bacLabels.suspend;
    return t.bacLabels.revoke;
  }

  const sleepHours = [4, 6, 7, 8];

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-slate-800">{t.title}</h1>
        <p className="text-slate-500 text-sm mt-1">{t.sub}</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">{t.warning}</div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">{t.gender}</label>
          <div className="grid grid-cols-2 gap-2">
            {(["male", "female"] as const).map((g) => (
              <button key={g} onClick={() => setGender(g)}
                className={`py-2.5 rounded-lg text-sm font-semibold transition-colors ${gender === g ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                {g === "male" ? t.male : t.female}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">{t.weight}</label>
          <div className="relative">
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">{t.weightUnit}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">{t.drinksLabel}</label>
          <div className="space-y-3">
            {drinks.map((d) => (
              <div key={d.id} className="border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="flex gap-2">
                  <select value={d.drinkIndex} onChange={(e) => updateDrink(d.id, "drinkIndex", parseInt(e.target.value))}
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
                    {DRINKS.map((preset, i) => <option key={i} value={i}>{preset.name}</option>)}
                  </select>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateDrink(d.id, "count", Math.max(1, d.count - 1))} className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 text-sm font-bold">-</button>
                    <span className="w-6 text-center text-sm font-medium">{d.count}</span>
                    <button onClick={() => updateDrink(d.id, "count", d.count + 1)} className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 text-sm font-bold">+</button>
                  </div>
                  {drinks.length > 1 && <button onClick={() => removeDrink(d.id)} className="text-slate-300 hover:text-red-400 text-lg leading-none">×</button>}
                </div>
                {d.drinkIndex === DRINKS.length - 1 && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <input type="number" value={d.ml || ""} onChange={(e) => updateDrink(d.id, "ml", parseFloat(e.target.value) || 0)} placeholder={t.volume}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">ml</span>
                    </div>
                    <div className="relative">
                      <input type="number" value={d.abv || ""} onChange={(e) => updateDrink(d.id, "abv", parseFloat(e.target.value) || 0)} placeholder={t.abv}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 pr-6" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button onClick={addDrink} className="w-full border-2 border-dashed border-slate-200 hover:border-blue-300 rounded-xl py-2.5 text-sm text-slate-400 hover:text-blue-400 transition-colors">
              {t.addDrink}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">{t.elapsed}</label>
          <div className="relative">
            <input type="number" value={drinkingHours} onChange={(e) => setDrinkingHours(e.target.value)} step="0.5" min="0"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">{t.elapsedUnit}</span>
          </div>
        </div>

        <button onClick={calculate} disabled={!weight}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white font-semibold py-3 rounded-lg transition-colors">
          {t.calculate}
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
            <p className="text-xs text-slate-400 mb-2">{t.currentBac}</p>
            <p className={`text-4xl font-bold ${getBacColor(result.bac)}`}>{result.bac.toFixed(4)}%</p>
            <div className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getBacLabel(result.bac).color}`}>
              {getBacLabel(result.bac).text}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-400 mb-3">{t.standards}</p>
            <div className="space-y-2">
              {t.standardItems.map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.color}`}>{item.bac}</span>
                </div>
              ))}
            </div>
          </div>

          {result.bac > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <p className="text-xs font-semibold text-slate-400 mb-3">{t.sleepTitle}</p>
              <div className="grid grid-cols-4 gap-2">
                {sleepHours.map((h) => {
                  const bac = result.bacAfterSleep(h);
                  return (
                    <div key={h} className="text-center bg-slate-50 rounded-xl p-3">
                      <div className="text-xs text-slate-400 mb-1">{h}{t.sleepUnit}</div>
                      <div className={`text-sm font-bold ${getBacColor(bac)}`}>{bac.toFixed(4)}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {result.bac > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <p className="text-xs font-semibold text-slate-400 mb-3">{t.recoveryTitle}</p>
              <div className="flex justify-around text-center">
                <div>
                  <div className="text-xs text-slate-400 mb-1">{t.driveReady}</div>
                  <div className="text-xl font-bold text-orange-500">
                    {result.driveIn <= 0 ? t.driveReadyNow : `${t.aboutHours}${result.driveIn.toFixed(1)}${t.hoursUnit}`}
                  </div>
                </div>
                <div className="w-px bg-slate-200" />
                <div>
                  <div className="text-xs text-slate-400 mb-1">{t.sober}</div>
                  <div className="text-xl font-bold text-slate-600">{t.aboutHours}{result.soberIn.toFixed(1)}{t.hoursUnit}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
