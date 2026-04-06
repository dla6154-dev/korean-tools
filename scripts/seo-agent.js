/**
 * SEO 최적화 에이전트
 * 역할: 콘텐츠 품질 검사 + sitemap 자동 갱신 + robots.txt 생성
 * 실행: node scripts/seo-agent.js
 */

const fs   = require("fs");
const path = require("path");

const BASE_URL   = "https://rate-snap.com";
const ROOT       = path.join(__dirname, "..");
const DATA_DIR   = path.join(ROOT, "app/data");
const PUBLIC_DIR = path.join(ROOT, "public");
const APP_DIR    = path.join(ROOT, "app");

// ─── 유틸 ─────────────────────────────────────────────────────
function readJSON(file) {
  const fp = path.join(DATA_DIR, file);
  if (!fs.existsSync(fp)) return [];
  try { return JSON.parse(fs.readFileSync(fp, "utf-8")); }
  catch { return []; }
}

function warn(msg)  { console.warn(`  ⚠️  ${msg}`); }
function info(msg)  { console.log (`  ℹ️  ${msg}`); }
function ok(msg)    { console.log (`  ✅ ${msg}`); }

// ─── 1. 콘텐츠 품질 검사 ──────────────────────────────────────
function checkQuality(category, articles) {
  let issues = 0;
  for (const a of articles) {
    if (!a.slug)                    { warn(`[${category}] slug 없음`); issues++; }
    if (!a.title || a.title.length < 5)  { warn(`[${category}:${a.slug}] title 너무 짧음`); issues++; }
    if (!a.summary || a.summary.length < 10) { warn(`[${category}:${a.slug}] summary 없음/짧음`); issues++; }
    if (!a.content || a.content.length < 100) { warn(`[${category}:${a.slug}] content 너무 짧음`); issues++; }
    if (!a.date)                    { warn(`[${category}:${a.slug}] date 없음`); issues++; }
  }
  return issues;
}

// ─── 2. robots.txt 생성 ───────────────────────────────────────
function ensureRobots() {
  const robotsPath = path.join(PUBLIC_DIR, "robots.txt");
  if (fs.existsSync(robotsPath)) {
    ok("robots.txt 이미 존재");
    return;
  }
  const content = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${BASE_URL}/sitemap.xml`,
    "",
    "# 자동 생성 — seo-agent.js",
  ].join("\n");
  fs.writeFileSync(robotsPath, content, "utf-8");
  ok("robots.txt 생성 완료");
}

// ─── 3. sitemap.ts 동적 업데이트 ──────────────────────────────
function updateSitemap(stats) {
  const sitemapPath = path.join(APP_DIR, "sitemap.ts");

  const staticPaths = [
    { url: BASE_URL,                priority: 1.0,  freq: "daily"   },
    { url: `${BASE_URL}/stocks`,    priority: 0.95, freq: "daily"   },
    { url: `${BASE_URL}/us-stocks`, priority: 0.95, freq: "daily"   },
    { url: `${BASE_URL}/bitcoin`,   priority: 0.95, freq: "daily"   },
    { url: `${BASE_URL}/social`,    priority: 0.9,  freq: "daily"   },
    { url: `${BASE_URL}/age`,       priority: 0.8,  freq: "monthly" },
    { url: `${BASE_URL}/anniversary`,priority:0.8,  freq: "monthly" },
    { url: `${BASE_URL}/dday`,      priority: 0.8,  freq: "monthly" },
    { url: `${BASE_URL}/bmi`,       priority: 0.8,  freq: "monthly" },
    { url: `${BASE_URL}/characters`,priority: 0.8,  freq: "monthly" },
    { url: `${BASE_URL}/loan`,      priority: 0.8,  freq: "monthly" },
    { url: `${BASE_URL}/severance`, priority: 0.75, freq: "monthly" },
    { url: `${BASE_URL}/alcohol`,   priority: 0.75, freq: "monthly" },
    { url: `${BASE_URL}/chosung`,   priority: 0.75, freq: "monthly" },
    { url: `${BASE_URL}/keyboard`,  priority: 0.75, freq: "monthly" },
    { url: `${BASE_URL}/image-compress`, priority: 0.75, freq: "monthly" },
    { url: `${BASE_URL}/en`,        priority: 0.85, freq: "monthly" },
  ];

  const newContent = `import type { MetadataRoute } from "next";
import bitcoinData  from "./data/bitcoin.json";
import stocksData   from "./data/stocks.json";
import usStocksData from "./data/us-stocks.json";
import socialData   from "./data/social.json";

type Article = { slug: string; date?: string };

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "${BASE_URL}";

  const staticPaths: MetadataRoute.Sitemap = [
${staticPaths.map((p) =>
  `    { url: "${p.url}", lastModified: new Date(), changeFrequency: "${p.freq}", priority: ${p.priority} },`
).join("\n")}
  ];

  const articlePaths = (
    category: string,
    articles: Article[],
    priority: number
  ): MetadataRoute.Sitemap =>
    articles.map((a) => ({
      url: \`\${baseUrl}/\${category}/\${a.slug}\`,
      lastModified: a.date ? new Date(a.date) : new Date(),
      changeFrequency: "weekly" as const,
      priority,
    }));

  return [
    ...staticPaths,
    ...articlePaths("stocks",    stocksData    as Article[], 0.85),
    ...articlePaths("us-stocks", usStocksData  as Article[], 0.85),
    ...articlePaths("bitcoin",   bitcoinData   as Article[], 0.85),
    ...articlePaths("social",    socialData    as Article[], 0.8),
  ];
}
`;

  fs.writeFileSync(sitemapPath, newContent, "utf-8");
  ok(`sitemap.ts 업데이트 완료 (기사 ${stats.total}개 포함)`);
}

// ─── 4. SEO 통계 리포트 생성 ──────────────────────────────────
function writeReport(stats) {
  const reportPath = path.join(DATA_DIR, "seo-report.json");
  const report = {
    generated: new Date().toISOString(),
    stats,
    baseUrl: BASE_URL,
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf-8");
  ok(`seo-report.json 저장 완료`);
}

// ─── 메인 ─────────────────────────────────────────────────────
function main() {
  console.log("🔍 SEO 에이전트 실행\n");

  const stocks   = readJSON("stocks.json");
  const usStocks = readJSON("us-stocks.json");
  const bitcoin  = readJSON("bitcoin.json");
  const social   = readJSON("social.json");

  console.log("── 콘텐츠 품질 검사");
  let totalIssues = 0;
  totalIssues += checkQuality("stocks",    stocks);
  totalIssues += checkQuality("us-stocks", usStocks);
  totalIssues += checkQuality("bitcoin",   bitcoin);
  totalIssues += checkQuality("social",    social);
  if (!totalIssues) ok("품질 검사 이상 없음");

  console.log("\n── robots.txt");
  ensureRobots();

  const stats = {
    stocks:    { count: stocks.length,   latestDate: stocks[0]?.date    || null },
    usStocks:  { count: usStocks.length, latestDate: usStocks[0]?.date  || null },
    bitcoin:   { count: bitcoin.length,  latestDate: bitcoin[0]?.date   || null },
    social:    { count: social.length,   latestDate: social[0]?.date    || null },
    total:     stocks.length + usStocks.length + bitcoin.length + social.length,
    issues:    totalIssues,
  };

  console.log("\n── sitemap.ts 갱신");
  updateSitemap(stats);

  console.log("\n── SEO 리포트");
  writeReport(stats);

  console.log(`\n📈 요약`);
  console.log(`   국내주식: ${stats.stocks.count}개 (최신: ${stats.stocks.latestDate || "없음"})`);
  console.log(`   미국주식: ${stats.usStocks.count}개 (최신: ${stats.usStocks.latestDate || "없음"})`);
  console.log(`   코인: ${stats.bitcoin.count}개 (최신: ${stats.bitcoin.latestDate || "없음"})`);
  console.log(`   사회: ${stats.social.count}개 (최신: ${stats.social.latestDate || "없음"})`);
  console.log(`   총 이슈: ${totalIssues}개`);
  console.log(`\n✅ SEO 에이전트 완료`);
}

main();
