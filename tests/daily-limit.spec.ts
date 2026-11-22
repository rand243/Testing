import { test, expect } from '@playwright/test';
import { customers, openTransfer, submitAmount, balance, dailyTotal, message, smsSection } from './transfer-page';

// REQ-3.2 and the check order from the brief (Week 3, Task B, collapsed decision table).
test.describe('Daily limit (REQ-3.2)', () => {
  test('TR-DAY-001: total would be 1,000,001 -> daily limit error, no code', async ({ page }) => {
    await openTransfer(page, customers.TC016);
    await submitAmount(page, '50000');
    await expect(message(page)).toHaveText('Daily limit exceeded');
    await expect(smsSection(page)).toBeHidden();
    await expect(dailyTotal(page)).toHaveText('950,001');
    await expect(balance(page)).toHaveText('1,000,000');
  });

  test('total of exactly 1,000,000 is allowed (limit is inclusive)', async ({ page }) => {
    await openTransfer(page, customers.TC015);
    await submitAmount(page, '50000');
    await expect(message(page)).toHaveText('Transfer completed');
    await expect(dailyTotal(page)).toHaveText('1,000,000');
    await expect(balance(page)).toHaveText('950,000');
  });

  test('TR-DAY-002: amount and daily limit both violated -> the amount error is shown', async ({ page }) => {
    await openTransfer(page, customers.TC017);
    await submitAmount(page, '600000');
    await expect(message(page)).toContainText('Amount error: maximum is 500,000');
    await expect(message(page)).not.toContainText('Daily limit');
    await expect(balance(page)).toHaveText('1,000,000');
  });
});
