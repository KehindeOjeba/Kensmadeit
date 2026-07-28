# Pre-Launch Checklist

## ✅ Environment Setup
- [ ] Node.js 18+ installed (`node --version`)
- [ ] PostgreSQL installed and running
- [ ] `.env.local` file created
- [ ] All required environment variables set:
  - [ ] DATABASE_URL
  - [ ] PAYSTACK_SECRET_KEY & PAYSTACK_PUBLIC_KEY
  - [ ] NEXTAUTH_SECRET
  - [ ] NEXTAUTH_URL

## ✅ Database
- [ ] PostgreSQL database created
- [ ] `npx prisma migrate dev` run successfully
- [ ] `npm run db:seed` completed
- [ ] Sample data visible in `npx prisma studio`
- [ ] Tables created:
  - [ ] admin_users
  - [ ] categories
  - [ ] products
  - [ ] orders
  - [ ] order_items
  - [ ] reviews
  - [ ] carts
  - [ ] accounts
  - [ ] sessions
  - [ ] verification_tokens

## ✅ Application
- [ ] Dependencies installed: `npm install`
- [ ] Dev server starts: `npm run dev`
- [ ] No TypeScript errors in console
- [ ] Application runs without crashes

## ✅ Frontend Tests

### Home Page (http://localhost:3000)
- [ ] Page loads without errors
- [ ] KensMadeIt logo visible
- [ ] "Shop Now" button functional
- [ ] Navigation header visible
- [ ] Footer visible

### Shop Catalog (http://localhost:3000/shop)
- [ ] Products load in grid
- [ ] At least 6 products visible
- [ ] Categories show in sidebar
- [ ] Product images load
- [ ] "Add to Cart" buttons visible
- [ ] Search bar at top works
- [ ] Category filtering works
- [ ] Sorting dropdown works
- [ ] Pagination shows

### Product Detail (Click any product)
- [ ] Product page loads
- [ ] Image gallery with thumbnails
- [ ] Product details display:
  - [ ] Name
  - [ ] Description
  - [ ] Price
  - [ ] Compare price (strikethrough)
  - [ ] Stock status
  - [ ] SKU
  - [ ] Tags
- [ ] Reviews section visible
- [ ] Related products show (carousel or grid)
- [ ] "Add to Cart" button works
- [ ] Quantity selector works (+ and -)

### Shopping Cart (Click cart icon)
- [ ] Cart page loads
- [ ] Added items appear in cart
- [ ] Item images show
- [ ] Quantity adjusters work
- [ ] Remove buttons work
- [ ] Cart totals calculate correctly
- [ ] "Proceed to Checkout" button visible
- [ ] Cart persists after page refresh

### Checkout (Click Proceed to Checkout)
- [ ] Checkout page loads (Step 1: Shipping)
- [ ] Form fields visible:
  - [ ] Full Name
  - [ ] Email
  - [ ] Phone
  - [ ] Address
  - [ ] City
  - [ ] State
  - [ ] Country (Nigeria)
  - [ ] Postal Code
- [ ] Form validation (try empty submit)
- [ ] "Continue to Payment" button works
- [ ] Step 2 loads with payment review
- [ ] Order summary shows items
- [ ] "Back" button works
- [ ] "Pay with Paystack" button visible

### Payment (Use test card)
- [ ] Redirects to Paystack
- [ ] Test card: 4084 0842 7671 9399
- [ ] Enter any 3 digits for CVV
- [ ] Enter any future expiry date
- [ ] Accept or enter OTP if prompted
- [ ] Redirect back to payment-success page
- [ ] Order confirmation displays:
  - [ ] Order number (KM-xxxxx)
  - [ ] Customer name
  - [ ] Total amount
  - [ ] Delivery address
  - [ ] Confirmation message

### Cart Count Badge
- [ ] Add items to cart
- [ ] Header shows cart count
- [ ] Count updates in real-time
- [ ] Clears on successful checkout

## ✅ API Tests

### Test with Postman or cURL

```bash
# Test Products API
curl "http://localhost:3000/api/products"
curl "http://localhost:3000/api/products?page=1&limit=12"
curl "http://localhost:3000/api/products?category=handmade-shoes"

# Test Categories API
curl "http://localhost:3000/api/categories"

# Test Reviews API (after submitting review)
curl "http://localhost:3000/api/reviews?productId=<product-id>"
```

### Verify API Responses
- [ ] Products endpoint returns proper pagination
- [ ] Categories endpoint returns product count
- [ ] Reviews show approved reviews only
- [ ] No 500 errors in console

## ✅ Database Verification

### In Prisma Studio (`npx prisma studio`)
- [ ] Check **categories** table
  - [ ] 3 categories present
  - [ ] Names: Handmade Shoes, Handmade Slippers, Ready Made Shoes
  
- [ ] Check **products** table
  - [ ] 6 products present
  - [ ] All have images array
  - [ ] All have category relationships
  - [ ] Stock values set correctly
  
- [ ] Check **admin_users** table
  - [ ] Admin account exists
  - [ ] Email: admin@kensmadeit.com

- [ ] After checkout, verify **orders** table
  - [ ] New order created
  - [ ] orderNumber matches KM-xxxxx format
  - [ ] customerEmail matches checkout email
  - [ ] paymentStatus = "paid"
  - [ ] orderStatus = "processing"

- [ ] After checkout, verify **order_items** table
  - [ ] Items created for order
  - [ ] Quantities correct
  - [ ] Prices correct

## ✅ Browser DevTools

### Console
- [ ] No red errors (warnings okay)
- [ ] No 404 errors for images
- [ ] No API errors

### Network Tab
- [ ] API calls succeed (200 status)
- [ ] Images load (200 status)
- [ ] No failed requests

### LocalStorage
- [ ] Key: `kensmadeit-cart` exists
- [ ] Contains cart items after adding
- [ ] Persists after page reload

### Application (Storage)
- [ ] Check localStorage for cart data
- [ ] Verify data structure:
  ```json
  {
    "state": {
      "items": [...],
      "version": 1
    }
  }
  ```

## ✅ Build & Production Check

- [ ] Build completes: `npm run build`
- [ ] No TypeScript errors
- [ ] Production build size reasonable
- [ ] Start server: `npm run start`
- [ ] Production mode works

## ✅ Security Checks

- [ ] No sensitive data in client-side code
- [ ] API keys only in .env.local (server-side)
- [ ] Database URL not exposed
- [ ] Paystack webhook signature verified
- [ ] CORS properly configured (if needed)

## ✅ Responsive Design

Test on different screen sizes:
- [ ] Mobile (375px width)
  - [ ] Header responsive
  - [ ] Product grid stacks
  - [ ] Forms readable
  - [ ] Buttons clickable

- [ ] Tablet (768px width)
  - [ ] Layout adapts
  - [ ] Sidebar visible/works

- [ ] Desktop (1024px+ width)
  - [ ] Full layout visible
  - [ ] Sidebar displays

## ✅ Performance

- [ ] Initial load time < 3 seconds
- [ ] Images load smoothly
- [ ] No layout shifts (CLS)
- [ ] Interactions feel responsive

## 📋 Known Limitations (Not Yet Implemented)

- [ ] Admin dashboard not available yet
- [ ] Email notifications not configured
- [ ] User accounts/login not implemented
- [ ] Wishlist not available
- [ ] Product recommendations not available
- [ ] Payment refunds not automated
- [ ] SMS notifications not setup

## 🚀 When Ready for Deployment

- [ ] All tests above passed
- [ ] Switch to LIVE Paystack keys
- [ ] Set NEXTAUTH_SECRET to secure random value
- [ ] Point DATABASE_URL to production database
- [ ] Set NEXTAUTH_URL to production domain
- [ ] Run `npm run build` successfully
- [ ] Configure Paystack webhook URL to production
- [ ] Test full checkout with live payment
- [ ] Monitor error logs

## 📝 Notes

- Seed data includes both Naira pricing and sample products
- Test mode uses Paystack test keys (no real charges)
- Cart persists only in browser (no server-side persistence yet)
- Orders show "processing" status after payment (awaiting admin action)
- Product images come from public folder

---

## ❓ Quick Troubleshooting

**Build fails:**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**Database connection fails:**
```bash
# Check PostgreSQL is running
# Verify DATABASE_URL format: postgresql://user:pass@localhost:5432/dbname
# Test connection: psql your_database
```

**Paystack not working:**
- Verify API keys are correct
- Check you're using TEST keys in development
- Verify webhook URL is accessible

**Images not showing:**
- Check files exist in `/public` folder
- Verify paths in database match file names
- Check browser console for 404 errors

**Cart not persisting:**
- Check browser localStorage is enabled
- Check DevTools → Application → LocalStorage
- Key should be `kensmadeit-cart`

---

## ✨ Success Criteria

You know everything is working when:
1. ✅ Homepage loads with hero section
2. ✅ Shop shows 6 products with proper filtering
3. ✅ Can add items to cart
4. ✅ Cart persists after page refresh
5. ✅ Checkout form validates correctly
6. ✅ Paystack test payment completes
7. ✅ Order appears in database
8. ✅ Order confirmation page shows
9. ✅ Cart empties after successful checkout
10. ✅ No errors in console

---

**Date Created:** May 14, 2026
**Status:** Pre-Launch Ready
**Next Step:** Complete this checklist, then proceed with testing
