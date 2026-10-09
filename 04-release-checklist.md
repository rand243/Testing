# SMS Code — Release Checklist (12 items)

Build / env: ______________   Tester: ______________   Date: ________

Run with amount 100,001 on TC-014 unless stated. Every item traces to a boundary or a state from Week 3.

- [ ] 1. 100,000 completes with no code; 100,001 shows the code screen
- [ ] 2. SMS arrives promptly (target ≤ 30 s — target not in the brief, confirm with analyst)
- [ ] 3. The code is 6 digits
- [ ] 4. Correct code within 120 s executes the transfer
- [ ] 5. Balance and daily total are unchanged until the code is confirmed
- [ ] 6. Wrong code shows an error and keeps the code screen
- [ ] 7. Third wrong code cancels the transfer; no debit
- [ ] 8. Code stops working after 120 seconds
- [ ] 9. Correct code entered after expiry is rejected; no debit
- [ ] 10. Confirm tapped twice debits once
- [ ] 11. Confirmed transfer is not cancelled or reversed when 120 s pass afterwards
- [ ] 12. SMS text correct in KZ, RU and EN
