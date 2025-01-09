import { test as base, expect } from '@playwright/test';
import { generateUser } from '../generators/userGenerator';
import { postSignUp } from '../apimethods/postSignUp';
import { postSignIn } from '../apimethods/postSignIn';
import { deleteUser } from '../apimethods/deleteUser';
import { User } from '../types/User';

type AuthenticatedFixtures = {
  authenticatedUser: {
    userData: User;
    token: string;
  };
};

export const test = base.extend<AuthenticatedFixtures>({
  // to co jest przed await use jest wykonywane przed testem (setup)
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
    
    // to co zwracamy do testu
    await use({
      userData,
      token
    });

    // to co jest po await use jest wykonywane po tescie (cleanup)
    const deleteResponse = await deleteUser(request, userData.username, token);
    expect(deleteResponse.status()).toBe(204);
  }
});

export { expect } from '@playwright/test';  