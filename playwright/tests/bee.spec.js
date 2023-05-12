// @ts-check
const {test, expect} = require('@playwright/test');

test('has title', async ({page}) => {
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

        // Spot some bees
        await assertRecordCastes(page, '#queenSpotted', '3');
        await assertRecordCastes(page, '#workerSpotted', '4');
        await assertRecordCastes(page, '#maleSpotted', '5');
        await assertRecordCastes(page, '#unknownSpotted', '6');

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