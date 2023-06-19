import {expect, test} from '@playwright/test';
import {BeeTrackerPage} from "./beeTrackerPage.js";

const queenColumn = '3';
const workerColumn = '4';
const maleColumn = '5';
const unknownCasteColumn = '6';

let localDate = new Date();
let dateToday = localDate.getDate().toString().padStart(2, "0");
let monthToday = (localDate.getMonth()+1).toString().padStart(2, "0");
const today = dateToday+'/'+monthToday+'/'+localDate.getFullYear();

test('has title', async ({page}) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Bee./);
});

test.describe('New BeeWalk', () => {

    test('Do a walk and see some bees', async ({page}) => {
        const beePage = new BeeTrackerPage(page);
        // Visit web app.
        await beePage.goto();

        // Expects no walk metadata yet.
        const walkMetaData = page.locator('#walkData');
        await expect(walkMetaData).toBeHidden();

        // Click start button.
        await beePage.startWalk();

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

    test('Change walk meta data', async ({page}) => {
        const beePage = new BeeTrackerPage(page);
        // Visit web app.
        await beePage.goto();

        // Expects no edit buttons yet.
        const editButton = page.locator('#edit');
        const saveButton = page.locator('#save');
        await expect(editButton).toBeHidden();
        await expect(saveButton).toBeHidden();

        // Click start button.
        await beePage.startWalk();

        // Expects edit button to be visible.
        await expect(editButton).toBeEnabled();
        await expect(saveButton).toBeHidden();

        // Click edit button.
        await beePage.editMetaData();

        // Expects fields to be editable.
        const date = page.locator('#dateDisplay');
        const startTime = page.locator('#startTimeDisplay');
        const endTime = page.locator('#endTimeDisplay');
        const sunshine = page.locator('#sunshineDisplay');
        const windSpeed = page.locator('#windSpeedDisplay');
        const temperature = page.locator('#tempDisplay');

        await expect(date).toBeEditable();
        await expect(startTime).toBeEditable();
        await expect(sunshine).toBeEditable();
        await expect(windSpeed).toBeEditable();
        await expect(temperature).toBeEditable();
        await expect(endTime).toBeHidden();

        // Expects save button to be visible.
        await expect(saveButton).toBeEnabled();
        await expect(editButton).toBeHidden();

        // Change details in data fields.
        await expect(date).toContainText(today);

        await date.fill('');
        await expect(date).toContainText('');

        await date.fill('Hello World!');
        await expect(date).toContainText('Hello World!');


        // Click save button.
        await beePage.saveMetaData();

        // Expects data to be updated.
        const updatedDate = page.locator('#dateDisplay');
        await expect(updatedDate).toContainText('Hello World!');
        await expect(endTime).toBeHidden();

        // Expects fields to be non-editable. TODO

        // Click end button.
        await expect(endTime).toBeEnabled();

        // Click edit button.
        await beePage.editMetaData();

        // Expects fields to be editable.
        await expect(endTime).toBeEditable();

        // Click save button.
        await beePage.saveMetaData();

        // Expects fields to be non-editable. TODO
        // await expect(endTime).not.toBeEditable();
    });

    test('Finish a walk and clear data', async ({page}) => {
        const beePage = new BeeTrackerPage(page);
        // Visit web app.
        await beePage.goto();

        // Click start button.
        await beePage.startWalk();

        // Record some sightings.
        const walkData = page.locator('#walkData');
        await expect(walkData).toContainText(today);
        await assertRecordCastes(page, '#queenSpotted', '1', queenColumn);
        await assertRecordCastes(page, '#workerSpotted', '1', workerColumn);
        await assertRecordCastes(page, '#maleSpotted', '1', maleColumn);
        await assertRecordCastes(page, '#unknownSpotted', '1', unknownCasteColumn);

        // End walk.
        await beePage.stopWalk();

        // Clear all data.
        await beePage.clearAllData();

        // Data is no longer displayed.
        const observations = page.locator('#observations');
        await expect(walkData).toBeHidden();
        await expect(walkData).not.toContainText(today);
        await expect(observations).toBeEmpty();
    });

    test('Refresh page and persist data', async ({page}) => {
        const beePage = new BeeTrackerPage(page);
        // Visit web app.
        await beePage.goto();

        // Start walk and record a sighting.
        await beePage.startWalk();
        await assertRecordCastes(page, '#queenSpotted', '1', queenColumn);

        // Confirm data is displayed
        const walkData = page.locator('#walkData');
        const observations = page.locator('#observations');
        await expect(walkData).toContainText(today);
        await expect(observations).toContainText('Bumblebee');

        // Refresh page.
        await page.reload();

        // The same data is still displayed.
        await expect(walkData).toContainText(today);
        await expect(observations).toContainText('Bumblebee');
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
