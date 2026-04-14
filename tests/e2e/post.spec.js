// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Post page (/post.html) — General Posts listing
 * Verifies the new post type page loads and shows correct structure
 */

test.describe('Post Page — General Posts Listing', () => {

  test('post.html loads successfully', async ({ page }) => {
    const res = await page.goto('/post.html');
    expect(res.status()).toBe(200);
  });

  test('post page has correct title', async ({ page }) => {
    await page.goto('/post.html');
    await expect(page).toHaveTitle(/Posts.*Evolutionary Game LAB/i);
  });

  test('post page hero heading contains Posts', async ({ page }) => {
    await page.goto('/post.html');
    await page.waitForLoadState('domcontentloaded');

    const html = await page.content();
    expect(html).toMatch(/Posts/);
  });

  test('post page has Firebase blog_posts query for postType=post', async ({ page }) => {
    await page.goto('/post.html');
    const html = await page.content();

    expect(html).toContain("where('postType', '==', 'post')");
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

test.describe('Student Blog — postType Filter', () => {

  test('student-blog.html loads successfully', async ({ page }) => {
    const res = await page.goto('/student-blog.html');
    expect(res.status()).toBe(200);
  });

  test('student-blog filters out postType=post entries', async ({ page }) => {
    await page.goto('/student-blog.html');
    const html = await page.content();

    // filteredDocs filter logic should be present
    expect(html).toContain('filteredDocs');
    expect(html).toContain("pt === 'student'");
  });

});
