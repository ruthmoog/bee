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
}