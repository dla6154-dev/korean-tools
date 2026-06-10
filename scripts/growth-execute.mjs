import fs from "node:fs";
import path from "node:path";
import {
  GROWTH_OUTPUT_DIR,
  ROOT_DIR,
  getQueryMetrics,
  isDirectRun,
  loadSiteMetrics,
  readJson,
  relativeFromRoot,
  writeJson,
  writeText
} from "./growth-lib.mjs";
import { generateGrowthPlan } from "./growth-plan.mjs";

const CONFIG_PATH = path.join(ROOT_DIR, "app", "data", "growth-config.json");

const METADATA_TEMPLATES = {
  "/date-calc": {
    title: (query) => `${query} | 며칠 후 날짜, 100일, 기념일 계산`,
    description: (query) =>
      `${query}가 필요할 때 기준 날짜에서 며칠 후 또는 이전 날짜를 바로 계산하세요. 100일, 기념일, 마감일 계산까지 한 번에 확인할 수 있습니다.`,
  },
  "/unit-price": {
    title: (query) => `${query} | 100g당 가격, 100ml당 가격, 개당 가격 비교`,
    description: (query) =>
      `${query}가 필요할 때 묶음 상품과 용량, 중량, 개수 상품을 같은 기준으로 비교하세요. 100g, 100ml, 개당 가격으로 가성비를 빠르게 확인할 수 있습니다.`,
  },
  "/characters": {
    title: (query) => `${query} | 공백 포함, 공백 제외, 단어 수, 바이트 계산`,
    description: (query) =>
      `${query}가 필요할 때 공백 포함 글자 수, 공백 제외 글자 수, 단어 수, 바이트를 바로 확인하세요. 자기소개서, 이력서, SNS 글 작성에 바로 사용할 수 있습니다.`,
  },
  "/date-diff": {
    title: (query) => `${query} | 두 날짜 사이 며칠인지 바로 확인`,
    description: (query) =>
      `${query}가 필요할 때 시작일과 종료일을 입력하면 총 일수, 주 수, 개월 수를 한 번에 계산합니다. 근무 기간, 계약 기간, 여행 기간 계산에 바로 사용할 수 있습니다.`,
  },
  "/anniversary": {
    title: (query) => `${query} | 100일, 1주년 자동 계산`,
    description: (query) =>
      `${query}가 필요할 때 시작일만 입력하면 100일, 200일, 1주년 같은 주요 기념일을 자동으로 계산하세요. 연애, 결혼, 입사일 기념일 계산에 바로 쓸 수 있습니다.`,
  },
  "/image-compress": {
    title: (query) => `${query} | JPG, PNG, WebP 용량 줄이기`,
    description: (query) =>
      `${query}가 필요할 때 JPG, PNG, WebP 이미지를 브라우저에서 바로 압축하세요. 서버 업로드 없이 용량을 줄이고 포맷 변환까지 빠르게 처리할 수 있습니다.`,
  },
  "/qr-code": {
    title: (query) => `${query} | URL, 텍스트, 전화번호 무료 변환`,
    description: (query) =>
      `${query}가 필요할 때 URL, 텍스트, 전화번호를 QR코드로 바로 변환하세요. 크기, 색상, 오류 복구 수준을 설정하고 즉시 다운로드할 수 있습니다.`,
  },
};

function normalizeConfig(config) {
  return {
    homepagePromotions: Array.isArray(config?.homepagePromotions) ? config.homepagePromotions : [],
    metadataOverrides:
      config?.metadataOverrides && typeof config.metadataOverrides === "object"
        ? config.metadataOverrides
        : {},
  };
}

function loadGrowthConfig() {
  return normalizeConfig(
    readJson(CONFIG_PATH, {
      homepagePromotions: [],
      metadataOverrides: {},
    }),
  );
}

function normalizeLeadQuery(query) {
  return String(query ?? "").replace(/\s+/g, " ").trim();
}

function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "growth-update";
}

function writeGitHubOutput(key, value) {
  if (!process.env.GITHUB_OUTPUT) {
    return;
  }

  fs.appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`, "utf8");
}

function writeGitHubMultilineOutput(key, value) {
  if (!process.env.GITHUB_OUTPUT) {
    return;
  }

  fs.appendFileSync(
    process.env.GITHUB_OUTPUT,
    `${key}<<EOF\n${value}\nEOF\n`,
    "utf8",
  );
}

function chooseExecutableExperiment(plan) {
  return (
    plan.experiments.find(
      (experiment) =>
        experiment.decision === "auto_pr_candidate" &&
        (experiment.type === "metadata-refresh" || experiment.type === "internal-linking"),
    ) ?? null
  );
}

function applyMetadataRefresh(config, experiment, metrics) {
  const route = experiment.route;
  if (!route || !METADATA_TEMPLATES[route]) {
    return {
      changed: false,
      status: "manual_review",
      reason: "No safe metadata template exists for this route.",
      filesChanged: [],
    };
  }

  const leadQuery = normalizeLeadQuery(
    getQueryMetrics(metrics, route)
      .sort((left, right) => (right.impressions30d ?? 0) - (left.impressions30d ?? 0))[0]?.query,
  );

  if (!leadQuery || leadQuery.length < 2 || leadQuery.length > 60) {
    return {
      changed: false,
      status: "manual_review",
      reason: "The route has no safe lead query for automatic metadata rewriting.",
      filesChanged: [],
    };
  }

  const nextOverride = {
    title: METADATA_TEMPLATES[route].title(leadQuery),
    description: METADATA_TEMPLATES[route].description(leadQuery),
  };
  const currentOverride = config.metadataOverrides[route] ?? {};

  if (
    currentOverride.title === nextOverride.title &&
    currentOverride.description === nextOverride.description
  ) {
    return {
      changed: false,
      status: "noop",
      reason: "The metadata override already matches the current lead query.",
      filesChanged: [],
    };
  }

  config.metadataOverrides[route] = nextOverride;

  return {
    changed: true,
    status: "applied",
    reason: `Updated metadata override for ${route} using the lead query "${leadQuery}".`,
    filesChanged: [relativeFromRoot(CONFIG_PATH)],
  };
}

function applyHomepagePromotion(config, experiment) {
  const route = experiment.route;
  if (!route) {
    return {
      changed: false,
      status: "manual_review",
      reason: "Homepage promotion needs a concrete route.",
      filesChanged: [],
    };
  }

  const existingPromotion = config.homepagePromotions.find((item) => item.route === route);
  if (existingPromotion) {
    return {
      changed: false,
      status: "noop",
      reason: "This route is already promoted on the homepage.",
      filesChanged: [],
    };
  }

  config.homepagePromotions = [
    {
      route,
      experimentId: experiment.id,
      reason: experiment.title,
    },
    ...config.homepagePromotions,
  ].slice(0, 8);

  return {
    changed: true,
    status: "applied",
    reason: `Promoted ${route} into homepage discovery links.`,
    filesChanged: [relativeFromRoot(CONFIG_PATH)],
  };
}

function executeExperiment(config, experiment, metrics) {
  if (!experiment) {
    return {
      changed: false,
      status: "skipped",
      reason: "No auto-PR experiment is currently eligible.",
      filesChanged: [],
    };
  }

  if (experiment.type === "metadata-refresh") {
    return applyMetadataRefresh(config, experiment, metrics);
  }

  if (experiment.type === "internal-linking") {
    return applyHomepagePromotion(config, experiment);
  }

  return {
    changed: false,
    status: "manual_review",
    reason: `Experiment type "${experiment.type}" is not auto-executable.`,
    filesChanged: [],
  };
}

function buildPrTitle(experiment) {
  if (!experiment) {
    return "[Growth] No auto-executable change";
  }

  return `[Growth] ${experiment.title}`;
}

function buildCommitMessage(experiment) {
  if (!experiment) {
    return "chore: no growth change";
  }

  return `chore: apply growth update for ${experiment.route ?? experiment.type}`;
}

export function executeGrowthPlan() {
  const { plan } = generateGrowthPlan();
  const siteMetricsBundle = loadSiteMetrics();
  const config = loadGrowthConfig();
  const topExperiment = plan.experiments[0] ?? null;
  const executableExperiment =
    plan.exampleData || siteMetricsBundle.isExample ? null : chooseExecutableExperiment(plan);

  const execution = plan.exampleData || siteMetricsBundle.isExample
    ? {
        changed: false,
        status: "skipped",
        reason: "Example metrics are active, so auto-PR execution is disabled.",
        filesChanged: [],
      }
    : executeExperiment(config, executableExperiment, siteMetricsBundle.data ?? {});

  if (execution.changed) {
    writeJson(CONFIG_PATH, config);
  }

  const prTitle = buildPrTitle(executableExperiment);
  const commitMessage = buildCommitMessage(executableExperiment);
  const branchSuffix = slugify(executableExperiment?.id ?? topExperiment?.id ?? "growth-update");

  const result = {
    generatedAt: new Date().toISOString(),
    planSource: relativeFromRoot(path.join(GROWTH_OUTPUT_DIR, "growth-plan.json")),
    topExperiment,
    executableExperiment,
    execution: {
      ...execution,
      prTitle,
      commitMessage,
      branchSuffix,
    },
  };

  const executionJsonPath = path.join(GROWTH_OUTPUT_DIR, "growth-execution.json");
  const executionMarkdownPath = path.join(GROWTH_OUTPUT_DIR, "growth-execution.md");
  const prBodyPath = path.join(GROWTH_OUTPUT_DIR, "growth-pr-body.md");

  const markdownLines = [
    "# Growth Execution",
    "",
    `Generated: ${result.generatedAt}`,
    `Plan source: \`${result.planSource}\``,
    "",
    "## Top Experiment",
    topExperiment
      ? `- ${topExperiment.title} (${topExperiment.decision}, score ${topExperiment.score})`
      : "- No experiment generated.",
    topExperiment?.route ? `- Route: ${topExperiment.route}` : null,
    "",
    "## Executed Experiment",
    executableExperiment
      ? `- ${executableExperiment.title} (${executableExperiment.type})`
      : "- No executable experiment was selected.",
    executableExperiment?.route ? `- Route: ${executableExperiment.route}` : null,
    "",
    "## Result",
    `- Status: ${execution.status}`,
    `- Reason: ${execution.reason}`,
    execution.filesChanged.length > 0 ? `- Files changed: ${execution.filesChanged.join(", ")}` : "- Files changed: none",
  ].filter(Boolean);

  const prBodyLines = [
    "# Automated Growth Draft PR",
    "",
    "This PR was created from the growth loop.",
    "",
    "## Selected Experiment",
    executableExperiment
      ? `- Title: ${executableExperiment.title}`
      : "- No executable experiment was selected.",
    executableExperiment?.route ? `- Route: ${executableExperiment.route}` : null,
    executableExperiment?.hypothesis ? `- Hypothesis: ${executableExperiment.hypothesis}` : null,
    "",
    "## Execution Result",
    `- Status: ${execution.status}`,
    `- Reason: ${execution.reason}`,
    execution.filesChanged.length > 0 ? `- Files changed: ${execution.filesChanged.join(", ")}` : "- Files changed: none",
    "",
    "## Guardrails",
    "- This workflow only auto-applies low-risk metadata or homepage discovery changes.",
    "- Higher-risk experiments should stay in manual review.",
  ].filter(Boolean);

  writeJson(executionJsonPath, result);
  writeText(executionMarkdownPath, `${markdownLines.join("\n")}\n`);
  writeText(prBodyPath, `${prBodyLines.join("\n")}\n`);

  writeGitHubOutput("changed", String(execution.changed));
  writeGitHubOutput("status", execution.status);
  writeGitHubOutput("branch_suffix", branchSuffix);
  writeGitHubMultilineOutput("pr_title", prTitle);
  writeGitHubMultilineOutput("commit_message", commitMessage);

  return {
    result,
    executionJsonPath,
    executionMarkdownPath,
    prBodyPath,
  };
}

if (isDirectRun(import.meta.url, process.argv[1])) {
  const { executionJsonPath, executionMarkdownPath } = executeGrowthPlan();
  console.log(`Growth execution written: ${path.relative(process.cwd(), executionJsonPath)}`);
  console.log(`Growth execution markdown: ${path.relative(process.cwd(), executionMarkdownPath)}`);
}
