import { expect, Page } from '@playwright/test';

/** Test customers from the Week 4 test plan (preconditions are set through the URL). */
export const customers = {
  TC014: { balance: 1_000_000, daily: 0 },        // balance 1,000,000, daily total 0
  TC015: { balance: 1_000_000, daily: 950_000 },  // exact-limit boundary
  TC016: { balance: 1_000_000, daily: 950_001 },  // one tenge over the limit
  TC017: { balance: 1_000_000, daily: 500_000 },  // amount and daily limit both violated
};

export const CORRECT_CODE = '123456'; // stub code of the demo app
export const WRONG_CODE = '000000';

export async function openTransfer(page: Page, c: { balance: number; daily: number } = customers.TC014) {
  await page.goto(`/?balance=${c.balance}&daily=${c.daily}`);
  await expect(page.getByRole('heading', { name: 'Transfers' })).toBeVisible();
}

export async function submitAmount(page: Page, amount: string) {
  await page.locator('#amount').fill(amount);
  await page.getByRole('button', { name: 'Continue' }).click();
}

export async function enterCode(page: Page, code: string) {
  await page.locator('#code').fill(code);
  await page.getByRole('button', { name: 'Confirm' }).click();
}

export const balance = (page: Page) => page.locator('#balance');
export const dailyTotal = (page: Page) => page.locator('#daily');
export const message = (page: Page) => page.locator('#message');
export const statement = (page: Page) => page.locator('#statement li');
export const smsSection = (page: Page) => page.locator('#sms');
