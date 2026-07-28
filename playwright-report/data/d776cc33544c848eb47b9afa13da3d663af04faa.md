# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout.spec.ts >> Checkout Flow >> should calculate totals correctly
- Location: e2e\checkout.spec.ts:161:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Target page, context or browser has been closed
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e5]:
      - link "Home" [ref=e6] [cursor=pointer]:
        - /url: /
      - img [ref=e7]
      - link "Shop" [ref=e9] [cursor=pointer]:
        - /url: /shop
      - img [ref=e10]
      - generic [ref=e12]: another test
    - generic [ref=e13]:
      - generic [ref=e15]:
        - generic [ref=e16]:
          - img "another test" [ref=e18]
          - generic [ref=e19]:
            - button "Product 1" [ref=e20] [cursor=pointer]:
              - img "Product 1" [ref=e21]
            - button "Product 2" [ref=e22] [cursor=pointer]:
              - img "Product 2" [ref=e23]
        - generic [ref=e24]:
          - generic [ref=e26]: Handmade Shoes
          - heading "another test" [level=1] [ref=e27]
          - generic [ref=e28]:
            - generic [ref=e29]:
              - img [ref=e30]
              - img [ref=e32]
              - img [ref=e34]
              - img [ref=e36]
              - img [ref=e38]
            - generic [ref=e40]: No reviews yet
          - paragraph [ref=e41]: test test test
          - generic [ref=e42]:
            - generic [ref=e43]: ₦5,000
            - generic [ref=e44]: ₦700
          - paragraph [ref=e46]:
            - img [ref=e47]
            - text: In Stock - 4 available
          - generic [ref=e49]:
            - generic [ref=e50]: Select Size
            - combobox [ref=e51]:
              - option "39" [selected]
              - option "40"
              - option "41"
              - option "42"
              - option "43"
              - option "44"
              - option "45"
              - option "46"
          - generic [ref=e52]:
            - generic [ref=e53]: Select Color
            - combobox [ref=e54]:
              - option "Black" [selected]
              - option "Brown"
              - option "Red"
          - paragraph [ref=e56]: "SKU: 000"
          - generic [ref=e57]:
            - generic [ref=e58]:
              - button "−" [ref=e59] [cursor=pointer]
              - spinbutton [ref=e60]: "1"
              - button "+" [ref=e61] [cursor=pointer]
            - button "Add to Cart" [ref=e62] [cursor=pointer]:
              - img
              - text: Add to Cart
      - generic [ref=e63]:
        - heading "Customer Reviews" [level=2] [ref=e64]
        - button "Write a Review" [ref=e65] [cursor=pointer]
        - paragraph [ref=e66]: No reviews yet. Be the first to review this product!
  - button "Open Next.js Dev Tools" [ref=e72] [cursor=pointer]:
    - img [ref=e73]
  - alert [ref=e76]
```

# Test source

```ts
  80  |   })
  81  | 
  82  |   test('should fill shipping form and proceed to payment', async ({ page }) => {
  83  |     // Add product to cart
  84  |     await navigateToFirstProduct(page)
  85  |     
  86  |     const addToCartButton = page.locator('button:has-text("Add to Cart")')
  87  |     await addToCartButton.click()
  88  | 
  89  |     // Go to checkout
  90  |     await page.goto('/shop/checkout')
  91  | 
  92  |     // Fill shipping form
  93  |     await page.fill('input[placeholder*="Name"], input[type="text"]', 'John Doe').catch(() => null)
  94  |     await page.fill('input[type="email"]', 'john@example.com').catch(() => null)
  95  |     await page.fill('input[placeholder*="Phone"]', '+234801234567').catch(() => null)
  96  |     await page.fill('input[placeholder*="Address"]', '123 Main Street').catch(() => null)
  97  |     await page.fill('input[placeholder*="City"]', 'Lagos').catch(() => null)
  98  |     await page.fill('input[placeholder*="State"]', 'Lagos').catch(() => null)
  99  |     await page.fill('input[placeholder*="Postal"]', '100001').catch(() => null)
  100 | 
  101 |     // Click next/continue button
  102 |     const nextButton = page.locator('button:has-text("Continue"), button:has-text("Next")')
  103 |     await nextButton.click().catch(() => null)
  104 | 
  105 |     // Verify we're on payment step
  106 |     await page.waitForTimeout(500)
  107 |     const isPaymentPage = page.url().includes('checkout') || await page.locator('text=/Payment|Paystack/i').isVisible({ timeout: 2000 }).catch(() => false)
  108 |     expect(isPaymentPage).toBeTruthy()
  109 |   })
  110 | 
  111 |   test('should validate required fields on checkout form', async ({ page }) => {
  112 |     // Add product to cart
  113 |     await navigateToFirstProduct(page)
  114 |     
  115 |     const addToCartButton = page.locator('button:has-text("Add to Cart")')
  116 |     await addToCartButton.click().catch(() => null)
  117 | 
  118 |     // Go to checkout
  119 |     await page.goto('/shop/checkout')
  120 | 
  121 |     // Try to submit empty form
  122 |     const nextButton = page.locator('button:has-text("Continue"), button:has-text("Next")')
  123 |     await nextButton.click().catch(() => null)
  124 | 
  125 |     // Check for error message
  126 |     const errorMessage = page.locator('text=/required|missing/i')
  127 |     const isError = await errorMessage.isVisible({ timeout: 2000 }).catch(() => false)
  128 |     
  129 |     expect(isError || !page.url().includes('payment')).toBeTruthy()
  130 |   })
  131 | 
  132 |   test('should verify order summary on checkout', async ({ page }) => {
  133 |     // Add product to cart
  134 |     await navigateToFirstProduct(page)
  135 |     
  136 |     const addToCartButton = page.locator('button:has-text("Add to Cart")')
  137 |     await addToCartButton.click().catch(() => null)
  138 | 
  139 |     // Go to checkout
  140 |     await page.goto('/shop/checkout')
  141 | 
  142 |     // Verify order summary is visible
  143 |     const orderSummary = page.locator('text=/Order Summary|Subtotal/')
  144 |     await expect(orderSummary).toBeVisible({ timeout: 5000 }).catch(() => null)
  145 |   })
  146 | 
  147 |   test('should handle empty cart', async ({ page }) => {
  148 |     // Go directly to checkout with empty cart
  149 |     await page.goto('/shop/checkout')
  150 | 
  151 |     // Wait a moment for redirect
  152 |     await page.waitForTimeout(1000)
  153 | 
  154 |     // Should redirect back to cart or shop
  155 |     const currentUrl = page.url()
  156 |     const isRedirected = currentUrl.includes('/cart') || currentUrl.includes('/shop')
  157 |     
  158 |     expect(isRedirected).toBeTruthy()
  159 |   })
  160 | 
  161 |   test('should calculate totals correctly', async ({ page }) => {
  162 |     // Add product to cart
  163 |     await navigateToFirstProduct(page)
  164 | 
  165 |     // Get product price
  166 |     const priceText = await page.locator('[data-testid="product-price"]').first().textContent().catch(() => '0')
  167 |     const productPrice = parseFloat(priceText?.replace(/[^0-9.]/g, '') || '0')
  168 | 
  169 |     // Set quantity to 2
  170 |     const quantityInput = page.locator('input[type="number"]')
  171 |     if (await quantityInput.isVisible({ timeout: 2000 }).catch(() => false)) {
  172 |       await quantityInput.clear().catch(() => null)
  173 |       await quantityInput.fill('2').catch(() => null)
  174 |     }
  175 | 
  176 |     const addToCartButton = page.locator('button:has-text("Add to Cart")')
  177 |     await addToCartButton.click().catch(() => null)
  178 | 
  179 |     // Go to cart
> 180 |     await page.goto('/shop/cart')
      |                ^ Error: page.goto: Target page, context or browser has been closed
  181 | 
  182 |     // Verify subtotal is displayed
  183 |     const subtotalText = await page.locator('[data-testid="cart-subtotal"]').textContent().catch(() => '0')
  184 |     const subtotal = parseFloat(subtotalText?.replace(/[^0-9.]/g, '') || '0')
  185 | 
  186 |     // Verify total
  187 |     const totalText = await page.locator('[data-testid="cart-total"]').textContent().catch(() => '0')
  188 |     const total = parseFloat(totalText?.replace(/[^0-9.]/g, '') || '0')
  189 | 
  190 |     expect(subtotal).toBeGreaterThan(0)
  191 |     expect(total).toBeGreaterThan(0)
  192 |   })
  193 | })
  194 | 
```