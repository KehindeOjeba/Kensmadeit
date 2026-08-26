# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: payment.spec.ts >> Payment Verification >> should have correct payment reference format
- Location: e2e\payment.spec.ts:112:7

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
  - button "Open Next.js Dev Tools" [ref=e38] [cursor=pointer]:
    - generic [ref=e41]:
      - text: Compiling
      - generic [ref=e42]:
        - generic [ref=e43]: .
        - generic [ref=e44]: .
        - generic [ref=e45]: .
  - alert [ref=e46]
```

# Test source

```ts
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
  62  |     await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
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
> 125 |     await page.goto('/shop/checkout')
      |                ^ Error: page.goto: Target page, context or browser has been closed
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
  163 |     // Get the pay button and check its state
  164 |     const paystackButton = page.locator('button:has-text("Pay with Paystack")')
  165 |     
  166 |     // Verify button is visible
  167 |     await expect(paystackButton).toBeVisible({ timeout: 5000 }).catch(() => null)
  168 |   })
  169 | 
  170 |   test('should display payment error handling', async ({ page }) => {
  171 |     // Navigate to payment success page with invalid reference
  172 |     await page.goto('/shop/payment-success?reference=invalid&email=test@example.com', { waitUntil: 'networkidle' }).catch(() => null)
  173 | 
  174 |     // Wait for page to stabilize
  175 |     await page.waitForTimeout(500)
  176 | 
  177 |     // Check if error is shown or page redirects
  178 |     const currentUrl = page.url()
  179 |     const errorElement = page.locator('text=/failed|error|verification/i')
  180 |     const hasError = await errorElement.isVisible({ timeout: 2000 }).catch(() => false)
  181 |     
  182 |     // Should either show error or redirect away from payment-success
  183 |     const isErrorPage = hasError || !currentUrl.includes('payment-success') || currentUrl.includes('cart')
  184 |     expect(isErrorPage).toBeTruthy()
  185 |   })
  186 | 
  187 |   test('should verify email is sent on successful payment', async ({ page }) => {
  188 |     // Navigate to shop
  189 |     await page.goto('/shop')
  190 |     await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
  191 |     
  192 |     // Navigate to first product
  193 |     await navigateToFirstProduct(page)
  194 |     
  195 |     // Add to cart
  196 |     const addToCartButton = page.locator('button:has-text("Add to Cart")')
  197 |     await addToCartButton.click().catch(() => null)
  198 | 
  199 |     // Go to checkout
  200 |     await page.goto('/shop/checkout')
  201 | 
  202 |     const email = 'payment-test@example.com'
  203 | 
  204 |     // Fill form with test email
  205 |     await fillCheckoutForm(page, { email })
  206 | 
  207 |     // Proceed to payment
  208 |     const nextButton = page.locator('button:has-text("Continue"), button:has-text("Next")')
  209 |     await nextButton.click().catch(() => null)
  210 | 
  211 |     // Verify email is shown in order details
  212 |     const emailDisplay = page.locator(`text=${email}`)
  213 |     await expect(emailDisplay).toBeVisible({ timeout: 5000 }).catch(() => null)
  214 |   })
  215 | })
  216 | 
```