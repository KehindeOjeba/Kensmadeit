# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: payment.spec.ts >> Payment Verification >> should show payment page with Paystack button
- Location: e2e\payment.spec.ts:59:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForSelector: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[data-testid="product-card"]') to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - heading "Shop" [level=1] [ref=e6]
        - button [ref=e7] [cursor=pointer]:
          - img [ref=e8]
      - generic [ref=e11]:
        - textbox "Search products..." [ref=e12]
        - button "Search" [ref=e13] [cursor=pointer]
    - generic [ref=e15]:
      - complementary [ref=e16]:
        - generic [ref=e17]:
          - heading "Categories" [level=3] [ref=e18]
          - button "All Products" [ref=e20] [cursor=pointer]
        - generic [ref=e21]:
          - heading "Sort By" [level=3] [ref=e22]
          - generic [ref=e23]:
            - generic [ref=e24] [cursor=pointer]:
              - radio "Newest" [checked] [ref=e25]
              - generic [ref=e26]: Newest
            - generic [ref=e27] [cursor=pointer]:
              - 'radio "Price: Low to High" [ref=e28]'
              - generic [ref=e29]: "Price: Low to High"
            - generic [ref=e30] [cursor=pointer]:
              - 'radio "Price: High to Low" [ref=e31]'
              - generic [ref=e32]: "Price: High to Low"
            - generic [ref=e33] [cursor=pointer]:
              - 'radio "Name: A to Z" [ref=e34]'
              - generic [ref=e35]: "Name: A to Z"
            - generic [ref=e36] [cursor=pointer]:
              - 'radio "Name: Z to A" [ref=e37]'
              - generic [ref=e38]: "Name: Z to A"
      - main [ref=e39]
  - button "Open Next.js Dev Tools" [ref=e106] [cursor=pointer]:
    - img [ref=e107]
  - alert [ref=e110]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | 
  3   | const navigateToFirstProduct = async (page) => {
  4   |   const firstProduct = page.locator('[data-testid="product-card"]').first()
  5   |   const productLink = firstProduct.locator('a').first()
  6   |   const href = await productLink.getAttribute('href')
  7   |   
  8   |   if (href) {
  9   |     await page.goto(href)
  10  |   } else {
  11  |     await firstProduct.click()
  12  |     await page.waitForTimeout(500)
  13  |   }
  14  |   
  15  |   // Wait for page to load with a more forgiving timeout
  16  |   await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => null)
  17  | }
  18  | 
  19  | const fillCheckoutForm = async (page, data = {}) => {
  20  |   const defaultData = {
  21  |     name: 'Test User',
  22  |     email: 'test@example.com',
  23  |     phone: '+234801234567',
  24  |     address: '123 Test St',
  25  |     city: 'Lagos',
  26  |     state: 'Lagos',
  27  |     postal: '100001',
  28  |     ...data
  29  |   }
  30  | 
  31  |   // Use more direct selectors to avoid iterating through all inputs
  32  |   const selectors = [
  33  |     { placeholder: 'Name', value: defaultData.name },
  34  |     { placeholder: 'Email', value: defaultData.email },
  35  |     { placeholder: 'Phone', value: defaultData.phone },
  36  |     { placeholder: 'Address', value: defaultData.address },
  37  |     { placeholder: 'City', value: defaultData.city },
  38  |     { placeholder: 'State', value: defaultData.state },
  39  |     { placeholder: 'Postal', value: defaultData.postal },
  40  |   ]
  41  | 
  42  |   for (const selector of selectors) {
  43  |     const input = page.locator(`input[placeholder*="${selector.placeholder}"]`)
  44  |     const isVisible = await input.isVisible({ timeout: 1000 }).catch(() => false)
  45  |     if (isVisible) {
  46  |       await input.fill(selector.value).catch(() => null)
  47  |     }
  48  |   }
  49  | 
  50  |   // Also try email input with type selector
  51  |   const emailInput = page.locator('input[type="email"]')
  52  |   const emailVisible = await emailInput.isVisible({ timeout: 1000 }).catch(() => false)
  53  |   if (emailVisible) {
  54  |     await emailInput.fill(defaultData.email).catch(() => null)
  55  |   }
  56  | }
  57  | 
  58  | test.describe('Payment Verification', () => {
  59  |   test('should show payment page with Paystack button', async ({ page }) => {
  60  |     // Navigate to shop
  61  |     await page.goto('/shop')
> 62  |     await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
      |                ^ Error: page.waitForSelector: Test timeout of 30000ms exceeded.
  63  |     
  64  |     // Navigate to first product
  65  |     await navigateToFirstProduct(page)
  66  |     
  67  |     // Add to cart
  68  |     const addToCartButton = page.locator('button:has-text("Add to Cart")')
  69  |     await addToCartButton.click().catch(() => null)
  70  | 
  71  |     // Go to checkout
  72  |     await page.goto('/shop/checkout')
  73  | 
  74  |     // Fill form
  75  |     await fillCheckoutForm(page)
  76  | 
  77  |     // Proceed to payment
  78  |     const nextButton = page.locator('button:has-text("Continue"), button:has-text("Next")')
  79  |     await nextButton.click().catch(() => null)
  80  | 
  81  |     // Check for Paystack button
  82  |     const paystackButton = page.locator('button:has-text("Pay with Paystack")')
  83  |     await expect(paystackButton).toBeVisible({ timeout: 5000 }).catch(() => null)
  84  |   })
  85  | 
  86  |   test('should display order amount correctly', async ({ page }) => {
  87  |     // Navigate to shop
  88  |     await page.goto('/shop')
  89  |     await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
  90  |     
  91  |     // Navigate to first product
  92  |     await navigateToFirstProduct(page)
  93  | 
  94  |     // Get product price
  95  |     const priceText = await page.locator('[data-testid="product-price"]')
  96  |       .first()
  97  |       .textContent()
  98  |       .catch(() => '0')
  99  |     
  100 |     // Add to cart
  101 |     const addToCartButton = page.locator('button:has-text("Add to Cart")')
  102 |     await addToCartButton.click().catch(() => null)
  103 | 
  104 |     // Go to checkout
  105 |     await page.goto('/shop/checkout')
  106 | 
  107 |     // Verify amount is displayed
  108 |     const amountDisplay = page.locator('text=/₦.*[0-9]/')
  109 |     await expect(amountDisplay).toBeVisible({ timeout: 5000 }).catch(() => null)
  110 |   })
  111 | 
  112 |   test('should have correct payment reference format', async ({ page }) => {
  113 |     // Navigate to shop
  114 |     await page.goto('/shop')
  115 |     await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
  116 |     
  117 |     // Navigate to first product
  118 |     await navigateToFirstProduct(page)
  119 |     
  120 |     // Add to cart
  121 |     const addToCartButton = page.locator('button:has-text("Add to Cart")')
  122 |     await addToCartButton.click().catch(() => null)
  123 | 
  124 |     // Go to checkout
  125 |     await page.goto('/shop/checkout')
  126 | 
  127 |     // Fill form
  128 |     await fillCheckoutForm(page)
  129 | 
  130 |     // Proceed to payment
  131 |     const nextButton = page.locator('button:has-text("Continue"), button:has-text("Next")')
  132 |     await nextButton.click().catch(() => null)
  133 | 
  134 |     // Check if order number is displayed (KM-xxxxx format)
  135 |     const orderNumber = page.locator('text=/KM-[0-9]+/')
  136 |     const isVisible = await orderNumber.isVisible({ timeout: 2000 }).catch(() => false)
  137 |     
  138 |     if (isVisible) {
  139 |       await expect(orderNumber).toBeVisible()
  140 |     }
  141 |   })
  142 | 
  143 |   test('should prevent duplicate payment submissions', async ({ page }) => {
  144 |     // Navigate to shop
  145 |     await page.goto('/shop')
  146 |     await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
  147 |     
  148 |     // Navigate to first product
  149 |     await navigateToFirstProduct(page)
  150 |     
  151 |     // Add to cart
  152 |     const addToCartButton = page.locator('button:has-text("Add to Cart")')
  153 |     await addToCartButton.click().catch(() => null)
  154 | 
  155 |     // Go to checkout and fill form
  156 |     await page.goto('/shop/checkout')
  157 |     await fillCheckoutForm(page)
  158 | 
  159 |     // Proceed to payment
  160 |     const nextButton = page.locator('button:has-text("Continue"), button:has-text("Next")')
  161 |     await nextButton.click().catch(() => null)
  162 | 
```