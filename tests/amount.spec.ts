import { test, expect } from '@playwright/test';
import { openTransfer, submitAmount, balance, message, smsSection, statement } from './transfer-page';

// REQ-3.1 / REQ-3.3: amount 100..500,000, whole tenge; SMS code above 100,000.
// 3-value boundary values around every border (Week 3, Task A).
type Outcome = 'below-min' | 'executes' | 'needs-code' | 'above-max';
const cases: Array<[string, Outcome]> = [
  ['98', 'below-min'], ['99', 'below-min'], ['100', 'executes'], ['101', 'executes'],
  ['99999', 'executes'], ['100000', 'executes'], ['100001', 'needs-code'], ['100002', 'needs-code'],
  ['499999', 'needs-code'], ['500000', 'needs-code'], ['500001', 'above-max'], ['500002', 'above-max'],
];

test.describe('Amount boundaries (REQ-3.1, REQ-3.3)', () => {
  for (const [amount, outcome] of cases) {
    test(`amount ${amount} -> ${outcome}`, async ({ page }) => {
      await openTransfer(page);
      await submitAmount(page, amount);
      switch (outcome) {
        case 'below-min':
          await expect(message(page)).toContainText('Amount error: minimum is 100');
          await expect(smsSection(page)).toBeHidden();
          await expect(balance(page)).toHaveText('1,000,000');
          break;
        case 'above-max':
          await expect(message(page)).toContainText('Amount error: maximum is 500,000');
          await expect(smsSection(page)).toBeHidden();
          await expect(balance(page)).toHaveText('1,000,000');
          break;
        case 'executes':
          await expect(message(page)).toHaveText('Transfer completed');
          await expect(smsSection(page)).toBeHidden();
          await expect(statement(page)).toHaveCount(1);
          await expect(balance(page)).toHaveText((1_000_000 - Number(amount)).toLocaleString('en-US'));
          break;
        case 'needs-code':
          await expect(smsSection(page)).toBeVisible();
          await expect(balance(page)).toHaveText('1,000,000'); // unchanged until the code is confirmed
          await expect(statement(page)).toHaveCount(0);
          break;
      }
    });
  }
});

test.describe('Invalid amount partitions: one invalid value per test', () => {
  for (const [label, value] of [['not a whole number', '1500.50'], ['not a number', 'abc']]) {
    test(`${label} (${value}) is rejected`, async ({ page }) => {
      await openTransfer(page);
      await submitAmount(page, value);
      await expect(message(page)).toContainText('whole tenge only');
      await expect(balance(page)).toHaveText('1,000,000');
    });
  }

  test('empty amount is rejected', async ({ page }) => {
    await openTransfer(page);
    await submitAmount(page, '');
    await expect(message(page)).toContainText('enter an amount');
    await expect(balance(page)).toHaveText('1,000,000');
  });
});
