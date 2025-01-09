import { test, expect } from '@playwright/test';
import { ISO_TIMESTAMP_PATTERN } from '../../utils/validation';

test.describe('Login API', () => {

  test('should successfully login with valid admin credentials', async ({ request }) => {
    // when
    const response = await request.post('/users/signin', {
      data: {
        username: 'admin',
        password: 'admin'
      }
    });

    // then
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body).toMatchObject({
      username: 'admin',
      roles: ['ROLE_ADMIN', 'ROLE_CLIENT'],
      firstName: 'Slawomir',
      lastName: 'Radzyminski',
      email: 'admin@email.com'
    });
    expect(body.token).toBeDefined();
    expect(typeof body.token).toBe('string');
  });

  test('should handle empty credentials', async ({ request }) => {
    // when
    const response = await request.post('/users/signin', {
      data: {
        username: '',
        password: ''
      }
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
    const response = await request.post('/users/signin', {
      data: {
        username: 'invaliduser',
        password: 'wrongpassword'
      }
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
