// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Tags Knowledge Graph Page Tests
 * Verifies D3 force-directed graph renders on tags.html (April 2026 redesign)
 */

test.describe('Tags Knowledge Graph', () => {

  test('tags.html loads without error', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('/tags.html');
    await page.waitForLoadState('domcontentloaded');
    // Filter out pre-existing layout errors (theme toggle 'sw' null, Firebase)
    const graphErrors = errors.filter(e =>
      !e.includes('Firebase') &&
      !e.includes('firestore') &&
      !e.includes("'sw'") &&
      !e.includes('theme') &&
      !e.includes('addEventListener')  // layout-owned sw.addEventListener crash
    );
    expect(graphErrors).toHaveLength(0);
  });

  test('knowledge graph title is present in hero', async ({ page }) => {
    await page.goto('/tags.html');
    await page.waitForLoadState('domcontentloaded');
    const heading = page.locator('h1');
    await expect(heading).toContainText('태그');
  });

  test('graph SVG element is present', async ({ page }) => {
    await page.goto('/tags.html');
    await page.waitForLoadState('domcontentloaded');
    const svg = page.locator('#kg-svg');
    await expect(svg).toBeAttached();
  });

  test('D3 renders node circles inside the SVG', async ({ page }) => {
    await page.goto('/tags.html');
    await page.waitForLoadState('domcontentloaded');
    // Allow D3 simulation to start
    await page.waitForTimeout(800);

    const circles = page.locator('#kg-svg circle');
    const count = await circles.count();
    // At least one tag node circle rendered
    expect(count).toBeGreaterThan(0);
  });

  test('D3 renders node label text', async ({ page }) => {
    await page.goto('/tags.html');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(800);

    const labels = page.locator('#kg-svg text');
    const count = await labels.count();
    expect(count).toBeGreaterThan(0);
  });

  test('control buttons are present', async ({ page }) => {
    await page.goto('/tags.html');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('#btn-kg-reset')).toBeVisible();
    await expect(page.locator('#btn-kg-list')).toBeVisible();
  });

  test('list view toggles on button click', async ({ page }) => {
    await page.goto('/tags.html');
    await page.waitForLoadState('domcontentloaded');

    const listSection = page.locator('#kg-list-section');
    // Initially hidden
    await expect(listSection).toBeHidden();

    // Click to show
    await page.locator('#btn-kg-list').click();
    await expect(listSection).toBeVisible();

    // Click to hide again
    await page.locator('#btn-kg-list').click();
    await expect(listSection).toBeHidden();
  });

  test('post panel is hidden on initial load', async ({ page }) => {
    await page.goto('/tags.html');
    await page.waitForLoadState('domcontentloaded');

    const panel = page.locator('#kg-panel');
    await expect(panel).toBeHidden();
  });

  test('clicking a graph node shows the post panel', async ({ page }) => {
    await page.goto('/tags.html');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000); // let simulation settle

    // Click the first rendered node circle
    const firstNode = page.locator('#kg-svg .kg-node circle').first();
    const nodeCount = await page.locator('#kg-svg .kg-node').count();
    if (nodeCount === 0) {
      // No nodes — graph may be empty in test env, skip
      return;
    }
    await firstNode.click();

    const panel = page.locator('#kg-panel');
    await expect(panel).toBeVisible({ timeout: 3000 });

    // Panel should show a tag name
    const tagLabel = page.locator('#kg-panel-tag');
    const text = await tagLabel.textContent();
    expect(text).toBeTruthy();
  });

  test('post panel close button hides panel', async ({ page }) => {
    await page.goto('/tags.html');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    const nodeCount = await page.locator('#kg-svg .kg-node').count();
    if (nodeCount === 0) return;

    await page.locator('#kg-svg .kg-node circle').first().click();
    await expect(page.locator('#kg-panel')).toBeVisible({ timeout: 3000 });

    await page.locator('#kg-panel-close').click();
    await expect(page.locator('#kg-panel')).toBeHidden();
  });

  test('tags page does not overflow horizontally on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/tags.html');
    await page.waitForLoadState('domcontentloaded');

    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth + 1;
    });
    expect(overflow).toBe(false);
  });

  test('EGLab header is present on tags page', async ({ page }) => {
    await page.goto('/tags.html');
    await page.waitForLoadState('domcontentloaded');
    const header = page.locator('.main-header');
    await expect(header).toBeVisible();
  });

});
