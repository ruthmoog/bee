// @ts-check
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('http://localhost:8080');
  await expect(page).toHaveTitle(/Bee./);
});

test('start walk', async ({ page }) => {
  await page.goto('http://localhost:8080');
  // Click the get started link.
  await page.click('#start');
  // Expects the URL to contain intro.
  const locator = page.locator('#dateTime');
  await expect(locator).toContainText('Date:');
  await expect(locator).toContainText('BeeWalk started:');
});
