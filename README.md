# Project Lavos

![E2E Tests](https://github.com/guitargnarr/projectlavos-monorepo/actions/workflows/e2e-tests.yml/badge.svg)
![Deploy](https://github.com/guitargnarr/projectlavos-monorepo/actions/workflows/deploy-vercel.yml/badge.svg)

Multi-site platform demonstrating AI-native development capabilities with 4 deployed subdomains.

## 🚀 Live Demos

- **Main Site**: https://projectlavos.com - Landing page and project information
- **Demos**: https://demos.projectlavos.com - Interactive demo applications (Restaurant Analyzer, etc.)
- **About**: https://about.projectlavos.com - Project background and 10-Hour Question
- **Guitar Platform**: https://guitar.projectlavos.com - Guitar learning platform with tabs and MIDI playback

---

## E2E Testing

Comprehensive end-to-end testing for the Project Lavos multi-site architecture using Playwright.

## Test Coverage

### 1. Restaurant Analyzer Tests (`restaurant-analyzer.spec.js`)
- ✅ Page loading and rendering
- ✅ Restaurant selection and analysis
- ✅ Results display verification
- ✅ Error state handling
- ✅ Retry functionality
- ✅ Cross-browser testing (Chrome, Safari)

### 2. Mobile Responsiveness (`mobile-responsive.spec.js`)
- ✅ Vertical stacking on mobile devices
- ✅ Readable text sizing
- ✅ Tappable button sizes (44x44px minimum)
- ✅ No horizontal scrolling
- ✅ Touch interaction support
- ✅ Tablet layout verification

### 3. Error State Handling (`error-states.spec.js`)
- ✅ API unreachable errors
- ✅ Retry button display and functionality
- ✅ Timeout handling
- ✅ HTTP 500/404 error responses
- ✅ Malformed API response handling
- ✅ UI state during loading

### 4. Cross-Subdomain Navigation (`cross-subdomain.spec.js`)
- ✅ Navigation between all 4 subdomains
- ✅ "10-Hour Question" prominence on about page
- ✅ Email link with correct subject
- ✅ Consistent navigation across sites
- ✅ No console errors on any subdomain

## Subdomains Tested

- **Main**: https://projectlavos.com
- **Demos**: https://demos.projectlavos.com
- **About**: https://about.projectlavos.com
- **Services**: https://services.projectlavos.com

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run specific test file
```bash
npx playwright test restaurant-analyzer
npx playwright test mobile-responsive
npx playwright test error-states
npx playwright test cross-subdomain
```

### Run tests in specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=webkit
npx playwright test --project=mobile-chrome
```

### Run in UI mode (interactive)
```bash
npx playwright test --ui
```

### Run in headed mode (see browser)
```bash
npx playwright test --headed
```

### Debug specific test
```bash
npx playwright test --debug restaurant-analyzer
```

## Test Reports

### View HTML report
```bash
npx playwright show-report
```

Reports include:
- Test execution timeline
- Screenshots on failure
- Video recordings on failure
- Network activity logs
- Console logs

## CI/CD Integration

Tests run automatically on:
- Push to `main` or `feature/e2e-testing` branches
- Pull requests to `main`
- Daily at 6 AM UTC (scheduled)

GitHub Actions workflow: `.github/workflows/e2e-tests.yml`

## Test Configuration

- **Timeout**: 30 seconds per test
- **Retries**: 2 retries in CI, 0 locally
- **Browsers**: Chromium, WebKit (Safari), Mobile Chrome, Mobile Safari
- **Parallel execution**: Enabled
- **Screenshots**: On failure only
- **Videos**: On failure only

## Requirements

- Node.js 18+
- npm or yarn

## Installation

```bash
npm install
npx playwright install chromium webkit
```

## Writing New Tests

1. Create new `.spec.js` file in `tests/` directory
2. Follow existing test patterns
3. Use descriptive test names
4. Add to this README

## Troubleshooting

### Tests failing locally but passing in CI
- Clear browser cache: `npx playwright install --force`
- Check network connectivity
- Verify production sites are accessible

### Timeout errors
- Increase timeout in `playwright.config.js`
- Check if API is slow or down
- Add more specific waitFor conditions

### Screenshots not captured
- Ensure `screenshot: 'only-on-failure'` in config
- Check `test-results/` directory
- Run with `--headed` to see browser

## Test Checklist (WEEK2)

Based on `WEEK2_ACTIONABLE_CHECKLIST.md`:

- [x] Open https://demos.projectlavos.com in Chrome (item 14)
- [x] Test Restaurant Analyzer: Select Jack Fry's → Analyze → Verify results (item 15)
- [x] Test error handling: Go offline → Trigger error → Verify retry (item 16-17)
- [x] Test in Safari (item 18)
- [x] Test on mobile: Grid stacks, text readable, buttons tappable (items 19-21)
- [x] Open https://about.projectlavos.com (item 22)
- [x] Verify 10-Hour Question prominent (item 22)
- [x] Click "Try Free Demos" → Verify navigation (item 23)
- [x] Click "Let's Talk" → Verify email subject (item 24)
- [x] Document broken functionality via GitHub issues (item 25)

## 📚 Documentation

- **[QA Summary](QA_SUMMARY.md)** - Test results and quality assessment
- **[Test Failures](TEST_FAILURES.md)** - Detailed test failure analysis (80% pass rate)
- **[TODO Analysis](TODOS_COMPLETED.md)** - Feature roadmap and GitHub Issues
- **[README Improvements](README_IMPROVEMENTS.md)** - Documentation enhancement plan
- **[Auth Setup](services/SETUP-AUTH.md)** - Supabase authentication configuration
- **[Implementation Summary](services/IMPLEMENTATION-SUMMARY.md)** - Guitar platform architecture
- **[GitHub Issues](https://github.com/guitargnarr/projectlavos-monorepo/issues)** - Open tasks and improvements

## Next Steps

1. Run test suite: `npx playwright test`
2. Review failures and fix issues
3. Add more test cases as needed
4. Integrate with deployment pipeline

---

**Status**: ✅ Test suite complete and ready for execution
**Coverage**: 4 test files, 30+ test cases, 4 browsers
**Execution Time**: ~5-10 minutes for full suite
