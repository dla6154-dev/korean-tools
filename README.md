# Korean Tools

Utility-focused Next.js site for Korean users.

## Core Scripts

```bash
npm run dev
npm run build
npm run lint
```

## Growth Loop

This repo now includes a growth-ops layer that sits on top of the existing site.

### What it does

- reads normalized traffic and search metrics
- summarizes current growth state
- suggests ranked growth experiments
- produces CI-friendly markdown and JSON artifacts

### Local usage

1. Export your GA4 page CSV, optional GA4 event CSV, Search Console pages CSV, and optional Search Console queries CSV.
2. Normalize them into the tracked input file:

```bash
npm run growth:import -- --ga4-pages path/to/ga4-pages.csv --ga4-events path/to/ga4-events.csv --gsc-pages path/to/gsc-pages.csv --gsc-queries path/to/gsc-queries.csv
```

3. Run:

```bash
npm run growth:loop
npm run growth:execute
```

If you want live data instead of CSV exports, configure Google API access and run:

```bash
npm run growth:fetch
```

Artifacts are written to:

- `growth/output/growth-report.json`
- `growth/output/growth-report.md`
- `growth/output/growth-plan.json`
- `growth/output/growth-plan.md`
- `growth/output/growth-summary.md`

### Available growth scripts

```bash
npm run growth:authorize
npm run growth:fetch
npm run growth:import
npm run growth:push-secrets
npm run growth:report
npm run growth:plan
npm run growth:execute
npm run growth:loop
```

If you do not provide a matching source column, the importer leaves that metric at `0` or unset. That mainly affects `sessions7d`, `sessions90d`, and `repeatUserRate30d` unless you enrich the JSON manually.

### Auto-execution

`npm run growth:execute` reads the ranked plan and only auto-applies a very small safe subset:

- metadata refreshes for strategic routes through `app/data/growth-config.json`
- homepage discovery promotions for internal-link experiments

If no safe `auto_pr_candidate` exists, it writes execution artifacts but makes no code change.

### Live data setup

You can connect real GA4 and Search Console data with either a Google service account or a user OAuth refresh token.

Required environment variables:

- one of `GA4_PROPERTY_ID` or `GA4_MEASUREMENT_ID`
- `GSC_SITE_URL`
- either `GOOGLE_SERVICE_ACCOUNT_BASE64`, `GOOGLE_SERVICE_ACCOUNT_JSON`, or `GOOGLE_APPLICATION_CREDENTIALS`
- or `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, and `GOOGLE_OAUTH_REFRESH_TOKEN`

Optional environment variables:

- `GROWTH_GA4_END_OFFSET_DAYS` default `1`
- `GROWTH_GSC_END_OFFSET_DAYS` default `3`
- `GSC_SEARCH_TYPE` default `web`

Setup notes:

- Enable the Google Analytics Data API.
- If you use a service account, add it as at least `Viewer` or `Analyst` on the GA4 property.
- If you use a service account, add the same identity as an owner or full user to the Search Console property.
- If GA4 refuses a service-account email, use the OAuth flow instead.
- `GSC_SITE_URL` must exactly match the Search Console property identifier, for example `https://example.com/` or `sc-domain:example.com`.

For local development, the simplest option is:

1. Choose one auth mode.
2. For a service account, save the key JSON to a local file.
3. Put this in `.env.local`:

```bash
GA4_PROPERTY_ID=123456789
# or GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GSC_SITE_URL=https://example.com/
GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\service-account.json
```

Or generate a user refresh token directly into `.env.local`:

```bash
npm run growth:authorize -- --client-secret C:\path\to\client-secret.json --write-env
```

If your GitHub CLI is already authenticated, you can push the repo secrets and variables in one shot:

```bash
npm run growth:push-secrets
```

This command reads `.env.local`, writes:

- `GSC_SITE_URL`
- `GA4_PROPERTY_ID` if present
- `GA4_MEASUREMENT_ID` if present
- `GOOGLE_SERVICE_ACCOUNT_JSON` if present
- `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, and `GOOGLE_OAUTH_REFRESH_TOKEN` if present

and also pushes optional repo variables when present:

- `GROWTH_GA4_END_OFFSET_DAYS`
- `GROWTH_GSC_END_OFFSET_DAYS`
- `GSC_SEARCH_TYPE`

### Rules and evals

- Growth guardrails: `docs/growth-rules.md`
- Growth scoring rubric: `evals/growth/rubric.json`
- Eval notes: `evals/growth/README.md`

### GitHub Actions

The scheduled workflow lives at:

- `.github/workflows/growth-agent.yml`

It fetches live metrics when secrets are present, runs the growth loop, executes safe changes, and opens a draft PR when a real `auto_pr_candidate` is applied.
