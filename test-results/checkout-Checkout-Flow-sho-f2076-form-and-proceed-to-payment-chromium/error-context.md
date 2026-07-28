# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout.spec.ts >> Checkout Flow >> should fill shipping form and proceed to payment
- Location: e2e\checkout.spec.ts:82:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForTimeout: Target page, context or browser has been closed
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]
  - generic [ref=e13]:
    - generic [ref=e14]:
      - link "Home" [ref=e15] [cursor=pointer]:
        - /url: /
      - generic [ref=e16]: /
      - generic [ref=e17]: Shopping Cart
    - generic [ref=e18]:
      - generic [ref=e20]:
        - generic [ref=e22]:
          - heading "Shopping Cart" [level=1] [ref=e23]
          - paragraph [ref=e24]: 1 item
        - generic [ref=e26]:
          - link "another test" [ref=e27] [cursor=pointer]:
            - /url: /shop/product/another-test
            - img "another test" [ref=e29]
          - generic [ref=e30]:
            - link "another test" [ref=e31] [cursor=pointer]:
              - /url: /shop/product/another-test
              - heading "another test" [level=3] [ref=e32]
            - paragraph [ref=e33]: "Size: 39"
            - paragraph [ref=e34]: "Color: Black"
            - paragraph [ref=e35]: ₦5,000
            - generic [ref=e36]:
              - generic [ref=e37]:
                - button "Decrease quantity" [ref=e38] [cursor=pointer]:
                  - img [ref=e39]
                - generic [ref=e40]: "1"
                - button "Increase quantity" [ref=e41] [cursor=pointer]:
                  - img [ref=e42]
              - button "Remove from cart" [ref=e43] [cursor=pointer]:
                - img [ref=e44]
          - generic [ref=e47]:
            - paragraph [ref=e48]: Subtotal
            - paragraph [ref=e49]: ₦5,000
        - link "Continue Shopping" [ref=e51] [cursor=pointer]:
          - /url: /shop
          - button "Continue Shopping" [ref=e52]
      - generic [ref=e54]:
        - heading "Order Summary" [level=2] [ref=e55]
        - generic [ref=e56]:
          - generic [ref=e57]:
            - generic [ref=e58]: Subtotal
            - generic [ref=e59]: ₦5,000
          - generic [ref=e60]:
            - generic [ref=e61]: Shipping
            - generic [ref=e62]: Free
          - generic [ref=e63]:
            - generic [ref=e64]: Tax (VAT)
            - generic [ref=e65]: Calculated at checkout
        - generic [ref=e67]:
          - generic [ref=e68]: Total
          - generic [ref=e69]: ₦5,000
        - button "Proceed to Checkout" [ref=e70] [cursor=pointer]:
          - text: Proceed to Checkout
          - img
        - button "Clear Cart" [ref=e71] [cursor=pointer]
        - paragraph [ref=e73]: You can review your order before making payment during checkout.
```

# Test source

```ts
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
  19  | test.describe('Checkout Flow', () => {
  20  |   test.beforeEach(async ({ page }) => {
  21  |     // Navigate to shop page
  22  |     await page.goto('/shop')
  23  |     // Wait for products to load
  24  |     await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
  25  |   })
  26  | 
  27  |   test('should add product to cart', async ({ page }) => {
  28  |     await navigateToFirstProduct(page)
  29  |     
  30  |     // Select quantity
  31  |     const quantityInput = page.locator('input[type="number"]')
  32  |     if (await quantityInput.isVisible({ timeout: 2000 }).catch(() => false)) {
  33  |       await quantityInput.clear()
  34  |       await quantityInput.fill('2')
  35  |     }
  36  | 
  37  |     // Click add to cart button
  38  |     const addToCartButton = page.locator('button:has-text("Add to Cart")')
  39  |     await addToCartButton.click()
  40  | 
  41  |     // Check success message or cart update
  42  |     await page.waitForTimeout(500)
  43  |   })
  44  | 
  45  |   test('should view cart with items', async ({ page }) => {
  46  |     // Add a product first
  47  |     await navigateToFirstProduct(page)
  48  |     
  49  |     const addToCartButton = page.locator('button:has-text("Add to Cart")')
  50  |     await addToCartButton.click()
  51  | 
  52  |     // Navigate to cart
  53  |     await page.goto('/shop/cart')
  54  | 
  55  |     // Verify cart is not empty - use more specific selector
  56  |     await expect(page.locator('[data-testid="cart-subtotal"]')).toBeVisible({ timeout: 5000 }).catch(() => null)
  57  |     
  58  |     // Check total is displayed
  59  |     const total = page.locator('[data-testid="cart-total"]')
  60  |     await expect(total).toBeVisible({ timeout: 5000 }).catch(() => null)
  61  |   })
  62  | 
  63  |   test('should proceed to checkout', async ({ page }) => {
  64  |     // Add product to cart
  65  |     await navigateToFirstProduct(page)
  66  |     
  67  |     const addToCartButton = page.locator('button:has-text("Add to Cart")')
  68  |     await addToCartButton.click()
  69  | 
  70  |     // Go to cart
  71  |     await page.goto('/shop/cart')
  72  |     
  73  |     // Click proceed to checkout
  74  |     const checkoutButton = page.locator('button:has-text("Proceed to Checkout")')
  75  |     await checkoutButton.click()
  76  | 
  77  |     // Verify checkout page loaded
  78  |     await page.waitForURL('/shop/checkout', { timeout: 5000 }).catch(() => null)
  79  |     await expect(page.locator('text=Checkout')).toBeVisible({ timeout: 5000 }).catch(() => null)
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
> 106 |     await page.waitForTimeout(500)
      |                ^ Error: page.waitForTimeout: Target page, context or browser has been closed
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
  180 |     await page.goto('/shop/cart')
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