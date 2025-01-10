import { test, expect } from '../../fixtures/authenticated.ui.fixture';
import { HomePage } from '../../pages/home.page';
import { EditPage } from '../../pages/edit.page';
import { generateUser } from '../../generators/userGenerator';
import { getUser } from '../../apimethods/getUser';
import { type User } from '../../types/User';
import { APIRequestContext } from '@playwright/test';
import { FRONTEND_URL } from '../../utils/constants';

async function verifyUserDataOnServer(
    request: APIRequestContext, 
    username: string, 
    token: string, 
    expectedData: Partial<User>
) {
    const userResponse = await getUser(request, username, token);
    expect(userResponse.status()).toBe(200);
    const userData = await userResponse.json();
    
    Object.entries(expectedData).forEach(([key, value]) => {
        expect(userData[key]).toEqual(value);
    });
}

test('should display edit form with user data', async ({ page, authenticatedContext }) => {
    // given
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.clickEditButton(authenticatedContext.userData);
    
    // when
    const editPage = new EditPage(page);

    // then
    await expect(editPage.heading).toBeVisible();
    await expect(editPage.firstNameInput).toHaveValue(authenticatedContext.userData.firstName);
    await expect(editPage.lastNameInput).toHaveValue(authenticatedContext.userData.lastName);
    await expect(editPage.emailInput).toHaveValue(authenticatedContext.userData.email);
    await expect(editPage.usernameInput).toBeDisabled();
    await expect(editPage.usernameInput).toHaveValue(authenticatedContext.userData.username);
    await expect(editPage.rolesInput).toBeDisabled();
    await expect(editPage.rolesInput).toHaveValue(authenticatedContext.userData.roles.join(','));
});

test('should update user data successfully', async ({ page, request, authenticatedContext }) => {
    // given
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.clickEditButton(authenticatedContext.userData);
    const editPage = new EditPage(page);
    const updatedUser = generateUser();
    
    // when
    await editPage.fillEditForm({
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email
    });
    await editPage.submitEdit();
    
    // then
    await expect(page).toHaveURL(`${FRONTEND_URL}/`);
    const userInList = await homePage.findUserInList(updatedUser.firstName, updatedUser.lastName);
    await expect(userInList).toBeVisible();

    // verify server-side changes
    await verifyUserDataOnServer(
        request, 
        authenticatedContext.userData.username, 
        authenticatedContext.token,
        {
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            username: authenticatedContext.userData.username,
            roles: authenticatedContext.userData.roles
        }
    );
});

test('should send correct PUT request when updating user', async ({ page, authenticatedContext }) => {
    // given
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.clickEditButton(authenticatedContext.userData);
    const editPage = new EditPage(page);
    const updatedUser = generateUser();
    let putRequestIntercepted = false;

    // intercept PUT request
    await page.route(`**/users/${authenticatedContext.userData.username}`, async (route) => {
        if (route.request().method() === 'PUT') {
            putRequestIntercepted = true;
            const requestBody = JSON.parse(route.request().postData() || '{}');
            
            // verify request payload
            expect(requestBody).toEqual({
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                roles: authenticatedContext.userData.roles,
                username: authenticatedContext.userData.username
            });

            // verify headers
            const headers = route.request().headers();
            expect(headers['authorization']).toBe(`Bearer ${authenticatedContext.token}`);
            expect(headers['content-type']).toContain('application/json');

            await route.continue();
        } else {
            await route.continue();
        }
    });
    
    // when
    await editPage.fillEditForm({
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email
    });
    await editPage.submitEdit();
    
    // then
    expect(putRequestIntercepted).toBe(true);
    await expect(page).toHaveURL(`${FRONTEND_URL}/`);
});

test('should cancel edit and return to home page', async ({ page, authenticatedContext }) => {
    // given
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.clickEditButton(authenticatedContext.userData);
    const editPage = new EditPage(page);
    const updatedUser = generateUser();
    
    // when
    await editPage.fillEditForm({
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email
    });
    await editPage.clickCancel();
    
    // then
    await expect(page).toHaveURL(`${FRONTEND_URL}/`);
    const userInList = await homePage.findUserInList(
        authenticatedContext.userData.firstName, 
        authenticatedContext.userData.lastName
    );
    await expect(userInList).toBeVisible();
}); 