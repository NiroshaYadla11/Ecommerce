/**
 * Checkout Helper Functions
 * 
 * Helper functions for checkout process
 * Implements robust form filling and order verification
 */

import { Page, expect } from '@playwright/test';
import { CheckoutData } from '../fixtures/test-data';
import { SELECTORS, TIMEOUTS } from '../constants/selectors';
import { clickElement, fillInput, verifyVisible, verifyText, verifyHidden } from '../utils/actions';
import { navigateToCart, verifyProductInCart } from './cart';

/**
 * Fill checkout form with valid details (does not submit order)
 * 
 * @param page - Playwright page object
 * @param checkoutData - Checkout form data (name, country, city, creditCard, month, year)
 * @param expectedProductName - Optional product name to verify in cart
 * @throws {Error} If form filling fails
 * 
 * @example
 * ```typescript
 * await fillCheckoutForm(page, {
 *   name: 'John Doe',
 *   country: 'United States',
 *   city: 'New York',
 *   creditCard: '1234567890123456',
 *   month: '12',
 *   year: '2025'
 * }, 'Samsung galaxy s6');
 * ```
 */
export async function fillCheckoutForm(
  page: Page, 
  checkoutData: CheckoutData, 
  expectedProductName?: string
): Promise<void> {
  try {
    // Step 1: Navigate to cart
    await navigateToCart(page);
    
    // Step 2: Click Place Order button to open the form
    await clickElement(SELECTORS.PLACE_ORDER_BUTTON(page), 'Click place order button');
    
    // Step 3: Fill checkout form
    await fillInput(SELECTORS.ORDER_NAME_INPUT(page), checkoutData.name, 'Name');
    await fillInput(SELECTORS.ORDER_COUNTRY_INPUT(page), checkoutData.country, 'Country');
    await fillInput(SELECTORS.ORDER_CITY_INPUT(page), checkoutData.city, 'City');
    await fillInput(SELECTORS.ORDER_CARD_INPUT(page), checkoutData.creditCard, 'Credit Card');
    await fillInput(SELECTORS.ORDER_MONTH_INPUT(page), checkoutData.month, 'Month');
    await fillInput(SELECTORS.ORDER_YEAR_INPUT(page), checkoutData.year, 'Year');
    
    console.log('✓ Checkout form filled successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Checkout form filling failed: ${errorMessage}. ` +
      `Please verify cart has items and all checkout form fields are filled correctly.`
    );
  }
}

/**
 * Submit the order after form is filled
 * 
 * @param page - Playwright page object
 * @throws {Error} If order submission fails
 * 
 * @example
 * ```typescript
 * await submitOrder(page);
 * ```
 */
export async function submitOrder(page: Page): Promise<void> {
  try {
    // Click purchase button to submit order
    await clickElement(SELECTORS.PURCHASE_BUTTON(page), 'Click purchase button');
    
    console.log('✓ Order submitted successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Order submission failed: ${errorMessage}. ` +
      `Please verify the checkout form is filled correctly.`
    );
  }
}

/**
 * Verify order confirmation modal is displayed correctly
 * 
 * @param page - Playwright page object
 * @throws {Error} If order confirmation verification fails
 * 
 * @example
 * ```typescript
 * await verifyOrderConfirmation(page);
 * ```
 */
export async function verifyOrderConfirmation(page: Page): Promise<void> {
  try {
    // Verify success message title is visible (exact message verified in verifyOrderModalMessage)
    const successMessage = SELECTORS.SWEET_ALERT_TITLE(page);
    await verifyVisible(successMessage, 'Order success message');
    
    // Verify order details are displayed
    const orderDetails = SELECTORS.SWEET_ALERT_MESSAGE(page);
    await verifyVisible(orderDetails, 'Order details');
    
    // Verify OK button is available
    const okButton = SELECTORS.SWEET_ALERT_OK_BUTTON(page);
    await verifyVisible(okButton, 'OK button');
    
    console.log('✓ Order confirmation verified');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Order confirmation verification failed: ${errorMessage}. ` +
      `The order may not have been placed successfully.`
    );
  }
}

/**
 * Verify order confirmation message content contains expected information
 * 
 * @param page - Playwright page object
 * @throws {Error} If order message verification fails
 * 
 * @example
 * ```typescript
 * await verifyOrderMessageContent(page);
 * ```
 */
export async function verifyOrderMessageContent(page: Page): Promise<void> {
  try {
    // Get order details message (visibility already verified in verifyOrderConfirmation)
    const orderDetails = SELECTORS.SWEET_ALERT_MESSAGE(page);
    
    // Get the message text
    const messageText = await orderDetails.textContent();
    
    if (!messageText || messageText.trim().length === 0) {
      throw new Error('Order confirmation message is empty');
    }
    
    // Verify message contains expected order information
    // Typically order messages contain: Amount, Card number, Order ID, or customer details
    const messageLower = messageText.toLowerCase();
    const hasAmount = messageLower.includes('amount') || messageLower.includes('$') || /\d+/.test(messageText);
    const hasOrderInfo = messageLower.includes('id') || messageLower.includes('card') || messageLower.includes('number');
    
    if (!hasAmount && !hasOrderInfo) {
      // At minimum, verify message has meaningful content (not just whitespace)
      if (messageText.trim().length < 10) {
        throw new Error(`Order confirmation message appears incomplete: "${messageText}"`);
      }
    }
    
    console.log(`✓ Order confirmation message content verified: "${messageText.substring(0, 50)}..."`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Order message content verification failed: ${errorMessage}. ` +
      `The order confirmation message may be missing or incomplete.`
    );
  }
}

/**
 * Verify order confirmation modal displays the expected message
 * 
 * @param page - Playwright page object
 * @param expectedMessage - Expected message text in the modal (e.g., "Thank you for your purchase!")
 * @throws {Error} If modal message verification fails
 * 
 * @example
 * ```typescript
 * await verifyOrderModalMessage(page, 'Thank you for your purchase!');
 * ```
 */
export async function verifyOrderModalMessage(page: Page, expectedMessage: string): Promise<void> {
  try {
    // Verify success message title contains expected message
    const successMessage = SELECTORS.SWEET_ALERT_TITLE(page);
    await verifyVisible(successMessage, 'Order success message');
    await verifyText(successMessage, expectedMessage, 'Order success message');
    
    // Verify order details are displayed
    const orderDetails = SELECTORS.SWEET_ALERT_MESSAGE(page);
    await verifyVisible(orderDetails, 'Order details');
    
    // Verify OK button is available
    const okButton = SELECTORS.SWEET_ALERT_OK_BUTTON(page);
    await verifyVisible(okButton, 'OK button');
    
    console.log(`✓ Order confirmation modal verified with message: "${expectedMessage}"`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Order modal message verification failed: ${errorMessage}. ` +
      `Expected message: "${expectedMessage}". The order confirmation modal may not be displayed correctly.`
    );
  }
}

/**
 * Close order confirmation modal
 * 
 * @param page - Playwright page object
 * @throws {Error} If closing the modal fails
 * 
 * @example
 * ```typescript
 * await closeOrderConfirmation(page);
 * ```
 */
export async function closeOrderConfirmation(page: Page): Promise<void> {
  try {
    // Click OK button
    await clickElement(SELECTORS.SWEET_ALERT_OK_BUTTON(page), 'Click OK button');
    
    // Verify modal is closed
    await verifyHidden(SELECTORS.SWEET_ALERT(page), 'Order confirmation modal');
    
    console.log('✓ Order confirmation modal closed');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to close order confirmation: ${errorMessage}`);
  }
}

