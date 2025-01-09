import { APIRequestContext } from '@playwright/test';

export const deleteUser = async (request: APIRequestContext, username: string, token: string) => {
  return request.delete(`/users/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}; 