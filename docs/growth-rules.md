# Growth Rules

## Goal

`Korean Tools` growth automation exists to increase qualified traffic without damaging trust, search hygiene, or tool usability.

## North Star Metrics

Track these in order:

1. `organic_sessions_30d`
2. `search_clicks_30d`
3. `tool_completion_rate`
4. `repeat_user_rate`

## Decision Rules

- Prefer changes that improve search demand capture for existing high-intent tools.
- Prefer changes that improve click-through rate on already-impressed pages before creating new pages.
- Prefer experiments on `date-calc`, `unit-price`, `characters`, `date-diff`, and other high-intent utility routes.
- Prefer low-risk SEO changes first: metadata, internal linking, supporting copy, FAQs, examples, and comparison blocks.

## Guardrails

These changes require human review before merge:

- `robots`, `sitemap`, `canonical`, or redirect policy changes
- Removing or renaming an indexed route
- Adding intrusive popups, forced sign-in, or misleading CTR bait
- Auto-publishing AI-written pages without factual review
- Any change that weakens page speed or tool completion UX

## What Counts As A Good Experiment

A good experiment should have:

- A single page or route family as the target
- A clear hypothesis
- A measurable success metric
- A rollback path
- A low chance of harming current rankings

## Weekly Loop

1. Collect normalized metrics from analytics and search data.
2. Summarize current winners, weak pages, and data gaps.
3. Generate 3 to 5 experiments.
4. Score them with the growth rubric.
5. Implement only low-risk, high-confidence items.
6. Measure impact after release and feed the results back into the next loop.

## Default Safe Change Types

- Title and description rewrites
- Internal link improvements
- FAQ/example block additions
- Above-the-fold copy tightening
- Related-tool discovery improvements

## Default Unsafe Change Types

- Mass route creation
- Large-scale content regeneration
- Route deletions
- Auto-generated backlinks or spammy growth tactics
- Hiding weak pages by blocking crawl without a replacement strategy
