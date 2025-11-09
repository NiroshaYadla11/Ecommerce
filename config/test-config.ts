/**
 * Test Configuration
 * 
 * Centralized configuration management with environment variable support
 * Best practice: No hardcoded configuration values
 */

export interface TestConfig {
  baseUrl: string;
  browser: {
    headless: boolean;
    channel: 'chromium' | 'firefox' | 'webkit' | 'chrome' | 'msedge';
    timeout: number;
  };
  timeouts: {
    short: number;
    medium: number;
    long: number;
    extraLong: number;
  };
  retries: {
    maxRetries: number;
    retryDelay: number;
  };
  screenshots: {
    enabled: boolean;
    onFailure: boolean;
    path: string;
  };
  videos: {
    enabled: boolean;
    onFailure: boolean;
    path: string;
  };
}

/**
 * Get test configuration from environment variables or defaults
 * Best practice: Environment-based configuration
 */
export function getTestConfig(): TestConfig {
  return {
    baseUrl: process.env.BASE_URL || 'https://www.demoblaze.com',
    browser: {
      headless: process.env.HEADLESS === 'true' || false,
      channel: (process.env.BROWSER as any) || 'chromium',
      timeout: parseInt(process.env.BROWSER_TIMEOUT || '60000', 10),
    },
    timeouts: {
      short: parseInt(process.env.TIMEOUT_SHORT || '5000', 10),
      medium: parseInt(process.env.TIMEOUT_MEDIUM || '10000', 10),
      long: parseInt(process.env.TIMEOUT_LONG || '30000', 10),
      extraLong: parseInt(process.env.TIMEOUT_EXTRA_LONG || '60000', 10),
    },
    retries: {
      maxRetries: parseInt(process.env.MAX_RETRIES || '2', 10),
      retryDelay: parseInt(process.env.RETRY_DELAY || '1000', 10),
    },
    screenshots: {
      enabled: process.env.SCREENSHOTS_ENABLED !== 'false',
      onFailure: process.env.SCREENSHOTS_ON_FAILURE !== 'false',
      path: process.env.SCREENSHOTS_PATH || 'test-results/screenshots',
    },
    videos: {
      enabled: process.env.VIDEOS_ENABLED === 'true',
      onFailure: process.env.VIDEOS_ON_FAILURE !== 'false',
      path: process.env.VIDEOS_PATH || 'test-results/videos',
    },
  };
}

export const TEST_CONFIG = getTestConfig();

