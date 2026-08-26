# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: payment.spec.ts >> Payment Verification >> should verify email is sent on successful payment
- Location: e2e\payment.spec.ts:187:7

# Error details

```
Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e5]:
      - heading "Checkout" [level=1] [ref=e6]
      - link "Back to Cart" [ref=e7] [cursor=pointer]:
        - /url: /shop/cart
        - button "Back to Cart" [ref=e8]:
          - img
          - text: Back to Cart
    - generic [ref=e13]:
      - generic [ref=e16]:
        - heading "Shipping Information" [level=2] [ref=e17]
        - generic [ref=e18]:
          - generic [ref=e19]:
            - generic [ref=e20]: Full Name *
            - textbox "Kenny Ojeba" [active] [ref=e21]
          - generic [ref=e22]:
            - generic [ref=e23]:
              - generic [ref=e24]: Email Address *
              - textbox "kennyoj@example.com" [ref=e25]: payment-test@example.com
            - generic [ref=e26]:
              - generic [ref=e27]: Phone Number *
              - textbox "+234 ********" [ref=e28]
        - generic [ref=e29]:
          - heading "Shipping Address" [level=3] [ref=e30]
          - generic [ref=e31]:
            - generic [ref=e32]:
              - generic [ref=e33]: Street Address *
              - textbox "145 Ochird Street" [ref=e34]
            - generic [ref=e35]:
              - generic [ref=e36]:
                - generic [ref=e37]: City *
                - textbox "Lagos" [ref=e38]
              - generic [ref=e39]:
                - generic [ref=e40]: State/Province *
                - textbox "Lagos" [ref=e41]
            - generic [ref=e42]:
              - generic [ref=e43]:
                - generic [ref=e44]: Country *
                - textbox [disabled]: Nigeria
              - generic [ref=e45]:
                - generic [ref=e46]: Postal Code *
                - textbox "100001" [ref=e47]
        - generic [ref=e48]:
          - link "Back to Cart" [ref=e49] [cursor=pointer]:
            - /url: /shop/cart
            - button "Back to Cart" [ref=e50]
          - button "Continue to Payment" [ref=e51] [cursor=pointer]
      - generic [ref=e53]:
        - heading "Order Summary" [level=3] [ref=e54]
        - generic [ref=e56]:
          - img "another test" [ref=e58]
          - generic [ref=e59]:
            - paragraph [ref=e60]: another test
            - paragraph [ref=e61]: "Size: 39"
            - paragraph [ref=e62]: "Color: Black"
            - paragraph [ref=e63]: 1x ₦5,000
            - paragraph [ref=e64]: ₦5,000
        - generic [ref=e65]:
          - generic [ref=e66]:
            - generic [ref=e67]: Subtotal
            - generic [ref=e68]: ₦5,000
          - generic [ref=e69]:
            - generic [ref=e70]: Shipping
            - generic [ref=e71]: Free
          - generic [ref=e72]:
            - generic [ref=e73]: Tax
            - generic [ref=e74]: Calculated at payment
          - generic [ref=e75]:
            - generic [ref=e76]: Total
            - generic [ref=e77]: ₦5,000
  - button "Open Next.js Dev Tools" [ref=e83] [cursor=pointer]:
    - generic [ref=e86]:
      - text: Rendering
      - generic [ref=e87]:
        - generic [ref=e88]: .
        - generic [ref=e89]: .
        - generic [ref=e90]: .
  - alert [ref=e91]
```