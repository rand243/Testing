# Test Cases — 12, from the Week 3 design

All cases are independent. Status: designed, not yet executed. Navigation for all: Transfers → Between my accounts, recipient: own deposit ending 4417. Customers: see test plan §2. Origin in Week 3 shown in brackets.

## Amount (Task A)
### TR-AMT-001 · REQ-3.1 [W3-A, P1 border]
**Preconditions:** TC-014 logged in; balance 1,000,000; daily total 0.
**Steps:** 1. Open Transfers → Between my accounts. 2. Select the deposit ending 4417. 3. Enter 99. 4. Tap Continue.
**Expected:** rejected with an amount error; no SMS screen. **Postconditions:** balance 1,000,000; daily total 0; no statement entry.

### TR-AMT-002 · REQ-3.1 [W3-A, P2 border]
**Preconditions:** as AMT-001.
**Steps:** 1–2 as above. 3. Enter 100. 4. Tap Continue.
**Expected:** executed immediately, no SMS screen. **Postconditions:** balance 999,900; daily total 100; one statement entry of 100.

### TR-AMT-003 · REQ-3.3 [W3-A, code threshold]
**Preconditions:** as AMT-001.
**Steps:** 1–2. 3. Enter 100,000. 4. Tap Continue.
**Expected:** executed immediately, no SMS screen. **Postconditions:** balance 900,000; daily total 100,000.

### TR-AMT-004 · REQ-3.3 [W3-A, code threshold; W3-B column R1]
**Preconditions:** as AMT-001.
**Steps:** 1–2. 3. Enter 100,001. 4. Tap Continue.
**Expected:** SMS code screen shown; balance unchanged. **Postconditions:** transfer pending confirmation; balance 1,000,000.

### TR-AMT-005 · REQ-3.1 [W3-A, max boundary]
**Preconditions:** as AMT-001.
**Steps:** 1–2. 3. Enter 500,000. 4. Tap Continue.
**Expected:** SMS code screen shown (valid amount). **Postconditions:** transfer pending; balance 1,000,000.

### TR-AMT-006 · REQ-3.1 [W3-A, above max]
**Preconditions:** as AMT-001.
**Steps:** 1–2. 3. Enter 500,001. 4. Tap Continue.
**Expected:** rejected with an amount error; no SMS screen. **Postconditions:** balance 1,000,000; daily total 0.

## Daily limit and check order (Task B)
### TR-DAY-001 · REQ-3.2 [W3-B column R3–R4]
**Preconditions:** TC-016 logged in; balance 1,000,000; daily total 950,001.
**Steps:** 1–2. 3. Enter 50,000. 4. Tap Continue.
**Expected:** rejected with a daily limit error (total would be 1,000,001); no SMS screen. **Postconditions:** daily total 950,001; balance 1,000,000.

### TR-DAY-002 · REQ-3.1, 3.2 [W3-B column R5–R8, both rules violated]
**Preconditions:** TC-017 logged in; balance 1,000,000; daily total 500,000.
**Steps:** 1–2. 3. Enter 600,000 (amount above max and total 1,100,000). 4. Tap Continue.
**Expected:** the **amount** error is shown, not the daily limit error (brief); no SMS screen. **Postconditions:** balances unchanged.

## SMS code (Task C)
For the OTP cases the amount is 100,001 with TC-014 (balance 1,000,000, daily total 0), steps 1–4 as AMT-004 bring up the code screen. C = correct code from the SMS; W = a wrong 6-digit code, 000000.

### TR-OTP-001 · REQ-3.3 [W3-C test V3: W, W, C]
**Steps:** After the code screen: 5. Enter 000000, Confirm. 6. Enter 000000, Confirm. 7. Enter the correct code, Confirm.
**Expected:** after 5 and 6 an error is shown and the code screen stays; after 7 transfer confirmed. **Postconditions:** balance 899,999; daily total 100,001; one statement entry.

### TR-OTP-002 · REQ-3.3 [W3-C test V7: W, W, W]
**Steps:** After the code screen: 5. Enter 000000, Confirm. 6. Same. 7. Same.
**Expected:** third wrong code cancels the transfer. **Postconditions:** balance 1,000,000; daily total 0; no statement entry.

### TR-OTP-003 · REQ-3.3 [W3-C invalid transition: Expired + correct code]
**Steps:** After the code screen: 5. Wait 121 seconds without input. 6. Enter the correct code, Confirm.
**Expected:** transfer cancelled at 120 s; the correct code is rejected. **Postconditions:** balance 1,000,000; daily total 0; no statement entry.

### TR-OTP-004 · REQ-3.3 [W3-C invalid transition: Confirmed + correct code]
**Steps:** After the code screen: 5. Enter the correct code, tap Confirm twice within 1 second.
**Expected:** exactly one debit. **Postconditions:** balance 899,999; one statement entry of 100,001; daily total 100,001.
