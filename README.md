# Testing — money transfer page with Playwright and CI

[![Playwright Tests](https://github.com/rand243/Testing/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/rand243/Testing/actions/workflows/playwright.yml)

A small demo page "Transfers → Between my accounts" (`app/index.html`, served by `server.js`) implements the rules of the course brief, and 25 Playwright tests check it. The tests come from the test design in Weeks 3–4:

| Spec | What it checks | Technique |
|---|---|---|
| `tests/amount.spec.ts` | amount 100–500,000, whole tenge; SMS code above 100,000; 3-value boundaries | partitions + boundary values |
| `tests/daily-limit.spec.ts` | daily limit 1,000,000, check order (amount error wins) | collapsed decision table |
| `tests/sms-code.spec.ts` | 120 s expiry, 3 wrong attempts, double confirm, final states | state table |

The SMS code of the demo app is the fixed stub `123456`. Test customers (balance and daily total) are set through the URL, e.g. `/?balance=1000000&daily=950000`.

## CI

[![Playwright Tests](https://github.com/rand243/Testing/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/rand243/Testing/actions/workflows/playwright.yml)

**CI system:** GitHub Actions. It is built into GitHub, where the repository already lives, needs no server of its own, is free for public repositories and supports matrices for sharding.

**Pipeline** (`.github/workflows/playwright.yml`):

- runs on every push and pull request (and manually via `workflow_dispatch`);
- `npm ci` with the npm cache, Chromium installed with system dependencies;
- the full Playwright suite split into 4 shards (`--shard=i/4`) running in parallel;
- the `merge-reports` job merges the shards' blob reports into one HTML report and JUnit;
- artefacts: `playwright-report` (HTML), `test-results-N` (traces, screenshots, videos, JUnit), `junit-report`; kept for 14 days.

**CI settings** (`playwright.config.ts`, when `CI=true`): `forbidOnly: true`, `retries: 2`, reporters `list`, `blob`, `junit`, `trace: 'on-first-retry'`.

### Runtime

| Configuration | Total run time | Run tests step (slowest shard) | Run |
| --- | --- | --- | --- |
| 1 job, no sharding | X min Y s | X min Y s | [run](LINK) |
| 4 shards + merge | X min Y s | X min Y s | [run](LINK) |

Median of 3 runs via `workflow_dispatch`. Conclusion: _(one sentence: with 25 fast tests each shard spends most of its time on setup — checkout, npm ci, browser install — so the total time barely drops or even grows; sharding pays off when the suite itself takes minutes.)_

### Running locally

    npm ci
    npx playwright install --with-deps chromium
    CI=true npx playwright test

Shards and report merge locally:

    mkdir -p all-blob-reports
    CI=true npx playwright test --shard=1/2 && cp blob-report/*.zip all-blob-reports/
    CI=true npx playwright test --shard=2/2 && cp blob-report/*.zip all-blob-reports/
    npx playwright merge-reports --config merge.config.ts ./all-blob-reports
    npx playwright show-report
