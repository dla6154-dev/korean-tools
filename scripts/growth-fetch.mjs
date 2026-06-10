import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  GROWTH_INPUT_DIR,
  GROWTH_OUTPUT_DIR,
  ensureDir,
  formatDateOnly,
  isDirectRun,
  loadOptionalEnvFiles,
  normalizeRoutePath,
  relativeFromRoot,
  utcDaysAgo,
  writeJson,
  writeText
} from "./growth-lib.mjs";

const GA_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const TOKEN_AUDIENCE = "https://oauth2.googleapis.com/token";
const GA_ENDPOINT = "https://analyticsdata.googleapis.com/v1beta";
const GSC_ENDPOINT = "https://www.googleapis.com/webmasters/v3";
const GA_ADMIN_ENDPOINT = "https://analyticsadmin.googleapis.com/v1beta";

function getIntEnv(name, fallbackValue) {
  const value = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(value) ? value : fallbackValue;
}

function clampRate(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(1, value));
}

function roundMetric(value, digits = 4) {
  if (!Number.isFinite(value)) {
    return undefined;
  }

  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function base64UrlEncode(input) {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buffer.toString("base64url");
}

function parseServiceAccount() {
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credentialsPath && fs.existsSync(credentialsPath)) {
    return JSON.parse(fs.readFileSync(credentialsPath, "utf8"));
  }

  if (process.env.GOOGLE_SERVICE_ACCOUNT_BASE64) {
    const raw = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_BASE64, "base64").toString("utf8");
    return JSON.parse(raw);
  }

  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  }

  throw new Error(
    "Missing Google credentials. Set GOOGLE_SERVICE_ACCOUNT_BASE64, GOOGLE_SERVICE_ACCOUNT_JSON, or GOOGLE_APPLICATION_CREDENTIALS.",
  );
}

function createServiceAccountAssertion(serviceAccount, scopes) {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const header = {
    alg: "RS256",
    typ: "JWT",
  };
  const claimSet = {
    iss: serviceAccount.client_email,
    scope: scopes.join(" "),
    aud: TOKEN_AUDIENCE,
    exp: nowSeconds + 3600,
    iat: nowSeconds,
  };
  const unsignedToken = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(claimSet))}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsignedToken);
  signer.end();
  const signature = signer.sign(serviceAccount.private_key);
  return `${unsignedToken}.${base64UrlEncode(signature)}`;
}

async function getAccessToken(serviceAccount, scopes) {
  const assertion = createServiceAccountAssertion(serviceAccount, scopes);
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  });

  const response = await fetch(TOKEN_AUDIENCE, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get Google access token: ${response.status} ${errorText}`);
  }

  const payload = await response.json();
  if (!payload.access_token) {
    throw new Error("Google access token response did not include access_token.");
  }

  return payload.access_token;
}

async function fetchGoogleJson(url, accessToken, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google API request failed: ${response.status} ${url} ${errorText}`);
  }

  return response.json();
}

async function runGaReport(accessToken, propertyId, requestBody) {
  return fetchGoogleJson(
    `${GA_ENDPOINT}/properties/${propertyId}:runReport`,
    accessToken,
    {
      method: "POST",
      body: JSON.stringify(requestBody),
    },
  );
}

async function listGaAccountSummaries(accessToken, pageToken) {
  const query = new URLSearchParams();
  if (pageToken) {
    query.set("pageToken", pageToken);
  }

  return fetchGoogleJson(
    `${GA_ADMIN_ENDPOINT}/accountSummaries${query.size > 0 ? `?${query.toString()}` : ""}`,
    accessToken,
  );
}

async function listGaDataStreams(accessToken, propertyName, pageToken) {
  const query = new URLSearchParams();
  if (pageToken) {
    query.set("pageToken", pageToken);
  }

  return fetchGoogleJson(
    `${GA_ADMIN_ENDPOINT}/${propertyName}/dataStreams${query.size > 0 ? `?${query.toString()}` : ""}`,
    accessToken,
  );
}

async function runSearchConsoleQuery(accessToken, siteUrl, requestBody) {
  return fetchGoogleJson(
    `${GSC_ENDPOINT}/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    accessToken,
    {
      method: "POST",
      body: JSON.stringify(requestBody),
    },
  );
}

function buildDateRange(days, offsetDays) {
  const endDate = utcDaysAgo(offsetDays);
  const startDate = utcDaysAgo(offsetDays + days - 1);

  return {
    startDate: formatDateOnly(startDate),
    endDate: formatDateOnly(endDate),
  };
}

async function resolveGaPropertyId(accessToken, explicitPropertyId, measurementId) {
  if (explicitPropertyId) {
    return explicitPropertyId;
  }

  const normalizedMeasurementId = String(measurementId ?? "").trim();
  if (!normalizedMeasurementId) {
    throw new Error("Missing GA4_PROPERTY_ID and GA4_MEASUREMENT_ID.");
  }

  const propertyNames = [];
  let pageToken = undefined;

  do {
    const response = await listGaAccountSummaries(accessToken, pageToken);
    for (const accountSummary of response.accountSummaries ?? []) {
      for (const propertySummary of accountSummary.propertySummaries ?? []) {
        if (propertySummary.property) {
          propertyNames.push(propertySummary.property);
        }
      }
    }
    pageToken = response.nextPageToken || undefined;
  } while (pageToken);

  for (const propertyName of propertyNames) {
    let streamPageToken = undefined;

    do {
      const response = await listGaDataStreams(accessToken, propertyName, streamPageToken);
      for (const dataStream of response.dataStreams ?? []) {
        if (dataStream.webStreamData?.measurementId === normalizedMeasurementId) {
          return propertyName.replace(/^properties\//, "");
        }
      }

      streamPageToken = response.nextPageToken || undefined;
    } while (streamPageToken);
  }

  throw new Error(
    `Could not resolve a GA4 property ID from measurement ID ${normalizedMeasurementId}.`,
  );
}

function getMetricValue(row, metricIndex = 0) {
  const rawValue = row?.metricValues?.[metricIndex]?.value;
  const parsed = Number(rawValue);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function fetchGaSummary(accessToken, propertyId, dateRange, organicDateRange) {
  const [sessions7d, sessions30d, sessions90d, organic30d] = await Promise.all([
    runGaReport(accessToken, propertyId, {
      dateRanges: [buildDateRange(7, getIntEnv("GROWTH_GA4_END_OFFSET_DAYS", 1))],
      metrics: [{ name: "sessions" }],
    }),
    runGaReport(accessToken, propertyId, {
      dateRanges: [dateRange],
      metrics: [{ name: "sessions" }, { name: "totalUsers" }, { name: "newUsers" }],
    }),
    runGaReport(accessToken, propertyId, {
      dateRanges: [buildDateRange(90, getIntEnv("GROWTH_GA4_END_OFFSET_DAYS", 1))],
      metrics: [{ name: "sessions" }],
    }),
    runGaReport(accessToken, propertyId, {
      dateRanges: [organicDateRange],
      metrics: [{ name: "sessions" }],
      dimensionFilter: {
        filter: {
          fieldName: "sessionDefaultChannelGroup",
          stringFilter: {
            matchType: "EXACT",
            value: "Organic Search",
          },
        },
      },
    }),
  ]);

  const totalUsers30d = getMetricValue(sessions30d.rows?.[0], 1);
  const newUsers30d = getMetricValue(sessions30d.rows?.[0], 2);
  const repeatUsers30d = Math.max(0, totalUsers30d - newUsers30d);

  return {
    sessions7d: getMetricValue(sessions7d.rows?.[0], 0),
    sessions30d: getMetricValue(sessions30d.rows?.[0], 0),
    sessions90d: getMetricValue(sessions90d.rows?.[0], 0),
    organicSessions30d: getMetricValue(organic30d.rows?.[0], 0),
    repeatUserRate30d: totalUsers30d > 0 ? clampRate(repeatUsers30d / totalUsers30d) : 0,
  };
}

async function fetchGaSessionsByPage(accessToken, propertyId, dateRange, organicOnly = false) {
  const report = await runGaReport(accessToken, propertyId, {
    dateRanges: [dateRange],
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "sessions" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: "5000",
    ...(organicOnly
      ? {
          dimensionFilter: {
            filter: {
              fieldName: "sessionDefaultChannelGroup",
              stringFilter: {
                matchType: "EXACT",
                value: "Organic Search",
              },
            },
          },
        }
      : {}),
  });

  const pageMap = new Map();

  for (const row of report.rows ?? []) {
    const route = normalizeRoutePath(row.dimensionValues?.[0]?.value);
    if (!route) {
      continue;
    }

    pageMap.set(route, getMetricValue(row, 0));
  }

  return pageMap;
}

async function fetchGaEventCounts(accessToken, propertyId, dateRange) {
  const report = await runGaReport(accessToken, propertyId, {
    dateRanges: [dateRange],
    dimensions: [{ name: "pagePath" }, { name: "eventName" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: {
      filter: {
        fieldName: "eventName",
        inListFilter: {
          values: ["tool_start", "tool_complete", "tool_copy_result"],
        },
      },
    },
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    limit: "5000",
  });

  const pageMap = new Map();
  let totalStarts = 0;
  let totalCompletes = 0;

  for (const row of report.rows ?? []) {
    const route = normalizeRoutePath(row.dimensionValues?.[0]?.value);
    const eventName = row.dimensionValues?.[1]?.value ?? "";
    const eventCount = getMetricValue(row, 0);

    if (!route) {
      continue;
    }

    const current = pageMap.get(route) ?? {
      toolStarts30d: 0,
      toolCompletes30d: 0,
      copyEvents30d: 0,
    };

    if (eventName === "tool_start") {
      current.toolStarts30d += eventCount;
      totalStarts += eventCount;
    }

    if (eventName === "tool_complete") {
      current.toolCompletes30d += eventCount;
      totalCompletes += eventCount;
    }

    if (eventName === "tool_copy_result") {
      current.copyEvents30d += eventCount;
    }

    pageMap.set(route, current);
  }

  return {
    pageMap,
    totalStarts,
    totalCompletes,
  };
}

async function fetchSearchConsoleRows(accessToken, siteUrl, requestBase) {
  const rowLimit = getIntEnv("GROWTH_FETCH_PAGE_LIMIT", 1000);
  const rows = [];
  let startRow = 0;

  while (true) {
    const payload = await runSearchConsoleQuery(accessToken, siteUrl, {
      ...requestBase,
      rowLimit,
      startRow,
    });
    const nextRows = payload.rows ?? [];
    rows.push(...nextRows);

    if (nextRows.length < rowLimit) {
      break;
    }

    startRow += rowLimit;
  }

  return rows;
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
    completionRate: undefined,
  };
  pageMap.set(route, created);
  return created;
}

function mergePageSessions(pageMap, sessionMap, fieldName) {
  for (const [route, value] of sessionMap.entries()) {
    upsertPage(pageMap, route)[fieldName] = value;
  }
}

function mergePageEvents(pageMap, eventMap) {
  for (const [route, values] of eventMap.entries()) {
    Object.assign(upsertPage(pageMap, route), values);
  }
}

function mergeSearchConsolePages(pageMap, rows) {
  for (const row of rows) {
    const route = normalizeRoutePath(row.keys?.[0]);
    if (!route) {
      continue;
    }

    const page = upsertPage(pageMap, route);
    page.searchClicks30d = Number(row.clicks ?? 0);
    page.searchImpressions30d = Number(row.impressions ?? 0);
    page.ctr30d = roundMetric(Number(row.ctr ?? 0));
    page.averagePosition30d = roundMetric(Number(row.position ?? 0), 2);
  }
}

function finalizeTopPages(pageMap) {
  return [...pageMap.values()]
    .map((page) => ({
      ...page,
      completionRate:
        page.toolStarts30d > 0
          ? roundMetric(page.toolCompletes30d / page.toolStarts30d)
          : undefined,
    }))
    .filter((page) =>
      page.sessions30d > 0 ||
      page.searchClicks30d > 0 ||
      page.searchImpressions30d > 0 ||
      page.toolStarts30d > 0,
    )
    .sort((left, right) => {
      const leftScore = left.sessions30d * 10 + left.searchClicks30d * 5 + left.searchImpressions30d / 10;
      const rightScore = right.sessions30d * 10 + right.searchClicks30d * 5 + right.searchImpressions30d / 10;
      return rightScore - leftScore;
    })
    .slice(0, 50);
}

function buildTopQueries(rows) {
  return rows
    .map((row) => {
      const page = normalizeRoutePath(row.keys?.[1]);
      if (!page) {
        return null;
      }

      return {
        query: row.keys?.[0] ?? "",
        page,
        clicks30d: Number(row.clicks ?? 0),
        impressions30d: Number(row.impressions ?? 0),
        ctr30d: roundMetric(Number(row.ctr ?? 0)),
        averagePosition30d: roundMetric(Number(row.position ?? 0), 2),
      };
    })
    .filter((row) => row && row.query)
    .slice(0, 50);
}

function buildNotes({ gaDateRange, gscDateRange, propertyId, siteUrl }) {
  return [
    `GA4 property: ${propertyId} (${gaDateRange.startDate} to ${gaDateRange.endDate})`,
    `Search Console site: ${siteUrl} (${gscDateRange.startDate} to ${gscDateRange.endDate})`,
    "Generated by scripts/growth-fetch.mjs.",
  ];
}

function buildIssues({ topPages, topQueries }) {
  const issues = [];

  if (topPages.length === 0) {
    issues.push({
      type: "analytics",
      severity: "medium",
      message: "No page-level metrics were returned from the connected GA4/Search Console sources.",
    });
  }

  if (topQueries.length === 0) {
    issues.push({
      type: "search-console",
      severity: "low",
      message: "No query-level rows were returned from Search Console.",
    });
  }

  return issues;
}

export async function fetchGrowthMetrics() {
  loadOptionalEnvFiles();
  ensureDir(GROWTH_INPUT_DIR);
  ensureDir(GROWTH_OUTPUT_DIR);

  const configuredPropertyId = process.env.GA4_PROPERTY_ID;
  const measurementId = process.env.GA4_MEASUREMENT_ID;
  const siteUrl = process.env.GSC_SITE_URL;

  if (!siteUrl) {
    throw new Error("Missing GSC_SITE_URL.");
  }

  const serviceAccount = parseServiceAccount();
  const accessToken = await getAccessToken(serviceAccount, [GA_SCOPE, GSC_SCOPE]);
  const propertyId = await resolveGaPropertyId(accessToken, configuredPropertyId, measurementId);

  const gaDateRange = buildDateRange(30, getIntEnv("GROWTH_GA4_END_OFFSET_DAYS", 1));
  const gscDateRange = buildDateRange(30, getIntEnv("GROWTH_GSC_END_OFFSET_DAYS", 3));
  const searchType = process.env.GSC_SEARCH_TYPE ?? "web";

  const [
    gaSummary,
    gaSessionsByPage,
    gaOrganicSessionsByPage,
    gaEvents,
    gscSummaryRows,
    gscPageRows,
    gscQueryRows,
  ] = await Promise.all([
    fetchGaSummary(accessToken, propertyId, gaDateRange, gaDateRange),
    fetchGaSessionsByPage(accessToken, propertyId, gaDateRange, false),
    fetchGaSessionsByPage(accessToken, propertyId, gaDateRange, true),
    fetchGaEventCounts(accessToken, propertyId, gaDateRange),
    fetchSearchConsoleRows(accessToken, siteUrl, {
      startDate: gscDateRange.startDate,
      endDate: gscDateRange.endDate,
      type: searchType,
      aggregationType: "auto",
    }),
    fetchSearchConsoleRows(accessToken, siteUrl, {
      startDate: gscDateRange.startDate,
      endDate: gscDateRange.endDate,
      dimensions: ["page"],
      type: searchType,
      aggregationType: "byPage",
    }),
    fetchSearchConsoleRows(accessToken, siteUrl, {
      startDate: gscDateRange.startDate,
      endDate: gscDateRange.endDate,
      dimensions: ["query", "page"],
      type: searchType,
      aggregationType: "byPage",
    }),
  ]);

  const gscSummary = gscSummaryRows[0] ?? {};
  const pageMap = new Map();

  mergePageSessions(pageMap, gaSessionsByPage, "sessions30d");
  mergePageSessions(pageMap, gaOrganicSessionsByPage, "organicSessions30d");
  mergePageEvents(pageMap, gaEvents.pageMap);
  mergeSearchConsolePages(pageMap, gscPageRows);

  const topPages = finalizeTopPages(pageMap);
  const topQueries = buildTopQueries(gscQueryRows);
  const summary = {
    sessions7d: gaSummary.sessions7d,
    sessions30d: gaSummary.sessions30d,
    sessions90d: gaSummary.sessions90d,
    organicSessions30d: gaSummary.organicSessions30d,
    organicShare30d:
      gaSummary.sessions30d > 0
        ? roundMetric(gaSummary.organicSessions30d / gaSummary.sessions30d) ?? 0
        : 0,
    searchClicks30d: Number(gscSummary.clicks ?? 0),
    searchImpressions30d: Number(gscSummary.impressions ?? 0),
    averageCtr30d: roundMetric(Number(gscSummary.ctr ?? 0)) ?? 0,
    averagePosition30d: roundMetric(Number(gscSummary.position ?? 0), 2) ?? 0,
    repeatUserRate30d: roundMetric(gaSummary.repeatUserRate30d) ?? 0,
    toolCompletionRate30d:
      gaEvents.totalStarts > 0
        ? roundMetric(gaEvents.totalCompletes / gaEvents.totalStarts) ?? 0
        : 0,
  };

  const payload = {
    generatedAt: new Date().toISOString(),
    summary,
    topPages,
    topQueries,
    issues: buildIssues({ topPages, topQueries }),
    notes: buildNotes({ gaDateRange, gscDateRange, propertyId, siteUrl }),
  };

  const inputPath = path.join(GROWTH_INPUT_DIR, "site-metrics.json");
  const markdownPath = path.join(GROWTH_OUTPUT_DIR, "growth-fetch.md");

  writeJson(inputPath, payload);
  writeText(
    markdownPath,
    [
      "# Growth Fetch",
      "",
      `Generated: ${payload.generatedAt}`,
      `Metrics file: \`${relativeFromRoot(inputPath)}\``,
      `GA4 property: \`${propertyId}\` (${gaDateRange.startDate} to ${gaDateRange.endDate})`,
      `Search Console site: \`${siteUrl}\` (${gscDateRange.startDate} to ${gscDateRange.endDate})`,
      "",
      "## Snapshot",
      `- Sessions (30d): ${summary.sessions30d}`,
      `- Organic sessions (30d): ${summary.organicSessions30d}`,
      `- Search clicks (30d): ${summary.searchClicks30d}`,
      `- Search impressions (30d): ${summary.searchImpressions30d}`,
      `- Tool completion rate (30d): ${summary.toolCompletionRate30d}`,
    ].join("\n") + "\n",
  );

  return {
    payload,
    inputPath,
    markdownPath,
  };
}

if (isDirectRun(import.meta.url, process.argv[1])) {
  fetchGrowthMetrics()
    .then(({ inputPath, markdownPath }) => {
      console.log(`Growth metrics fetched: ${path.relative(process.cwd(), inputPath)}`);
      console.log(`Growth fetch markdown: ${path.relative(process.cwd(), markdownPath)}`);
    })
    .catch((error) => {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    });
}
