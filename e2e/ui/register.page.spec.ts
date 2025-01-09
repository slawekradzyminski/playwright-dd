import { test as baseTest, expect } from '@playwright/test';
import { test as userTest } from '../../fixtures/user.fixture';
import { test as registeredTest } from '../../fixtures/registered.user.fixture';
import { RegisterPage } from '../../pages/register.page';
import { LoginPage } from '../../pages/login.page';

userTest('should successfully register a new user', async ({ page, userData }) => {
    // given
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    // when
    await registerPage.fillRegistrationForm(userData);
    await registerPage.submitRegistration();

    // then
    await expect(page).toHaveURL(new LoginPage(page).page.url());
    await expect(registerPage.successMessage).toBeVisible();
});

registeredTest('should show error when registering with existing username', async ({ page, registeredUser }) => {
    // given
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    // when
    await registerPage.fillRegistrationForm(registeredUser);
    await registerPage.submitRegistration();

    // then
    await expect(registerPage.errorMessage).toBeVisible();
});

baseTest('should navigate to login page when clicking cancel button', async ({ page }) => {
    // given
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    // when
    await registerPage.clickCancel();

    // then
    const loginPage = new LoginPage(page);
    await expect(page).toHaveURL(loginPage.page.url());
    const heading = await loginPage.getHeading('Login');
    await expect(heading).toBeVisible();
}); 