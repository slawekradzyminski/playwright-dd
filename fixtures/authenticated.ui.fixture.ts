import { test as base, expect } from '@playwright/test';
import { generateUser } from '../generators/userGenerator';
import { postSignUp } from '../apimethods/postSignUp';
import { postSignIn } from '../apimethods/postSignIn';
import { deleteUser } from '../apimethods/deleteUser';
import { User } from '../types/User';
import { FRONTEND_URL } from '../utils/constants';

type AuthenticatedUIFixtures = {
  authenticatedContext: {
    userData: User;
    token: string;
  };
};

export const test = base.extend<AuthenticatedUIFixtures>({
  authenticatedContext: async ({ page, request }, use) => {
    const userData = generateUser();
   
    // Register user
    const registerResponse = await postSignUp(request, userData);
    expect(registerResponse.status()).toBe(201);


    // Login user
    const loginResponse = await postSignIn(request, {
      username: userData.username,
      password: userData.password
    });
    expect(loginResponse.status()).toBe(200);
   
    const loginData = await loginResponse.json();
   
    // Navigate to login page first (to get access to localStorage)
    await page.goto(`${FRONTEND_URL}`);
    await page.waitForTimeout(1000);
    // Set up localStorage with user data
    await page.evaluate((data) => {
        localStorage.setItem('user', JSON.stringify(data));
        window.dispatchEvent(new Event('storage'));
      }, loginData);
  
    // Provide the context to the test
    await use({
      userData,
      token: loginData.token
    });

    // Cleanup after test
    const deleteResponse = await deleteUser(request, userData.username, loginData.token);
    expect(deleteResponse.status()).toBe(204);
   
    // Clear localStorage
    await page.evaluate(() => {
      localStorage.clear();
    });
  }
});


export { expect } from '@playwright/test';