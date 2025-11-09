# 🎯 E-commerce Checkout Flow Automation

> **Playwright + TypeScript + BDD (Cucumber)** - Professional test automation framework for DemoBlaze E-commerce site

## 📋 Overview

This project implements a robust E2E test automation suite for the [DemoBlaze](https://www.demoblaze.com/) e-commerce checkout flow using **Playwright** with **TypeScript** and **BDD** methodology with **Cucumber/Gherkin** syntax.

## 🏗️ Technology Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Test Framework** | Playwright | 1.40+ | Modern, fast, reliable E2E testing |
| **Language** | TypeScript | 5.3+ | Type-safe, maintainable code |
| **BDD Framework** | Cucumber | 10.0+ | Gherkin syntax for business-readable tests |
| **Package Manager** | npm | Latest | Dependency management |

### 🎯 Framework Choice Justification

**Playwright** was selected over Cypress for the following reasons:

1. **🌐 Cross-Browser Support**: Native support for Chromium, Firefox, and WebKit
2. **⚡ Performance**: Faster test execution with parallel test runs
3. **🔌 Network Control**: Superior API interception and network mocking capabilities
4. **📱 Mobile Testing**: Built-in mobile device emulation
5. **🔧 Modern Architecture**: Better integration with modern TypeScript workflows

## 📁 Project Structure

```
Ecommerce/
├── features/                    # BDD Feature files (Gherkin syntax)
│   └── checkout-flow.feature
├── step-definitions/            # Cucumber step definitions
│   └── checkout-steps.ts
├── tests/                      # Playwright test files
│   └── api-interception.spec.ts # API interception test
├── helpers/                    # Modern helper functions pattern
│   ├── auth.ts                 # Authentication helpers
│   ├── products.ts             # Product selection helpers
│   ├── cart.ts                 # Cart operations helpers
│   └── checkout.ts             # Checkout process helpers
├── fixtures/                   # Test data management
│   └── test-data.ts            # Centralized test data (no hardcoded values)
├── utils/                      # Utility functions
│   ├── api-helper.ts           # API interception utilities
│   └── error-handler.ts        # Error handling utilities
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json               # TypeScript configuration
├── cucumber.config.js          # Cucumber configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## 🛠️ Setup Instructions

### Prerequisites

Ensure you have the following installed:

- **Node.js** 22+ (LTS recommended) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)

### Installation Steps

#### 1. Clone or Navigate to Project

```bash
cd Ecommerce
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Install Playwright Browsers

```bash
npx playwright install
```

This installs Chromium, Firefox, and WebKit browsers required for testing.

#### 4. Verify Installation

```bash
npm run test -- --version
```

## ▶️ Test Execution

### Run All Tests

```bash
npm test
```

### Run Specific Test Suites

**E2E Checkout Flow Test (BDD):**
```bash
npm run test:e2e
# or
npm run test:bdd
```

**API Interception Test:**
```bash
npm run test:api
```

**API Test Options:**
```bash
npm run test:api:headed  # Run API test with browser visible
npm run test:api:ui       # Run API test in UI mode
npm run test:api:debug    # Run API test in debug mode
```

**View Test Report:**
```bash
npm run test:report
```

### Run Tests in Different Browsers

**BDD Tests (Cucumber):**
```bash
# Run in Chromium (default)
npm run test:bdd:chromium

# Run in Firefox
npm run test:bdd:firefox

# Run in WebKit (Safari)
npm run test:bdd:webkit

# Run in headed mode (visible browser)
npm run test:bdd:headed
```

**API Tests (Playwright):**
```bash
# Run in Chromium
npm run test:api:chromium

# Run in Firefox
npm run test:api:firefox

# Run in WebKit
npm run test:api:webkit

# Run in all browsers sequentially
npm run test:api:all-browsers
```

**Using Environment Variables:**
```bash
# Windows PowerShell
$env:BROWSER="firefox"; npm run test:bdd
$env:HEADLESS="false"; npm run test:bdd

# Windows CMD
set BROWSER=firefox && npm run test:bdd
set HEADLESS=false && npm run test:bdd

# Linux/Mac
BROWSER=firefox npm run test:bdd
HEADLESS=false npm run test:bdd
```

**Available Browser Options:**
- `chromium` (default)
- `firefox`
- `webkit`


## 🧪 Test Scenarios

### 1. ✅ E2E Checkout Flow (Mandatory)

**Happy Path Test Flow:**

| Step | Action | Validation |
|------|--------|------------|
| **🔐 Login** | Login with credentials (`test` / `test`) | Successful authentication |
| **📱 Product Selection** | Select "Samsung galaxy s6" | Product details displayed |
| **🛒 Add to Cart** | Click "Add to cart" button | Success message appears |
| **💳 Checkout** | Complete "Place Order" form | Cart items verified |
| **✅ Verification** | Submit order | "Thank you for your purchase!" modal |

**Test File:** `features/checkout-flow.feature` (BDD with Gherkin syntax)

### 2. 🔌 API Interception Test (Crucial)

- **📡 API Spy:** Intercepts network request for product list (`/entries`)
- **✅ Status Validation:** Confirms response status is `200`
- **📊 Response Validation:** Asserts response contains ≥5 product entries

**Test File:** `tests/api-interception.spec.ts`

### 3. 🥒 BDD Implementation

**Feature File:** `features/checkout-flow.feature`

Uses Gherkin syntax with Given/When/Then methodology:

```gherkin
Feature: E-commerce Checkout Flow
  Scenario: Complete Happy Path Checkout Flow
    Given I am on the DemoBlaze home page
    When I log in with valid credentials "test" and "test"
    Then I should be successfully authenticated
    ...
```

**Step Definitions:** `step-definitions/checkout-steps.ts`

## 🏗️ Design Patterns

### Modern Helper Functions Pattern

This project uses **modern helper functions** instead of traditional Page Object Model:

**Benefits:**
- ✅ Lightweight and maintainable
- ✅ Better TypeScript support
- ✅ Reusable across tests
- ✅ Easy to understand and modify

**Example:**
```typescript
// helpers/auth.ts
export async function login(page: Page, credentials: LoginCredentials): Promise<void> {
  await page.click('text=Log in');
  await page.fill('#loginusername', credentials.username);
  await page.fill('#loginpassword', credentials.password);
  await page.click('button:has-text("Log in")');
}
```

**Usage in Tests:**
```typescript
import { login } from '../helpers/auth';
await login(page, LOGIN_CREDENTIALS);
```

### Test Data Management

All test data is centralized in `fixtures/test-data.ts`:

- ✅ No hardcoded values in tests
- ✅ Easy to update and maintain
- ✅ Type-safe with TypeScript interfaces

**Example:**
```typescript
export const LOGIN_CREDENTIALS: LoginCredentials = {
  username: 'test',
  password: 'test',
};
```

### Error Handling

Graceful error handling with clear messages:

```typescript
try {
  await login(page, credentials);
} catch (error) {
  throw new Error(`Login failed: ${error.message}`);
}
```

## 📊 Test Reports

**Important:** This project generates **two separate reports** because we use two different test frameworks:

1. **Playwright Report** - Shows API interception test results
2. **Cucumber Report** - Shows BDD/E2E checkout flow test results

### Quick Access

```bash
# Step 1: Generate both reports (run all tests)
npm test

# Step 2: View all reports
npm run test:report:all
```

### Understanding the Reports

| Report | Shows | Generated By | How to View |
|--------|-------|--------------|-------------|
| **Playwright HTML** | API interception test | `npm run test:api` | `npm run test:report` or open `playwright-report/index.html` |
| **Cucumber HTML** | BDD checkout flow test | `npm run test:bdd` | Open `test-results/cucumber-report.html` or `npm run test:report:cucumber` |

### Viewing Reports

**Option 1: View All Reports (Recommended)**
```bash
# First, generate both reports
npm test

# Then open all reports
npm run test:report:all
```

**Option 2: View Playwright Report (API Tests)**
```bash
npm run test:report
```
Opens Playwright report at `http://localhost:9323` with interactive features.

**Option 3: View Cucumber Report (BDD Tests)**
```bash
# First generate the report
npm run test:bdd

# Then view it
npm run test:report:cucumber
```

**Option 4: Manual**
- **API Tests:** Open `playwright-report/index.html` in your browser
- **BDD Tests:** Open `test-results/cucumber-report.html` in your browser

### Report Locations

| Report Type | Location | What It Shows |
|------------|----------|--------------|
| **Playwright HTML** | `playwright-report/index.html` | API interception test results with screenshots, videos, traces |
| **Cucumber HTML** | `test-results/cucumber-report.html` | BDD checkout flow test results with step-by-step execution |
| **JSON Results** | `test-results/results.json` | Machine-readable format for CI/CD |
| **Cucumber JSON** | `test-results/cucumber-report.json` | BDD results in JSON format |
| **Screenshots** | `test-results/` (on failure) | Failure screenshots |
| **Videos** | `test-results/` (on failure) | Failure video recordings |

> **Note:** If you only see API results, make sure you've run `npm run test:bdd` to generate the Cucumber report for BDD tests.

## ⚙️ Configuration

### Playwright Configuration

Key settings in `playwright.config.ts`:

- **Base URL:** `https://www.demoblaze.com`
- **Timeout:** 30 seconds per test
- **Retries:** 2 retries on failure (CI mode)
- **Screenshots:** On failure only
- **Videos:** Retained on failure
- **Trace:** On first retry

### Environment Variables

Create `.env` file for custom configuration (optional):

```env
BASE_URL=https://www.demoblaze.com
USERNAME=test
PASSWORD=test
```

## 🔧 Best Practices Implemented

✅ **Clean Code Architecture**
- Modular helper functions
- Separation of concerns
- Type-safe TypeScript code

✅ **BDD Integration**
- Gherkin feature files
- Separate step definitions
- Business-readable tests

✅ **Data Management**
- Centralized fixtures
- No hardcoded values
- Type-safe interfaces

✅ **Error Handling**
- Graceful failures
- Clear error messages
- Retry mechanisms

✅ **Cross-Browser Support**
- Chromium, Firefox, WebKit
- Configurable browser projects

✅ **Modern Patterns**
- Helper functions over POM
- Reusable utilities
- Scalable structure

## 🐛 Troubleshooting

### Common Issues

**1. Tests fail with timeout errors:**
- Increase timeout in `playwright.config.ts`
- Check network connectivity
- Verify site is accessible

**2. BDD tests not running:**
- Ensure `ts-node` is installed: `npm install --save-dev ts-node`
- Check Cucumber configuration in `cucumber.config.js`

**3. Browser installation issues:**
- Run `npx playwright install --force`
- Check system requirements: `npx playwright install-deps`

## 📝 Notes

- All tests target the public DemoBlaze demo site
- Tests use test credentials: `test` / `test`
- Product tested: "Samsung galaxy s6"
- API endpoint tested: `/entries`

## 👤 Author

Automation Test Engineer

## 📄 License

ISC

---

**🎯 Ready to test? Run `npm test` and see the magic happen!** 🚀
