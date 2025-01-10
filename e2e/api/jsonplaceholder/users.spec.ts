import { test, expect } from '@playwright/test';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('Users API', () => {
    test('GET /users - should return all users', async ({ request }) => {
        // given
        const response = await request.get(`${BASE_URL}/users`);
        const responseBody = await response.json();

        // then
        expect(response.ok()).toBeTruthy();
        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);
    });

    test('GET /users/:id - should return single user', async ({ request }) => {
        // given
        const userId = 1;
        const response = await request.get(`${BASE_URL}/users/${userId}`);
        const user = await response.json();

        // then
        expect(response.ok()).toBeTruthy();
        expect(user.id).toBe(userId);
        expect(user.name).toBeTruthy();
        expect(user.email).toBeTruthy();
    });

    test('GET /users/:id/posts - should return user posts', async ({ request }) => {
        // given
        const userId = 1;
        const response = await request.get(`${BASE_URL}/users/${userId}/posts`);
        const posts = await response.json();

        // then
        expect(response.ok()).toBeTruthy();
        expect(Array.isArray(posts)).toBeTruthy();
        posts.forEach(post => {
            expect(post.userId).toBe(userId);
        });
    });

    test('POST /users - should create a new user', async ({ request }) => {
        // given
        const newUser = {
            name: 'John Doe',
            username: 'johndoe',
            email: 'john@example.com',
            address: {
                street: 'Test Street',
                suite: 'Apt. 123',
                city: 'Testville',
                zipcode: '12345'
            }
        };

        // when
        const response = await request.post(`${BASE_URL}/users`, { data: newUser });
        const createdUser = await response.json();

        // then
        expect(response.ok()).toBeTruthy();
        expect(createdUser.id).toBeTruthy();
        expect(createdUser.name).toBe(newUser.name);
        expect(createdUser.email).toBe(newUser.email);
    });

    test('PUT /users/:id - should update a user', async ({ request }) => {
        // given
        const userId = 1;
        const updatedUser = {
            name: 'Updated Name',
            email: 'updated@example.com'
        };

        // when
        const response = await request.put(`${BASE_URL}/users/${userId}`, { data: updatedUser });
        const returnedUser = await response.json();

        // then
        expect(response.ok()).toBeTruthy();
        expect(returnedUser.name).toBe(updatedUser.name);
        expect(returnedUser.email).toBe(updatedUser.email);
    });

    test('DELETE /users/:id - should delete a user', async ({ request }) => {
        // given
        const userId = 1;

        // when
        const response = await request.delete(`${BASE_URL}/users/${userId}`);

        // then
        expect(response.ok()).toBeTruthy();
    });
}); 