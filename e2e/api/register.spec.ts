import { test, expect } from '../fixtures/user.fixture';
import { generateInvalidBody } from '../../generators/userGenerator';
import { ISO_TIMESTAMP_PATTERN } from '../../utils/validation';
import { postSignUp } from '../../apimethods/postSignUp';

test.describe('Register API', () => {
  test('should successfully register a new user', async ({ request, userData }) => {
    // when
    const response = await postSignUp(request, userData);

    // then
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toMatchObject({
      token: expect.any(String)
    });
  });

  test('should return 400 for empty credentials', async ({ request }) => {
    // when
    const response = await postSignUp(request, generateInvalidBody());

    // then
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toMatchObject({
      username: 'Minimum username length: 4 characters',
      password: 'Minimum password length: 4 characters'
    });
  });

  test('should return 400 for invalid email format', async ({ request, userData }) => {
    // given
    userData.email = 'invalid-email';

    // when
    const response = await postSignUp(request, userData);

    // then
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toMatchObject({
      email: 'must be a well-formed email address'
    });
  });

  test('should return 400 for short password', async ({ request, userData }) => {
    // given
    userData.password = '123';

    // when
    const response = await postSignUp(request, userData);

    // then
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toMatchObject({
      password: 'Minimum password length: 4 characters'
    });
  });

  test('should return 400 for short username', async ({ request, userData }) => {
    // given
    userData.username = 'abc';

    // when
    const response = await postSignUp(request, userData);

    // then
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toMatchObject({
      username: 'Minimum username length: 4 characters'
    });
  });

  test('should return 422 for duplicate username', async ({ request, userData }) => {
    // given user is already registered
    await postSignUp(request, userData);

    // when
    const response = await postSignUp(request, userData);

    // then
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body).toMatchObject({
      status: 422,
      error: 'Unprocessable Entity',
      message: 'Username is already in use',
      path: '/users/signup'
    });
    expect(body.timestamp).toMatch(ISO_TIMESTAMP_PATTERN);
  });
});
