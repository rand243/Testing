# Defect Reports (3) — requirement defects found during test design

These are designed from gaps in the brief, as allowed by the assignment. "Actual result" is what the document says or omits; nothing was executed on a build. Severity and priority are proposals (tester proposes, product owner decides).

---
## DEF-M01
**Title:** Transfers: no expected result when amount exceeds available balance (REQ-3.4 missing from the brief)
**Environment:** Specification review — course brief "the same transfer, now with an SMS code"
**Preconditions:** none (document review)
**Steps to reproduce:**
1. Open the brief and read the five rules (amount, daily limit, code above 100,000, code validity, check order).
2. Look for a rule that states what happens when the amount is greater than the account balance.
3. Look for balance as a condition in the decision table (`week3/02-task-b-decision-table.md`).
**Expected result:** a stated outcome (rejection message, and whether the check runs before or after the amount, daily-limit and SMS checks), so that a test can be written.
**Actual result:** the brief does not mention balance anywhere; the decision table has no balance condition; REQ-3.4 is NOT COVERED in the traceability matrix.
**Reproducibility:** always (document content)
**Severity:** high · **Priority:** high (proposals)
**Evidence:** brief text; traceability matrix, REQ-3.4 row
**Traces to:** REQ-3.4

---
## DEF-M02
**Title:** Daily limit: not specified whether cancelled, expired or pending transfers count, or which day a transfer confirmed after midnight belongs to
**Environment:** Specification review, brief rule "Daily limit 1,000,000 KZT across all transfers, reset at midnight Almaty time"
**Preconditions:** none (document review)
**Steps to reproduce:**
1. Open the daily limit rule.
2. Consider a transfer of 500,000 that is submitted and then cancelled (3 wrong codes) or expires (120 s). Look for whether its amount counts towards the 1,000,000.
3. Consider a transfer submitted at 23:59:50 whose code is confirmed at 00:00:20. Look for the day it counts against, and whether the 120 s validity still holds.
4. Look for whether a total of exactly 1,000,000 is allowed.
**Expected result:** all three points are stated, so boundary tests for the daily limit and the midnight reset have a definite expected result.
**Actual result:** none of the three points is stated. TR-DAY-001 and the exact-limit candidate test rely on the assumption that the limit is inclusive; the midnight tests cannot be written.
**Reproducibility:** always (document content)
**Severity:** medium · **Priority:** medium (proposals)
**Evidence:** brief text; week 3 Task B question list, items 2–4
**Traces to:** REQ-3.2 / TR-DAY-001, TR-DAY-002

---
## DEF-M03
**Title:** SMS code: not specified whether a customer can request a new code, or what happens to the attempt counter and the 120 s timer
**Environment:** Specification review, brief rules "6-digit SMS code", "valid for 120 seconds", "three wrong attempts cancel the transfer"
**Preconditions:** none (document review)
**Steps to reproduce:**
1. Open the SMS code rules.
2. Look for a "resend code" option. If it exists, look for whether it resets the attempt counter and the 120 s timer.
3. Look for whether input that is not 6 digits counts as a wrong attempt.
4. Look at the state table (`week3/03-task-c-state-table.md`): the 9 cells for Confirmed, Expired and Blocked are not defined by the brief.
**Expected result:** resend behaviour, counting rules and the behaviour in the three final states are stated (the state table proposes "rejected, no debit, no change").
**Actual result:** none of these is stated in the brief. Without it TR-OTP-001…004 test only proposed behaviour for the final states, and a resend that resets attempts would allow unlimited guessing.
**Reproducibility:** always (document content)
**Severity:** high · **Priority:** medium (proposals)
**Evidence:** brief text; state table
**Traces to:** REQ-3.3 / TR-OTP-001…004
