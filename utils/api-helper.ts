/**
 * API Helper Utilities
 * 
 * Utilities for API interception and validation
 * Implements robust network monitoring and response validation
 */

import { Page, expect } from '@playwright/test';
import { API_ENDPOINTS, TEST_CONFIG } from '../fixtures/test-data';
import { TIMEOUTS } from '../constants/selectors';

/**
 * Intercept and validate API response
 * 
 * @param page - Playwright page object
 * @param endpoint - API endpoint to intercept (e.g., '/entries')
 * @param expectedStatus - Expected HTTP status code (default: 200)
 * @returns {Promise<unknown>} Response data as JSON
 * @throws {Error} If API interception fails or status doesn't match
 * 
 * @example
 * ```typescript
 * const responseData = await interceptApiRequest(page, '/entries', 200);
 * ```
 */
export async function interceptApiRequest(
  page: Page,
  endpoint: string,
  expectedStatus: number = 200
): Promise<unknown> {
  try {
    const responsePromise = page.waitForResponse(
      (response) => {
        const urlMatches = response.url().includes(endpoint);
        const statusMatches = response.status() === expectedStatus;
        return urlMatches && statusMatches;
      },
      { timeout: TIMEOUTS.LONG }
    );
    
    const response = await responsePromise;
    
    // Verify response is JSON
    const contentType = response.headers()['content-type'] || '';
    if (!contentType.includes('application/json')) {
      console.warn(`Warning: Response content-type is ${contentType}, expected JSON`);
    }
    
    const responseData = await response.json();
    
    console.log(`✓ API request intercepted: ${endpoint} - Status: ${expectedStatus}`);
    return responseData;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `API interception failed for ${endpoint}: ${errorMessage}. ` +
      `Please verify the endpoint is correct and the API is accessible.`
    );
  }
}

/**
 * Validate API response contains minimum number of products
 * 
 * Handles both array responses and object responses with array property
 * 
 * @param responseData - API response data (can be array or object with array property)
 * @param minProducts - Minimum number of products expected (default: 5)
 * @throws {Error} If validation fails (not an array or insufficient products)
 * 
 * @example
 * ```typescript
 * validateProductListResponse(responseData, 5);
 * ```
 */
export function validateProductListResponse(
  responseData: unknown, 
  minProducts: number = TEST_CONFIG.MIN_PRODUCTS
): void {
  try {
    let products: unknown[];
    
    // Handle different response structures
    if (Array.isArray(responseData)) {
      // Response is directly an array
      products = responseData;
    } else if (typeof responseData === 'object' && responseData !== null) {
      // Response is an object - find any array property
      const responseObj = responseData as Record<string, unknown>;
      const arrayProperty = Object.values(responseObj).find(Array.isArray);
      
      if (arrayProperty && Array.isArray(arrayProperty)) {
        products = arrayProperty;
      } else {
        throw new Error(
          `Response is not an array and no array property found. ` +
          `Received type: ${typeof responseData}, Keys: ${Object.keys(responseObj).join(', ')}`
        );
      }
    } else {
      throw new Error(
        `Response is not an array or object. Received type: ${typeof responseData}`
      );
    }
    
    // Verify minimum product count
    const productCount = products.length;
    expect(productCount).toBeGreaterThanOrEqual(minProducts);
    
    // Verify products have required structure (at least one product)
    if (productCount > 0) {
      const firstProduct = products[0];
      if (typeof firstProduct !== 'object' || firstProduct === null) {
        throw new Error('Products in response are not valid objects');
      }
    }
    
    console.log(
      `✓ Product list validation passed: Found ${productCount} products (minimum: ${minProducts})`
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Product list validation failed: ${errorMessage}. ` +
      `Expected at least ${minProducts} products in the response.`
    );
  }
}

/**
 * Setup API request interception before navigation
 * 
 * This sets up a route handler to intercept and log API requests
 * 
 * @param page - Playwright page object
 * @param endpoint - Endpoint to intercept (e.g., '/entries')
 * 
 * @example
 * ```typescript
 * await setupApiInterception(page, '/entries');
 * ```
 */
export async function setupApiInterception(page: Page, endpoint: string): Promise<void> {
  await page.route(`**/${endpoint}`, (route) => {
    const url = route.request().url();
    console.log(`Intercepting request to: ${url}`);
    
    // Continue the request without modification
    route.continue();
  });
  
  console.log(`✓ API interception setup complete for endpoint: ${endpoint}`);
}

