import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { type User } from '../types/User';

export class RegisterPage extends BasePage {
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly emailInput: Locator;
    readonly registerButton: Locator;
    readonly cancelLink: Locator;
    readonly errorMessage: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.firstNameInput = page.locator('input[name="firstName"]');
        this.lastNameInput = page.locator('input[name="lastName"]');
        this.usernameInput = page.locator('input[name="username"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.emailInput = page.locator('input[name="email"]');
        this.registerButton = page.getByRole('button', { name: 'Register' });
        this.cancelLink = page.getByRole('link', { name: 'Cancel' });
        this.errorMessage = page.getByText('Username is already in use');
        this.successMessage = page.getByText('Registration successful');
    }

    async goto() {
        await super.goto('/register');
    }

    async fillRegistrationForm(user: User) {
        await this.firstNameInput.fill(user.firstName);
        await this.lastNameInput.fill(user.lastName);
        await this.usernameInput.fill(user.username);
        await this.passwordInput.fill(user.password);
        await this.emailInput.fill(user.email);
    }

    async submitRegistration() {
        await this.registerButton.click();
    }

    async clickCancel() {
        await this.cancelLink.click();
    }
} 