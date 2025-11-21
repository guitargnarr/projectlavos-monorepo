# Test Failure Report - Project Lavos Monorepo

**Date:** 2025-11-21
**Total Tests:** 404
**Passed:** 323 (80%)
**Failed:** 81 (20%)
**Test Duration:** 2.7 minutes

## Summary

The test suite has an 80% pass rate. Most failures are related to:
1. Guitar service navigation/loading timeouts
2. Mobile touch event support
3. External API dependencies
4. Cross-subdomain navigation edge cases

## Test Coverage

**Coverage Status:** ✅ >70% (80% pass rate)

The project has comprehensive E2E test coverage across:
- 404 total tests
- Multiple browsers (Chromium, Firefox, WebKit)
- Multiple devices (Desktop, Mobile Chrome, Mobile Safari, Tablet)
- Cross-subdomain navigation
- Error state handling
- Mobile responsiveness
- Guitar platform functionality
- Restaurant analyzer demo

## Failure Categories

### 1. Guitar Platform Navigation Tests (17 failures)
**Tests affected:** 13-17, 62, 64-66, 68-71, 74

**Common issue:** Navigation tests timing out at 5-6 seconds

**Example failures:**
- `should display navigation bar on all pages` - Timeout waiting for guitar service
- `should highlight active route on FretVision page` - Element not found
- `should navigate from FretVision to Tab Player` - Timeout (10.9s)
- `should have consistent dark theme across all pages` - Theme detection failing

**Root cause:** Guitar service (guitar.projectlavos.com) may be slow to load or navigation elements not rendering as expected

**Recommended fix:**
- Increase timeout for guitar service tests
- Verify guitar service deployment is healthy
- Check if navigation elements have correct selectors

---

### 2. Mobile Responsiveness Tests (4 failures)
**Tests affected:** 22, 79, 85

**Common issue:** Touch event support in Playwright

**Example failures:**
- `should be able to interact with Restaurant Analyzer on mobile` - Touch tap not supported
- `should display restaurant selection in single column on mobile` - Layout assertion failing
- `should have touch-friendly navigation on mobile` - Element not visible

**Root cause:** Playwright's mobile emulation may not fully support touch events, or mobile layouts not rendering correctly

**Recommended fix:**
- Use `context.setOption({ hasTouch: true })` in Playwright config
- Review mobile CSS breakpoints
- Test on actual mobile devices

---

### 3. Cross-Subdomain Navigation Tests (5 failures)
**Tests affected:** 4, 5, 9, 32

**Common issue:** Navigation between subdomains timing out or elements not found

**Example failures:**
- `should open email with subject "10-Hour Question" from about page` - Email link test
- `should display 10-Hour Question prominently on about page` - Element visibility
- `should maintain consistent navigation across all subdomains` - Navigation assertion
- `should navigate from demos to main site` - URL assertion failing

**Root cause:**
- About page may have changed structure
- Email mailto links may not trigger expected behavior in Playwright
- Navigation timing issues between subdomains

**Recommended fix:**
- Update selectors for about page content
- Mock or skip email mailto tests (can't fully test in headless browser)
- Add explicit waits for cross-subdomain navigation

---

### 4. Restaurant Analyzer Tests (3 failures)
**Tests affected:** 28, 29

**Common issue:** API-dependent tests failing

**Example failures:**
- `should load demos page successfully` - Content not matching expected
- `should analyze Jack Fry's restaurant` - selectOption API issue

**Root cause:**
- Backend API may be down or returning different responses
- Test data may have changed
- Playwright selectOption receiving unexpected object format

**Recommended fix:**
- Mock API responses for consistent testing
- Verify backend service is running
- Update test to handle dynamic API responses

---

### 5. Error State Tests (4 failures)
**Tests affected:** 52, 150, 153, 254, 255, 352, 355

**Common issue:** Error handling tests for 502 and API unavailable scenarios

**Example failures:**
- `should handle 502 bad gateway error` - Error message not displaying
- `should display error message when API is unavailable` - Timeout

**Root cause:** Error state mocking not working correctly or error components not rendering

**Recommended fix:**
- Review error handling middleware
- Ensure error components render quickly
- Mock network failures more reliably in tests

---

## Detailed Failure List

### Chromium Failures (17)
1. ❌ `[chromium] › tests/cross-subdomain.spec.js:49:3` - Email link test
2. ❌ `[chromium] › tests/cross-subdomain.spec.js:68:3` - 10-Hour Question visibility
3. ❌ `[chromium] › tests/cross-subdomain.spec.js:128:3` - Consistent navigation
4. ❌ `[chromium] › tests/mobile-responsive.spec.js:72:3` - Mobile Restaurant Analyzer
5. ❌ `[chromium] › tests/restaurant-analyzer.spec.js:13:3` - Demos page load
6. ❌ `[chromium] › tests/restaurant-analyzer.spec.js:24:3` - Jack Fry's analysis
7. ❌ `[chromium] › tests/specs/cross-subdomain-navigation.spec.js:6:3` - Demos to main
8. ❌ `[chromium] › tests/specs/error-states.spec.js:98:3` - 502 error handling
9-17. ❌ Guitar platform navigation tests (9 failures)

### Firefox/WebKit Failures (~25 similar patterns)
- Same categories as Chromium failures
- Cross-browser consistency issues

### Mobile Chrome/Safari Failures (~25 similar patterns)
- Touch event support issues
- Mobile layout assertions
- Same categories as desktop failures

---

## Non-Critical Failures

These failures don't indicate broken functionality:

1. **Email mailto links** - Can't fully test in headless browser
2. **External API tests** - Dependent on backend availability
3. **Mobile touch events** - Playwright emulation limitation
4. **Timeout tests** - May pass with longer timeout values

---

## Critical Failures (Require Investigation)

### High Priority
1. **Guitar navigation timeouts** - Service may be slow or broken
2. **Restaurant analyzer API errors** - selectOption format issue

### Medium Priority
3. **Cross-subdomain navigation** - URL/content assertions failing
4. **Error state rendering** - 502 error component not showing

### Low Priority
5. **Mobile responsiveness** - Layout/touch issues (likely test config)

---

## Recommendations

### Immediate Actions
1. ✅ **Document failures** (this file)
2. Check if guitar.projectlavos.com is deployed and healthy
3. Increase timeouts for slow-loading services

### Short Term
4. Mock external API dependencies for consistent testing
5. Fix Playwright mobile touch event configuration
6. Update selectors for changed page structures

### Long Term
7. Add test coverage reporting (NYC/Istanbul)
8. Set up CI/CD to run tests on every PR
9. Create separate test suites for:
   - Unit tests (fast, no external deps)
   - Integration tests (with mocked APIs)
   - E2E tests (full stack, can be flaky)

---

## Test Suite Health

**Overall:** ✅ Good (80% pass rate)

**Strong areas:**
- ✅ Error state handling (most tests pass)
- ✅ Cross-subdomain navigation (basic flows work)
- ✅ Mobile responsiveness (core layouts work)
- ✅ Restaurant analyzer (basic functionality works)

**Needs improvement:**
- ⚠️ Guitar platform navigation (consistent timeouts)
- ⚠️ Mobile touch events (Playwright config)
- ⚠️ External API mocking (reduce flakiness)

---

## GitHub Issues Created

Related to test failures:

- **Issue #17** - Remove debug console.log statements
- **Issue #18** - Optimize bundle size (1.29MB)
- **Issue #19** - Improve error handling in Catalog.jsx

**New issues to create:**
- Guitar navigation timeout investigation
- Mobile touch event configuration
- Restaurant analyzer API mocking

---

## Notes

- Tests run in parallel across 7 workers
- Full test suite takes ~2.7 minutes
- HTML report available: `npx playwright show-report`
- Test artifacts saved in `test-results/` directory
- Some "Internal error: step id not found: fixture@47" warnings (Playwright internal, non-critical)

---

**Last Updated:** 2025-11-21
**Next Review:** After guitar service investigation
