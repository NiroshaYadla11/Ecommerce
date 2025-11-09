/**
 * Test Data Fixtures
 * 
 * Centralized data management - no hardcoded values in tests
 */

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface CheckoutData {
  name: string;
  country: string;
  city: string;
  creditCard: string;
  month: string;
  year: string;
}

// User credentials
export const LOGIN_CREDENTIALS: LoginCredentials = {
  username: 'test',
  password: 'test',
};

// Checkout form data
export const CHECKOUT_DATA: CheckoutData = {
  name: 'John Doe',
  country: 'United States',
  city: 'New York',
  creditCard: '1234567890123456',
  month: '12',
  year: '2025',
};

// API endpoints
export const API_ENDPOINTS = {
  ENTRIES: '/entries',
  LOGIN: '/login',
  ADDTOCART: '/addtocart',
};

// Test product to select
export const TEST_PRODUCT = {
  name: 'Samsung galaxy s6',
  expectedInCart: true,
};

// Expected messages (for internal helper validations)
export const EXPECTED_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome',
  PRODUCT_ADDED: 'Product added',
  ORDER_SUCCESS: 'Thank you for your purchase!',
};

// Test configuration
export const TEST_CONFIG = {
  MIN_PRODUCTS: 5,
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

// Application URL
export const BASE_URL = 'https://www.demoblaze.com';

