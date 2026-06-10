import fs from "node:fs";
import path from "node:path";
import {
  GROWTH_INPUT_DIR,
  isDirectRun,
  writeJson
} from "./growth-lib.mjs";

const DEFAULT_OUTPUT_PATH = path.join(GROWTH_INPUT_DIR, "site-metrics.json");

function printUsage() {
  console.log("Usage:");
  console.log("  node scripts/growth-import.mjs [options]");
  console.log("");
  console.log("Options:");
  console.log("  --ga4-pages <file>     GA4 page-level CSV export");
  console.log("  --ga4-events <file>    GA4 event-level CSV export");
  console.log("  --gsc-pages <file>     Search Console pages CSV export");
  console.log("  --gsc-queries <file>   Search Console queries CSV export");
  console.log(`  --out <file>           Output JSON path (default: ${path.relative(process.cwd(), DEFAULT_OUTPUT_PATH)})`);
}

function parseArgs(argv) {
  const args = {
    ga4Pages: null,
    ga4Events: null,
    gscPages: null,
    gscQueries: null,
    out: DEFAULT_OUTPUT_PATH
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    }

    if (arg === "--ga4-pages" && next) {
      args.ga4Pages = next;
      index += 1;
      continue;
    }

    if (arg === "--ga4-events" && next) {
      args.ga4Events = next;
      index += 1;
      continue;
    }

    if (arg === "--gsc-pages" && next) {
      args.gscPages = next;
      index += 1;
      continue;
    }

    if (arg === "--gsc-queries" && next) {
      args.gscQueries = next;
      index += 1;
      continue;
    }

    if (arg === "--out" && next) {
      args.out = next;
      index += 1;
      continue;
    }

    throw new Error(`Unknown or incomplete argument: ${arg}`);
  }

  if (!args.ga4Pages && !args.ga4Events && !args.gscPages && !args.gscQueries) {
    throw new Error("Provide at least one CSV input.");
  }

  return args;
}

function normalizeKey(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/^\ufeff/, "")
    .replace(/[^a-z0-9]+/g, "");
}

function buildLookup(row) {
  const lookup = new Map();

  for (const [key, value] of Object.entries(row)) {
    lookup.set(normalizeKey(key), String(value ?? "").trim());
  }

  return lookup;
}

function pickValue(lookup, candidates) {
  for (const candidate of candidates) {
    const value = lookup.get(normalizeKey(candidate));
    if (value) {
      return value;
    }
  }

  return "";
}

function parseNumber(value) {
  const raw = String(value ?? "").trim();
  if (!raw || raw === "-" || raw.toLowerCase() === "(not set)") {
    return null;
  }

  const cleaned = raw
    .replace(/,/g, "")
    .replace(/[^0-9.+-]/g, "")
    .trim();
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseRate(value) {
  const raw = String(value ?? "").trim();
  const parsed = parseNumber(raw);
  if (parsed === null) {
    return null;
  }

  if (raw.includes("%") || parsed > 1) {
    return parsed / 100;
  }

  return parsed;
}

function safeDivide(numerator, denominator) {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator <= 0) {
    return null;
  }

  return numerator / denominator;
}

function roundMetric(value, digits = 4) {
  if (!Number.isFinite(value)) {
    return undefined;
  }

  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function normalizePath(value) {
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

function readCsv(filePath) {
  if (!filePath) {
    return [];
  }

  const text = fs.readFileSync(filePath, "utf8").replace(/^\ufeff/, "");
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (inQuotes) {
      if (char === "\"") {
        if (text[index + 1] === "\"") {
          field += "\"";
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === "\"") {
      inQuotes = true;
      continue;
    }

    if (char === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    if (char !== "\r") {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const [headerRow, ...dataRows] = rows.filter((currentRow) =>
    currentRow.some((cell) => String(cell ?? "").trim() !== ""),
  );

  if (!headerRow) {
    return [];
  }

  return dataRows.map((currentRow) => {
    const record = {};
    for (let index = 0; index < headerRow.length; index += 1) {
      record[headerRow[index]] = currentRow[index] ?? "";
    }
    return record;
  });
}

function upsertPage(pageMap, route) {
  const existing = pageMap.get(route);
  if (existing) {
    return existing;
  }

  const created = {
    path: route,
    sessions30d: 0,
    organicSessions30d: 0,
    searchClicks30d: 0,
    searchImpressions30d: 0,
    ctr30d: undefined,
    averagePosition30d: undefined,
    toolStarts30d: 0,
    toolCompletes30d: 0,
    copyEvents30d: 0,
    completionRate: undefined
  };

  pageMap.set(route, created);
  return created;
}

function importGa4Pages(pageMap, rows) {
  for (const row of rows) {
    const lookup = buildLookup(row);
    const route = normalizePath(
      pickValue(lookup, [
        "Page path and screen class",
        "Page path + query string",
        "Page path and query string",
        "Page path",
        "Landing page",
        "Page location",
        "Page"
      ]),
    );

    if (!route) {
      continue;
    }

    const page = upsertPage(pageMap, route);
    const sessions = parseNumber(pickValue(lookup, ["Sessions", "sessions30d"]));
    const organicSessions = parseNumber(
      pickValue(lookup, [
        "Organic sessions",
        "Organic search sessions",
        "organicSessions30d"
      ]),
    );

    if (sessions !== null) {
      page.sessions30d = sessions;
    }

    if (organicSessions !== null) {
      page.organicSessions30d = organicSessions;
    }
  }
}

function importGa4Events(pageMap, rows) {
  for (const row of rows) {
    const lookup = buildLookup(row);
    const route = normalizePath(
      pickValue(lookup, [
        "Page path and screen class",
        "Page path + query string",
        "Page path and query string",
        "Page path",
        "Page location",
        "Page"
      ]),
    );
    const eventName = pickValue(lookup, ["Event name"]).toLowerCase();
    const count = parseNumber(pickValue(lookup, ["Event count", "Count"]));

    if (!route || !eventName || count === null) {
      continue;
    }

    const page = upsertPage(pageMap, route);

    if (eventName === "tool_start") {
      page.toolStarts30d += count;
    }

    if (eventName === "tool_complete") {
      page.toolCompletes30d += count;
    }

    if (eventName === "tool_copy_result") {
      page.copyEvents30d += count;
    }
  }
}

function importGscPages(pageMap, rows) {
  for (const row of rows) {
    const lookup = buildLookup(row);
    const route = normalizePath(pickValue(lookup, ["Top pages", "Page", "Pages"]));
    if (!route) {
      continue;
    }

    const page = upsertPage(pageMap, route);
    const clicks = parseNumber(pickValue(lookup, ["Clicks", "clicks30d"]));
    const impressions = parseNumber(pickValue(lookup, ["Impressions", "impressions30d"]));
    const ctr = parseRate(pickValue(lookup, ["CTR", "ctr30d"]));
    const position = parseNumber(
      pickValue(lookup, ["Position", "Average position", "averagePosition30d"]),
    );

    if (clicks !== null) {
      page.searchClicks30d = clicks;
    }

    if (impressions !== null) {
      page.searchImpressions30d = impressions;
    }

    if (ctr !== null) {
      page.ctr30d = roundMetric(ctr);
    } else {
      page.ctr30d = roundMetric(safeDivide(page.searchClicks30d, page.searchImpressions30d));
    }

    if (position !== null) {
      page.averagePosition30d = roundMetric(position, 2);
    }
  }
}

function importGscQueries(rows) {
  const queries = [];

  for (const row of rows) {
    const lookup = buildLookup(row);
    const query = pickValue(lookup, ["Top queries", "Query", "Queries"]);
    if (!query || query.toLowerCase() === "total" || query.toLowerCase() === "totals") {
      continue;
    }

    const route = normalizePath(pickValue(lookup, ["Top pages", "Page", "Pages"]));
    const clicks = parseNumber(pickValue(lookup, ["Clicks", "clicks30d"])) ?? 0;
    const impressions = parseNumber(pickValue(lookup, ["Impressions", "impressions30d"])) ?? 0;
    const ctr = parseRate(pickValue(lookup, ["CTR", "ctr30d"]));
    const position = parseNumber(
      pickValue(lookup, ["Position", "Average position", "averagePosition30d"]),
    );

    queries.push({
      query,
      page: route,
      clicks30d: clicks,
      impressions30d: impressions,
      ctr30d: roundMetric(ctr ?? safeDivide(clicks, impressions)),
      averagePosition30d: roundMetric(position, 2)
    });
  }

  queries.sort((left, right) => right.impressions30d - left.impressions30d);
  return queries.slice(0, 50);
}

function buildSummary(pageMap) {
  const pages = [...pageMap.values()];
  const sessions30d = pages.reduce((sum, page) => sum + (page.sessions30d ?? 0), 0);
  const organicSessions30d = pages.reduce((sum, page) => sum + (page.organicSessions30d ?? 0), 0);
  const searchClicks30d = pages.reduce((sum, page) => sum + (page.searchClicks30d ?? 0), 0);
  const searchImpressions30d = pages.reduce((sum, page) => sum + (page.searchImpressions30d ?? 0), 0);
  const totalStarts = pages.reduce((sum, page) => sum + (page.toolStarts30d ?? 0), 0);
  const totalCompletes = pages.reduce((sum, page) => sum + (page.toolCompletes30d ?? 0), 0);
  const weightedPositionBase = pages.reduce(
    (sum, page) => sum + ((page.averagePosition30d ?? 0) * (page.searchImpressions30d ?? 0)),
    0,
  );

  return {
    sessions7d: 0,
    sessions30d,
    sessions90d: 0,
    organicSessions30d,
    organicShare30d: roundMetric(safeDivide(organicSessions30d, sessions30d)) ?? 0,
    searchClicks30d,
    searchImpressions30d,
    averageCtr30d: roundMetric(safeDivide(searchClicks30d, searchImpressions30d)) ?? 0,
    averagePosition30d: roundMetric(safeDivide(weightedPositionBase, searchImpressions30d), 2) ?? 0,
    repeatUserRate30d: 0,
    toolCompletionRate30d: roundMetric(safeDivide(totalCompletes, totalStarts)) ?? 0
  };
}

function buildTopPages(pageMap) {
  const pages = [...pageMap.values()]
    .map((page) => ({
      ...page,
      completionRate: roundMetric(safeDivide(page.toolCompletes30d, page.toolStarts30d))
    }))
    .filter((page) =>
      (page.sessions30d ?? 0) > 0 ||
      (page.searchClicks30d ?? 0) > 0 ||
      (page.searchImpressions30d ?? 0) > 0 ||
      (page.toolStarts30d ?? 0) > 0,
    )
    .sort((left, right) => {
      const leftScore =
        (left.sessions30d ?? 0) * 10 +
        (left.searchClicks30d ?? 0) * 5 +
        (left.searchImpressions30d ?? 0) / 10;
      const rightScore =
        (right.sessions30d ?? 0) * 10 +
        (right.searchClicks30d ?? 0) * 5 +
        (right.searchImpressions30d ?? 0) / 10;

      return rightScore - leftScore;
    });

  return pages.slice(0, 50);
}

function buildIssues(args) {
  const issues = [];

  if (!args.ga4Events) {
    issues.push({
      type: "analytics",
      severity: "medium",
      message: "GA4 event export was not provided, so completion rates may be missing."
    });
  }

  if (!args.gscQueries) {
    issues.push({
      type: "search-console",
      severity: "low",
      message: "Search Console query export was not provided, so keyword-level planning will stay sparse."
    });
  }

  return issues;
}

export function importGrowthMetrics(options) {
  const args = options ?? parseArgs(process.argv.slice(2));
  const pageMap = new Map();

  importGa4Pages(pageMap, readCsv(args.ga4Pages));
  importGa4Events(pageMap, readCsv(args.ga4Events));
  importGscPages(pageMap, readCsv(args.gscPages));

  const topQueries = importGscQueries(readCsv(args.gscQueries));
  const summary = buildSummary(pageMap);
  const topPages = buildTopPages(pageMap);
  const output = {
    generatedAt: new Date().toISOString(),
    summary,
    topPages,
    topQueries,
    issues: buildIssues(args),
    notes: [
      "Generated by scripts/growth-import.mjs.",
      "Fields without matching source columns stay at 0 or remain unset."
    ]
  };

  writeJson(path.resolve(args.out), output);

  return {
    output,
    outPath: path.resolve(args.out)
  };
}

if (isDirectRun(import.meta.url, process.argv[1])) {
  try {
    const { outPath, output } = importGrowthMetrics();
    console.log(`Growth metrics imported: ${path.relative(process.cwd(), outPath)}`);
    console.log(`Pages: ${output.topPages.length}, queries: ${output.topQueries.length}`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    printUsage();
    process.exit(1);
  }
}
