"use client";

/**
 * 광고 최적화 에이전트 컴포넌트
 * 역할: 광고 슬롯 A/B 테스트 + 클릭/노출 추적 + 위치 최적화
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// ─── 타입 ─────────────────────────────────────────────────────
type AdVariant = "A" | "B";
type AdSlot    = "sidebar-right" | "inline-top" | "inline-bottom";

interface AdStats {
  impressions: number;
  clicks:      number;
  slot:        AdSlot;
  variant:     AdVariant;
  lastSeen:    string;
}

type AdStatsStore = Record<string, AdStats>;

const STORAGE_KEY = "ad_optimizer_stats";

// ─── 유틸 ─────────────────────────────────────────────────────
function loadStats(): AdStatsStore {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveStats(stats: AdStatsStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

function getVariant(slot: AdSlot): AdVariant {
  // 슬롯별로 일관된 variant 배정 (방문 수 기반 순환)
  const stats = loadStats();
  const key   = slot;
  const entry = stats[key];
  if (!entry) return "A";
  // 50회마다 variant 전환
  return Math.floor(entry.impressions / 50) % 2 === 0 ? "A" : "B";
}

function trackImpression(slot: AdSlot, variant: AdVariant) {
  const stats = loadStats();
  const key   = slot;
  const prev  = stats[key] || { impressions: 0, clicks: 0, slot, variant, lastSeen: "" };
  stats[key]  = { ...prev, impressions: prev.impressions + 1, lastSeen: new Date().toISOString(), variant };
  saveStats(stats);
}

function trackClick(slot: AdSlot) {
  const stats = loadStats();
  const key   = slot;
  if (!stats[key]) return;
  stats[key].clicks += 1;
  saveStats(stats);
}

// ─── 광고 콘텐츠 (Variant A / B) ──────────────────────────────
function AdContent({ slot, variant }: { slot: AdSlot; variant: AdVariant }) {
  const isArticlePage = ["stocks", "bitcoin", "social"].some((c) =>
    typeof window !== "undefined" && window.location.pathname.includes(`/${c}/`)
  );

  // Variant A: 세로형 배너
  if (variant === "A") {
    return (
      <div className="bg-gradient-to-b from-slate-100 to-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 text-xs p-3 gap-1">
        <span className="text-lg">📢</span>
        <span className="font-medium text-slate-500">광고 영역</span>
        <span className="text-[10px]">160 × 600</span>
        <span className="text-[9px] text-slate-300 mt-1">variant A</span>
      </div>
    );
  }

  // Variant B: 콘텐츠형 (카드 스타일)
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg flex flex-col items-center justify-center text-blue-400 text-xs p-3 gap-1">
      <span className="text-lg">💡</span>
      <span className="font-medium text-blue-600">여기에 광고를</span>
      <span className="text-blue-500">문의: admin@site.com</span>
      <span className="text-[9px] text-blue-300 mt-1">variant B</span>
    </div>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────
interface AdOptimizerProps {
  slot:        AdSlot;
  width?:      number;
  height?:     number;
  className?:  string;
  showStats?:  boolean; // 개발 모드용
}

export default function AdOptimizer({
  slot,
  width   = 160,
  height  = 600,
  className = "",
  showStats = false,
}: AdOptimizerProps) {
  const [variant, setVariant]     = useState<AdVariant>("A");
  const [stats,   setStats]       = useState<AdStats | null>(null);
  const [mounted, setMounted]     = useState(false);
  const hasTracked                = useRef(false);
  const pathname                  = usePathname();

  useEffect(() => {
    setMounted(true);
    const v = getVariant(slot);
    setVariant(v);

    if (!hasTracked.current) {
      trackImpression(slot, v);
      hasTracked.current = true;
    }

    if (showStats) {
      const all = loadStats();
      setStats(all[slot] || null);
    }
  }, [slot, showStats]);

  // SSR 중에는 렌더링 안 함 (hydration 오류 방지)
  if (!mounted) {
    return (
      <div
        style={{ width, height: Math.min(height, 300) }}
        className={`bg-slate-100 rounded-lg ${className}`}
      />
    );
  }

  const ctr = stats && stats.impressions > 0
    ? ((stats.clicks / stats.impressions) * 100).toFixed(1)
    : "0.0";

  return (
    <div className={`relative ${className}`}>
      {/* 광고 영역 */}
      <div
        style={{ width, height }}
        className="cursor-pointer select-none"
        onClick={() => {
          trackClick(slot);
          if (showStats) {
            const all = loadStats();
            setStats(all[slot] || null);
          }
        }}
      >
        <AdContent slot={slot} variant={variant} />
      </div>

      {/* 개발 모드 통계 오버레이 */}
      {showStats && stats && (
        <div className="mt-2 text-[10px] text-slate-400 bg-slate-50 rounded p-2 leading-relaxed">
          <div>슬롯: <span className="font-mono">{slot}</span></div>
          <div>Variant: <span className="font-semibold">{variant}</span></div>
          <div>노출: {stats.impressions.toLocaleString()}</div>
          <div>클릭: {stats.clicks.toLocaleString()}</div>
          <div>CTR: {ctr}%</div>
        </div>
      )}
    </div>
  );
}

// ─── 전체 통계 조회 훅 (대시보드용) ───────────────────────────
export function useAdStats() {
  const [stats, setStats] = useState<AdStatsStore>({});

  useEffect(() => {
    setStats(loadStats());
    const interval = setInterval(() => setStats(loadStats()), 5000);
    return () => clearInterval(interval);
  }, []);

  const totalImpressions = Object.values(stats).reduce((s, v) => s + v.impressions, 0);
  const totalClicks      = Object.values(stats).reduce((s, v) => s + v.clicks, 0);
  const overallCTR       = totalImpressions > 0
    ? ((totalClicks / totalImpressions) * 100).toFixed(2)
    : "0.00";

  return { stats, totalImpressions, totalClicks, overallCTR };
}
