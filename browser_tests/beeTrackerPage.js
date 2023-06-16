export class BeeTrackerPage {
    constructor(page) {
        this.page = page
    }

    async goto() {
        await this.page.goto('/');
    }

    async startWalk() {
        await this.page.click('#start');
    }

    async stopWalk() {
        await this.page.click('#stop');
    }

    async editMetaData() {
        await this.page.click('#edit');
    }

    async saveMetaData() {
        await this.page.click('#save');
    }
}