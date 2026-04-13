// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * EGLab Playwright E2E Test Configuration
 * Run: npm run test:e2e (requires Jekyll serving at localhost:4000)
 * Start Jekyll: bundle exec jekyll serve
 */
module.exports = defineConfig({
  testDir:    './e2e',
  timeout:    30_000,
  retries:    1,
  workers:    2,

  use: {
    baseURL:          'http://localhost:4000',
    headless:         true,
    screenshot:       'only-on-failure',
    video:            'retain-on-failure',
    trace:            'retain-on-failure',
  },

  projects: [
    {
      name:  'chromium',
      use:   { ...devices['Desktop Chrome'] },
    },
    {
      name:  'firefox',
      use:   { ...devices['Desktop Firefox'] },
    },
    {
      name:  'mobile-chrome',
      use:   { ...devices['Pixel 5'] },
    },
  ],

  reporter: [
    ['list'],
    ['html', { outputFolder: '../test-results/html-report', open: 'never' }],
  ],

  // Run Jekyll before tests (optional — comment out if running manually)
  // webServer: {
  //   command: 'bundle exec jekyll serve --port 4000',
  //   port: 4000,
  //   reuseExistingServer: true,
  //   timeout: 60_000,
  // },
});
