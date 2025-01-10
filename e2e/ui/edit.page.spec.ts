import { test, expect } from '../../fixtures/authenticated.ui.fixture';
import { HomePage } from '../../pages/home.page';
import { EditPage } from '../../pages/edit.page';
import { generateUser } from '../../generators/userGenerator';

test('should display edit form with user data', async ({ page, authenticatedContext }) => {
    // given
    const homePage = new HomePage(page);
    await homePage.goto();
    await expect(homePage.successMessage).toBeVisible();
    
    // when
    const editButton = await homePage.getEditButton(authenticatedContext.userData);
    await editButton.click();
    
    // then
    const editPage = new EditPage(page);
    await expect(editPage.heading).toBeVisible();
    await expect(editPage.firstNameInput).toHaveValue(authenticatedContext.userData.firstName);
    await expect(editPage.lastNameInput).toHaveValue(authenticatedContext.userData.lastName);
    await expect(editPage.emailInput).toHaveValue(authenticatedContext.userData.email);
    await expect(editPage.usernameInput).toBeDisabled();
    await expect(editPage.rolesInput).toBeDisabled();
});

test('should update user data successfully', async ({ page, authenticatedContext }) => {
    // given
    const homePage = new HomePage(page);
    await homePage.goto();
    await expect(homePage.successMessage).toBeVisible();
    
    const editButton = await homePage.getEditButton(authenticatedContext.userData);
    await editButton.click();
    
    const editPage = new EditPage(page);
    await expect(editPage.heading).toBeVisible();
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
    await expect(homePage.successMessage).toBeVisible();
    
    const editButton = await homePage.getEditButton(authenticatedContext.userData);
    await editButton.click();
    
    const editPage = new EditPage(page);
    await expect(editPage.heading).toBeVisible();
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