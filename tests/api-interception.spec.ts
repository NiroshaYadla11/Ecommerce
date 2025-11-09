/**
 * API Interception Test
 * 
 * Network monitoring and API validation
 */

import { test, expect } from '@playwright/test';
import { interceptApiRequest, validateProductListResponse, setupApiInterception } from '../utils/api-helper';
import { API_ENDPOINTS, TEST_CONFIG } from '../fixtures/test-data';

test.describe('API Interception Tests', () => {
  test('Intercept and validate product list API request', async ({ page }) => {
    await setupApiInterception(page, API_ENDPOINTS.ENTRIES);

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // 1. API Spy: Intercept network request for product list (/entries)
    const responseData = await interceptApiRequest(page, API_ENDPOINTS.ENTRIES, 200);

    expect(responseData).toBeDefined();
    if (typeof responseData === 'object' && responseData !== null) {
      console.log(`Response structure keys: ${Object.keys(responseData as Record<string, unknown>).join(', ')}`);
    }
    validateProductListResponse(responseData, TEST_CONFIG.MIN_PRODUCTS);
  });
});

