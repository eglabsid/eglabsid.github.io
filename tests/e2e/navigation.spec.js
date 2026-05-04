// @ts-check
const { test, expect } = require('@playwright/test');

async function navigateFromMenu(page, from, label, expectedUrl) {
  await page.goto(from);
  await page.waitForLoadState('domcontentloaded');
  await page.locator('.menu-icon').click();
  await page.waitForTimeout(250);
  await page.locator('.main-nav a', { hasText: label }).click();
  await expect(page).toHaveURL(expectedUrl);
}

test.describe('Primary Navigation', () => {
  test('home menu navigates to all posts', async ({ page }) => {
    await navigateFromMenu(page, '/', '연구 아카이브', /\/archive\.html$/);
  });

  test('archive menu navigates to tags', async ({ page }) => {
    await navigateFromMenu(page, '/archive.html', '태그', /\/tags\.html$/);
  });

  test('tags menu navigates to about', async ({ page }) => {
    await navigateFromMenu(page, '/tags.html', '연구실 소개', /\/about\.html$/);
  });

  test('about menu navigates to home', async ({ page }) => {
    await navigateFromMenu(page, '/about.html', '홈', /\/$/);
  });

  test('student blog menu navigates to home', async ({ page }) => {
    await navigateFromMenu(page, '/student-blog.html', '홈', /\/$/);
  });

  test('student post page menu still navigates while empty state is shown', async ({ page }) => {
    await page.goto('/student-post.html');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('#notFoundState')).toBeVisible();

    await page.locator('.menu-icon').click();
    await page.waitForTimeout(250);
    await page.locator('.main-nav a', { hasText: '홈' }).click();

    await expect(page).toHaveURL(/\/$/);
  });

  test('LLM Wiki is removed from header and footer navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    await page.locator('.menu-icon').click();
    await page.waitForTimeout(250);
    await expect(page.locator('.main-nav a', { hasText: 'LLM Wiki' })).toHaveCount(0);
    await expect(page.locator('.main-footer a', { hasText: 'LLM Wiki' })).toHaveCount(0);
  });
});
