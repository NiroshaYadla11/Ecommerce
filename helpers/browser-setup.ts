/**
 * Browser Setup Helper
 * 
 * Centralized browser initialization and configuration
 * Best practice: Environment-based configuration, proper resource management
 */

import { chromium, firefox, webkit, Browser, BrowserContext, Page } from 'playwright';
import { TEST_CONFIG } from '../config/test-config';
import { logger } from '../utils/logger';

let browser: Browser | null = null;
let context: BrowserContext | null = null;
let page: Page | null = null;

/**
 * Get browser launcher based on configuration
 * Best practice: Configurable browser selection
 */
function getBrowserLauncher() {
  const channel = TEST_CONFIG.browser.channel;
  switch (channel) {
    case 'firefox':
      return firefox;
    case 'webkit':
      return webkit;
    case 'chromium':
    default:
      return chromium;
  }
}

/**
 * Initialize browser and create new page
 * Best practice: Proper resource management, configuration-driven
 * @returns {Promise<Page>} Playwright page object
 */
export async function initializeBrowser(): Promise<Page> {
  try {
    if (!browser) {
      const launcher = getBrowserLauncher();
      const launchOptions: any = {
        headless: TEST_CONFIG.browser.headless,
        args: ['--start-maximized'],
        timeout: TEST_CONFIG.browser.timeout,
      };

      browser = await launcher.launch(launchOptions);
      logger.info(`Browser launched: ${TEST_CONFIG.browser.channel}`, {
        headless: TEST_CONFIG.browser.headless,
      });
    }

    if (!context) {
      context = await browser.newContext({
        viewport: null, // Use full screen
        recordVideo: TEST_CONFIG.videos.enabled
          ? { dir: TEST_CONFIG.videos.path }
          : undefined,
      });
      logger.debug('Browser context created');
    }

    if (!page) {
      page = await context.newPage();
      logger.debug('New page created');
    }

    return page;
  } catch (error) {
    logger.error('Failed to initialize browser', { error });
    throw error;
  }
}

/**
 * Navigate to base URL
 * Best practice: Use configuration instead of hardcoded values
 * @param page - Playwright page object
 */
export async function navigateToBaseUrl(page: Page): Promise<void> {
  try {
    // Playwright auto-waits for navigation to complete (load event by default)
    await page.goto(TEST_CONFIG.baseUrl, {
      waitUntil: 'domcontentloaded', // Faster than 'load' or 'networkidle', Playwright's default
      timeout: TEST_CONFIG.timeouts.long,
    });
    logger.info(`Navigated to: ${TEST_CONFIG.baseUrl}`);
  } catch (error) {
    logger.error('Failed to navigate to base URL', { error, url: TEST_CONFIG.baseUrl });
    throw error;
  }
}

/**
 * Get current page instance
 * @returns {Page | null} Current page or null if not initialized
 */
export function getPage(): Page | null {
  return page;
}

/**
 * Cleanup browser resources
 * Best practice: Proper resource cleanup, error handling
 */
export async function cleanupBrowser(): Promise<void> {
  try {
    if (page) {
      await page.close();
      page = null;
      logger.debug('Page closed');
    }
    if (context) {
      await context.close();
      context = null;
      logger.debug('Browser context closed');
    }
    if (browser) {
      await browser.close();
      browser = null;
      logger.info('Browser closed');
    }
  } catch (error) {
    logger.error('Error during browser cleanup', { error });
    // Don't throw - cleanup should be best effort
  }
}

