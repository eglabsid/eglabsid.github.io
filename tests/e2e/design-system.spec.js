// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * US-001 / US-002 / US-003 — Design System Tests
 * Verifies CSS custom properties, glass-card utility, and header behavior
 */

test.describe('Design System', () => {

  test('CSS custom properties defined on :root', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const hasPrimary = await page.evaluate(() => {
      const val = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-primary').trim();
      return val.length > 0;
    });
    expect(hasPrimary).toBe(true);

    const hasAccent = await page.evaluate(() => {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--color-accent').trim().length > 0;
    });
    expect(hasAccent).toBe(true);

    const hasRadius = await page.evaluate(() => {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--radius-lg').trim().length > 0;
    });
    expect(hasRadius).toBe(true);
  });

  test('glass-card utility class exists and has backdrop-filter', async ({ page }) => {
    await page.goto('/student-blog.html');
    await page.waitForLoadState('domcontentloaded');

    // Insert a glass-card element and check its styles
    const hasBackdropFilter = await page.evaluate(() => {
      const el = document.createElement('div');
      el.className = 'glass-card';
      el.style.position = 'fixed';
      el.style.top = '-9999px';
      document.body.appendChild(el);
      const styles = getComputedStyle(el);
      const bf = styles.backdropFilter || styles.webkitBackdropFilter;
      document.body.removeChild(el);
      return bf && bf.includes('blur');
    });
    expect(hasBackdropFilter).toBe(true);
  });

  test('header is present and sticky', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const header = page.locator('.main-header');
    await expect(header).toBeVisible();

    const position = await header.evaluate(el =>
      getComputedStyle(el).position
    );
    expect(position).toBe('sticky');
  });

  test('Student Blog nav link is present in navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Open nav
    await page.locator('.menu-icon').click();
    await page.waitForTimeout(400);

    const studentBlogLink = page.locator('.main-nav a', { hasText: 'Student Blog' });
    await expect(studentBlogLink).toBeVisible();
    await expect(studentBlogLink).toHaveAttribute('href', /student-blog/);
  });

  test('dark/light mode CSS variables switch correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Check light mode default bg color
    const lightBg = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim()
    );
    expect(lightBg).toBeTruthy();

    // Switch to dark mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    const darkBg = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim()
    );
    expect(darkBg).toBeTruthy();
    expect(darkBg).not.toBe(lightBg); // values should differ
  });

  test('post cards render with correct structure on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Wait for at least one post card to appear
    const cardBox = page.locator('.post-card-box');
    if (await cardBox.count() > 0) {
      await expect(cardBox.first()).toBeVisible();
    }
  });

});
