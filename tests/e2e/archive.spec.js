// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Archive Page Readability Tests
 * Verifies archive page loads correctly and displays posts with proper styling
 */

test.describe('Archive Page Readability', () => {

  test('archive page loads with HTTP 200', async ({ page }) => {
    // Attach console listener before navigating
    const consoleMessages = [];
    const consoleErrors = [];

    page.on('console', msg => {
      consoleMessages.push(msg);
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    const response = await page.goto('/archive.html');
    await page.waitForLoadState('domcontentloaded');

    // Verify HTTP 200
    expect(response.status()).toBe(200);

    // Verify no console errors
    expect(consoleErrors).toHaveLength(0);
  });

  test('archive tag-master container is visible', async ({ page }) => {
    await page.goto('/archive.html');
    await page.waitForLoadState('domcontentloaded');

    const archiveContainer = page.locator('.archive.tag-master');
    await expect(archiveContainer).toBeVisible();
  });

  test('post title color is dark ink on light background (not cyan, not near-white)', async ({ page }) => {
    await page.goto('/archive.html');
    await page.waitForLoadState('domcontentloaded');

    // Wait for at least one post title to be available
    const postTitle = page.locator('.archive a.post-list-title').first();
    await expect(postTitle).toBeVisible();

    // Get the computed color
    const computedColor = await postTitle.evaluate(el =>
      window.getComputedStyle(el).color
    );

    // Verify it's NOT the old cyan (0, 188, 212)
    expect(computedColor).not.toMatch(/rgb\(0,\s*188,\s*212\)/);

    // Light theme: title should be dark ink #1a1a2e = rgb(26, 26, 46)
    // Verify it is dark (all channels < 100)
    const match = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      const [, r, g, b] = match.map(Number);
      expect(r).toBeLessThan(100);
      expect(g).toBeLessThan(100);
      expect(b).toBeLessThan(100);
    }
  });

  test('post excerpt exists and is visible', async ({ page }) => {
    await page.goto('/archive.html');
    await page.waitForLoadState('domcontentloaded');

    // Wait for post excerpt to be visible
    const postExcerpt = page.locator('.archive .post-excerpt').first();
    await expect(postExcerpt).toBeVisible();
  });

  test('search input is visible and interactive', async ({ page }) => {
    await page.goto('/archive.html');
    await page.waitForLoadState('domcontentloaded');

    // Use .first() — page has two #search-input elements (archive form + global search include)
    const searchInput = page.locator('#search-input').first();
    await expect(searchInput).toBeVisible();

    // Test interactivity: focus and type
    await searchInput.click();
    await searchInput.type('test');

    // Verify value was typed
    const value = await searchInput.inputValue();
    expect(value).toBe('test');
  });

});
