import { test, expect } from '../../fixtures/registered.user.fixture';
import { ISO_TIMESTAMP_PATTERN } from '../../utils/validation';
import { postSignIn } from '../../apimethods/postSignIn';

test.describe('Login API', () => {

  test('should successfully login with valid credentials', async ({ request, registeredUser }) => {
    // when
    const response = await postSignIn(request, {
      username: registeredUser.username,
      password: registeredUser.password
    });

    // then
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body).toMatchObject({
      username: registeredUser.username,
      roles: registeredUser.roles,
      firstName: registeredUser.firstName,
      lastName: registeredUser.lastName,
      email: registeredUser.email
    });
    expect(body.token).toBeDefined();
    expect(typeof body.token).toBe('string');
  });

  test('should handle empty credentials', async ({ request }) => {
    // when
    const response = await postSignIn(request, {
      username: '',
      password: ''
    });

    // then
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toMatchObject({
      password: 'Minimum password length: 4 characters',
      username: 'Minimum username length: 4 characters'
    });
  });

  test('should return 422 for invalid credentials', async ({ request }) => {
    // when
    const response = await postSignIn(request, {
      username: 'invaliduser',
      password: 'wrongpassword'
    });

    // then
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body).toMatchObject({
      status: 422,
      error: 'Unprocessable Entity',
      message: 'Invalid username/password supplied',
      path: '/users/signin'
    });
    expect(body.timestamp).toMatch(ISO_TIMESTAMP_PATTERN);
  });

});
