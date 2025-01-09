import { test as base, expect } from '@playwright/test';
import { generateUser } from '../generators/userGenerator';
import { postSignUp } from '../apimethods/postSignUp';
import { postSignIn } from '../apimethods/postSignIn';
import { User } from '../types/User';

type AuthenticatedFixtures = {
  authenticatedUser: {
    userData: User;
    token: string;
  };
};

export const test = base.extend<AuthenticatedFixtures>({
  authenticatedUser: async ({ request }, use) => {
    const userData = generateUser();
    const registerResponse = await postSignUp(request, userData);
    expect(registerResponse.status()).toBe(201);

    const loginResponse = await postSignIn(request, {
      username: userData.username,
      password: userData.password
    });
    expect(loginResponse.status()).toBe(200);
    
    const { token } = await loginResponse.json();
    
    await use({
      userData,
      token
    });
  }
});

export { expect } from '@playwright/test';  