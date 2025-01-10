import { test, expect } from '@playwright/test';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('Posts API', () => {
    test('GET /posts - should return all posts', async ({ request }) => {
        // given
        const response = await request.get(`${BASE_URL}/posts`);
        const responseBody = await response.json();

        // then
        expect(response.ok()).toBeTruthy();
        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);
    });

    test('GET /posts/:id - should return single post', async ({ request }) => {
        // given
        const postId = 1;
        const response = await request.get(`${BASE_URL}/posts/${postId}`);
        const post = await response.json();

        // then
        expect(response.ok()).toBeTruthy();
        expect(post.id).toBe(postId);
        expect(post.title).toBeTruthy();
        expect(post.body).toBeTruthy();
    });

    test('POST /posts - should create a new post', async ({ request }) => {
        // given
        const newPost = {
            title: 'New Post',
            body: 'This is a new post',
            userId: 1
        };

        // when
        const response = await request.post(`${BASE_URL}/posts`, { data: newPost });
        const createdPost = await response.json();

        // then
        expect(response.ok()).toBeTruthy();
        expect(createdPost.id).toBeTruthy();
        expect(createdPost.title).toBe(newPost.title);
        expect(createdPost.body).toBe(newPost.body);
    });

    test('PUT /posts/:id - should update a post', async ({ request }) => {
        // given
        const postId = 1;
        const updatedPost = {
            title: 'Updated Post',
            body: 'This is an updated post',
            userId: 1
        };

        // when
        const response = await request.put(`${BASE_URL}/posts/${postId}`, { data: updatedPost });
        const returnedPost = await response.json();

        // then
        expect(response.ok()).toBeTruthy();
        expect(returnedPost.title).toBe(updatedPost.title);
        expect(returnedPost.body).toBe(updatedPost.body);
    });

    test('DELETE /posts/:id - should delete a post', async ({ request }) => {
        // given
        const postId = 1;

        // when
        const response = await request.delete(`${BASE_URL}/posts/${postId}`);

        // then
        expect(response.ok()).toBeTruthy();
    });
}); 