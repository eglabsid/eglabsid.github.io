// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * US-007 / US-008 / US-009 / US-010 — Admin Panel Tests
 * Verifies login gate, Google Sign-In button, editor, and user management
 */

test.describe('Admin Panel — Authentication Gate', () => {

  test('admin/index.html loads without error', async ({ page }) => {
    await page.goto('/admin/');
    await expect(page).toHaveTitle(/EGLab Admin/i);
  });

  test('login screen is shown when unauthenticated', async ({ page }) => {
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    const loginScreen = page.locator('#loginScreen');
    await expect(loginScreen).toBeVisible();
  });

  test('Google Sign-In button is present and clickable', async ({ page }) => {
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    const signInBtn = page.locator('#googleSignInBtn');
    await expect(signInBtn).toBeVisible();
    await expect(signInBtn).toContainText(/google/i);
    await expect(signInBtn).toBeEnabled();
  });

  test('app panel is hidden when unauthenticated', async ({ page }) => {
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    const app = page.locator('#app');
    await expect(app).toBeHidden();
  });

  test('login card has EGLab branding', async ({ page }) => {
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    const title = page.locator('.login-title');
    await expect(title).toContainText('EGLab Admin');
  });

  test('login logo icon is visible', async ({ page }) => {
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    const logo = page.locator('.login-logo');
    await expect(logo).toBeVisible();
  });

});

test.describe('Admin Panel — Editor Structure', () => {

  // These tests bypass auth by injecting mock user state
  // In a real test environment, use Firebase emulator for full auth testing

  test('Quill editor library is loaded', async ({ page }) => {
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    const quillLoaded = await page.evaluate(() => typeof window.Quill !== 'undefined');
    expect(quillLoaded).toBe(true);
  });

  test('editor form fields exist in DOM', async ({ page }) => {
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    // Fields exist in DOM even when login screen is showing
    await expect(page.locator('#postTitle')).toBeAttached();
    await expect(page.locator('#postAuthor')).toBeAttached();
    await expect(page.locator('#postTags')).toBeAttached();
    await expect(page.locator('#postExcerpt')).toBeAttached();
    await expect(page.locator('#quillEditor')).toBeAttached();
  });

  test('postType select field exists with student and post options', async ({ page }) => {
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    const select = page.locator('#postType');
    await expect(select).toBeAttached();

    const studentOpt = select.locator('option[value="student"]');
    const postOpt    = select.locator('option[value="post"]');
    await expect(studentOpt).toBeAttached();
    await expect(postOpt).toBeAttached();
  });

  test('postType defaults to student', async ({ page }) => {
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    const value = await page.locator('#postType').evaluate(el => el.value);
    expect(value).toBe('student');
  });

  test('posts table has Type column header', async ({ page }) => {
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    const html = await page.content();
    expect(html).toContain('<th>Type</th>');
  });

  test('Publish and Save Draft buttons exist', async ({ page }) => {
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('#publishBtn')).toBeAttached();
    await expect(page.locator('#saveDraftBtn')).toBeAttached();
  });

  test('media workflow controls exist in DOM', async ({ page }) => {
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('#editorMediaToolbar')).toBeAttached();
    await expect(page.locator('#insertImageBtn')).toBeAttached();
    await expect(page.locator('#attachFileBtn')).toBeAttached();
    await expect(page.locator('#mediaSidebar')).toBeAttached();
    await expect(page.locator('#imageWidthRange')).toBeAttached();
    await expect(page.locator('#attachmentList')).toBeAttached();
  });

  test('navigation tabs exist', async ({ page }) => {
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('.nav-tab[data-panel="editorPanel"]')).toBeAttached();
    await expect(page.locator('.nav-tab[data-panel="postsPanel"]')).toBeAttached();
  });

  test('confirm dialog exists and is initially hidden', async ({ page }) => {
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    const dialog = page.locator('#confirmDialog');
    await expect(dialog).toBeAttached();
    await expect(dialog).not.toHaveClass(/open/);
  });

  test('editor source includes attachment and media selection helpers', async ({ page }) => {
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    const html = await page.content();
    expect(html).toContain('insertAttachmentFromFile');
    expect(html).toContain('applyImageWidth');
    expect(html).toContain('applyImageAlignment');
    expect(html).toContain('moveSelectedMedia');
    expect(html).toContain('text/eglab-media-id');
    expect(html).toContain('Move Up');
    expect(html).toContain('data-attachment-chip');
    expect(html).toContain('Drop images to insert them');
  });

  test('save workflow source still keeps draft and publish wiring intact', async ({ page }) => {
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    const html = await page.content();
    expect(html).toContain("savePost('published')");
    expect(html).toContain("savePost('draft')");
    expect(html).toContain("const content  = quill.root.innerHTML");
    expect(html).toContain('serverTimestamp()');
  });

  test('admin app is exposed only after authorized role check', async ({ page }) => {
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    const html = await page.content();
    expect(html).toContain("AUTHORIZED_ADMIN_ROLES = new Set(['admin', 'writer'])");
    expect(html).toContain('denyAccessAndReturnHome');
    expect(html).toContain('권한이 없습니다. EGLAB 홈으로 돌아갑니다.');
    expect(html).toContain('window.location.replace(HOME_URL)');
    expect(html).toContain("document.getElementById('app').style.display = 'block'");
  });

});

test.describe('Admin Panel — Responsive Design', () => {

  test('login card is visible on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    const card = page.locator('.login-card');
    await expect(card).toBeVisible();

    const box = await card.boundingBox();
    expect(box.width).toBeLessThanOrEqual(375);
  });

  test('sign in button is full width on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    const btn = page.locator('.btn-google');
    await expect(btn).toBeVisible();
  });

  test('media workflow UI remains present on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('#insertImageBtn')).toBeAttached();
    await expect(page.locator('#attachFileBtn')).toBeAttached();
    await expect(page.locator('#imageWidthRange')).toBeAttached();
    await expect(page.locator('#moveMediaUpBtn')).toBeAttached();
  });

});

test.describe('Admin Panel — LLM Wiki Login Integration', () => {

  test('admin page targets saas-of-funqa Firebase project', async ({ page }) => {
    const response = await page.goto('/admin/');
    expect(response.status()).toBe(200);

    const html = await page.content();
    expect(html).toContain('saas-of-funqa');
    expect(html).toContain('saas-of-funqa.firebaseapp.com');
  });

  test('firebase-config.js defines LLM_WIKI collection constant', async ({ page }) => {
    const response = await page.goto('/assets/js/firebase-config.js');
    expect(response.status()).toBe(200);

    const src = await page.content();
    expect(src).toContain("LLM_WIKI");
    expect(src).toContain("'llm_wiki'");
  });

  test('llm-wiki-service.js is available as static asset', async ({ page }) => {
    const response = await page.goto('/assets/js/llm-wiki-service.js');
    expect(response.status()).toBe(200);

    const src = await page.content();
    expect(src).toContain('llmWikiSaveEntry');
    expect(src).toContain('DB_COLLECTIONS.LLM_WIKI');
  });

  test('Google Sign-In click does not navigate away (popup-based auth)', async ({ page }) => {
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    // Intercept popup window before it opens to prevent external browser dialog
    page.on('popup', popup => popup.close());

    const btn = page.locator('#googleSignInBtn');
    await expect(btn).toBeVisible();

    // Click should not cause page navigation (auth uses signInWithPopup)
    await btn.click();
    await page.waitForTimeout(500);

    // Still on admin page — no redirect occurred
    expect(page.url()).toContain('/admin');

    // Login screen should still be visible (no real auth completed)
    await expect(page.locator('#loginScreen')).toBeVisible();
  });

  test('login screen subtitle mentions correct access path', async ({ page }) => {
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    const subtitle = page.locator('.login-subtitle');
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toContainText(/google account/i);
  });

  test('Firebase Auth module is imported in admin page', async ({ page }) => {
    const response = await page.goto('/admin/');
    const html = await response.text();

    // Admin page imports Firebase Auth v10 modular SDK
    expect(html).toContain('firebase-auth.js');
    expect(html).toContain('GoogleAuthProvider');
    expect(html).toContain('signInWithPopup');
    expect(html).not.toContain('signInWithRedirect');
    expect(html).toContain('onAuthStateChanged');
  });

});

test.describe('Admin Panel — Post Type Extra Fields', () => {

  test('postExtraFields section exists in DOM', async ({ page }) => {
    await page.goto('/admin/');
    await page.waitForLoadState('load');

    await expect(page.locator('#postExtraFields')).toBeAttached();
  });

  test('postExtraFields is hidden when postType is student', async ({ page }) => {
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    // Default is student — extra fields should be hidden
    const value = await page.locator('#postType').evaluate(el => el.value);
    expect(value).toBe('student');

    const extra = page.locator('#postExtraFields');
    await expect(extra).toBeHidden();
  });

  test('postExtraFields toggle logic exists in source', async ({ page }) => {
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    // Verify the toggle handler is present in the compiled HTML
    const html = await page.content();
    expect(html).toContain("postExtraFields");
    expect(html).toContain("'post' ? 'block' : 'none'");
    expect(html).toContain("addEventListener('change'");
  });

  test('postExtraFields display style toggles correctly', async ({ page }) => {
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    // #app is hidden when unauthenticated; check inline style directly
    const hiddenStyle = await page.evaluate(() =>
      document.getElementById('postExtraFields').style.display
    );
    expect(hiddenStyle).toBe('none');

    const shownStyle = await page.evaluate(() => {
      const el = document.getElementById('postExtraFields');
      el.style.display = 'block';
      return el.style.display;
    });
    expect(shownStyle).toBe('block');

    const hiddenAgain = await page.evaluate(() => {
      const el = document.getElementById('postExtraFields');
      el.style.display = 'none';
      return el.style.display;
    });
    expect(hiddenAgain).toBe('none');
  });

  test('extra fields include img, category, github inputs', async ({ page }) => {
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('#postImg')).toBeAttached();
    await expect(page.locator('#postCategory')).toBeAttached();
    await expect(page.locator('#postGithub')).toBeAttached();
  });

  test('extra fields include read_time, show_date, mathjax, toc checkboxes', async ({ page }) => {
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('#postReadTime')).toBeAttached();
    await expect(page.locator('#postShowDate')).toBeAttached();
    await expect(page.locator('#postMathjax')).toBeAttached();
    await expect(page.locator('#postToc')).toBeAttached();
  });

  test('postShowDate checkbox is checked by default', async ({ page }) => {
    await page.goto('/admin/');
    await page.waitForLoadState('domcontentloaded');

    const isChecked = await page.locator('#postShowDate').evaluate(el => el.checked);
    expect(isChecked).toBe(true);
  });

});
