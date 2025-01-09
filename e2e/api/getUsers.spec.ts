import { test, expect } from '../../fixtures/authenticated.fixture';
import { getUsers } from '../../apimethods/getUsers';
import { User } from '../../types/User';

test.describe('Users API', () => {
  
  test('should return users list when authenticated', async ({ request, authenticatedUser }) => {
    // when
    const response = await getUsers(request, authenticatedUser.token);

    // then
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    
    const foundUser = body.find((user: User) => user.username === authenticatedUser.userData.username);
    expect(foundUser).toBeDefined();
    expect(foundUser).toMatchObject({
      username: authenticatedUser.userData.username,
      firstName: authenticatedUser.userData.firstName,
      lastName: authenticatedUser.userData.lastName,
      email: authenticatedUser.userData.email,
      roles: authenticatedUser.userData.roles
    });
  });

  test('should return 403 when no authorization header', async ({ request }) => {
    // when
    const response = await getUsers(request);

    // then
    expect(response.status()).toBe(403);
  });

  test('should return 403 when invalid token provided', async ({ request }) => {
    // when
    const response = await getUsers(request, 'invalid-token');

    // then
    expect(response.status()).toBe(403);
  });
});
