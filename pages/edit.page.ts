import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { type User } from '../types/User';

export class EditPage extends BasePage {
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly usernameInput: Locator;
    readonly rolesInput: Locator;
    readonly editButton: Locator;
    readonly cancelLink: Locator;
    readonly heading: Locator;

    constructor(page: Page) {
        super(page);
        this.firstNameInput = page.locator('input[name="firstName"]');
        this.lastNameInput = page.locator('input[name="lastName"]');
        this.emailInput = page.locator('input[name="email"]');
        this.usernameInput = page.locator('input[name="username"]');
        this.rolesInput = page.locator('input[name="roles"]');
        this.editButton = page.getByRole('button', { name: 'Edit User' });
        this.cancelLink = page.getByRole('link', { name: 'Cancel' });
        this.heading = page.getByRole('heading', { name: 'Edit user' });
    }

    async goto(username: string) {
        await super.goto(`/edit/${username}`);
    }

    async fillEditForm(user: Partial<User>) {
        if (user.firstName) await this.firstNameInput.fill(user.firstName);
        if (user.lastName) await this.lastNameInput.fill(user.lastName);
        if (user.email) await this.emailInput.fill(user.email);
    }

    async submitEdit() {
        await this.editButton.click();
    }

    async clickCancel() {
        await this.cancelLink.click();
    }
} 