import path from "node:path";
import {
  GROWTH_OUTPUT_DIR,
  STRATEGIC_ROUTES,
  collectPageRoutes,
  ensureDir,
  getPageMetric,
  getSummaryMetric,
  getQueryMetrics,
  isDirectRun,
  loadSeoInventory,
  loadSiteMetrics,
  toPercent,
  writeJson,
  writeText
} from "./growth-lib.mjs";

function buildObservations(routes, metrics, seoInventory) {
  const observations = [];
  const topPages = Array.isArray(metrics?.topPages) ? metrics.topPages : [];
  const topQueries = Array.isArray(metrics?.topQueries) ? metrics.topQueries : [];

  const lowCtrPages = topPages
    .filter((page) => (page.searchImpressions30d ?? 0) >= 100 && (page.ctr30d ?? 0) < 0.03)
    .sort((left, right) => (right.searchImpressions30d ?? 0) - (left.searchImpressions30d ?? 0))
    .slice(0, 2);

  for (const page of lowCtrPages) {
    observations.push({
      type: "ctr-opportunity",
      route: page.path,
      summary: `${page.path} is getting impressions but weak CTR.`,
      detail: `Impressions: ${page.searchImpressions30d ?? 0}, CTR: ${toPercent(page.ctr30d ?? 0)}`
    });
  }

  const lowCompletionPages = topPages
    .filter((page) => (page.sessions30d ?? 0) >= 20 && Number.isFinite(page.completionRate) && page.completionRate < 0.45)
    .sort((left, right) => (right.sessions30d ?? 0) - (left.sessions30d ?? 0))
    .slice(0, 2);

  for (const page of lowCompletionPages) {
    observations.push({
      type: "completion-opportunity",
      route: page.path,
      summary: `${page.path} has traffic but weak completion.`,
      detail: `Sessions: ${page.sessions30d ?? 0}, completion: ${toPercent(page.completionRate)}`
    });
  }

  for (const route of STRATEGIC_ROUTES) {
    const pageMetric = getPageMetric(metrics, route);
    const queryMetricCount = getQueryMetrics(metrics, route).length;

    if (!pageMetric && queryMetricCount === 0) {
      observations.push({
        type: "strategic-gap",
        route,
        summary: `${route} is strategic but has no normalized traffic evidence yet.`,
        detail: "Treat as a discovery or instrumentation gap until analytics is richer."
      });
    }
  }

  if ((seoInventory?.stats?.issues ?? 0) > 0) {
    observations.push({
      type: "seo-issues",
      route: null,
      summary: "Existing SEO inventory still reports unresolved issues.",
      detail: `Issue count: ${seoInventory.stats.issues}`
    });
  }

  if (topQueries.length === 0) {
    observations.push({
      type: "data-gap",
      route: null,
      summary: "No search query data is connected yet.",
      detail: "Connect Search Console exports to unlock CTR and keyword planning."
    });
  }

  if (topPages.length === 0) {
    observations.push({
      type: "data-gap",
      route: null,
      summary: "No page-level growth metrics are available yet.",
      detail: "Add normalized GA4 or analytics exports to growth/inputs/site-metrics.json."
    });
  }

  return observations;
}

function buildRecommendations(observations) {
  const recommendations = [];

  if (observations.some((item) => item.type === "ctr-opportunity")) {
    recommendations.push("Rewrite titles and descriptions on pages with high impressions but low CTR.");
  }

  if (observations.some((item) => item.type === "completion-opportunity")) {
    recommendations.push("Tighten above-the-fold copy and examples on pages with traffic but weak completion.");
  }

  if (observations.some((item) => item.type === "strategic-gap")) {
    recommendations.push("Strengthen internal links and supporting content around strategic routes that lack discovery.");
  }

  if (observations.some((item) => item.type === "data-gap")) {
    recommendations.push("Prioritize analytics normalization so future experiments are based on evidence, not guesses.");
  }

  if (recommendations.length === 0) {
    recommendations.push("Keep iterating on measured pages and add post-launch result tracking for each experiment.");
  }

  return recommendations;
}

export function generateGrowthReport() {
  ensureDir(GROWTH_OUTPUT_DIR);

  const siteMetricsBundle = loadSiteMetrics();
  const seoInventoryBundle = loadSeoInventory();
  const routes = collectPageRoutes();
  const siteMetrics = siteMetricsBundle.data ?? {};
  const seoInventory = seoInventoryBundle.data ?? {};

  const inventory = {
    totalRoutes: routes.length,
    toolRoutes: routes.filter((route) => route.kind === "tool").length,
    supportRoutes: routes.filter((route) => route.kind === "support").length,
    redirectRoutes: routes.filter((route) => route.kind === "redirect").length
  };

  const snapshot = {
    sessions30d: getSummaryMetric(siteMetrics, "sessions30d"),
    organicSessions30d: getSummaryMetric(siteMetrics, "organicSessions30d"),
    searchClicks30d: getSummaryMetric(siteMetrics, "searchClicks30d"),
    searchImpressions30d: getSummaryMetric(siteMetrics, "searchImpressions30d"),
    averageCtr30d: getSummaryMetric(siteMetrics, "averageCtr30d"),
    averagePosition30d: getSummaryMetric(siteMetrics, "averagePosition30d"),
    repeatUserRate30d: getSummaryMetric(siteMetrics, "repeatUserRate30d"),
    toolCompletionRate30d: getSummaryMetric(siteMetrics, "toolCompletionRate30d")
  };

  const observations = buildObservations(routes, siteMetrics, seoInventory);
  const recommendations = buildRecommendations(observations);

  const report = {
    generatedAt: new Date().toISOString(),
    sources: {
      metrics: {
        file: siteMetricsBundle.source,
        exampleData: siteMetricsBundle.isExample
      },
      seoInventory: {
        file: seoInventoryBundle.source,
        available: Boolean(seoInventory?.generated)
      }
    },
    inventory,
    snapshot,
    observations,
    recommendations,
    strategicRoutes: STRATEGIC_ROUTES,
    topPages: Array.isArray(siteMetrics.topPages) ? siteMetrics.topPages.slice(0, 10) : [],
    topQueries: Array.isArray(siteMetrics.topQueries) ? siteMetrics.topQueries.slice(0, 10) : []
  };

  const markdownLines = [
    "# Growth Report",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "## Sources",
    `- Metrics input: \`${report.sources.metrics.file}\`${report.sources.metrics.exampleData ? " (example data)" : ""}`,
    `- SEO inventory: \`${report.sources.seoInventory.file}\`${report.sources.seoInventory.available ? "" : " (not populated)"}`,
    "",
    "## Inventory",
    `- Total routes: ${inventory.totalRoutes}`,
    `- Tool routes: ${inventory.toolRoutes}`,
    `- Support routes: ${inventory.supportRoutes}`,
    `- Redirect routes: ${inventory.redirectRoutes}`,
    "",
    "## Snapshot",
    `- Sessions (30d): ${snapshot.sessions30d}`,
    `- Organic sessions (30d): ${snapshot.organicSessions30d}`,
    `- Search clicks (30d): ${snapshot.searchClicks30d}`,
    `- Search impressions (30d): ${snapshot.searchImpressions30d}`,
    `- Average CTR (30d): ${toPercent(snapshot.averageCtr30d)}`,
    `- Average position (30d): ${snapshot.averagePosition30d}`,
    `- Repeat user rate (30d): ${toPercent(snapshot.repeatUserRate30d)}`,
    `- Tool completion rate (30d): ${toPercent(snapshot.toolCompletionRate30d)}`,
    "",
    "## Observations"
  ];

  if (observations.length === 0) {
    markdownLines.push("- No clear growth observations were generated.");
  } else {
    for (const item of observations) {
      markdownLines.push(`- ${item.summary} ${item.detail ? `(${item.detail})` : ""}`);
    }
  }

  markdownLines.push("", "## Recommended Focus");
  for (const item of recommendations) {
    markdownLines.push(`- ${item}`);
  }

  const reportJsonPath = path.join(GROWTH_OUTPUT_DIR, "growth-report.json");
  const reportMarkdownPath = path.join(GROWTH_OUTPUT_DIR, "growth-report.md");

  writeJson(reportJsonPath, report);
  writeText(reportMarkdownPath, `${markdownLines.join("\n")}\n`);

  return {
    report,
    reportJsonPath,
    reportMarkdownPath
  };
}

if (isDirectRun(import.meta.url, process.argv[1])) {
  const { reportJsonPath, reportMarkdownPath } = generateGrowthReport();
  console.log(`Growth report written: ${path.relative(process.cwd(), reportJsonPath)}`);
  console.log(`Growth report markdown: ${path.relative(process.cwd(), reportMarkdownPath)}`);
}
