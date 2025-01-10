import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { type User } from '../types/User';
import { FRONTEND_URL } from '../utils/constants';

export class HomePage extends BasePage {
    readonly welcomeMessage: (firstName: string) => Locator;
    readonly logoutButton: Locator;
    readonly userListHeading: Locator;
    readonly successMessage: Locator;
    readonly userList: Locator;

    constructor(page: Page) {
        super(page);
        this.welcomeMessage = (firstName: string) => page.getByRole('heading', { name: `Hi ${firstName}!` });
        this.logoutButton = page.getByRole('link', { name: 'Logout' });
        this.userListHeading = page.getByRole('heading', { name: 'All registered users:' });
        this.successMessage = page.getByText("You're logged in! Congratulations :)");
        this.userList = page.locator('ul');
    }

    async goto() {
        await super.goto('');
        await this.successMessage.waitFor({ state: 'visible' });
        await this.userListHeading.waitFor({ state: 'visible' });
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

    private async _getEditButton(user: User) {
        await this.userList.waitFor({ state: 'visible' });
        const fullName = `${user.firstName} ${user.lastName}`;
        const userRow = this.page.locator('ul li').filter({ hasText: fullName }).first();
        await userRow.waitFor({ state: 'visible' });
        return userRow.locator('a.text-primary.edit');
    }

    async clickEditButton(user: User) {
        const editButton = await this._getEditButton(user);
        await editButton.click();
    }
}

