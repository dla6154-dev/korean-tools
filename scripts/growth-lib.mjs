import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT_DIR = path.join(__dirname, "..");
export const APP_DIR = path.join(ROOT_DIR, "app");
export const DATA_DIR = path.join(APP_DIR, "data");
export const DOCS_DIR = path.join(ROOT_DIR, "docs");
export const GROWTH_DIR = path.join(ROOT_DIR, "growth");
export const GROWTH_INPUT_DIR = path.join(GROWTH_DIR, "inputs");
export const GROWTH_OUTPUT_DIR = path.join(GROWTH_DIR, "output");
export const EVALS_DIR = path.join(ROOT_DIR, "evals", "growth");
export const ENV_FILE_PATHS = [
  path.join(ROOT_DIR, ".env.local"),
  path.join(ROOT_DIR, ".env")
];

const KNOWN_SUPPORT_ROUTES = new Set([
  "/",
  "/about",
  "/en",
  "/feedback",
  "/privacy",
  "/terms",
  "/updates"
]);

const KNOWN_REDIRECT_ROUTES = new Set(["/beer-price"]);

export const STRATEGIC_ROUTES = [
  "/date-calc",
  "/unit-price",
  "/characters",
  "/date-diff",
  "/anniversary",
  "/image-compress",
  "/qr-code"
];

export function readJson(filePath, fallbackValue) {
  try {
    if (!fs.existsSync(filePath)) {
      return fallbackValue;
    }

    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallbackValue;
  }
}

export function writeJson(filePath, value) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function writeText(filePath, value) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, value, "utf8");
}

export function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function loadOptionalEnvFiles() {
  for (const filePath of ENV_FILE_PATHS) {
    if (!fs.existsSync(filePath)) {
      continue;
    }

    const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex <= 0) {
        continue;
      }

      const key = trimmed.slice(0, separatorIndex).trim().replace(/^export\s+/, "");
      if (!key || process.env[key]) {
        continue;
      }

      let value = trimmed.slice(separatorIndex + 1).trim();
      if (
        (value.startsWith("\"") && value.endsWith("\"")) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      process.env[key] = value.replace(/\\n/g, "\n");
    }
  }
}

export function relativeFromRoot(filePath) {
  return path.relative(ROOT_DIR, filePath).split(path.sep).join("/");
}

export function formatDateOnly(date) {
  return date.toISOString().slice(0, 10);
}

export function utcDaysAgo(days) {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - days);
  return date;
}

export function normalizeRoutePath(value) {
  const raw = String(value ?? "").trim();
  if (!raw || raw.toLowerCase() === "total" || raw.toLowerCase() === "totals") {
    return null;
  }

  let pathname = raw;

  if (/^https?:\/\//i.test(pathname)) {
    try {
      pathname = new URL(pathname).pathname;
    } catch {
      return null;
    }
  }

  pathname = pathname.split("?")[0].split("#")[0].trim();
  if (!pathname) {
    return null;
  }

  if (!pathname.startsWith("/")) {
    pathname = `/${pathname}`;
  }

  pathname = pathname.replace(/\/{2,}/g, "/");
  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }

  return pathname;
}

function walk(dirPath, fileList = []) {
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, fileList);
      continue;
    }

    fileList.push(fullPath);
  }

  return fileList;
}

function isPageFile(filePath) {
  return /[\\/]page\.tsx$/.test(filePath);
}

function routeFromPageFile(filePath) {
  const relative = path.relative(APP_DIR, filePath);
  const segments = relative.split(path.sep).slice(0, -1);
  const routeSegments = [];

  for (const segment of segments) {
    if (segment.startsWith("(") && segment.endsWith(")")) {
      continue;
    }

    if (segment.startsWith("[")) {
      return null;
    }

    routeSegments.push(segment);
  }

  if (routeSegments.length === 0) {
    return "/";
  }

  return `/${routeSegments.join("/")}`;
}

export function collectPageRoutes() {
  const pageFiles = walk(APP_DIR).filter(isPageFile);
  const routes = [];

  for (const filePath of pageFiles) {
    const route = routeFromPageFile(filePath);
    if (!route) {
      continue;
    }

    routes.push({
      route,
      filePath,
      relativeFile: relativeFromRoot(filePath),
      lastModified: fs.statSync(filePath).mtime.toISOString(),
      kind: classifyRoute(route)
    });
  }

  routes.sort((left, right) => left.route.localeCompare(right.route));
  return routes;
}

export function classifyRoute(route) {
  if (KNOWN_REDIRECT_ROUTES.has(route)) {
    return "redirect";
  }

  if (KNOWN_SUPPORT_ROUTES.has(route)) {
    return "support";
  }

  return "tool";
}

export function loadSiteMetrics() {
  const livePath = path.join(GROWTH_INPUT_DIR, "site-metrics.json");
  const examplePath = path.join(GROWTH_INPUT_DIR, "site-metrics.example.json");

  if (fs.existsSync(livePath)) {
    return {
      source: "growth/inputs/site-metrics.json",
      isExample: false,
      data: readJson(livePath, {})
    };
  }

  return {
    source: "growth/inputs/site-metrics.example.json",
    isExample: true,
    data: readJson(examplePath, {})
  };
}

export function loadSeoInventory() {
  const filePath = path.join(DATA_DIR, "seo-report.json");
  return {
    source: relativeFromRoot(filePath),
    data: readJson(filePath, {})
  };
}

export function loadRubric() {
  return readJson(path.join(EVALS_DIR, "rubric.json"), {
    version: 1,
    weights: {
      trafficPotential: 30,
      evidenceStrength: 20,
      userValue: 20,
      implementationEase: 15,
      seoSafety: 15
    },
    thresholds: {
      auto_pr_candidate: 78,
      manual_review: 60
    }
  });
}

export function getPageMetric(metrics, route) {
  const topPages = Array.isArray(metrics?.topPages) ? metrics.topPages : [];
  return topPages.find((page) => page.path === route) ?? null;
}

export function getQueryMetrics(metrics, route) {
  const queries = Array.isArray(metrics?.topQueries) ? metrics.topQueries : [];
  return queries.filter((query) => query.page === route);
}

export function getSummaryMetric(metrics, key, fallbackValue = 0) {
  const value = metrics?.summary?.[key];
  return Number.isFinite(value) ? value : fallbackValue;
}

export function toPercent(value) {
  if (!Number.isFinite(value)) {
    return "0.0%";
  }

  return `${(value * 100).toFixed(1)}%`;
}

export function normalizeScale(value) {
  return Math.max(1, Math.min(5, value));
}

export function weightedScore(dimensions, rubric) {
  const weights = rubric.weights ?? {};
  let total = 0;

  for (const [key, weight] of Object.entries(weights)) {
    const score = normalizeScale(dimensions[key] ?? 1);
    total += (score / 5) * weight;
  }

  return Math.round(total);
}

export function formatDate(dateString = new Date().toISOString()) {
  return new Date(dateString).toISOString().slice(0, 10);
}

export function truncate(text, maxLength) {
  if (!text || text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, Math.max(0, maxLength - 1))}…`;
}

export function isDirectRun(moduleUrl, argvPath) {
  if (!argvPath) {
    return false;
  }

  return fileURLToPath(moduleUrl) === path.resolve(argvPath);
}
