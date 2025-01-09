import { faker } from '@faker-js/faker';
import type { User } from '../types/User';

const MIN_LENGTH = 4;
const MAX_ATTEMPTS = 20;

const generateValidName = (generator: () => string): string => {
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const value = generator();
    if (value.length >= MIN_LENGTH) {
      return value;
    }
  }
  throw new Error('Could not generate valid name after maximum attempts');
};

export const generateUser = (): User => {
  const firstName = generateValidName(() => faker.person.firstName());
  const lastName = generateValidName(() => faker.person.lastName());
  const username = generateValidName(() => faker.internet.username());

  return {
    username,
    email: faker.internet.email({ firstName, lastName }),
    password: faker.internet.password({ length: 12 }),
    roles: ['ROLE_ADMIN', 'ROLE_CLIENT'],
    firstName,
    lastName,
  };
};
