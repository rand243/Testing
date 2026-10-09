# Traceability Matrix

| Requirement | Test cases | Technique | Status |
|---|---|---|---|
| REQ-3.1 Amount 100 – 500,000, whole tenge | TR-AMT-001, 002, 005, 006; TR-DAY-002 | Partitions + boundary values; decision table | 5 of 5 designed, not executed |
| REQ-3.2 Daily limit 1,000,000, reset midnight Almaty | TR-DAY-001, TR-DAY-002 | Decision table (collapsed) | 2 of 2 designed, not executed. Gaps: exact-limit boundary and midnight reset not in the 12 (see below) |
| REQ-3.3 SMS code above 100,000 | TR-AMT-003, 004, 005; TR-OTP-001…004 | Boundary values; state transition | 7 of 7 designed, not executed |
| REQ-3.4 Insufficient balance | — | — | **NOT COVERED** |

## Why REQ-3.4 is not covered
- The brief does not state the requirement at all: it appeared only as a gap while building the Week 3 decision table (no condition for balance). No expected result exists to test against.
- Not clear whether the balance check happens before or after the amount, daily-limit and SMS checks.
- No test customer with a low balance in the data plan.
- Action: DEF-M01 asks the analyst to define it; then add two cases (amount = balance, amount = balance + 1).

## Week 3 tests not carried into the 12 (candidates for the next iteration)
- Daily limit boundary: TC-015, daily total 950,000, transfer 50,000 → executes (total exactly 1,000,000).
- Invalid partitions: 1,500.50 (not whole), abc, empty.
- Valid-transitions tests V1, V2, V4, V5, V6 and Confirmed + 120 s (timer does not reverse), Blocked + correct code.
- Midnight reset (23:59:50 / 00:00:00 Almaty) — blocked by DEF-M02.
- Pairwise configuration set (13 tests, `week3/04-pairwise-pict.md`).
