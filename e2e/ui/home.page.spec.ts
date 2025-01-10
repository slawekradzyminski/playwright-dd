import { test, expect } from '../../fixtures/authenticated.ui.fixture';
import { HomePage } from '../../pages/home.page';
import { LoginPage } from '../../pages/login.page';
import { generateUser } from '../../generators/userGenerator';
import { postSignUp } from '../../apimethods/postSignUp';

test('should display welcome message for authenticated user', async ({ page, authenticatedContext }) => {
    // given
    const homePage = new HomePage(page);
    await homePage.goto();
   
    // then
    await expect(homePage.welcomeMessage(authenticatedContext.userData.firstName)).toBeVisible();
    await expect(homePage.successMessage).toBeVisible();
});


test('should redirect to login page after logout', async ({ page, authenticatedContext }) => {
    // given
    const homePage = new HomePage(page);
    await homePage.goto();
    await expect(homePage.welcomeMessage(authenticatedContext.userData.firstName)).toBeVisible();
   
    // when
    await homePage.logout();
   
    // then
    const loginPage = new LoginPage(page);
    await expect(page).toHaveURL(loginPage.page.url());
});


test('should display non-empty user list after login', async ({ page, authenticatedContext }) => {
    // given
    const homePage = new HomePage(page);
    await homePage.goto();
   
    // then
    await expect(homePage.userListHeading).toBeVisible();
    const usersCount = await homePage.getUsersCount();
    expect(usersCount).toBeGreaterThan(0);
});


test('should display newly registered user in the list', async ({ page, request, authenticatedContext }) => {
    // given
    const homePage = new HomePage(page);
    await homePage.goto();
    const newUser = generateUser();
   
    // when
    const registerResponse = await postSignUp(request, newUser);
    expect(registerResponse.status()).toBe(201);
    await page.reload();
   
    // then
    const userInList = await homePage.findUserInList(newUser.firstName, newUser.lastName);
    await expect(userInList).toBeVisible();
});
