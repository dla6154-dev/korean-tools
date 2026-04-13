"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useLanguage } from "../language-context";

const T = {
  ko: {
    title: "사다리타기",
    subtitle: "공정한 제비뽑기, 사다리로 결정하세요",
    playersLabel: "참가자",
    resultsLabel: "결과",
    playerPlaceholder: (i: number) => `참가자 ${i + 1}`,
    resultPlaceholder: (i: number) => `결과 ${i + 1}`,
    addPlayer: "참가자 추가",
    removePlayer: "삭제",
    generateButton: "사다리 생성",
    regenerate: "다시 생성",
    pickAll: "전체 공개",
    resetButton: "초기화",
    clickToReveal: "클릭해서 결과 확인",
    resultLabel: "결과",
    maxWarning: "최대 6명까지 가능합니다.",
    minWarning: "최소 2명이 필요합니다.",
    statusReady: "사다리가 생성됐어요",
    statusReadyBody: "참가자 이름을 클릭해 경로를 확인하세요.",
    statusDone: "전체 공개 완료",
    hintLabel: "이용 안내",
    hints: [
      "참가자 이름과 결과를 입력하고 사다리를 생성하세요.",
      "참가자 이름을 클릭하면 경로 애니메이션이 실행됩니다.",
      "전체 공개 버튼으로 모든 결과를 한번에 확인할 수 있습니다.",
    ],
  },
  en: {
    title: "Ladder Game",
    subtitle: "Fair drawing made fun with a ladder",
    playersLabel: "Players",
    resultsLabel: "Results",
    playerPlaceholder: (i: number) => `Player ${i + 1}`,
    resultPlaceholder: (i: number) => `Result ${i + 1}`,
    addPlayer: "Add player",
    removePlayer: "Remove",
    generateButton: "Generate ladder",
    regenerate: "Regenerate",
    pickAll: "Reveal all",
    resetButton: "Reset",
    clickToReveal: "Click to reveal",
    resultLabel: "Result",
    maxWarning: "Maximum 6 players allowed.",
    minWarning: "At least 2 players required.",
    statusReady: "Ladder is ready",
    statusReadyBody: "Click a player name to trace their path.",
    statusDone: "All revealed",
    hintLabel: "How to use",
    hints: [
      "Enter player names and results, then generate the ladder.",
      "Click a player name to animate their path.",
      "Use 'Reveal all' to show all results at once.",
    ],
  },
};

type Rung = { col: number; row: number };
type LadderState = {
  rungs: Rung[];
  paths: number[]; // paths[i] = result index for player i
};

const NUM_ROWS = 18;
const SVG_PADDING_X = 40;
const SVG_PADDING_TOP = 0;
const SVG_PADDING_BOTTOM = 0;
const SVG_HEIGHT = 340;

function generateLadder(numPlayers: number): LadderState {
  const rungs: Rung[] = [];
  const numGaps = numPlayers - 1;

  for (let row = 0; row < NUM_ROWS; row++) {
    const used = new Set<number>();
    for (let col = 0; col < numGaps; col++) {
      if (used.has(col)) continue;
      if (Math.random() < 0.38) {
        rungs.push({ col, row });
        used.add(col);
        used.add(col + 1);
      }
    }
  }

  // Compute paths
  const paths = Array.from({ length: numPlayers }, (_, start) => {
    let col = start;
    for (let row = 0; row < NUM_ROWS; row++) {
      const rightRung = rungs.find((r) => r.col === col && r.row === row);
      const leftRung = col > 0 ? rungs.find((r) => r.col === col - 1 && r.row === row) : undefined;
      if (rightRung) col += 1;
      else if (leftRung) col -= 1;
    }
    return col;
  });

  return { rungs, paths };
}

function getColX(col: number, numPlayers: number, svgWidth: number) {
  const usable = svgWidth - SVG_PADDING_X * 2;
  return SVG_PADDING_X + (col / (numPlayers - 1)) * usable;
}

function getRowY(row: number) {
  const usable = SVG_HEIGHT - SVG_PADDING_TOP - SVG_PADDING_BOTTOM;
  return SVG_PADDING_TOP + (row / NUM_ROWS) * usable;
}

function buildPathD(playerIdx: number, rungs: Rung[], numPlayers: number, svgWidth: number): string {
  let col = playerIdx;
  let y = getRowY(0);
  const x = getColX(col, numPlayers, svgWidth);
  let d = `M ${x} ${y}`;

  for (let row = 0; row < NUM_ROWS; row++) {
    const nextY = getRowY(row + 1);
    const rightRung = rungs.find((r) => r.col === col && r.row === row);
    const leftRung = col > 0 ? rungs.find((r) => r.col === col - 1 && r.row === row) : undefined;

    if (rightRung) {
      const midY = getRowY(row) + (getRowY(row + 1) - getRowY(row)) * 0.5;
      const newCol = col + 1;
      const newX = getColX(newCol, numPlayers, svgWidth);
      const oldX = getColX(col, numPlayers, svgWidth);
      d += ` L ${oldX} ${midY} L ${newX} ${midY} L ${newX} ${nextY}`;
      col = newCol;
    } else if (leftRung) {
      const midY = getRowY(row) + (getRowY(row + 1) - getRowY(row)) * 0.5;
      const newCol = col - 1;
      const newX = getColX(newCol, numPlayers, svgWidth);
      const oldX = getColX(col, numPlayers, svgWidth);
      d += ` L ${oldX} ${midY} L ${newX} ${midY} L ${newX} ${nextY}`;
      col = newCol;
    } else {
      d += ` L ${getColX(col, numPlayers, svgWidth)} ${nextY}`;
    }
    y = nextY;
  }

  return d;
}

const PLAYER_COLORS = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899",
];

export default function LadderClient() {
  const { lang } = useLanguage();
  const t = T[lang];

  const [players, setPlayers] = useState(["", "", "", ""]);
  const [results, setResults] = useState(["", "", "", ""]);
  const [ladder, setLadder] = useState<LadderState | null>(null);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [animating, setAnimating] = useState<number | null>(null);
  const [animProgress, setAnimProgress] = useState(0);
  const [warning, setWarning] = useState("");
  const [svgWidth, setSvgWidth] = useState(400);
  const svgRef = useRef<SVGSVGElement>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    function updateWidth() {
      if (svgRef.current) {
        setSvgWidth(svgRef.current.clientWidth || 400);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [ladder]);

  const numPlayers = players.length;

  function addPlayer() {
    if (players.length >= 6) { setWarning(t.maxWarning); return; }
    setPlayers((p) => [...p, ""]);
    setResults((r) => [...r, ""]);
    setLadder(null);
    setRevealed(new Set());
    setWarning("");
  }

  function removePlayer(idx: number) {
    if (players.length <= 2) { setWarning(t.minWarning); return; }
    setPlayers((p) => p.filter((_, i) => i !== idx));
    setResults((r) => r.filter((_, i) => i !== idx));
    setLadder(null);
    setRevealed(new Set());
    setWarning("");
  }

  function generate() {
    if (players.length < 2) { setWarning(t.minWarning); return; }
    setWarning("");
    const newLadder = generateLadder(numPlayers);
    setLadder(newLadder);
    setRevealed(new Set());
    setAnimating(null);
    setAnimProgress(0);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  }

  const animatePath = useCallback((playerIdx: number) => {
    if (!ladder) return;
    if (animating !== null) return;
    setAnimating(playerIdx);
    setAnimProgress(0);

    const startTime = performance.now();
    const duration = 1200;

    function frame(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      setAnimProgress(progress);
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(frame);
      } else {
        setAnimating(null);
        setRevealed((prev) => new Set([...prev, playerIdx]));
      }
    }
    animFrameRef.current = requestAnimationFrame(frame);
  }, [ladder, animating]);

  function revealAll() {
    if (!ladder) return;
    setRevealed(new Set(Array.from({ length: numPlayers }, (_, i) => i)));
    setAnimating(null);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  }

  function reset() {
    setLadder(null);
    setRevealed(new Set());
    setAnimating(null);
    setAnimProgress(0);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  }

  const allRevealed = ladder !== null && revealed.size === numPlayers;

  return (
    <div className="bg-[radial-gradient(circle_at_top,_rgba(209,250,229,0.6),_rgba(248,250,252,1)_40%)] min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🪜</div>
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{t.title}</h1>
          <p className="mt-2 text-slate-500">{t.subtitle}</p>
        </div>

        {!ladder ? (
          /* Setup panel */
          <div className="space-y-4">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid grid-cols-2 gap-6">
                {/* Players */}
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                    {t.playersLabel}
                  </div>
                  <div className="space-y-2">
                    {players.map((p, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div
                          className="h-4 w-4 shrink-0 rounded-full"
                          style={{ backgroundColor: PLAYER_COLORS[i] }}
                        />
                        <input
                          type="text"
                          value={p}
                          onChange={(e) => {
                            const next = [...players];
                            next[i] = e.target.value;
                            setPlayers(next);
                          }}
                          placeholder={t.playerPlaceholder(i)}
                          className="flex-1 min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                        />
                        {players.length > 2 && (
                          <button
                            onClick={() => removePlayer(i)}
                            className="text-slate-300 hover:text-rose-400 text-lg leading-none"
                          >×</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Results */}
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                    {t.resultsLabel}
                  </div>
                  <div className="space-y-2">
                    {results.map((r, i) => (
                      <input
                        key={i}
                        type="text"
                        value={r}
                        onChange={(e) => {
                          const next = [...results];
                          next[i] = e.target.value;
                          setResults(next);
                        }}
                        placeholder={t.resultPlaceholder(i)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 items-center justify-between">
                {players.length < 6 && (
                  <button
                    onClick={addPlayer}
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                  >
                    + {t.addPlayer}
                  </button>
                )}
                {warning && <p className="text-sm text-rose-500">{warning}</p>}
              </div>
            </div>

            {/* Hints */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
              <div className="text-xs font-semibold text-amber-700 mb-2">{t.hintLabel}</div>
              <div className="space-y-1">
                {t.hints.map((h) => (
                  <p key={h} className="flex gap-2 text-sm text-slate-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                    <span>{h}</span>
                  </p>
                ))}
              </div>
            </div>

            <button
              onClick={generate}
              className="w-full rounded-2xl bg-emerald-500 py-4 text-base font-bold text-white shadow transition hover:bg-emerald-600"
            >
              🪜 {t.generateButton}
            </button>
          </div>
        ) : (
          /* Ladder game view */
          <div className="space-y-4">
            {/* Status bar */}
            <div className={`rounded-2xl border px-5 py-4 flex items-center gap-3 ${
              allRevealed
                ? "border-emerald-200 bg-emerald-50"
                : "border-blue-200 bg-blue-50"
            }`}>
              <span className="text-2xl">{allRevealed ? "🎉" : "👆"}</span>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {allRevealed ? t.statusDone : t.statusReady}
                </p>
                {!allRevealed && (
                  <p className="text-xs text-slate-500">{t.statusReadyBody}</p>
                )}
              </div>
            </div>

            {/* Player name buttons (top) */}
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${numPlayers}, 1fr)` }}
            >
              {players.map((p, i) => (
                <button
                  key={i}
                  onClick={() => !revealed.has(i) && animating === null && animatePath(i)}
                  disabled={revealed.has(i) || animating !== null}
                  className={`rounded-xl px-2 py-2.5 text-sm font-bold transition ${
                    revealed.has(i)
                      ? "cursor-default opacity-60"
                      : animating === i
                        ? "opacity-80 scale-95"
                        : "hover:scale-105 hover:shadow cursor-pointer"
                  }`}
                  style={{
                    backgroundColor: `${PLAYER_COLORS[i]}20`,
                    borderWidth: 2,
                    borderColor: PLAYER_COLORS[i],
                    color: PLAYER_COLORS[i],
                  }}
                >
                  {p || t.playerPlaceholder(i)}
                </button>
              ))}
            </div>

            {/* SVG Ladder */}
            <div className="rounded-[20px] border border-slate-200 bg-white overflow-hidden shadow-sm">
              <svg
                ref={svgRef}
                viewBox={`0 0 ${svgWidth} ${SVG_HEIGHT}`}
                width="100%"
                height={SVG_HEIGHT}
                className="block"
              >
                {/* Vertical lines */}
                {Array.from({ length: numPlayers }, (_, i) => (
                  <line
                    key={`v-${i}`}
                    x1={getColX(i, numPlayers, svgWidth)}
                    y1={getRowY(0)}
                    x2={getColX(i, numPlayers, svgWidth)}
                    y2={getRowY(NUM_ROWS)}
                    stroke="#cbd5e1"
                    strokeWidth={2}
                  />
                ))}

                {/* Horizontal rungs */}
                {ladder.rungs.map((rung, idx) => (
                  <line
                    key={`h-${idx}`}
                    x1={getColX(rung.col, numPlayers, svgWidth)}
                    y1={getRowY(rung.row) + (getRowY(rung.row + 1) - getRowY(rung.row)) * 0.5}
                    x2={getColX(rung.col + 1, numPlayers, svgWidth)}
                    y2={getRowY(rung.row) + (getRowY(rung.row + 1) - getRowY(rung.row)) * 0.5}
                    stroke="#94a3b8"
                    strokeWidth={2}
                  />
                ))}

                {/* Revealed paths */}
                {[...revealed].map((playerIdx) => {
                  const d = buildPathD(playerIdx, ladder.rungs, numPlayers, svgWidth);
                  return (
                    <path
                      key={`path-${playerIdx}`}
                      d={d}
                      fill="none"
                      stroke={PLAYER_COLORS[playerIdx]}
                      strokeWidth={4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={0.85}
                    />
                  );
                })}

                {/* Animating path (clipped) */}
                {animating !== null && (() => {
                  const d = buildPathD(animating, ladder.rungs, numPlayers, svgWidth);
                  const totalLength = 9999; // approximate — use stroke-dashoffset trick
                  const drawn = animProgress * totalLength;
                  return (
                    <path
                      d={d}
                      fill="none"
                      stroke={PLAYER_COLORS[animating]}
                      strokeWidth={4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={`${drawn} ${totalLength}`}
                      opacity={0.9}
                    />
                  );
                })()}
              </svg>
            </div>

            {/* Result boxes (bottom) */}
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${numPlayers}, 1fr)` }}
            >
              {Array.from({ length: numPlayers }, (_, i) => {
                // Find which player lands here
                const playerWhoLandsHere = ladder.paths.findIndex((dest) => dest === i);
                const isRevealed = revealed.has(playerWhoLandsHere);
                const resultText = results[i] || t.resultPlaceholder(i);

                return (
                  <div
                    key={i}
                    className={`rounded-xl px-2 py-2.5 text-center text-sm font-bold transition-all ${
                      isRevealed
                        ? "border-2 shadow-sm"
                        : "border-2 border-dashed border-slate-200 bg-slate-50 text-slate-300"
                    }`}
                    style={
                      isRevealed
                        ? {
                            borderColor: PLAYER_COLORS[playerWhoLandsHere],
                            backgroundColor: `${PLAYER_COLORS[playerWhoLandsHere]}15`,
                            color: PLAYER_COLORS[playerWhoLandsHere],
                          }
                        : {}
                    }
                  >
                    {isRevealed ? resultText : "?"}
                  </div>
                );
              })}
            </div>

            {/* Result summary */}
            {revealed.size > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="space-y-2">
                  {[...revealed].sort().map((playerIdx) => {
                    const resultIdx = ladder.paths[playerIdx];
                    return (
                      <div key={playerIdx} className="flex items-center justify-between rounded-xl px-4 py-2.5"
                        style={{ backgroundColor: `${PLAYER_COLORS[playerIdx]}12` }}
                      >
                        <span className="font-semibold text-slate-800" style={{ color: PLAYER_COLORS[playerIdx] }}>
                          {players[playerIdx] || t.playerPlaceholder(playerIdx)}
                        </span>
                        <span className="text-slate-600 font-bold">
                          → {results[resultIdx] || t.resultPlaceholder(resultIdx)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={revealAll}
                disabled={allRevealed || animating !== null}
                className="rounded-2xl bg-emerald-500 py-3 text-sm font-bold text-white hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {t.pickAll}
              </button>
              <button
                onClick={generate}
                disabled={animating !== null}
                className="rounded-2xl border-2 border-emerald-200 bg-white py-3 text-sm font-bold text-emerald-600 hover:bg-emerald-50 disabled:opacity-40"
              >
                🔄 {t.regenerate}
              </button>
              <button
                onClick={reset}
                className="rounded-2xl border-2 border-slate-200 bg-white py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                ✏️ {t.resetButton}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
