import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { type User } from '../types/User';

export class LoginPage extends BasePage {
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly registerLink: Locator;
    readonly errorMessage: Locator;
    readonly welcomeMessage: (firstName: string) => Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.locator('input[name="username"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.registerLink = page.getByRole('link', { name: 'Register' });
        this.errorMessage = page.getByText('Invalid username/password supplied');
        this.welcomeMessage = (firstName: string) => page.getByRole('heading', { name: `Hi ${firstName}!` });
        this.successMessage = page.getByText("You're logged in! Congratulations :)");
    }

    async goto() {
        await super.goto('/login');
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async loginWithUser(user: User) {
        await this.login(user.username, user.password);
    }

    async clickRegister() {
        await this.registerLink.click();
    }
} 