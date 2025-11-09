/**
 * Selectors Constants
 * 
 * Centralized selectors using Playwright's recommended locator APIs
 * Best practice: Use getByRole, getByText, locator for better reliability
 */

import { Page, Locator } from '@playwright/test';

/**
 * Selector factory functions using Playwright's best practices
 * These return Playwright locators that use auto-waiting
 */
export const SELECTORS = {
  // Navigation - Using getByRole (Playwright best practice)
  LOGIN_LINK: (page: Page): Locator => page.getByRole('link', { name: 'Log in', exact: true }),
  CART_LINK: (page: Page): Locator => page.getByRole('link', { name: 'Cart', exact: true }),
  
  // Login Modal - Using ID selectors for modals
  LOGIN_MODAL: (page: Page): Locator => page.locator('#logInModal'),
  LOGIN_USERNAME_INPUT: (page: Page): Locator => page.locator('#loginusername'),
  LOGIN_PASSWORD_INPUT: (page: Page): Locator => page.locator('#loginpassword'),
  LOGIN_BUTTON: (page: Page): Locator => page.getByRole('button', { name: 'Log in', exact: true }),
  LOGGED_IN_USER: (page: Page): Locator => page.locator('#nameofuser'),
  
  // Product Selection - Using getByRole for links, locator for elements
  PRODUCT_LINK: (page: Page, productName: string): Locator => 
    page.getByRole('link', { name: productName, exact: true }),
  PRODUCT_TITLE: (page: Page): Locator => page.locator('h2.name'),
  PRODUCT_PRICE: (page: Page): Locator => page.locator('h3.price-container'),
  ADD_TO_CART_BUTTON: (page: Page): Locator => 
    page.getByRole('link', { name: 'Add to cart', exact: true }),
  
  // Cart - Using ID and CSS selectors
  CART_TABLE: (page: Page): Locator => page.locator('#tbodyid'),
  CART_ITEM_ROW: (page: Page): Locator => page.locator('#tbodyid tr'),
  CART_ITEM_PRODUCT_NAME: (page: Page, productName: string): Locator =>
    page.locator('#tbodyid tr').filter({ hasText: productName }),
  PLACE_ORDER_BUTTON: (page: Page): Locator =>
    page.getByRole('button', { name: 'Place Order', exact: true }),
  
  // Checkout Modal - Using ID selectors for form inputs
  ORDER_MODAL: (page: Page): Locator => page.locator('#orderModal'),
  ORDER_NAME_INPUT: (page: Page): Locator => page.locator('#name'),
  ORDER_COUNTRY_INPUT: (page: Page): Locator => page.locator('#country'),
  ORDER_CITY_INPUT: (page: Page): Locator => page.locator('#city'),
  ORDER_CARD_INPUT: (page: Page): Locator => page.locator('#card'),
  ORDER_MONTH_INPUT: (page: Page): Locator => page.locator('#month'),
  ORDER_YEAR_INPUT: (page: Page): Locator => page.locator('#year'),
  PURCHASE_BUTTON: (page: Page): Locator => 
    page.getByRole('button', { name: 'Purchase', exact: true }),
  
  // Order Confirmation - Using CSS selectors for alert containers
  SWEET_ALERT: (page: Page): Locator => page.locator('.sweet-alert'),
  SWEET_ALERT_TITLE: (page: Page): Locator => page.locator('.sweet-alert h2'),
  SWEET_ALERT_MESSAGE: (page: Page): Locator => page.locator('.sweet-alert p'),
  SWEET_ALERT_OK_BUTTON: (page: Page): Locator => 
    page.getByRole('button', { name: 'OK', exact: true }),
} as const;

/**
 * Timeout constants in milliseconds
 */
export const TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000,
  EXTRA_LONG: 60000,
} as const;


