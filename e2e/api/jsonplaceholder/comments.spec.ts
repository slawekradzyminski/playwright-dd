import { test, expect } from '@playwright/test';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('Comments API', () => {
    test('GET /comments - should return all comments', async ({ request }) => {
        // given
        const response = await request.get(`${BASE_URL}/comments`);
        const responseBody = await response.json();

        // then
        expect(response.ok()).toBeTruthy();
        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);
    });

    test('GET /comments/:id - should return single comment', async ({ request }) => {
        // given
        const commentId = 1;
        const response = await request.get(`${BASE_URL}/comments/${commentId}`);
        const comment = await response.json();

        // then
        expect(response.ok()).toBeTruthy();
        expect(comment.id).toBe(commentId);
        expect(comment.name).toBeTruthy();
        expect(comment.email).toBeTruthy();
        expect(comment.body).toBeTruthy();
    });

    test('GET /posts/:id/comments - should return comments for a post', async ({ request }) => {
        // given
        const postId = 1;
        const response = await request.get(`${BASE_URL}/posts/${postId}/comments`);
        const comments = await response.json();

        // then
        expect(response.ok()).toBeTruthy();
        expect(Array.isArray(comments)).toBeTruthy();
        comments.forEach(comment => {
            expect(comment.postId).toBe(postId);
        });
    });

    test('POST /comments - should create a new comment', async ({ request }) => {
        // given
        const newComment = {
            postId: 1,
            name: 'Test Comment',
            email: 'test@example.com',
            body: 'This is a test comment'
        };

        // when
        const response = await request.post(`${BASE_URL}/comments`, { data: newComment });
        const createdComment = await response.json();

        // then
        expect(response.ok()).toBeTruthy();
        expect(createdComment.id).toBeTruthy();
        expect(createdComment.name).toBe(newComment.name);
        expect(createdComment.email).toBe(newComment.email);
        expect(createdComment.body).toBe(newComment.body);
    });

    test('PUT /comments/:id - should update a comment', async ({ request }) => {
        // given
        const commentId = 1;
        const updatedComment = {
            name: 'Updated Comment',
            email: 'updated@example.com',
            body: 'This is an updated comment'
        };

        // when
        const response = await request.put(`${BASE_URL}/comments/${commentId}`, { data: updatedComment });
        const returnedComment = await response.json();

        // then
        expect(response.ok()).toBeTruthy();
        expect(returnedComment.name).toBe(updatedComment.name);
        expect(returnedComment.email).toBe(updatedComment.email);
        expect(returnedComment.body).toBe(updatedComment.body);
    });

    test('DELETE /comments/:id - should delete a comment', async ({ request }) => {
        // given
        const commentId = 1;

        // when
        const response = await request.delete(`${BASE_URL}/comments/${commentId}`);

        // then
        expect(response.ok()).toBeTruthy();
    });
}); 