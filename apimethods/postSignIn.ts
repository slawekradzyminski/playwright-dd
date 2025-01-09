import { APIRequestContext } from '@playwright/test';
import { SignInCredentials } from '../types/SignInCredentials';

export const postSignIn = async (request: APIRequestContext, credentials: SignInCredentials) => {
  return request.post('/users/signin', {
    data: credentials
  });
}; 