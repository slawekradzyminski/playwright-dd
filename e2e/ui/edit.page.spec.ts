import { test, expect } from '../../fixtures/authenticated.ui.fixture';
import { HomePage } from '../../pages/home.page';
import { EditPage } from '../../pages/edit.page';
import { generateUser } from '../../generators/userGenerator';

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

test('should update user data successfully', async ({ page, authenticatedContext }) => {
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
    await expect(page).toHaveURL(homePage.page.url());
    const userInList = await homePage.findUserInList(updatedUser.firstName, updatedUser.lastName);
    await expect(userInList).toBeVisible();
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
    await expect(page).toHaveURL(homePage.page.url());
    const userInList = await homePage.findUserInList(
        authenticatedContext.userData.firstName, 
        authenticatedContext.userData.lastName
    );
    await expect(userInList).toBeVisible();
}); 