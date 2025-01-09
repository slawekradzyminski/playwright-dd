import { test as base, expect } from '@playwright/test';
import { generateUser } from '../../generators/userGenerator';
import { postSignUp } from '../../apimethods/postSignUp';
import { User } from '../../types/User';

type AuthFixtures = {
  registeredUser: User;
};

export const test = base.extend<AuthFixtures>({
  registeredUser: async ({ request }, use) => {
    const userData = generateUser();
    const response = await postSignUp(request, userData);
    expect(response.status()).toBe(201);
    await use(userData);
  }
});

export { expect } from '@playwright/test'; 