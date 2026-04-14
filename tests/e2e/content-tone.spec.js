// @ts-check
const { test, expect } = require('@playwright/test');

const sampleStudentPostId = 'XvmfufJj8J83C1tJsfhR';

test.describe('EGLab page tone consistency', () => {
  test('archive page shows text-only preview cards inside branded shell', async ({ page }) => {
    await page.goto('/archive.html');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('.archive-hero')).toBeVisible();
    await expect(page.locator('.archive .post').first()).toBeVisible();

    const metrics = await page.evaluate(() => ({
      excerptHasImage: !!document.querySelector('.archive .post-excerpt img'),
      buttonCount: document.querySelectorAll('.archive-hero__actions a').length,
      statCount: document.querySelectorAll('.archive-hero__stats .archive-hero__stat').length,
    }));

    expect(metrics.excerptHasImage).toBe(false);
    expect(metrics.buttonCount).toBeGreaterThanOrEqual(2);
    expect(metrics.statCount).toBeGreaterThanOrEqual(3);
  });

  test('student post page uses branded hero and content shell', async ({ page }) => {
    await page.goto(`/student-post.html?id=${sampleStudentPostId}`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);

    await expect(page.locator('.student-post-hero')).toBeVisible();
    await expect(page.locator('.student-post-body-card')).toBeVisible();
    await expect(page.locator('.student-post-author')).toBeVisible();

    const metrics = await page.evaluate(() => {
      const abstract = document.querySelector('#postAbstract');
      const body = document.querySelector('#postBody');
      return {
        title: document.querySelector('#postTitle')?.textContent?.trim() || '',
        tagCount: document.querySelectorAll('#postTags .tag-badge').length,
        abstractVisible: abstract ? getComputedStyle(abstract).display !== 'none' : false,
        bodyBackground: body ? getComputedStyle(body).backgroundColor : '',
      };
    });

    expect(metrics.title.length).toBeGreaterThan(0);
    expect(metrics.tagCount).toBeGreaterThan(0);
    expect(metrics.abstractVisible).toBe(true);
    expect(metrics.bodyBackground).toBe('rgba(0, 0, 0, 0)');
  });
});
