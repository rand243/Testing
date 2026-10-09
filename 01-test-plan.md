# Test Plan Section — Money Transfer with SMS Code

Standard: ISO/IEC/IEEE 29119-3. Version 1.1, 2026-10-09. Test basis: the course brief (requirements REQ-3.1…3.4) and the Week 3 design (`../week3/`).

## 1. Scope
**In scope**
- REQ-3.1 Amount 100–500,000 KZT per transfer, whole tenge only.
- REQ-3.2 Daily limit 1,000,000 KZT across all transfers, reset at midnight Almaty time.
- REQ-3.3 SMS code (6 digits) for amounts above 100,000: valid 120 s, three wrong attempts cancel the transfer.
- Rule: if amount and daily limit are both violated, the amount error is shown.
- REQ-3.4 Insufficient balance — **requirement missing from the brief**, see risk 3 and DEF-M01.

**Out of scope**
- Transfers to other customers / other banks, currency, fees.
- Performance, load, penetration testing, SMS gateway internals.
- Web and ATM channels; platform × language matrix beyond the pairwise set in Week 3 (`04-pairwise-pict.md`).

## 2. Approach
- Level / type: system, functional, through the mobile UI on the test environment.
- Techniques (Week 3): equivalence partitioning + boundary values for the amount (REQ-3.1, 3.3); decision table collapsed to 4 columns for approval (REQ-3.1/3.2); state table and valid-transitions coverage (7 tests) for the SMS code (REQ-3.3); pairwise (PICT, 13 tests) for platform/language/account/recipient configuration.
- Regression: manual SMS release checklist (`04-release-checklist.md`) each release.
- Automation: not in this iteration; cases are independent so they can be automated in week 5.
- Test data: TC-014 (balance 1,000,000, daily total 0), TC-015 (daily total 950,000), TC-016 (daily total 950,001), TC-017 (daily total 500,000), all with balance 1,000,000. Preset daily totals must be provisioned by the environment owner before testing starts.
- Time-dependent cases (120 s expiry, midnight reset) need a controllable clock or a test run just before 00:00 Almaty.

## 3. Entry criteria
- Build deployed to the test environment; smoke test (login, open Transfers) passes.
- Test customers TC-014…TC-017 provisioned with the data above.
- A test SMS code can be received on a test phone.
- Analyst has answered, or acknowledged in writing, the open questions in Week 3 Task B.

## 4. Exit criteria
1. All 12 planned cases executed; each blocked case has a written reason.
2. Zero open critical or high severity defects.
3. REQ-3.1, 3.2, 3.3: 100% of their cases passed.
4. Release checklist 12 of 12 items ticked on the release candidate build.
5. REQ-3.4: expected behaviour defined and tested, or accepted as residual risk in writing by the product owner (name and date).
6. Residual risks written in the test completion report.

## 5. Top 3 product risks
| # | Risk | Impact | Covered by |
|---|---|---|---|
| 1 | Double debit when Confirm is tapped twice or the request is retried (Confirmed + correct code) | Direct financial loss | TR-OTP-004, checklist 10 |
| 2 | Wrong check order or limit boundary: daily limit applied before amount error, off-by-one at 1,000,000, midnight reset ambiguity | Wrong rejection / limit bypass, regulatory | TR-DAY-001, TR-DAY-002, DEF-M02 |
| 3 | Behaviour for insufficient balance undefined (REQ-3.4); late code accepted after expiry | Unspecified or insecure outcome | DEF-M01, TR-OTP-003 |

## 6. Assumptions (to confirm with the analyst)
- Amount range and daily limit are inclusive (a total of exactly 1,000,000 is allowed).
- "Above 100,000" is strictly greater: 100,000 needs no code, 100,001 does.
- Behaviour after a final state (Confirmed / Expired / Blocked) is "rejected, no change, no debit" (Week 3 Task C).
