// @ts-check
const {test, expect} = require('@playwright/test');
const queenColumn = '3';
const workerColumn = '4';
const maleColumn = '5';
const unknownCasteColumn = '6';


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

        // Expects S1 to be checked.
        await expect(page.locator('#S1')).toBeChecked();

        // Expects no observations yet.
        const observations = page.locator('#observations');
        await expect(observations).toBeEmpty();

        // Spot some bees
        await assertRecordCastes(page, '#queenSpotted',     '1', queenColumn);
        await assertRecordCastes(page, '#workerSpotted',    '1', workerColumn);
        await assertRecordCastes(page, '#maleSpotted',      '1', maleColumn);
        await assertRecordCastes(page, '#unknownSpotted',   '1', unknownCasteColumn);

        // Change section
        await page.click('#S2');
        await expect(page.locator('#S2')).toBeChecked();
        await assertRecordCastes(page, '#queenSpotted', '1', queenColumn);
        await assertCaste(page, '2', workerColumn, '3');

        // Change species
        await page.locator('#species').selectOption('Early');
        await assertRecordCastes(page, '#queenSpotted', '1', queenColumn);

        // End walk

        // TODO: test clearing data & refresh page own test
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

