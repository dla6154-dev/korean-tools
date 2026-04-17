"use client";

import { useState } from "react";
import { useLanguage } from "../language-context";

const T = {
  ko: {
    title: "BMI · 칼로리 계산기",
    sub: "체질량지수와 하루 필요 칼로리를 계산해드려요",
    gender: "성별", male: "남성", female: "여성",
    height: "키", weight: "몸무게", age: "나이",
    heightUnit: "cm", weightUnit: "kg", ageUnit: "세",
    activity: "활동량",
    activityOptions: [
      { value: "1.2", label: "거의 운동 안 함 (앉아서 생활)" },
      { value: "1.375", label: "가벼운 운동 (주 1~3회)" },
      { value: "1.55", label: "보통 운동 (주 3~5회)" },
      { value: "1.725", label: "활발한 운동 (주 6~7회)" },
      { value: "1.9", label: "매우 격렬한 운동 (하루 2회 이상)" },
    ],
    calculate: "계산하기",
    error: "키, 몸무게, 나이를 모두 입력해주세요.",
    errorHeight: "키를 올바르게 입력해주세요. (cm)",
    errorWeight: "몸무게를 올바르게 입력해주세요. (kg)",
    bmiLabel: "BMI (체질량지수)",
    idealWeight: "정상 범위 체중 (BMI 18.5~23)",
    bmrLabel: "기초대사량 (kcal)", bmrSub: "아무것도 안 해도 소모",
    tdeeLabel: "하루 필요 칼로리 (kcal)", tdeeSub: "활동량 반영",
    goalsTitle: "목적별 권장 칼로리",
    goals: [
      { label: "체중 감량 (500kcal 적게)", offset: -500, color: "text-blue-500" },
      { label: "체중 유지", offset: 0, color: "text-green-500" },
      { label: "근육 증가 (300kcal 더)", offset: 300, color: "text-orange-500" },
    ],
    bmiCategories: {
      underweight: "저체중", normal: "정상", overweight: "과체중", obese: "비만", severeObese: "고도비만",
    },
    bmiBarLabels: ["저체중\n~18.5", "정상\n18.5~23", "과체중\n23~25", "비만\n25~30", "고도비만\n30~"],
  },
  en: {
    title: "BMI & Calorie Calculator",
    sub: "Calculate your Body Mass Index and daily calorie needs",
    gender: "Gender", male: "Male", female: "Female",
    height: "Height", weight: "Weight", age: "Age",
    heightUnit: "cm", weightUnit: "kg", ageUnit: "yrs",
    activity: "Activity level",
    activityOptions: [
      { value: "1.2", label: "Sedentary (little or no exercise)" },
      { value: "1.375", label: "Lightly active (1–3 days/week)" },
      { value: "1.55", label: "Moderately active (3–5 days/week)" },
      { value: "1.725", label: "Very active (6–7 days/week)" },
      { value: "1.9", label: "Super active (twice a day)" },
    ],
    calculate: "Calculate",
    error: "Please enter height, weight, and age.",
    errorHeight: "Please enter a valid height (cm).",
    errorWeight: "Please enter a valid weight (kg).",
    bmiLabel: "BMI (Body Mass Index)",
    idealWeight: "Healthy weight range (BMI 18.5–23)",
    bmrLabel: "BMR (kcal)", bmrSub: "Calories at rest",
    tdeeLabel: "Daily Calories (kcal)", tdeeSub: "With activity",
    goalsTitle: "Goal-based calorie intake",
    goals: [
      { label: "Weight loss (−500 kcal)", offset: -500, color: "text-blue-500" },
      { label: "Maintenance", offset: 0, color: "text-green-500" },
      { label: "Muscle gain (+300 kcal)", offset: 300, color: "text-orange-500" },
    ],
    bmiCategories: {
      underweight: "Underweight", normal: "Normal", overweight: "Overweight", obese: "Obese", severeObese: "Severely Obese",
    },
    bmiBarLabels: ["Under-\nweight\n~18.5", "Normal\n18.5–23", "Over-\nweight\n23–25", "Obese\n25–30", "Severely\nObese\n30+"],
  },
};

function getBmiCategory(bmi: number, cats: typeof T.ko.bmiCategories) {
  if (bmi < 18.5) return { label: cats.underweight, color: "text-blue-500", bg: "bg-blue-50" };
  if (bmi < 23) return { label: cats.normal, color: "text-green-500", bg: "bg-green-50" };
  if (bmi < 25) return { label: cats.overweight, color: "text-yellow-500", bg: "bg-yellow-50" };
  if (bmi < 30) return { label: cats.obese, color: "text-orange-500", bg: "bg-orange-50" };
  return { label: cats.severeObese, color: "text-red-500", bg: "bg-red-50" };
}

function getBmiBarPosition(bmi: number) {
  return Math.min(Math.max(((bmi - 15) / 25) * 100, 0), 100);
}

export default function BmiClient() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activityLevel, setActivityLevel] = useState("1.55");
  const [result, setResult] = useState<null | { bmi: number; bmr: number; tdee: number; idealWeightMin: number; idealWeightMax: number }>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const h = parseFloat(height), w = parseFloat(weight), a = parseFloat(age);
    if (!h || !w || !a || h <= 0 || w <= 0 || a <= 0) { setError(t.error); return; }
    if (h < 50 || h > 300) { setError(t.errorHeight); return; }
    if (w < 10 || w > 500) { setError(t.errorWeight); return; }
    const hm = h / 100;
    const bmi = w / (hm * hm);
    const bmr = gender === "male"
      ? 88.362 + 13.397 * w + 4.799 * h - 5.677 * a
      : 447.593 + 9.247 * w + 3.098 * h - 4.330 * a;
    const tdee = bmr * parseFloat(activityLevel);
    setResult({
      bmi: Math.round(bmi * 10) / 10,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      idealWeightMin: Math.round(18.5 * hm * hm * 10) / 10,
      idealWeightMax: Math.round(23 * hm * hm * 10) / 10,
    });
  }

  const category = result ? getBmiCategory(result.bmi, t.bmiCategories) : null;

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-slate-800">{t.title}</h1>
        <p className="text-slate-500 text-sm mt-1">{t.sub}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
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

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: t.height, placeholder: "170", unit: t.heightUnit, value: height, set: setHeight },
            { label: t.weight, placeholder: "65", unit: t.weightUnit, value: weight, set: setWeight },
            { label: t.age, placeholder: "30", unit: t.ageUnit, value: age, set: setAge },
          ].map(({ label, placeholder, unit, value, set }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
              <div className="relative">
                <input type="number" value={value} onChange={(e) => set(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && calculate()} placeholder={placeholder}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 pr-8" />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">{unit}</span>
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">{t.activity}</label>
          <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
            {t.activityOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button onClick={calculate} disabled={!height || !weight || !age}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white font-semibold py-3 rounded-lg transition-colors">
          {t.calculate}
        </button>
      </div>

      {result && category && (
        <div className="space-y-4">
          <div className={`rounded-2xl p-6 ${category.bg}`}>
            <div className="text-center mb-4">
              <div className={`text-5xl font-bold ${category.color}`}>{result.bmi}</div>
              <div className={`text-lg font-semibold mt-1 ${category.color}`}>{category.label}</div>
              <div className="text-slate-400 text-sm mt-0.5">{t.bmiLabel}</div>
            </div>
            <div className="relative mt-2">
              <div className="flex h-3 rounded-full overflow-hidden">
                <div className="bg-blue-300" style={{ width: "23.3%" }} />
                <div className="bg-green-300" style={{ width: "18.7%" }} />
                <div className="bg-yellow-300" style={{ width: "13.3%" }} />
                <div className="bg-orange-300" style={{ width: "20%" }} />
                <div className="bg-red-300" style={{ width: "24.7%" }} />
              </div>
              <div className="absolute top-0 w-3 h-3 bg-slate-700 rounded-full border-2 border-white shadow -translate-x-1/2"
                style={{ left: `${getBmiBarPosition(result.bmi)}%` }} />
              <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                {t.bmiBarLabels.map((l, i) => (
                  <span key={i} className={i === 0 ? "" : i === t.bmiBarLabels.length - 1 ? "text-right" : "text-center"} style={{ whiteSpace: "pre" }}>{l}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-400 mb-3">{t.idealWeight}</p>
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-slate-700">
              <span>{result.idealWeightMin}kg</span>
              <span className="text-slate-300 text-lg">~</span>
              <span>{result.idealWeightMax}kg</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 text-center">
              <div className="text-2xl font-bold text-slate-700">{result.bmr.toLocaleString()}</div>
              <div className="text-xs text-slate-400 mt-1">{t.bmrLabel}</div>
              <div className="text-xs text-slate-300 mt-0.5">{t.bmrSub}</div>
            </div>
            <div className="bg-blue-500 rounded-2xl p-4 text-center text-white">
              <div className="text-2xl font-bold">{result.tdee.toLocaleString()}</div>
              <div className="text-xs text-blue-100 mt-1">{t.tdeeLabel}</div>
              <div className="text-xs text-blue-200 mt-0.5">{t.tdeeSub}</div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5">
            <p className="text-xs font-semibold text-slate-400 mb-3">{t.goalsTitle}</p>
            <div className="space-y-2">
              {t.goals.map(({ label, offset, color }) => (
                <div key={label} className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className={`font-bold ${color}`}>{(result.tdee + offset).toLocaleString()} kcal</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
