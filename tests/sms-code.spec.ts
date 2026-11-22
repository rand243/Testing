import { test, expect } from '@playwright/test';
import {
  CORRECT_CODE, WRONG_CODE, openTransfer, submitAmount, enterCode,
  balance, dailyTotal, message, smsSection, statement,
} from './transfer-page';

// REQ-3.3: 6-digit SMS code, valid 120 s, three wrong attempts cancel the transfer.
// State model from Week 3, Task C. The clock is controlled so the 120 s tests take no real time.
test.describe('SMS code state model (REQ-3.3)', () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.install();
    await openTransfer(page);
    await submitAmount(page, '100001');
    await expect(smsSection(page)).toBeVisible();
  });

  test('TR-OTP-001: wrong, wrong, correct -> confirmed on the third attempt', async ({ page }) => {
    await enterCode(page, WRONG_CODE);
    await expect(message(page)).toHaveText('Incorrect code, attempt 1 of 3');
    await enterCode(page, WRONG_CODE);
    await expect(message(page)).toHaveText('Incorrect code, attempt 2 of 3');
    await enterCode(page, CORRECT_CODE);
    await expect(message(page)).toHaveText('Transfer confirmed');
    await expect(balance(page)).toHaveText('899,999');
    await expect(dailyTotal(page)).toHaveText('100,001');
    await expect(statement(page)).toHaveCount(1);
  });

  test('TR-OTP-002: three wrong codes cancel the transfer', async ({ page }) => {
    for (let i = 0; i < 3; i++) await enterCode(page, WRONG_CODE);
    await expect(message(page)).toHaveText('Transfer cancelled: 3 wrong attempts');
    await expect(balance(page)).toHaveText('1,000,000');
    await expect(dailyTotal(page)).toHaveText('0');
    await expect(statement(page)).toHaveCount(0);
  });

  test('Blocked + correct code: rejected, no debit', async ({ page }) => {
    for (let i = 0; i < 3; i++) await enterCode(page, WRONG_CODE);
    await enterCode(page, CORRECT_CODE);
    await expect(message(page)).toHaveText('Transfer cancelled: 3 wrong attempts');
    await expect(balance(page)).toHaveText('1,000,000');
  });

  test('TR-OTP-003: Expired + correct code: rejected, no debit', async ({ page }) => {
    await page.clock.fastForward(121_000);
    await expect(message(page)).toHaveText('Code expired, transfer cancelled');
    await enterCode(page, CORRECT_CODE);
    await expect(message(page)).toHaveText('Code expired, transfer cancelled');
    await expect(balance(page)).toHaveText('1,000,000');
    await expect(statement(page)).toHaveCount(0);
  });

  test('TR-OTP-004: Confirm tapped twice debits once', async ({ page }) => {
    await page.locator('#code').fill(CORRECT_CODE);
    const confirm = page.getByRole('button', { name: 'Confirm' });
    await confirm.dblclick();
    await expect(message(page)).toHaveText('Transfer confirmed');
    await expect(statement(page)).toHaveCount(1);
    await expect(balance(page)).toHaveText('899,999');
  });

  test('Confirmed + 120 s pass: the transfer is not reversed', async ({ page }) => {
    await enterCode(page, CORRECT_CODE);
    await expect(message(page)).toHaveText('Transfer confirmed');
    await page.clock.fastForward(121_000);
    await expect(message(page)).toHaveText('Transfer confirmed');
    await expect(balance(page)).toHaveText('899,999');
    await expect(statement(page)).toHaveCount(1);
  });

  test('balance and daily total are unchanged until the code is confirmed', async ({ page }) => {
    await expect(balance(page)).toHaveText('1,000,000');
    await expect(dailyTotal(page)).toHaveText('0');
  });
});
