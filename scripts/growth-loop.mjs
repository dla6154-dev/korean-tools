import fs from "node:fs";
import path from "node:path";
import { GROWTH_OUTPUT_DIR, isDirectRun, writeText } from "./growth-lib.mjs";
import { generateGrowthPlan } from "./growth-plan.mjs";
import { generateGrowthReport } from "./growth-report.mjs";

function appendGitHubSummary(text) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) {
    return;
  }

  fs.appendFileSync(summaryPath, `${text}\n`, "utf8");
}

export function runGrowthLoop() {
  const { report, reportMarkdownPath } = generateGrowthReport();
  const { plan, planMarkdownPath } = generateGrowthPlan();
  const topExperiment = plan.experiments[0] ?? null;

  const summaryLines = [
    "# Growth Loop Summary",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Metrics source: \`${report.sources.metrics.file}\`${report.sources.metrics.exampleData ? " (example data)" : ""}`,
    `Route inventory: ${report.inventory.totalRoutes} total / ${report.inventory.toolRoutes} tool routes`,
    "",
    "## Snapshot",
    `- Sessions (30d): ${report.snapshot.sessions30d}`,
    `- Organic sessions (30d): ${report.snapshot.organicSessions30d}`,
    `- Search clicks (30d): ${report.snapshot.searchClicks30d}`,
    `- Search impressions (30d): ${report.snapshot.searchImpressions30d}`,
    "",
    "## Top Experiment"
  ];

  if (topExperiment) {
    summaryLines.push(`- Title: ${topExperiment.title}`);
    summaryLines.push(`- Score: ${topExperiment.score}`);
    summaryLines.push(`- Decision: ${topExperiment.decision}`);
    summaryLines.push(`- Route: ${topExperiment.route ?? "site-wide"}`);
    summaryLines.push(`- Hypothesis: ${topExperiment.hypothesis}`);
  } else {
    summaryLines.push("- No experiment generated.");
  }

  summaryLines.push("", "## Artifacts");
  summaryLines.push(`- Report: \`${path.relative(process.cwd(), reportMarkdownPath)}\``);
  summaryLines.push(`- Plan: \`${path.relative(process.cwd(), planMarkdownPath)}\``);

  const summaryText = `${summaryLines.join("\n")}\n`;
  const summaryOutputPath = path.join(GROWTH_OUTPUT_DIR, "growth-summary.md");
  writeText(summaryOutputPath, summaryText);
  appendGitHubSummary(summaryText);

  return {
    report,
    plan,
    summaryOutputPath
  };
}

if (isDirectRun(import.meta.url, process.argv[1])) {
  const { summaryOutputPath } = runGrowthLoop();
  console.log(`Growth summary written: ${path.relative(process.cwd(), summaryOutputPath)}`);
}
