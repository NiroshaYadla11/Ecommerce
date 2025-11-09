/**
 * Action Utilities
 * 
 * Centralized utility functions for common Playwright actions
 * Provides consistent error handling, logging, and timeout management
 */

import { Page, Locator, expect } from '@playwright/test';
import { TIMEOUTS } from '../constants/selectors';

/**
 * Click on an element with error handling and logging
 * 
 * @param locator - Playwright locator to click
 * @param actionDescription - Description of the action for logging (optional)
 * @param timeout - Optional timeout in milliseconds (default: MEDIUM)
 * @throws {Error} If click fails with descriptive error message
 * 
 * @example
 * ```typescript
 * await clickElement(SELECTORS.LOGIN_BUTTON(page), 'Click login button');
 * ```
 */
export async function clickElement(
  locator: Locator,
  actionDescription?: string,
  timeout: number = TIMEOUTS.MEDIUM
): Promise<void> {
  try {
    await locator.click({ timeout });
    if (actionDescription) {
      console.log(`✓ ${actionDescription}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const description = actionDescription || 'Click action';
    throw new Error(
      `${description} failed: ${errorMessage}. ` +
      `Please verify the element is visible and actionable.`
    );
  }
}

/**
 * Fill an input field with error handling and logging
 * 
 * @param locator - Playwright locator of the input field
 * @param value - Value to fill
 * @param fieldName - Name of the field for logging (optional)
 * @param timeout - Optional timeout in milliseconds (default: MEDIUM)
 * @throws {Error} If fill fails with descriptive error message
 * 
 * @example
 * ```typescript
 * await fillInput(SELECTORS.LOGIN_USERNAME_INPUT(page), 'username', 'Username');
 * ```
 */
export async function fillInput(
  locator: Locator,
  value: string,
  fieldName?: string,
  timeout: number = TIMEOUTS.MEDIUM
): Promise<void> {
  try {
    await locator.fill(value, { timeout });
    if (fieldName) {
      console.log(`✓ Filled ${fieldName} field`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const field = fieldName || 'input';
    throw new Error(
      `Failed to fill ${field} field: ${errorMessage}. ` +
      `Please verify the field is visible and editable.`
    );
  }
}

/**
 * Verify element is visible with error handling and logging
 * 
 * @param locator - Playwright locator to verify
 * @param elementName - Name of the element for logging (optional)
 * @param timeout - Optional timeout in milliseconds (default: MEDIUM)
 * @throws {Error} If element is not visible
 * 
 * @example
 * ```typescript
 * await verifyVisible(SELECTORS.LOGGED_IN_USER(page), 'Logged in user');
 * ```
 */
export async function verifyVisible(
  locator: Locator,
  elementName?: string,
  timeout: number = TIMEOUTS.MEDIUM
): Promise<void> {
  try {
    await expect(locator).toBeVisible({ timeout });
    if (elementName) {
      console.log(`✓ ${elementName} is visible`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const name = elementName || 'Element';
    throw new Error(
      `${name} is not visible: ${errorMessage}. ` +
      `Please verify the element exists and is displayed.`
    );
  }
}

/**
 * Verify element contains text with error handling and logging
 * 
 * @param locator - Playwright locator to verify
 * @param expectedText - Expected text to verify
 * @param elementName - Name of the element for logging (optional)
 * @param timeout - Optional timeout in milliseconds (default: MEDIUM)
 * @throws {Error} If element does not contain expected text
 * 
 * @example
 * ```typescript
 * await verifyText(SELECTORS.LOGGED_IN_USER(page), 'test', 'User element');
 * ```
 */
export async function verifyText(
  locator: Locator,
  expectedText: string,
  elementName?: string,
  timeout: number = TIMEOUTS.MEDIUM
): Promise<void> {
  try {
    await expect(locator).toContainText(expectedText, { timeout });
    if (elementName) {
      console.log(`✓ ${elementName} contains expected text: "${expectedText}"`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const name = elementName || 'Element';
    throw new Error(
      `${name} does not contain expected text "${expectedText}": ${errorMessage}. ` +
      `Please verify the element text matches the expected value.`
    );
  }
}

/**
 * Verify element is hidden with error handling and logging
 * 
 * @param locator - Playwright locator to verify
 * @param elementName - Name of the element for logging (optional)
 * @param timeout - Optional timeout in milliseconds (default: MEDIUM)
 * @throws {Error} If element is still visible
 * 
 * @example
 * ```typescript
 * await verifyHidden(SELECTORS.LOGIN_MODAL(page), 'Login modal');
 * ```
 */
export async function verifyHidden(
  locator: Locator,
  elementName?: string,
  timeout: number = TIMEOUTS.MEDIUM
): Promise<void> {
  try {
    await expect(locator).toBeHidden({ timeout });
    if (elementName) {
      console.log(`✓ ${elementName} is hidden`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const name = elementName || 'Element';
    throw new Error(
      `${name} is still visible: ${errorMessage}. ` +
      `Please verify the element should be hidden.`
    );
  }
}

/**
 * Wait for and handle dialog with error handling
 * 
 * @param page - Playwright page object
 * @param expectedMessage - Expected dialog message (optional, for verification)
 * @param timeout - Optional timeout in milliseconds (default: MEDIUM)
 * @returns Dialog message if dialog appeared
 * @throws {Error} If dialog handling fails or unexpected message
 * 
 * @example
 * ```typescript
 * const message = await handleDialog(page, 'Product added');
 * ```
 */
export async function handleDialog(
  page: Page,
  expectedMessage?: string,
  timeout: number = TIMEOUTS.MEDIUM
): Promise<string | null> {
  try {
    const dialog = await page.waitForEvent('dialog', { timeout }).catch(() => {
      // No dialog appeared, which might be fine
      return null;
    });

    if (!dialog) {
      return null;
    }

    const message = dialog.message();
    await dialog.accept();

    if (expectedMessage && !message.toLowerCase().includes(expectedMessage.toLowerCase())) {
      throw new Error(`Unexpected dialog message: ${message}. Expected: ${expectedMessage}`);
    }

    console.log(`✓ Dialog handled: ${message}`);
    return message;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Dialog handling failed: ${errorMessage}`);
  }
}

/**
 * Wait for navigation after clicking a link
 * 
 * @param page - Playwright page object
 * @param locator - Playwright locator to click
 * @param actionDescription - Description of the action for logging (optional)
 * @param timeout - Optional timeout in milliseconds (default: MEDIUM)
 * @throws {Error} If navigation fails
 * 
 * @example
 * ```typescript
 * await clickAndWaitForNavigation(page, SELECTORS.PRODUCT_LINK(page, 'Samsung'), 'Navigate to product');
 * ```
 */
export async function clickAndWaitForNavigation(
  page: Page,
  locator: Locator,
  actionDescription?: string,
  timeout: number = TIMEOUTS.MEDIUM
): Promise<void> {
  try {
    // Wait for navigation after click
    await Promise.all([
      page.waitForLoadState('domcontentloaded', { timeout }),
      locator.click({ timeout })
    ]);
    if (actionDescription) {
      console.log(`✓ ${actionDescription}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const description = actionDescription || 'Navigation';
    throw new Error(
      `${description} failed: ${errorMessage}. ` +
      `Please verify the link is clickable and navigation completes.`
    );
  }
}

/**
 * Get element text with error handling
 * 
 * @param locator - Playwright locator to get text from
 * @param elementName - Name of the element for logging (optional)
 * @param timeout - Optional timeout in milliseconds (default: MEDIUM)
 * @returns Element text content
 * @throws {Error} If getting text fails
 * 
 * @example
 * ```typescript
 * const text = await getText(SELECTORS.PRODUCT_TITLE(page), 'Product title');
 * ```
 */
export async function getText(
  locator: Locator,
  elementName?: string,
  timeout: number = TIMEOUTS.MEDIUM
): Promise<string> {
  try {
    await locator.waitFor({ state: 'visible', timeout });
    const text = await locator.textContent({ timeout });
    if (!text) {
      throw new Error('Element text is empty or null');
    }
    return text.trim();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const name = elementName || 'Element';
    throw new Error(
      `Failed to get text from ${name}: ${errorMessage}. ` +
      `Please verify the element is visible and contains text.`
    );
  }
}

/**
 * Get element count with error handling
 * 
 * @param locator - Playwright locator to count
 * @param elementName - Name of the element for logging (optional)
 * @returns Number of elements found
 * @throws {Error} If count fails
 * 
 * @example
 * ```typescript
 * const count = await getCount(SELECTORS.CART_ITEM_ROW(page), 'Cart items');
 * ```
 */
export async function getCount(
  locator: Locator,
  elementName?: string
): Promise<number> {
  try {
    const count = await locator.count();
    if (elementName) {
      console.log(`✓ Found ${count} ${elementName}`);
    }
    return count;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const name = elementName || 'elements';
    throw new Error(
      `Failed to count ${name}: ${errorMessage}. ` +
      `Please verify the locator is correct.`
    );
  }
}

