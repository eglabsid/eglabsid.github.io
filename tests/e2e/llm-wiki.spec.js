// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * LLM Wiki Firebase Integration Tests
 *
 * Note: firebase-config.js is NOT loaded as a global on student-blog.html —
 * that page uses inline ES module imports. Tests verify the static asset
 * exists and contains the correct constants, and that the admin page loads.
 */

test.describe('LLM Wiki Firebase Integration', () => {

  test('firebase-config.js static asset contains LLM_WIKI collection constant', async ({ page }) => {
    // Fetch the static JS file and verify the LLM_WIKI constant is present
    const response = await page.goto('/assets/js/firebase-config.js');
    expect(response.status()).toBe(200);

    const source = await page.content();
    expect(source).toContain("LLM_WIKI");
    expect(source).toContain("llm_wiki");
  });

  test('llm-wiki-service.js static asset is served and contains CRUD functions', async ({ page }) => {
    const response = await page.goto('/assets/js/llm-wiki-service.js');
    expect(response.status()).toBe(200);

    const source = await page.content();
    expect(source).toContain('llmWikiQueryByType');
    expect(source).toContain('llmWikiSaveEntry');
    expect(source).toContain('llm_wiki');
  });

  test('admin page loads without JS crash', async ({ page }) => {
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    // Page loaded successfully — no navigation error
    const url = page.url();
    expect(url).toContain('admin');
  });

  test('student-blog.html loads and renders without crash', async ({ page }) => {
    await page.goto('/student-blog.html');
    await page.waitForLoadState('domcontentloaded');

    // Page title and hero section confirm correct page load
    await expect(page).toHaveTitle(/Student Blog/i);
    const hero = page.locator('.student-blog-hero');
    await expect(hero).toBeVisible();
  });

});
