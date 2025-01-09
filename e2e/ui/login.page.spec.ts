import { test, expect } from '../../fixtures/registered.user.fixture';
import { LoginPage } from '../../pages/login.page';
import { RegisterPage } from '../../pages/register.page';

test('should successfully login with registered user', async ({ page, registeredUser }) => {
    // given
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // when
    await loginPage.loginWithUser(registeredUser);

    // then
    await expect(loginPage.welcomeMessage(registeredUser.firstName)).toBeVisible();
    await expect(loginPage.successMessage).toBeVisible();
});

test('should display error message for invalid credentials', async ({ page }) => {
    // given
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // when
    await loginPage.login('invaliduser', 'wrongpassword');

    // then
    await expect(loginPage.errorMessage).toBeVisible();
});

test('should navigate to register page when clicking register button', async ({ page }) => {
    // given
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // when
    await loginPage.clickRegister();

    // then
    const registerPage = new RegisterPage(page);
    await expect(page).toHaveURL(registerPage.page.url());
    const heading = await registerPage.getHeading('Register');
    await expect(heading).toBeVisible();
});
