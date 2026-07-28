# Quick Start Guide - Kensmadeit Ecommerce

## 🚀 Setup Instructions

### Step 1: Environment Variables
Create `.env.local` file in the project root:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/kensmadeit_db"

# Authentication
NEXTAUTH_SECRET="your-random-secret-here-use-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Paystack (Get from: https://dashboard.paystack.com/settings/developer)
PAYSTACK_PUBLIC_KEY="pk_test_your_public_key"
PAYSTACK_SECRET_KEY="sk_test_your_secret_key"

# Email (Optional - Get from: https://resend.com)
RESEND_API_KEY="your_resend_api_key"

# File Uploads (Optional - Get from: https://uploadthing.com)
UPLOADTHING_SECRET=""
UPLOADTHING_APP_ID=""
```

### Step 2: Database Setup

```bash
# Install dependencies
npm install

# Create and apply migrations
npx prisma migrate dev --name init

# Seed sample data
npm run db:seed
```

### Step 3: Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

---

## 🧪 Testing the Platform

### Home Page
- Navigate to http://localhost:3000
- Should show KensMadeIt branding with "Shop Now" button

### Shop Catalog
- Click "Shop Now" or "Shop" in header → `/shop`
- See product grid with categories and filters
- Test:
  - [ ] Category filtering works
  - [ ] Search functionality (top bar)
  - [ ] Sorting by price, name, newest
  - [ ] Pagination between pages

### Product Details
- Click any product → `/shop/product/[slug]`
- Test:
  - [ ] Images load and thumbnails work
  - [ ] Price and stock info display correctly
  - [ ] Add to Cart button updates header cart count
  - [ ] Reviews section (can submit review)
  - [ ] Related products show

### Shopping Cart
- Click cart icon in header → `/shop/cart`
- Test:
  - [ ] Cart items display correctly
  - [ ] Quantity can be adjusted
  - [ ] Items can be removed
  - [ ] Total calculates correctly
  - [ ] "Proceed to Checkout" button works

### Checkout Flow
- Click "Proceed to Checkout" → `/shop/checkout`
- Test:
  - [ ] Shipping form validates (try submitting empty)
  - [ ] Step indicator shows progress
  - [ ] Can go back to edit shipping
  - [ ] Order summary shows in sidebar
  - [ ] "Pay with Paystack" initializes payment

### Paystack Payment
- Use test card: **4084 0842 7671 9399**
- CVV: any 3 digits
- Expiry: any future date
- Test:
  - [ ] Redirected to Paystack
  - [ ] Successfully pay or test failed scenarios
  - [ ] Redirected back to `/shop/payment-success`
  - [ ] Order confirmation shows

---

## 📊 Database & Admin

### View Database (Visual)
```bash
npx prisma studio
```
Opens http://localhost:5555 with visual database editor

### Test Admin Account
- Email: `admin@kensmadeit.com`
- Password: `admin123`

### Verify Data
After checkout, check:
1. Order created in `orders` table
2. OrderItems created with correct quantities
3. Payment reference stored
4. Product stock decremented

---

## 🔄 Key Features to Verify

### ✅ Cart Persistence
1. Add items to cart
2. Refresh page (Cmd+R or F5)
3. Items should still be in cart ✓

### ✅ Product Search
1. Type in search bar at top
2. Should filter products by name/description

### ✅ Category Filter
1. Click category in sidebar
2. Should show only products in that category

### ✅ Real-time Cart Count
1. Add/remove items
2. Badge in header should update instantly

### ✅ Price Comparison
- Products with comparePrice should show strikethrough old price

### ✅ Stock Management
- Out of stock products should have disabled "Add to Cart"

---

## 🛠️ Common Development Tasks

### Add a New Product (via Prisma Studio)
1. Open `npx prisma studio`
2. Go to "products" table
3. Click "+ Add" (or edit seed.ts and run `npm run db:seed`)
4. Refresh shop page to see new product

### Update Product Stock
1. Via Prisma Studio → products table → edit stock field
2. Or update via SQL query

### Approve Customer Review
1. Via Prisma Studio → reviews table
2. Find review with `isApproved = false`
3. Change to `isApproved = true`

### View All Orders
```bash
npx prisma studio
# Go to orders table to see all guest checkout orders
```

---

## 🐛 Troubleshooting

### Build Fails
```bash
rm -rf .next
npm run build
```

### Database Connection Error
```bash
# Check if PostgreSQL is running
# Verify DATABASE_URL format
# Try: postgresql://user:pass@localhost:5432/dbname
```

### Paystack Not Working
- Check API keys are correct
- Switch between test/live keys
- Verify webhook URL is accessible
- Check Paystack dashboard → Settings → Webhooks

### Cart Not Persisting
- Check browser localStorage (DevTools → Application → LocalStorage)
- Should see key: `kensmadeit-cart`

### Images Not Loading
- Check image paths in public folder
- Verify image URLs in database

---

## 📱 Mobile Testing

```bash
# Test on different screen sizes
# Use DevTools: Cmd+Shift+I (Mac) or F12 (Windows)
# Click mobile device icon in DevTools

# Or test on actual device
# Run: npm run dev
# Visit: http://your-machine-ip:3000
```

---

## 🚢 Deployment Preparation

Before deploying to production:

1. **Environment Variables**
   - Use LIVE Paystack keys (not test)
   - Set NEXTAUTH_SECRET to secure value
   - Set DATABASE_URL to production DB

2. **Database**
   - Backup production data
   - Run migrations: `npx prisma migrate deploy`

3. **Build**
   ```bash
   npm run build
   npm run start
   ```

4. **Webhook**
   - Update Paystack webhook URL to production domain
   - Test webhook with test transaction

---

## 📚 File Structure Quick Reference

```
Key Pages:
- /app/page.tsx → Homepage (Landing/Hero)
- /app/(shop)/page.tsx → Products Catalog
- /app/(shop)/product/[slug]/page.tsx → Product Details
- /app/(shop)/cart/page.tsx → Shopping Cart
- /app/(shop)/checkout/page.tsx → Checkout Form
- /app/(shop)/payment-success/page.tsx → Order Confirmation

Key APIs:
- /app/api/products/* → Product endpoints
- /app/api/orders/* → Order management
- /app/api/payments/* → Paystack integration
- /app/api/reviews/* → Review system

Key Files:
- lib/store/cartStore.ts → Cart state (Zustand)
- lib/prisma.ts → Database client
- prisma/schema.prisma → Database schema
```

---

## 💡 Next Development Focus

1. **Admin Dashboard** - Create /admin section
2. **Email Notifications** - Order confirmations, shipping updates
3. **Analytics** - Track sales, popular products
4. **Inventory Management** - Stock alerts, low stock warnings
5. **Testing** - E2E and unit tests
6. **Performance** - Image optimization, API caching

---

**Happy Coding! 🎉**

For detailed development notes, see [DEVELOPMENT.md](./DEVELOPMENT.md)
