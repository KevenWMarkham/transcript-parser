# Mobile Device Emulation & Testing Design

**Date:** 2025-12-23
**Status:** Approved
**Author:** Claude + Keven

## Overview

Add automated E2E testing across mobile and tablet devices using Playwright's built-in device emulation.

## Requirements

- Run all existing E2E tests on multiple device configurations
- Support iOS, Android, and Tablet viewports
- Include Edge browser for desktop coverage
- Sequential execution to minimize CI resource usage

## Device Configuration

| Device         | Browser | Type             |
| -------------- | ------- | ---------------- |
| Desktop Chrome | Chrome  | Desktop          |
| Desktop Edge   | Edge    | Desktop          |
| iPhone 14      | Safari  | Mobile (iOS)     |
| Pixel 7        | Chrome  | Mobile (Android) |
| iPad (gen 7)   | Safari  | Tablet           |

## Implementation

### playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Desktop Edge',
      use: { ...devices['Desktop Edge'] },
    },
    {
      name: 'iPhone 14',
      use: { ...devices['iPhone 14'] },
    },
    {
      name: 'Pixel 7',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'iPad',
      use: { ...devices['iPad (gen 7)'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

### package.json Scripts

```json
{
  "test:e2e": "playwright test",
  "test:e2e:desktop": "playwright test --project='Desktop Chrome' --project='Desktop Edge'",
  "test:e2e:mobile": "playwright test --project='iPhone 14' --project='Pixel 7' --project='iPad'",
  "test:e2e:ios": "playwright test --project='iPhone 14' --project='iPad'",
  "test:e2e:android": "playwright test --project='Pixel 7'",
  "test:e2e:device": "playwright test --project"
}
```

### Usage

```bash
# Run all devices sequentially
pnpm test:e2e

# Desktop browsers only (quick check)
pnpm test:e2e:desktop

# Mobile/tablet devices only
pnpm test:e2e:mobile

# iOS devices only
pnpm test:e2e:ios

# Android only
pnpm test:e2e:android

# Single device for debugging
pnpm test:e2e:device "iPhone 14"
```

## Execution Order

1. Desktop Chrome
2. Desktop Edge
3. iPhone 14
4. Pixel 7
5. iPad

## Reporting

- **HTML Report:** Results grouped by device with filtering
- **Screenshots:** Captured at device resolution on failure
- **Video:** Retained on failure for debugging mobile issues
- **Console:** List reporter shows `[Device Name] › test-name`

## Estimated Timing

- Each device configuration: ~3-4 minutes
- Total sequential run (5 devices): ~15-20 minutes

## Test Considerations

Playwright automatically handles:

- Touch event simulation for mobile
- Correct viewport and device scale factor
- Mobile user agent strings
- Responsive CSS breakpoint rendering

Potential manual adjustments (if needed):

- Mobile hamburger menu navigation
- Hover-state alternatives for touch devices

## Files Modified

1. `playwright.config.ts` - Device projects and settings
2. `package.json` - New test scripts
