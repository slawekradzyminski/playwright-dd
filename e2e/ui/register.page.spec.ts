import { test as baseTest, expect } from '@playwright/test';
import { test as userTest } from '../../fixtures/user.fixture';
import { test as registeredTest } from '../../fixtures/registered.user.fixture';
import { FRONTEND_URL } from '../../utils/constants';

userTest('should successfully register a new user', async ({ page, userData }) => {
    // given
    await page.goto(`${FRONTEND_URL}/register`);

    // when
    await page.locator('input[name="firstName"]').fill(userData.firstName);
    await page.locator('input[name="lastName"]').fill(userData.lastName);
    await page.locator('input[name="username"]').fill(userData.username);
    await page.locator('input[name="password"]').fill(userData.password);
    await page.locator('input[name="email"]').fill(userData.email);
    await page.getByRole('button', { name: 'Register' }).click();

    // then
    await expect(page).toHaveURL(`${FRONTEND_URL}/login`);
    await expect(page.getByText('Registration successful')).toBeVisible();
});

registeredTest('should show error when registering with existing username', async ({ page, registeredUser }) => {
    // given
    await page.goto(`${FRONTEND_URL}/register`);

    // when
    await page.locator('input[name="firstName"]').fill(registeredUser.firstName);
    await page.locator('input[name="lastName"]').fill(registeredUser.lastName);
    await page.locator('input[name="username"]').fill(registeredUser.username);
    await page.locator('input[name="password"]').fill(registeredUser.password);
    await page.locator('input[name="email"]').fill(registeredUser.email);
    await page.getByRole('button', { name: 'Register' }).click();

    // then
    await expect(page.getByText('Username is already in use')).toBeVisible();
});

baseTest('should navigate to login page when clicking cancel button', async ({ page }) => {
    // given
    await page.goto(`${FRONTEND_URL}/register`);
    const cancelLink = page.getByRole('link', { name: 'Cancel' });

    // when
    await cancelLink.click();

    // then
    await expect(page).toHaveURL(`${FRONTEND_URL}/login`);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
}); 