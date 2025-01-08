import { test, expect } from '@playwright/test';

test.describe('Login API', () => {
  const API_URL = 'http://localhost:4001';

  test('should return 422 for invalid credentials', async ({ request }) => {
    // when
    const response = await request.post(`${API_URL}/users/signin`, {
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
    expect(body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}\+\d{2}:\d{2}$/);
  });

  test('should handle empty credentials', async ({ request }) => {
    // when
    const response = await request.post(`${API_URL}/users/signin`, {
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

  test('should successfully login with valid admin credentials', async ({ request }) => {
    // when
    const response = await request.post(`${API_URL}/users/signin`, {
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

});
