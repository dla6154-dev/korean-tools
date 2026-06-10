import path from "node:path";
import {
  GROWTH_OUTPUT_DIR,
  STRATEGIC_ROUTES,
  getPageMetric,
  getQueryMetrics,
  isDirectRun,
  loadRubric,
  loadSiteMetrics,
  toPercent,
  truncate,
  weightedScore,
  writeJson,
  writeText
} from "./growth-lib.mjs";
import { generateGrowthReport } from "./growth-report.mjs";

function buildMetadataExperiment(route, pageMetric, queryMetrics) {
  const leadQuery = queryMetrics[0];
  return {
    id: `metadata-refresh:${route}`,
    route,
    type: "metadata-refresh",
    title: `Refresh metadata for ${route}`,
    hypothesis: "Improved title and description should increase CTR on existing impressions.",
    evidence: [
      `Impressions: ${pageMetric?.searchImpressions30d ?? 0}`,
      `CTR: ${toPercent(pageMetric?.ctr30d ?? 0)}`,
      leadQuery ? `Lead query: ${leadQuery.query}` : "No query-level detail attached"
    ],
    suggestedChange: "Rewrite title, description, and top summary copy to match the dominant search intent.",
    dimensions: {
      trafficPotential: (pageMetric?.searchImpressions30d ?? 0) >= 500 ? 5 : 4,
      evidenceStrength: leadQuery ? 5 : 4,
      userValue: 4,
      implementationEase: 5,
      seoSafety: 4
    }
  };
}

function buildCompletionExperiment(route, pageMetric) {
  return {
    id: `ux-completion:${route}`,
    route,
    type: "ux-completion",
    title: `Improve completion flow for ${route}`,
    hypothesis: "Sharper examples and output framing should turn more visits into successful tool usage.",
    evidence: [
      `Sessions: ${pageMetric?.sessions30d ?? 0}`,
      `Completion rate: ${toPercent(pageMetric?.completionRate ?? 0)}`
    ],
    suggestedChange: "Tighten above-the-fold instructions, add example inputs, and shorten the path to the first successful result.",
    dimensions: {
      trafficPotential: 4,
      evidenceStrength: 5,
      userValue: 5,
      implementationEase: 3,
      seoSafety: 4
    }
  };
}

function buildInternalLinkExperiment(route) {
  return {
    id: `internal-links:${route}`,
    route,
    type: "internal-linking",
    title: `Strengthen discovery for ${route}`,
    hypothesis: "More internal links and related-tool references should improve crawl signals and surface the page to users.",
    evidence: [
      "Strategic route is present in the site but lacks clear normalized discovery signals."
    ],
    suggestedChange: "Add homepage and related-tool links, plus supporting FAQ or comparison copy pointing into the route.",
    dimensions: {
      trafficPotential: 4,
      evidenceStrength: 2,
      userValue: 4,
      implementationEase: 4,
      seoSafety: 5
    }
  };
}

function buildInstrumentationExperiment() {
  return {
    id: "instrumentation:normalized-metrics",
    route: null,
    type: "instrumentation",
    title: "Finish normalized growth instrumentation",
    hypothesis: "Better normalized analytics unlocks safer and more accurate experiment selection.",
    evidence: [
      "Top page or query data is missing or still using example values."
    ],
    suggestedChange: "Connect GA4 and Search Console exports into growth/inputs/site-metrics.json and add page-level completion events.",
    dimensions: {
      trafficPotential: 3,
      evidenceStrength: 5,
      userValue: 4,
      implementationEase: 3,
      seoSafety: 5
    }
  };
}

function dedupeExperiments(experiments) {
  const seen = new Set();
  return experiments.filter((experiment) => {
    if (seen.has(experiment.id)) {
      return false;
    }

    seen.add(experiment.id);
    return true;
  });
}

export function generateGrowthPlan() {
  const { report } = generateGrowthReport();
  const siteMetricsBundle = loadSiteMetrics();
  const metrics = siteMetricsBundle.data ?? {};
  const rubric = loadRubric();
  const usingExampleData = siteMetricsBundle.isExample;
  const experiments = [];

  for (const route of STRATEGIC_ROUTES) {
    const pageMetric = getPageMetric(metrics, route);
    const queryMetrics = getQueryMetrics(metrics, route)
      .sort((left, right) => (right.impressions30d ?? 0) - (left.impressions30d ?? 0));

    if (pageMetric && (pageMetric.searchImpressions30d ?? 0) >= 100 && (pageMetric.ctr30d ?? 0) < 0.03) {
      experiments.push(buildMetadataExperiment(route, pageMetric, queryMetrics));
    }

    if (pageMetric && (pageMetric.sessions30d ?? 0) >= 20 && Number.isFinite(pageMetric.completionRate) && pageMetric.completionRate < 0.45) {
      experiments.push(buildCompletionExperiment(route, pageMetric));
    }

    if (!pageMetric && queryMetrics.length === 0) {
      experiments.push(buildInternalLinkExperiment(route));
    }
  }

  if (report.sources.metrics.exampleData || (Array.isArray(metrics.topPages) ? metrics.topPages.length : 0) === 0) {
    experiments.push(buildInstrumentationExperiment());
  }

  const ranked = dedupeExperiments(experiments)
    .map((experiment) => {
      const score = weightedScore(experiment.dimensions, rubric);
      const defaultDecision =
        score >= (rubric.thresholds?.auto_pr_candidate ?? 78)
          ? "auto_pr_candidate"
          : score >= (rubric.thresholds?.manual_review ?? 60)
            ? "manual_review"
            : "backlog";
      const decision = usingExampleData && defaultDecision === "auto_pr_candidate"
        ? "manual_review"
        : defaultDecision;

      return {
        ...experiment,
        score,
        decision
      };
    })
    .sort((left, right) => right.score - left.score);

  const plan = {
    generatedAt: new Date().toISOString(),
    metricsSource: siteMetricsBundle.source,
    exampleData: usingExampleData,
    rubricVersion: rubric.version ?? 1,
    experiments: ranked
  };

  const markdownLines = [
    "# Growth Plan",
    "",
    `Generated: ${plan.generatedAt}`,
    `Metrics source: \`${plan.metricsSource}\`${plan.exampleData ? " (example data)" : ""}`,
    "",
    "## Ranked Experiments"
  ];

  if (ranked.length === 0) {
    markdownLines.push("- No experiments were generated.");
  } else {
    for (const experiment of ranked) {
      markdownLines.push(`- **${experiment.title}**`);
      markdownLines.push(`  Score: ${experiment.score} / 100`);
      markdownLines.push(`  Decision: ${experiment.decision}`);
      markdownLines.push(`  Route: ${experiment.route ?? "site-wide"}`);
      markdownLines.push(`  Hypothesis: ${experiment.hypothesis}`);
      markdownLines.push(`  Change: ${truncate(experiment.suggestedChange, 180)}`);
      markdownLines.push(`  Evidence: ${experiment.evidence.join(" | ")}`);
    }
  }

  const planJsonPath = path.join(GROWTH_OUTPUT_DIR, "growth-plan.json");
  const planMarkdownPath = path.join(GROWTH_OUTPUT_DIR, "growth-plan.md");

  writeJson(planJsonPath, plan);
  writeText(planMarkdownPath, `${markdownLines.join("\n")}\n`);

  return {
    plan,
    planJsonPath,
    planMarkdownPath
  };
}

if (isDirectRun(import.meta.url, process.argv[1])) {
  const { planJsonPath, planMarkdownPath } = generateGrowthPlan();
  console.log(`Growth plan written: ${path.relative(process.cwd(), planJsonPath)}`);
  console.log(`Growth plan markdown: ${path.relative(process.cwd(), planMarkdownPath)}`);
}
