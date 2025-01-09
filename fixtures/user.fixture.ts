import { test as base } from '@playwright/test';
import { generateUser } from '../generators/userGenerator';

type UserFixtures = {
  userData: ReturnType<typeof generateUser>;
};

export const test = base.extend<UserFixtures>({
  userData: async ({}, use) => {
    const userData = generateUser();
    await use(userData);
  }
});

export { expect } from '@playwright/test'; 