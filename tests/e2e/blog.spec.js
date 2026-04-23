// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('EGLAB Blog Hub Page', () => {
  test('student-blog.html loads with hub title', async ({ page }) => {
    await page.goto('/student-blog.html');
    await expect(page).toHaveTitle(/EGLAB Blog/i);
  });

  test('hero section is visible with Korean hub heading', async ({ page }) => {
    await page.goto('/student-blog.html');
    await page.waitForLoadState('domcontentloaded');

    const hero = page.locator('.ebh-hero');
    await expect(hero).toBeVisible();
    await expect(hero.locator('h1')).toContainText('EGLAB');
    await expect(hero.locator('h1')).toContainText('허브');
  });

  test('hub exposes EGLAB Blog and GitHub entry points', async ({ page }) => {
    await page.goto('/student-blog.html');

    const blogLink = page.locator('a[href="https://www.myeglab.com/"]').first();
    const githubLink = page.locator('a[href="https://github.com/eglabsid"]').first();

    await expect(blogLink).toBeVisible();
    await expect(githubLink).toBeVisible();
  });

  test('archive preview shows translated local posts', async ({ page }) => {
    await page.goto('/student-blog.html');
    await page.waitForLoadState('domcontentloaded');

    const cards = page.locator('.ebh-archive-card');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThanOrEqual(4);
  });

  test('header navigation works from hub page', async ({ page }) => {
    await page.goto('/student-blog.html');
    await page.waitForLoadState('domcontentloaded');

    const header = page.locator('.main-header');
    await expect(header).toBeVisible();

    const logo = header.locator('.logo a');
    await expect(logo).toBeVisible();
    const href = await logo.getAttribute('href');
    expect(href).toBeTruthy();
  });

  test('footer contains hub and admin links', async ({ page }) => {
    await page.goto('/student-blog.html');
    const footer = page.locator('.main-footer');
    await expect(footer).toBeVisible();
    await expect(footer.locator('a[href*="student-blog"]')).toBeVisible();
    await expect(footer.locator('a[href*="admin"]')).toBeVisible();
  });

  test('hub page does not overflow horizontally on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/student-blog.html');
    await page.waitForLoadState('domcontentloaded');

    const hasHorizontalOverflow = await page.evaluate(() => {
      const root = document.documentElement;
      return root.scrollWidth > window.innerWidth + 1;
    });

    expect(hasHorizontalOverflow).toBe(false);
  });
});

test.describe('Student Post Page', () => {
  test('student-post.html loads without postId and shows not-found or loading', async ({ page }) => {
    await page.goto('/student-post.html');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(4000);

    const notFound = page.locator('#notFoundState');
    await expect(notFound).toBeVisible();
  });

  test('back to hub link is present', async ({ page }) => {
    await page.goto('/student-post.html');
    await page.waitForLoadState('domcontentloaded');

    const backLink = page.locator('.content a[href*="student-blog"]').first();
    await expect(backLink).toBeVisible();
    const href = await backLink.getAttribute('href');
    expect(href).toContain('student-blog');
  });

  test('student post layout does not overflow horizontally on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/student-post.html');
    await page.waitForLoadState('domcontentloaded');

    const hasHorizontalOverflow = await page.evaluate(() => {
      const root = document.documentElement;
      return root.scrollWidth > window.innerWidth + 1;
    });

    expect(hasHorizontalOverflow).toBe(false);
  });
});
