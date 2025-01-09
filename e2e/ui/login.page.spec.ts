import { test, expect } from '../../fixtures/registered.user.fixture';
import { FRONTEND_URL } from '../../utils/constants';

test('should successfully login with registered user', async ({ page, registeredUser }) => {
    // given
    await page.goto(`${FRONTEND_URL}/login`);

    // when
    await page.locator('input[name="username"]').fill(registeredUser.username);
    await page.locator('input[name="password"]').fill(registeredUser.password);
    await page.getByRole('button', { name: 'Login' }).click();

    // then
    await expect(page.getByRole('heading', { name: `Hi ${registeredUser.firstName}!` })).toBeVisible();
    await expect(page.getByText("You're logged in! Congratulations :)")).toBeVisible();
});

test('should display error message for invalid credentials', async ({ page }) => {
    // given
    await page.goto(`${FRONTEND_URL}/login`);

    // when
    await page.locator('input[name="username"]').fill('invaliduser');
    await page.locator('input[name="password"]').fill('wrongpassword');
    await page.getByRole('button', { name: 'Login' }).click();

    // then
    await expect(page.getByText('Invalid username/password supplied')).toBeVisible();
});

test('should navigate to register page when clicking register button', async ({ page }) => {
    // given
    await page.goto(`${FRONTEND_URL}/login`);
    const registerLink = page.getByRole('link', { name: 'Register' });

    // when
    await registerLink.click();

    // then
    await expect(page).toHaveURL(`${FRONTEND_URL}/register`);
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
});
