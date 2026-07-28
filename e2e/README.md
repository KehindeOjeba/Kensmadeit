# E2E Testing with Playwright

This directory contains end-to-end tests for the kensmadeit-ecommerce application using Playwright.

## Test Files

### `checkout.spec.ts`
Tests for the complete checkout workflow:
- Adding products to cart
- Viewing cart
- Proceeding to checkout
- Filling shipping information
- Form validation
- Order summary display
- Empty cart handling
- Total calculations

### `payment.spec.ts`
Tests for payment processing:
- Paystack payment button visibility
- Amount display verification
- Order reference format validation
- Duplicate submission prevention
- Payment error handling
- Email confirmation on successful payment

## Running Tests

### Install dependencies
```bash
npm install -D @playwright/test
```

### Run all tests
```bash
npm run test:e2e
```

### Run tests in UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run tests in debug mode
```bash
npm run test:e2e:debug
```

### Run specific test file
```bash
npx playwright test checkout.spec.ts
```

### Run tests with specific browser
```bash
npx playwright test --project=chromium
```

## Configuration

- **Base URL**: http://localhost:3000 (configured in `playwright.config.ts`)
- **Test Directory**: `./e2e`
- **Browsers**: Chromium (configured)
- **Timeout**: 30 seconds per test
- **Retries**: 0 locally, 2 in CI

## Test Data Selectors

Tests use `data-testid` attributes for reliable element selection:
- `data-testid="product-card"` - Product listings
- `data-testid="product-price"` - Product price display
- `data-testid="cart-total"` - Cart total amount
- `data-testid="cart-subtotal"` - Cart subtotal
- `data-testid="checkout-items"` - Items section in checkout

## Notes

- Tests require the development server running (`npm run dev`)
- Tests use intelligent waits and don't rely on fixed timeouts
- Fallback selectors are included for form inputs (placeholder text)
- Payment tests validate form flow without actual Paystack integration
- All tests are isolated and don't depend on each other

## CI/CD Integration

Tests are configured to:
- Run in parallel locally (`fullyParallel: true`)
- Run sequentially in CI (`workers: 1`)
- Retry failed tests 2 times in CI
- Generate HTML reports in `playwright-report/`
- Capture screenshots on failures
- Record traces on first retry
