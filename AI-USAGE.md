# AI usage — SIS 2: CI pipeline for Playwright

**Model:** Claude (Anthropic), session configured as `claude-sonnet-5-5` (the serving model may differ), used through Claude Code in the claude.ai app.

## What the AI did
- Read the SIS 2 step-by-step guide (.docx) and the Week 3 / Week 4 course slides.
- Wrote the demo transfer page (`app/index.html`, `server.js`) implementing the Week 3 brief, because I had no Playwright project.
- Wrote the 25 Playwright tests (`tests/`), derived from my Week 3 test design (boundary values, decision table, SMS state table).
- Wrote `playwright.config.ts`, `merge.config.ts`, `.github/workflows/playwright.yml`, a one-time `generate-lockfile.yml`, this README's CI section and the report draft.
- Ran the tests locally in the AI's Linux sandbox: normal run (25 passed), CI mode in 4 shards, report merge (merged JUnit with 25 tests) and the `forbidOnly` check (a `test.only` fails with exit code 1).

## What the AI could not do
- It had no access to my GitHub account, so it did not push, did not run GitHub Actions and did not produce the Actions screenshots, run links, artefacts, badge status or timing numbers. Those are mine to produce and are marked in the report.
- It could not reach the npm registry from its sandbox, so `package-lock.json` is generated on GitHub (one-time workflow).

## Prompts (summary)
1. Uploaded the SIS 2 guide: "Submit Google docs report — what you implemented and how it works with screenshots."
2. Gave the repository link `https://github.com/rand243/Testing.git`.
3. "I don't even have the tests, can you do this assignment completely, following all the requirements."

## What I changed and why
> To be filled in by me: what I checked, ran myself and edited.
