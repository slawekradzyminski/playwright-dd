export type UserRole = 'ROLE_ADMIN' | 'ROLE_CLIENT';

export type User = {
  username: string;
  email: string;
  password: string;
  roles: UserRole[];
  firstName: string;
  lastName: string;
}; 