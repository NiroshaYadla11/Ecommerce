/**
 * Product Helper Functions
 * 
 * Helper functions for product browsing and selection
 * Implements robust element waiting and error handling
 */

import { Page, expect } from '@playwright/test';
import { SELECTORS, TIMEOUTS } from '../constants/selectors';
import { clickElement, verifyVisible, verifyText } from '../utils/actions';

/**
 * Navigate to product page by product name
 * 
 * @param page - Playwright page object
 * @param productName - Name of the product to select (must match exactly)
 * @throws {Error} If product is not found or navigation fails
 * 
 * @example
 * ```typescript
 * await selectProduct(page, 'Samsung galaxy s6');
 * ```
 */
export async function selectProduct(page: Page, productName: string): Promise<void> {
  try {
    // Step 1: Click on the product link
    await clickElement(SELECTORS.PRODUCT_LINK(page, productName), `Click product: ${productName}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Product selection failed for "${productName}": ${errorMessage}. `
    );
  }
}

/**
 * Verify product details are displayed on the product page
 * 
 * @param page - Playwright page object
 * @param productName - Expected product name to verify
 * @throws {Error} If product details are not displayed correctly
 * 
 * @example
 * ```typescript
 * await verifyProductDetails(page, 'Samsung galaxy s6');
 * ```
 */
export async function verifyProductDetails(page: Page, productName: string): Promise<void> {
  try {
    // Verify product title contains the expected product name
    const productTitle = SELECTORS.PRODUCT_TITLE(page);
    await verifyText(productTitle, productName, 'Product title');
    
    // Verify price is displayed
    const productPrice = SELECTORS.PRODUCT_PRICE(page);
    await verifyVisible(productPrice, 'Product price');
    
    // Verify "Add to cart" button is available
    const addToCartButton = SELECTORS.ADD_TO_CART_BUTTON(page);
    await verifyVisible(addToCartButton, 'Add to cart');
    
    console.log(`✓ Product details verified for ${productName}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Product details verification failed for "${productName}": ${errorMessage}. ` +
      `The product page may not have loaded correctly.`
    );
  }
}

