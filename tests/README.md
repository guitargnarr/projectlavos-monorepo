# Project Lavos E2E Test Suite

Comprehensive end-to-end testing suite for the Project Lavos multi-site architecture using Playwright.

## Overview

This test suite validates the functionality, responsiveness, and reliability of all Project Lavos demos across multiple browsers and devices.

## Test Coverage

### 1. Restaurant Analyzer Tests (`restaurant-analyzer.spec.js`)
- ✅ Cross-browser compatibility (Chrome, Firefox, Safari)
- ✅ Modal opening and closing
- ✅ Restaurant selection functionality
- ✅ API integration and data display
- ✅ Loading states and progress indicators
- ✅ Results visualization
- ✅ CTA functionality

**Total Tests**: 14 comprehensive test cases

### 2. Mobile Responsiveness Tests (`mobile-responsiveness.spec.js`)
- ✅ Mobile viewport layouts (375px, 667px)
- ✅ Tablet layouts (768px, 1024px)
- ✅ Desktop layouts (1280px, 1920px)
- ✅ Touch target sizes (accessibility)
- ✅ Device rotation handling
- ✅ Text readability on small screens
- ✅ Modal overflow handling
- ✅ Responsive grid layouts

**Total Tests**: 14 comprehensive test cases

### 3. Error State Tests (`error-states.spec.js`)
- ✅ Network failure handling
- ✅ 500 Internal Server Error
- ✅ 429 Rate Limiting
- ✅ 502 Bad Gateway
- ✅ API timeout scenarios
- ✅ Retry functionality
- ✅ Form validation
- ✅ Error message consistency across demos

**Total Tests**: 15 comprehensive test cases

### 4. Cross-Subdomain Navigation Tests (`cross-subdomain-navigation.spec.js`)
- ✅ Navigation between all 4 subdomains
- ✅ External link handling (Calendly, GitHub, email)
- ✅ Session state persistence
- ✅ Consistent branding across subdomains
- ✅ Asset loading from correct origins
- ✅ Meta tag consistency
- ✅ Browser back/forward navigation
- ✅ Query parameter preservation

**Total Tests**: 17 comprehensive test cases

## Test Statistics

- **Total Test Cases**: 60+
- **Browsers Tested**: Chromium, Firefox, WebKit (Safari)
- **Mobile Devices**: Pixel 5, iPhone 12, iPad Pro
- **Breakpoints**: 6 (mobile portrait/landscape, tablet, desktop, large desktop)
- **API Endpoints**: 5 (restaurant, email, sentiment, leads, phishing)
- **Subdomains**: 4 (main, demos, about, services)

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run install:browsers
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with UI mode (interactive)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Run specific browser
npm run test:chrome
npm run test:firefox
npm run test:safari

# Run mobile tests
npm run test:mobile

# Run specific test suite
npm run test:restaurant
npm run test:mobile-responsive
npm run test:errors
npm run test:navigation

# Debug mode
npm run test:debug
```

### View Test Reports

```bash
# Generate and view HTML report
npm run report
```

## CI/CD Integration

Tests run automatically on:
- ✅ Push to `main` or `develop` branches
- ✅ Pull requests to `main` or `develop`
- ✅ Daily at 6 AM UTC (scheduled)
- ✅ Manual workflow dispatch

### GitHub Actions Workflow

See `.github/workflows/e2e-tests.yml` for the complete CI/CD configuration.

**Features**:
- Parallel test execution across browsers
- Automatic screenshot capture on failure
- Test result artifacts (30-day retention)
- Consolidated HTML reports
- Slack/email notifications (optional)

## Test Configuration

### playwright.config.js

Key settings:
- **Base URL**: `https://demos.projectlavos.com`
- **Timeout**: 30 seconds per test
- **Retries**: 2 (in CI), 0 (locally)
- **Workers**: 1 (in CI), unlimited (locally)
- **Reporters**: HTML, JSON, JUnit
- **Trace**: On first retry
- **Screenshots**: Only on failure
- **Video**: Retain on failure

### Environment Variables

```bash
# Set base URL for testing
export BASE_URL=https://demos.projectlavos.com

# Run in CI mode
export CI=true
```

## Test Structure

```
tests/
├── specs/                           # Test specifications
│   ├── restaurant-analyzer.spec.js
│   ├── mobile-responsiveness.spec.js
│   ├── error-states.spec.js
│   └── cross-subdomain-navigation.spec.js
├── helpers/                         # Helper functions
│   └── test-helpers.js
├── fixtures/                        # Test data
│   └── test-data.js
└── README.md                        # This file
```

## Writing New Tests

### Example Test

```javascript
const { test, expect } = require('@playwright/test');

test('should load demo successfully', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const demoCard = page.locator('text=Restaurant Analyzer');
  await expect(demoCard).toBeVisible();
});
```

### Best Practices

1. **Use descriptive test names**: `should display error when API is unavailable`
2. **Wait for network idle**: `await page.waitForLoadState('networkidle')`
3. **Use timeouts for slow operations**: `test.setTimeout(60000)`
4. **Take screenshots on important steps**: `await page.screenshot({ path: 'screenshot.png' })`
5. **Intercept API calls for error testing**: `await page.route('**/api/**', route => route.abort())`
6. **Test across all browsers**: Use matrix strategy in CI/CD
7. **Clean up state**: Use `beforeEach` and `afterEach` hooks

## Common Issues & Solutions

### Issue: Tests timing out

**Solution**: Increase timeout or add explicit waits
```javascript
test.setTimeout(60000); // 60 seconds
await page.waitForSelector('.element', { timeout: 10000 });
```

### Issue: Flaky tests

**Solution**: Wait for network idle and use proper selectors
```javascript
await page.waitForLoadState('networkidle');
await page.waitForSelector('text=Expected Text');
```

### Issue: Screenshots not capturing failure

**Solution**: Check playwright.config.js settings
```javascript
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure'
}
```

## Performance Benchmarks

Average test execution times:
- **Restaurant Analyzer**: ~45 seconds (including API wait)
- **Mobile Responsiveness**: ~30 seconds
- **Error States**: ~25 seconds
- **Cross-Subdomain Navigation**: ~40 seconds

**Total Suite Runtime**: ~3-4 minutes (single browser)

## Contributing

When adding new tests:
1. Follow existing naming conventions
2. Add test data to `fixtures/test-data.js`
3. Use helpers from `helpers/test-helpers.js`
4. Update this README with new test coverage
5. Ensure tests pass locally before committing

## Support

For issues or questions:
- GitHub Issues: [projectlavos-monorepo/issues](https://github.com/guitargnarr/projectlavos-monorepo/issues)
- Email: matthewdscott7@gmail.com

---

**Built with Playwright** | Last Updated: November 2025
