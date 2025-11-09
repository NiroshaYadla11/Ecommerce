/**
 * Authentication Helper Functions
 * 
 * Modern helper functions pattern for authentication operations
 * Implements robust error handling and proper async/await patterns
 */

import { Page, expect } from '@playwright/test';
import { LoginCredentials } from '../fixtures/test-data';
import { SELECTORS, TIMEOUTS } from '../constants/selectors';
import { clickElement, fillInput, verifyVisible, handleDialog } from '../utils/actions';

/**
 * Login to the application via UI
 * 
 * @param page - Playwright page object
 * @param credentials - Login credentials (username and password)
 * @throws {Error} If login fails with descriptive error message
 * 
 * @example
 * ```typescript
 * await login(page, { username: 'test', password: 'test' });
 * ```
 */
export async function login(page: Page, credentials: LoginCredentials): Promise<void> {
  try {
    // Step 1: Click on Login navigation link
    await clickElement(SELECTORS.LOGIN_LINK(page), 'Click login link');
    
    // Step 2: Fill in credentials
    await fillInput(SELECTORS.LOGIN_USERNAME_INPUT(page), credentials.username, 'Username');
    await fillInput(SELECTORS.LOGIN_PASSWORD_INPUT(page), credentials.password, 'Password');
    
    // Step 3: Set up dialog handler before clicking login button
    const dialogPromise = page.waitForEvent('dialog', { timeout: TIMEOUTS.MEDIUM }).catch(() => {
      return null;
    });

    // Step 4: Click login button
    await clickElement(SELECTORS.LOGIN_BUTTON(page), 'Click login button');
    
    // Step 5: Handle dialog if it appears (for login failures)
    const dialog = await dialogPromise;
    if (dialog) {
      const message = dialog.message();
      await dialog.accept();
      if (message.toLowerCase().includes('wrong password') || 
          message.toLowerCase().includes('user does not exist')) {
        throw new Error(`Login failed: ${message}`);
      }
    }
    
    console.log(`✓ Successfully logged in as ${credentials.username}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Login failed for user "${credentials.username}": ${errorMessage}. ` +
      `Please verify credentials and that the site is accessible.`
    );
  }
}

/**
 * Verify user is logged in by checking the navigation bar
 * 
 * @param page - Playwright page object
 * @param username - Expected username to verify
 * @throws {Error} If user is not logged in or username doesn't match
 * 
 * @example
 * ```typescript
 * await verifyLoggedIn(page, 'test');
 * ```
 */
export async function verifyLoggedIn(page: Page, username: string): Promise<void> {
  try {
    const userElement = SELECTORS.LOGGED_IN_USER(page);
    await verifyVisible(userElement, 'Logged in user');
    await expect(userElement).toContainText(username, { timeout: TIMEOUTS.MEDIUM });
    console.log(`✓ Verified user is logged in: ${username}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `User verification failed for "${username}": ${errorMessage}. ` +
      `The user may not be logged in or the login session may have expired.`
    );
  }
}
