import { test } from '@playwright/test';
import { FRONTEND_URL } from '../../utils/constants';

test('check register page content', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/register`);
    const content = await page.content();
    console.log(content);
}); 