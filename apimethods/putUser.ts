import { APIRequestContext } from '@playwright/test';
import { UserEditBody } from '../types/UserEditBody';

export const putUser = async (request: APIRequestContext, username: string, userData: UserEditBody, token: string) => {
  return request.put(`/users/${username}`, {
    data: userData,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}; 