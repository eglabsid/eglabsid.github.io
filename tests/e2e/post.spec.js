// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Post page (/post.html) — Published post listing
 * Verifies the new post type page loads and shows correct structure
 */

test.describe('Post Page — Published Posts Listing', () => {

  test('post.html loads successfully', async ({ page }) => {
    const res = await page.goto('/post.html');
    expect(res.status()).toBe(200);
  });

  test('post page has correct title', async ({ page }) => {
    await page.goto('/post.html');
    await expect(page).toHaveTitle(/연구 글|EGLAB/i);
  });

  test('post page hero heading contains Posts', async ({ page }) => {
    await page.goto('/post.html');
    await page.waitForLoadState('domcontentloaded');

    const html = await page.content();
    expect(html).toMatch(/연구 글/);
  });

  test('post page loads published blog_posts and allows student posts', async ({ page }) => {
    await page.goto('/post.html');
    const html = await page.content();

    expect(html).toContain("where('status', '==', 'published')");
    expect(html).toContain("['post', 'student', 'student_post']");
    expect(html).toContain('Student Post');
    expect(html).toContain('blog_posts');
  });

  test('post page links back to admin for writing', async ({ page }) => {
    await page.goto('/post.html');
    await page.waitForLoadState('domcontentloaded');

    const adminLinks = page.locator('a[href*="admin"]');
    const count = await adminLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('post page has EGLab brand styling', async ({ page }) => {
    await page.goto('/post.html');
    await page.waitForLoadState('domcontentloaded');

    const html = await page.content();
    expect(html).toContain('#7bc043');
  });

});
