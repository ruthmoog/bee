// @ts-check
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('http://localhost:8080');
  await expect(page).toHaveTitle(/Bee./);
});

test.describe('New BeeWalk', () => {

  test('Do a walk and see some bees', async ({page}) => {
    // Visit web app.
    await page.goto('http://localhost:8080');

    // Expects no walk metadata yet.
    const walkMetaData = page.locator('#dateTime');
    await expect(walkMetaData).toBeEmpty();

    // Click start button.
    await page.click('#start');

    // Expects the walk metadata to contain the start date time.
    await expect(walkMetaData).toContainText('Date:');
    await expect(walkMetaData).toContainText('BeeWalk started:');

    // Expects no observations yet.
    const observations = page.locator('#observations');
    await expect(observations).toBeEmpty();

    // Spot a Queen
    await page.click('#queenSpotted');

    // Expects the observations table to have a S1 Bombus QUEEN.
    await expect(page.locator('#observations tr')).toHaveCount(1);
  });
});
