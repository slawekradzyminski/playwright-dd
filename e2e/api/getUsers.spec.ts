import { test, expect } from '../fixtures/authenticated.fixture';

test.describe('Users API', () => {
  
  test('should return users list when authenticated', async ({ request, authenticatedUser }) => {
    // when
    const response = await request.get('/users', {
      headers: {
        'Authorization': `Bearer ${authenticatedUser.token}`
      }
    });

    // then
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.length).toBeGreaterThan(0);
    const foundUser = body.find(user => user.username === authenticatedUser.userData.username);
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
    const response = await request.get('/users');

    // then
    expect(response.status()).toBe(403);
    const body = await response.json();
    expect(body).toMatchObject({
      status: 403,
      error: 'Forbidden',
      message: 'Access Denied',
      path: '/users'
    });
  });

  // ToDo: unskip after fixing the bug DD-1678
  test.skip('should return 403 when invalid token provided', async ({ request }) => {
    // when
    const response = await request.get('/users', {
      headers: {
        'Authorization': 'Bearer invalid-token'
      }
    });

    // then
    expect(response.status()).toBe(403);
    const body = await response.json();
    expect(body).toMatchObject({
      status: 403,
      error: 'Forbidden',
      message: 'Access Denied',
      path: '/users'
    });
  });
});
