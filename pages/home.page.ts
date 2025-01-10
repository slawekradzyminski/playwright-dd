import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';


export class HomePage extends BasePage {
    readonly welcomeMessage: (firstName: string) => Locator;
    readonly logoutButton: Locator;
    readonly userListHeading: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.welcomeMessage = (firstName: string) => page.getByRole('heading', { name: `Hi ${firstName}!` });
        this.logoutButton = page.getByRole('link', { name: 'Logout' });
        this.userListHeading = page.getByRole('heading', { name: 'All registered users:' });
        this.successMessage = page.getByText("You're logged in! Congratulations :)");
    }

    async goto() {
        await super.goto('/');
    }

    async logout() {
        await this.logoutButton.click();
    }

    async getUsersCount() {
        const userList = this.page.locator('ul li');
        await userList.first().waitFor({ state: 'attached' });
        return userList.count();
    }

    async findUserInList(firstName: string, lastName: string) {
        const fullName = `${firstName} ${lastName}`;
        return this.page.locator('ul li').filter({ hasText: fullName }).first();
    }
}

