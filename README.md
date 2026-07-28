# 🛍️ Kensmadeit Ecommerce Platform

A modern, responsive ecommerce platform for handmade shoes built with Next.js 15, TypeScript, Tailwind CSS, and Paystack payment integration. Features guest checkout, real-time cart management, product reviews, and comprehensive admin capabilities.

![Status](https://img.shields.io/badge/Status-Sprint%201%20Complete-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### 🛒 Customer Features
- ✅ Browse products with advanced filtering and search
- ✅ View detailed product pages with image galleries
- ✅ Customer reviews and ratings system
- ✅ Add to cart with real-time updates
- ✅ Persistent shopping cart (localStorage-based)
- ✅ Guest checkout (no account required)
- ✅ Secure payment with Paystack
- ✅ Order confirmation and tracking
- ✅ Responsive design (mobile-first)

### 💳 Payment & Orders
- ✅ Paystack integration (debit/credit cards, bank transfers, USSD)
- ✅ Secure payment processing with webhook verification
- ✅ Automatic order creation on successful payment
- ✅ Stock management and automatic decrement
- ✅ Order confirmation emails (setup ready)
- ✅ Readable order numbers (KM-xxxxx format)

### 🗂️ Product Management
- ✅ Product catalog with categories
- ✅ Product images and galleries
- ✅ Price comparison (original vs sale price)
- ✅ Stock tracking and availability
- ✅ Product tags and organization
- ✅ Related products recommendations

### 👥 Customer Reviews
- ✅ Submit product reviews
- ✅ Star rating system (1-5 stars)
- ✅ Admin approval for reviews
- ✅ Display average ratings

### 📦 Cart & Checkout
- ✅ Add/remove items
- ✅ Adjust quantities
- ✅ Cart persistence
- ✅ Order summary
- ✅ Shipping information form
- ✅ Multiple payment methods

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd kensmadeit-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev --name init
   npm run db:seed
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Test admin at [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 📚 Documentation

- **[Quick Start Guide](./QUICKSTART.md)** - Setup and testing instructions
- **[Development Guide](./DEVELOPMENT.md)** - Detailed development notes
- **[Build Summary](./BUILD_SUMMARY.md)** - What's been built
- **[Pre-Launch Checklist](./CHECKLIST.md)** - Testing checklist
- **[Windsurfrules](./windsurfrules2)** - Development roadmap

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Library:** Shadcn/ui
- **Icons:** Lucide React
- **State Management:** Zustand
- **Form Validation:** Zod (setup ready)

### Backend
- **Runtime:** Node.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** NextAuth.js (beta)
- **File Uploads:** Uploadthing (setup ready)
- **Email:** Resend (setup ready)

### Payment
- **Provider:** Paystack
- **Security:** Webhook verification with HMAC-SHA512

---

## 📁 Project Structure

```
kensmadeit-ecommerce/
├── app/
│   ├── api/                    # API endpoints
│   │   ├── products/          # Product endpoints
│   │   ├── categories/        # Category endpoints
│   │   ├── orders/            # Order management
│   │   ├── payments/          # Payment integration
│   │   └── reviews/           # Review system
│   ├── (home)/                # Landing page
│   ├── (shop)/                # Shopping pages
│   │   ├── page.tsx           # Product catalog
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── payment-success/
│   │   ├── product/[slug]/
│   │   └── layout.tsx
│   ├── page.tsx               # Home
│   └── layout.tsx             # Root layout
├── components/
│   ├── ui/                    # Reusable UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ...
├── lib/
│   ├── store/
│   │   └── cartStore.ts       # Zustand store
│   ├── prisma.ts              # Database client
│   ├── resend.ts              # Email client
│   ├── types.ts               # TypeScript types
│   └── utils.ts
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Seed script
│   └── migrations/
└── public/                    # Static assets
```

---

## 🗄️ Database Schema

### Core Tables
- **admin_users** - Admin authentication and management
- **categories** - Product categories
- **products** - Product catalog
- **orders** - Customer orders (guest checkout)
- **order_items** - Order line items
- **reviews** - Product reviews
- **carts** - Session-based carts
- **accounts, sessions, verification_tokens** - NextAuth tables

---

## 🔌 API Endpoints

### Products
```
GET  /api/products              # List products (with filters)
GET  /api/products/[id]        # Get product details
```

### Categories
```
GET  /api/categories            # List all categories
GET  /api/categories/[slug]    # Get category with products
```

### Orders
```
POST /api/orders                # Create order
GET  /api/orders                # Get order by number & email
```

### Payments
```
POST /api/payments/initialize   # Initialize Paystack payment
POST /api/payments/verify       # Verify payment
POST /api/payments/webhook      # Paystack webhook
```

### Reviews
```
POST /api/reviews               # Submit review
GET  /api/reviews               # Get product reviews
```

---

## 🔐 Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/kensmadeit

# Authentication
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000

# Paystack
PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_SECRET_KEY=sk_test_...

# Email (Optional)
RESEND_API_KEY=...

# File Upload (Optional)
UPLOADTHING_SECRET=...
UPLOADTHING_APP_ID=...
```

---

## 🧪 Testing

### Test Credentials
- **Admin Email:** admin@kensmadeit.com
- **Admin Password:** admin123

### Paystack Test Card
- **Card Number:** 4084 0842 7671 9399
- **CVV:** Any 3 digits
- **Expiry:** Any future date

---

## 📊 Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run lint            # Run ESLint

# Database
npx prisma studio      # Open Prisma Studio
npx prisma migrate dev # Create and apply migrations
npm run db:seed        # Seed sample data

# Build
npm run build           # Build for production
npm run start           # Start production server
```

---

## 🎯 Current Status

### ✅ Sprint 1 - Complete
- [x] Product catalog with filtering
- [x] Product detail pages
- [x] Shopping cart
- [x] Guest checkout
- [x] Paystack integration
- [x] Order confirmation
- [x] Review system
- [x] Responsive design

### 📋 Sprint 2 - Planned
- [ ] Admin dashboard
- [ ] Order management
- [ ] Review approval
- [ ] Email notifications
- [ ] Analytics
- [ ] Inventory management

### 🚀 Future Enhancements
- [ ] User accounts and authentication
- [ ] Wishlist feature
- [ ] Product recommendations
- [ ] PWA support
- [ ] AI-powered search
- [ ] Additional payment methods
- [ ] Subscription/recurring orders

---

## 🤝 Contributing

This is a private project. For access or contributions, please contact the project owner.

---

## 📞 Support

### Documentation
- See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed development notes
- See [QUICKSTART.md](./QUICKSTART.md) for setup instructions
- See [CHECKLIST.md](./CHECKLIST.md) for pre-launch verification

### Troubleshooting
1. Check environment variables are set correctly
2. Ensure PostgreSQL is running
3. Run migrations: `npx prisma migrate dev`
4. Check database with: `npx prisma studio`

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👨‍💻 Development Team

**Project:** Kensmadeit Ecommerce Platform  
**Current Status:** Sprint 1 Complete (May 14, 2026)  
**Next Milestone:** Admin Dashboard Implementation

---

## 🎉 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI by [Shadcn/ui](https://ui.shadcn.com)
- Icons by [Lucide](https://lucide.dev)
- Payments by [Paystack](https://paystack.com)
- Database by [Prisma](https://prisma.io)

---

**Ready to launch! 🚀** See [QUICKSTART.md](./QUICKSTART.md) to get started.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
