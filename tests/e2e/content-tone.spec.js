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
      const abstractRect = abstract?.getBoundingClientRect();
      const bodyCardRect = document.querySelector('.student-post-body-card')?.getBoundingClientRect();
      return {
        title: document.querySelector('#postTitle')?.textContent?.trim() || '',
        tagCount: document.querySelectorAll('#postTags .tag-badge').length,
        abstractVisible: abstract ? getComputedStyle(abstract).display !== 'none' : false,
        bodyBackground: body ? getComputedStyle(body).backgroundColor : '',
        abstractBodyGap: abstractRect && bodyCardRect ? Math.round(bodyCardRect.top - abstractRect.bottom) : 0,
      };
    });

    expect(metrics.title.length).toBeGreaterThan(0);
    expect(metrics.tagCount).toBeGreaterThan(0);
    expect(metrics.abstractVisible).toBe(true);
    expect(metrics.bodyBackground).toBe('rgba(0, 0, 0, 0)');
    expect(metrics.abstractBodyGap).toBeGreaterThanOrEqual(30);
  });

  test('footer uses branded copy and readable link chips', async ({ page }) => {
    await page.goto('/student-blog.html');
    await page.waitForLoadState('domcontentloaded');

    const footer = page.locator('.main-footer');
    await expect(footer).toBeVisible();
    await expect(footer.locator('.footer-brand__title')).toHaveText('EGLAB');
    await expect(footer.locator('.footer-brand__text')).toContainText('게임, AI, 자동화 실험');

    const metrics = await page.evaluate(() => {
      const nav = document.querySelector('.main-footer .footer-nav');
      const firstChip = nav?.querySelector('a');
      return {
        navCount: nav?.querySelectorAll('a').length || 0,
        navWraps: nav ? getComputedStyle(nav).flexWrap : '',
        firstChipRadius: firstChip ? getComputedStyle(firstChip).borderRadius : '',
      };
    });

    expect(metrics.navCount).toBeGreaterThanOrEqual(6);
    expect(metrics.navWraps).toBe('wrap');
    expect(metrics.firstChipRadius).toBe('999px');
  });
});
