import { test, expect } from '../../fixtures/authenticated.fixture';
import { getUser } from '../../apimethods/getUser';
import { User } from '../../types/User';
import exp from 'constants';

test.describe('User API', () => {
  
  test('should return user details when authenticated', async ({ request, authenticatedUser }) => {
    // when
    const response = await getUser(request, authenticatedUser.userData.username, authenticatedUser.token);

    // then
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({
      username: authenticatedUser.userData.username,
      firstName: authenticatedUser.userData.firstName,
      lastName: authenticatedUser.userData.lastName,
      email: authenticatedUser.userData.email,
      roles: authenticatedUser.userData.roles
    });
    expect(typeof body.id).toBe('number')
  });

  test('should return 404 when user does not exist', async ({ request, authenticatedUser }) => {
    // when
    const response = await getUser(request, 'non-existent-user', authenticatedUser.token);

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

  test('should return 403 when no authorization header', async ({ request, authenticatedUser }) => {
    // when
    const response = await getUser(request, authenticatedUser.userData.username);

    // then
    expect(response.status()).toBe(403);
  });

}); 