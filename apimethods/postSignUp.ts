import { APIRequestContext } from '@playwright/test';
import { User } from '../types/User';

export const postSignUp = async (request: APIRequestContext, userData: User) => {
  return request.post('/users/signup', {
    data: userData
  });
};
