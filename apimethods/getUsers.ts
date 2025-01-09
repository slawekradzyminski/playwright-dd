import { APIRequestContext } from '@playwright/test';

export const getUsers = async (request: APIRequestContext, token?: string) => {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return request.get('/users', { headers });
}; 