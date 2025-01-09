import { type Page, type Locator } from '@playwright/test';
import { FRONTEND_URL } from '../utils/constants';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto(path: string) {
        await this.page.goto(`${FRONTEND_URL}${path}`);
    }

    async getHeading(name: string): Promise<Locator> {
        return this.page.getByRole('heading', { name });
    }
} 