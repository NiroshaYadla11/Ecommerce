/**
 * Step Definitions for Checkout Flow
 * 
 * BDD step definitions using Cucumber with Gherkin syntax
 */

import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { Page } from 'playwright';
import { login, verifyLoggedIn } from '../helpers/auth';
import { selectProduct, verifyProductDetails } from '../helpers/products';
import { addProductToCart, verifyAddToCartSuccess, verifyProductInCart, verifyCartItems } from '../helpers/cart';
import { fillCheckoutForm, submitOrder, verifyOrderConfirmation, verifyOrderModalMessage } from '../helpers/checkout';
import { initializeBrowser, navigateToBaseUrl, cleanupBrowser } from '../helpers/browser-setup';
import { LOGIN_CREDENTIALS, CHECKOUT_DATA, TEST_PRODUCT, EXPECTED_MESSAGES } from '../fixtures/test-data';

let page: Page;

Before({ timeout: 60000 }, async function () {
  page = await initializeBrowser();
});

Given('I am on the DemoBlaze home page', { timeout: 60000 }, async function () {
  await navigateToBaseUrl(page);
});

When('I log in with valid credentials', { timeout: 60000 }, async function () {
  await login(page, LOGIN_CREDENTIALS);
});

Then('I should be successfully authenticated', { timeout: 30000 }, async function () {
  await verifyLoggedIn(page, LOGIN_CREDENTIALS.username);
});

When('I navigate to and select {string}', { timeout: 60000 }, async function (productName: string) {
  // Feature file provides example data for readability, but we verify against fixture
  // This ensures feature file is readable while maintaining data consistency
  await selectProduct(page, productName);
});

Then('the product details should be displayed', { timeout: 30000 }, async function () {
  // Use fixture for verification (ensures consistency)
  await verifyProductDetails(page, TEST_PRODUCT.name);
});

When('I add the product to cart', { timeout: 30000 }, async function () {
  // Store dialog promise for verification in next step
  this.dialogPromise = await addProductToCart(page);
});

Then('a success message should appear', { timeout: 30000 }, async function () {
  // Verify the success message dialog appeared with correct message
  await verifyAddToCartSuccess(page, this.dialogPromise);
});

When('I complete the checkout form with valid details', { timeout: 60000 }, async function () {
  await fillCheckoutForm(page, CHECKOUT_DATA, TEST_PRODUCT.name);
});

Then('the cart items should be verified', { timeout: 30000 }, async function () {
  await verifyCartItems(page, 1);
  await verifyProductInCart(page, TEST_PRODUCT.name);
});

When('I submit the order', { timeout: 30000 }, async function () {
  await submitOrder(page);
});

Then('the order should be placed successfully', { timeout: 30000 }, async function () {
  await verifyOrderConfirmation(page);
});

Then('I should see the {string} modal', { timeout: 30000 }, async function (expectedMessage: string) {
  // Use fixture for verification (ensures consistency)
  await verifyOrderModalMessage(page, EXPECTED_MESSAGES.ORDER_SUCCESS);
});

After({ timeout: 30000 }, async function () {
  await cleanupBrowser();
});

