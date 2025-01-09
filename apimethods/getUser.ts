import { APIRequestContext } from '@playwright/test';

export const getUser = async (request: APIRequestContext, username: string, token?: string) => {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return request.get(`/users/${username}`, { headers });
}; 