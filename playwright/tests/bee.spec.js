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
    let queenColumnRow1 = page.locator('#observations tr:nth-child(1) td:nth-child(3)');
    await expect(queenColumnRow1).toContainText('1');

    // Spot another Queen
    await page.click('#queenSpotted');

    // Expects the observations table to have another S1 Bombus QUEEN.
    await expect(queenColumnRow1).toContainText('2');

    // Spot a Worker
    await page.click('#workerSpotted');

    // Expects the observations table to have a S1 Bombus WORKER.
    let workerColumnRow1 = page.locator('#observations tr:nth-child(1) td:nth-child(4)');
    await expect(workerColumnRow1).toContainText('1');

    // Spot another two Workers
    await page.click('#workerSpotted');
    await page.click('#workerSpotted');

    // Expects the observations table to have another S1 Bombus WORKER.
    await expect(workerColumnRow1).toContainText('3');

    await assertRecordCastes(page, '#maleSpotted', '5');

  });
});

async function assertRecordCastes(page, buttonId, column) {
  await page.click(buttonId);

  let workerColumnRow1 = page.locator('#observations tr:nth-child(1) td:nth-child(' + column + ')');
  await expect(workerColumnRow1).toContainText('1');

  await page.click(buttonId);
  await page.click(buttonId);

  await expect(workerColumnRow1).toContainText('3');
}