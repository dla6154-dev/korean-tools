# Growth Evals

This folder defines how the repo scores growth experiments before implementation.

## Inputs

- `growth/inputs/site-metrics.json`
- route inventory from the app directory
- existing SEO inventory such as `app/data/seo-report.json`

## Output

The planning scripts produce:

- `growth/output/growth-report.json`
- `growth/output/growth-report.md`
- `growth/output/growth-plan.json`
- `growth/output/growth-plan.md`

## Scoring Model

See `rubric.json`.

The current loop is intentionally conservative:

- It suggests experiments automatically.
- It does not auto-merge code changes.
- It marks only low-risk items as `auto_pr_candidate`.

## How To Extend

- Add real GA4 and Search Console exports to the normalized metrics file.
- Add page-level tool completion events.
- Add post-launch measurements so experiments can be scored against actual outcomes.
