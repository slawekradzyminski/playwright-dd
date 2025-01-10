import { test, expect } from '../../fixtures/authenticated.fixture';
import { putUser } from '../../apimethods/putUser';
import { getUser } from '../../apimethods/getUser';
import { UserEditBody } from '../../types/UserEditBody';

test.describe('Edit User API', () => {
  test('should successfully edit user details', async ({ request, authenticatedUser }) => {
    // given
    const editedData: UserEditBody = {
      email: 'edited@example.com',
      roles: ['ROLE_ADMIN'],
      firstName: 'EditedFirst',
      lastName: 'EditedLast'
    };

    // when
    const response = await putUser(
      request,
      authenticatedUser.userData.username,
      editedData,
      authenticatedUser.token
    );

    // then
    expect(response.status()).toBe(200);
    
    // verify the changes
    const getUserResponse = await getUser(
      request,
      authenticatedUser.userData.username,
      authenticatedUser.token
    );
    const updatedUser = await getUserResponse.json();
    expect(updatedUser).toMatchObject(editedData);
  });

  test('should return 403 when no authorization header', async ({ request, authenticatedUser }) => {
    // given
    const editedData: UserEditBody = {
      email: 'edited@example.com',
      roles: ['ROLE_ADMIN'],
      firstName: 'EditedFirst',
      lastName: 'EditedLast'
    };

    // when
    const response = await putUser(
      request,
      authenticatedUser.userData.username,
      editedData,
      'invalid-token'
    );

    // then
    expect(response.status()).toBe(403);
  });

  test('should return 404 when user does not exist', async ({ request, authenticatedUser }) => {
    // given
    const editedData: UserEditBody = {
      email: 'edited@example.com',
      roles: ['ROLE_ADMIN'],
      firstName: 'EditedFirst',
      lastName: 'EditedLast'
    };

    // when
    const response = await putUser(
      request,
      'non-existent-user',
      editedData,
      authenticatedUser.token
    );

    // then
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toMatchObject({
      status: 404,
      error: 'Not Found',
      message: 'The user doesn\'t exist',
      path: '/users/non-existent-user'
    });
  });
}); 