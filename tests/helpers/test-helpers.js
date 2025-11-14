// Helper functions for E2E tests

/**
 * Wait for API response and return the data
 */
async function waitForApiResponse(page, urlPattern, timeout = 30000) {
  return await page.waitForResponse(
    response => response.url().includes(urlPattern) && response.status() === 200,
    { timeout }
  );
}

/**
 * Check if element is visible in viewport
 */
async function isInViewport(page, selector) {
  return await page.evaluate((selector) => {
    const element = document.querySelector(selector);
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }, selector);
}

/**
 * Wait for loading spinner to disappear
 */
async function waitForLoadingToComplete(page, timeout = 30000) {
  await page.waitForSelector('.animate-spin', { state: 'detached', timeout });
}

/**
 * Take a screenshot with timestamp
 */
async function takeTimestampedScreenshot(page, name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ path: `test-results/screenshots/${name}-${timestamp}.png`, fullPage: true });
}

/**
 * Check viewport dimensions
 */
async function getViewportDimensions(page) {
  return await page.evaluate(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio
  }));
}

/**
 * Simulate slow network (for testing loading states)
 */
async function setSlowNetwork(page) {
  const client = await page.context().newCDPSession(page);
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: 50 * 1024, // 50 KB/s
    uploadThroughput: 20 * 1024,   // 20 KB/s
    latency: 500                    // 500ms latency
  });
}

/**
 * Check responsive design at various breakpoints
 */
const breakpoints = {
  mobile: { width: 375, height: 667 },
  mobileLandscape: { width: 667, height: 375 },
  tablet: { width: 768, height: 1024 },
  tabletLandscape: { width: 1024, height: 768 },
  desktop: { width: 1280, height: 720 },
  largeDesktop: { width: 1920, height: 1080 }
};

module.exports = {
  waitForApiResponse,
  isInViewport,
  waitForLoadingToComplete,
  takeTimestampedScreenshot,
  getViewportDimensions,
  setSlowNetwork,
  breakpoints
};
