import {expect, test} from '@playwright/test';
import {BeeTrackerPage} from "./beeTrackerPage.js";

const queenColumn = '3';
const workerColumn = '4';
const maleColumn = '5';
const unknownCasteColumn = '6';

test('has title', async ({page}) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Bee./);
});

test.describe('New BeeWalk', () => {

    test('Do a walk and see some bees', async ({page}) => {
        const beePage = new BeeTrackerPage(page);
        // Visit web app.
        await beePage.goto()

        // Expects no walk metadata yet.
        const walkMetaData = page.locator('#dateTime');
        await expect(walkMetaData).toBeEmpty();

        // Click start button.
        await beePage.startWalk()

        // Expects the walk metadata to contain the start date time.
        await expect(walkMetaData).toContainText('Date:');
        await expect(walkMetaData).toContainText('BeeWalk started:');
        await expect(walkMetaData).toContainText('Sunshine:');
        await expect(walkMetaData).toContainText('Wind Speed');
        await expect(walkMetaData).toContainText('Temp °C:');

        // Expects S1 to be checked.
        await expect(page.locator('#S1')).toBeChecked();

        // Expects no observations yet.
        const observations = page.locator('#observations');
        await expect(observations).toBeEmpty();

        // Spot some bees
        await assertRecordCastes(page, '#queenSpotted', '1', queenColumn);
        await assertRecordCastes(page, '#workerSpotted', '1', workerColumn);
        await assertRecordCastes(page, '#maleSpotted', '1', maleColumn);
        await assertRecordCastes(page, '#unknownSpotted', '1', unknownCasteColumn);

        // Change section
        await page.click('#S2');
        await expect(page.locator('#S2')).toBeChecked();
        await assertRecordCastes(page, '#queenSpotted', '1', queenColumn);
        await assertCaste(page, '2', workerColumn, '3');

        // Change species
        await page.locator('#species').selectOption('Early');
        await assertRecordCastes(page, '#queenSpotted', '1', queenColumn);

        // End walk
        await beePage.stopWalk()
        await expect(walkMetaData).toContainText('Date:');
        await expect(walkMetaData).toContainText('BeeWalk started:');
        await expect(walkMetaData).toContainText('ended:');
        await expect(walkMetaData).toContainText('Sunshine:');
        await expect(walkMetaData).toContainText('Wind Speed');
        await expect(walkMetaData).toContainText('Temp °C');
    });
});

async function assertRecordCastes(page, buttonId, row, column) {
    await page.click(buttonId);

    await assertCaste(page, row, column, '1');

    await page.click(buttonId);
    await page.click(buttonId);

    await assertCaste(page, row, column, '3');
}

async function assertCaste(page, row, column, count) {
    let workerColumnRow1 = page.locator(`#observations tr:nth-child(${row}) td:nth-child(${column})`);
    await expect(workerColumnRow1).toContainText(count);

}
