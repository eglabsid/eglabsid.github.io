// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Homepage poster layout', () => {
  test('post previews use grid cards with full-width thumbnails', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const metrics = await page.evaluate(() => {
      const list = document.querySelector('.post-card-box');
      const item = list?.querySelector('li');
      const card = item?.querySelector('.post-card');
      const image = card?.querySelector('.post-card-image-wrapper');

      if (!list || !item || !card || !image) {
        return null;
      }

      const cols = getComputedStyle(list).gridTemplateColumns
        .split(' ')
        .filter(Boolean)
        .length;

      return {
        viewportWidth: window.innerWidth,
        listDisplay: getComputedStyle(list).display,
        itemFloat: getComputedStyle(item).float,
        columns: cols,
        cardWidth: card.getBoundingClientRect().width,
        imageWidth: image.getBoundingClientRect().width,
      };
    });

    expect(metrics).not.toBeNull();
    expect(metrics.listDisplay).toBe('grid');
    expect(metrics.itemFloat).toBe('none');
    expect(metrics.imageWidth / metrics.cardWidth).toBeGreaterThan(0.95);

    if (metrics.viewportWidth <= 560) {
      expect(metrics.columns).toBe(1);
    } else if (metrics.viewportWidth <= 1320) {
      expect(metrics.columns).toBeGreaterThanOrEqual(2);
    } else {
      expect(metrics.columns).toBeGreaterThanOrEqual(4);
    }
  });
});
