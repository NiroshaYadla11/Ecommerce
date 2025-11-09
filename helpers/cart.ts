/**
 * Cart Helper Functions
 * 
 * Helper functions for cart operations
 * Implements robust dialog handling and cart verification
 */

import { Page, expect } from '@playwright/test';
import { SELECTORS, TIMEOUTS } from '../constants/selectors';
import { clickElement, verifyVisible, handleDialog, getCount } from '../utils/actions';

/**
 * Add product to cart from product page
 * 
 * @param page - Playwright page object
 * @returns Promise that resolves when dialog appears (for verification in separate step)
 * @throws {Error} If add to cart action fails
 * 
 * @example
 * ```typescript
 * const dialogPromise = await addProductToCart(page);
 * // Verify dialog in separate step
 * ```
 */
export async function addProductToCart(page: Page): Promise<any> {
  try {
    // Set up dialog handler before clicking (this ensures we catch the dialog)
    const dialogPromise = page.waitForEvent('dialog', { timeout: TIMEOUTS.MEDIUM });

    // Click Add to cart button - Playwright auto-waits for button to be actionable
    await clickElement(SELECTORS.ADD_TO_CART_BUTTON(page), 'Click add to cart button');
    
    // Return dialog promise for verification in separate step
    return dialogPromise;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Add to cart failed: ${errorMessage}. ` +
      `Please ensure you are on a product page and the product is available.`
    );
  }
}

/**
 * Verify add to cart success message dialog
 * 
 * @param page - Playwright page object
 * @param dialogPromise - Promise that resolves when dialog appears
 * @throws {Error} If dialog verification fails or message is incorrect
 * 
 * @example
 * ```typescript
 * const dialogPromise = await addProductToCart(page);
 * await verifyAddToCartSuccess(page, dialogPromise);
 * ```
 */
export async function verifyAddToCartSuccess(
  page: Page, 
  dialogPromise: Promise<any>
): Promise<void> {
  try {
    // Wait for dialog to appear - Playwright auto-waits
    const dialog = await dialogPromise;
    const message = dialog.message();
    const messageLower = message.toLowerCase();
    
    // Verify success message contains expected text
    if (!messageLower.includes('product added') && !messageLower.includes('added')) {
      await dialog.accept();
      throw new Error(`Unexpected dialog message: ${message}. Expected: Product added`);
    }
    
    // Dismiss dialog - dialog.accept() automatically waits for dialog to be dismissed
    await dialog.accept();
    
    console.log(`✓ Success message verified: "${message}" - dialog dismissed`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Add to cart success verification failed: ${errorMessage}. ` +
      `Please verify the product was added successfully.`
    );
  }
}

/**
 * Navigate to cart page
 * 
 * @param page - Playwright page object
 * @throws {Error} If navigation to cart fails
 * 
 * @example
 * ```typescript
 * await navigateToCart(page);
 * ```
 */
export async function navigateToCart(page: Page): Promise<void> {
  try {
    // Click Cart navigation link
    await clickElement(SELECTORS.CART_LINK(page), 'Click cart link');
    
    // Verify cart table is loaded
    await verifyVisible(SELECTORS.CART_TABLE(page), 'Cart table');
    
    console.log('✓ Navigated to cart page');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Navigation to cart failed: ${errorMessage}`);
  }
}

/**
 * Verify cart contains items
 * 
 * @param page - Playwright page object
 * @param expectedItemCount - Expected minimum number of items (default: 1)
 * @throws {Error} If cart verification fails
 * 
 * @example
 * ```typescript
 * await verifyCartItems(page, 1);
 * ```
 */
export async function verifyCartItems(page: Page, expectedItemCount: number = 1): Promise<void> {
  try {
    // Navigate to cart if not already there
    await navigateToCart(page);
    
    // Verify cart items are loaded
    const cartItems = SELECTORS.CART_ITEM_ROW(page);
    await verifyVisible(cartItems, 'Cart items');
    
    // Get and verify cart item count
    const count = await getCount(cartItems, 'Cart items');
    
    // Verify cart has at least the expected number of items
    expect(count).toEqual(expectedItemCount);
    
    console.log(`✓ Cart verification passed: Found ${count} item(s)`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Cart verification failed: ${errorMessage}. ` +
      `Expected at least ${expectedItemCount} item(s) in cart.`
    );
  }
}

/**
 * Verify that a specific product is in the cart
 * 
 * @param page - Playwright page object
 * @param productName - Expected product name to verify in cart
 * @throws {Error} If product is not found in cart
 * 
 * @example
 * ```typescript
 * await verifyProductInCart(page, 'Samsung galaxy s6');
 * ```
 */
export async function verifyProductInCart(page: Page, productName: string): Promise<void> {
  try {
    // Verify cart table is loaded
    await verifyVisible(SELECTORS.CART_TABLE(page), 'Cart table');
    
    // Find cart item with the product name
    const cartItem = SELECTORS.CART_ITEM_PRODUCT_NAME(page, productName);
    
    // Verify the product is visible in cart
    await verifyVisible(cartItem, `Cart item with product: ${productName}`);
    
    console.log(`✓ Verified product "${productName}" is in cart`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Product verification in cart failed for "${productName}": ${errorMessage}. ` +
      `Please verify the product was added to cart correctly.`
    );
  }
}
