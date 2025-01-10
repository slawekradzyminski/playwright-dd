import { test as base, expect } from '@playwright/test';
import { deleteUser } from '../../apimethods/deleteUser';
import { getUser } from '../../apimethods/getUser';
import { generateUser } from '../../generators/userGenerator';
import { postSignUp } from '../../apimethods/postSignUp';
import { postSignIn } from '../../apimethods/postSignIn';
import { User } from '../../types/User';

type TestFixtures = {
  testUser: {
    userData: User;
    token: string;
  };
};

const test = base.extend<TestFixtures>({
  testUser: async ({ request }, use) => {
    // Setup
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

test.describe('Delete User API', () => {
  test('should successfully delete user', async ({ request, testUser }) => {
    // given - create another user to verify deletion
    const verifierUser = generateUser();
    await postSignUp(request, verifierUser);
    const loginResponse = await postSignIn(request, {
      username: verifierUser.username,
      password: verifierUser.password
    });
    const { token: verifierToken } = await loginResponse.json();

    // when
    const response = await deleteUser(
      request,
      testUser.userData.username,
      testUser.token
    );

    // then
    expect(response.status()).toBe(204);
    
    // verify user is deleted using different user's token
    const getUserResponse = await getUser(
      request,
      testUser.userData.username,
      verifierToken
    );
    expect(getUserResponse.status()).toBe(404);

    // cleanup verifier user
    await deleteUser(request, verifierUser.username, verifierToken);
  });

  test('should return 403 when invalid token provided', async ({ request, testUser }) => {
    // when
    const response = await deleteUser(
      request,
      testUser.userData.username,
      'invalid-token'
    );

    // then
    expect(response.status()).toBe(403);
  });

  test('should return 404 when user does not exist', async ({ request, testUser }) => {
    // when
    const response = await deleteUser(
      request,
      'non-existent-user',
      testUser.token
    );

    // then
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toMatchObject({
      status: 404,
      error: 'Not Found',
      message: 'The user doesn\'t exist',
      path: '/users/non-existent-user'
    });
  });
}); 