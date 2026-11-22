import { defineConfig, devices } from '@playwright/test';

// One variable switches on all CI behaviour. GitHub Actions and GitLab set CI=true
// automatically; on a developer machine the config behaves as usual.
const isCI = !!process.env.CI;
const PORT = 3000;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,            // shards split tests, not whole files
  forbidOnly: isCI,               // a forgotten test.only fails CI
  retries: isCI ? 2 : 0,          // a flaky test is marked flaky, not red
  workers: isCI ? 2 : undefined,  // GitHub runners have 2-4 vCPUs
  reporter: isCI
    ? [
        ['list'],
        ['blob'],                                   // for merging shards
        ['junit', { outputFile: 'reports/junit.xml' }],
      ]
    : [['list'], ['html', { open: 'on-failure' }]],
  use: {
    baseURL: process.env.BASE_URL || `http://localhost:${PORT}`,
    trace: 'on-first-retry',      // trace recorded on the first retry
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // The app under test lives in this repository (app/index.html, served by server.js).
  webServer: {
    command: 'npm run start',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !isCI,
  },
});
