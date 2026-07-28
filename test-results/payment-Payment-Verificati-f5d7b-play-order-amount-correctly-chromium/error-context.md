# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: payment.spec.ts >> Payment Verification >> should display order amount correctly
- Location: e2e\payment.spec.ts:86:7

# Error details

```
Test timeout of 30000ms exceeded.
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