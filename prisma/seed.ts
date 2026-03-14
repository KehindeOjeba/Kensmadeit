import { config } from 'dotenv'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// Load environment variables
config({ path: '.env' })

const prisma = new PrismaClient()

async function main() {
  console.log('seed')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  const adminUser = await prisma.adminUser.upsert({
    where: { email: 'admin@kensmadeit.com' },
    update: {},
    create: {
      email: 'admin@kensmadeit.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
    },
  })

  console.log('created', adminUser.email)

  // Create categories
  const categories = [
    {
      name: 'Handmade Shoes',
      slug: 'handmade-shoes',
      description: 'Premium handmade shoes crafted with care and precision',
      image: '/images/kshoe1.jpeg',
    },
    {
      name: 'Handmade Slippers',
      slug: 'handmade-slippers',
      description: 'Comfortable handmade slippers for everyday wear',
      image: '/images/slippers1.jpeg',
    },
    {
      name: 'Ready Made Shoes',
      slug: 'ready-made-shoes',
      description: 'High-quality ready-made shoes for immediate delivery',
      image: '/images/shoe1.jpg',
    },
  ]

  const createdCategories = []
  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: {},
      create: categoryData,
    })
    createdCategories.push(category)
    console.log(`Category  ${category.name}`)
  }

  // Create products
  const products = [
    // Handmade Shoes
    {
      name: 'Classic Leather Handmade Shoes',
      slug: 'classic-leather-handmade-shoes',
      description: 'Elegant handmade leather shoes perfect for formal occasions',
      price: 150.00,
      comparePrice: 200.00,
      sku: 'HS-CL-001',
      stock: 10,
      images: ['/images/kshoe1.jpeg', '/images/kshoe2.jpeg'],
      tags: ['handmade', 'leather', 'formal', 'classic'],
      categoryId: createdCategories[0].id,
    },
    {
      name: 'Casual Canvas Handmade Shoes',
      slug: 'casual-canvas-handmade-shoes',
      description: 'Comfortable casual handmade shoes for everyday wear',
      price: 85.00,
      comparePrice: 110.00,
      sku: 'HS-CC-002',
      stock: 15,
      images: ['/images/kshoe3.jpeg', '/images/IMG_9160.jpg'],
      tags: ['handmade', 'canvas', 'casual', 'comfortable'],
      categoryId: createdCategories[0].id,
    },
    // Handmade Slippers
    {
      name: 'Premium Leather Slippers',
      slug: 'premium-leather-slippers',
      description: 'Luxurious handmade leather slippers for ultimate comfort',
      price: 65.00,
      comparePrice: 85.00,
      sku: 'HL-PL-003',
      stock: 20,
      images: ['/images/slippers1.jpeg', '/images/slippers2.jpeg'],
      tags: ['handmade', 'leather', 'slippers', 'premium'],
      categoryId: createdCategories[1].id,
    },
    {
      name: 'Comfort Fabric Slippers',
      slug: 'comfort-fabric-slippers',
      description: 'Soft and comfortable handmade fabric slippers',
      price: 45.00,
      comparePrice: 60.00,
      sku: 'HL-CF-004',
      stock: 25,
      images: ['/images/slippers3.jpeg', '/images/slippers4.jpeg'],
      tags: ['handmade', 'fabric', 'slippers', 'comfort'],
      categoryId: createdCategories[1].id,
    },
    // Ready Made Shoes
    {
      name: 'Sports Running Shoes',
      slug: 'sports-running-shoes',
      description: 'High-performance running shoes for athletes',
      price: 120.00,
      comparePrice: 150.00,
      sku: 'RS-SR-005',
      stock: 30,
      images: ['/images/shoe1.jpg', '/images/shoe2.jpg'],
      tags: ['sports', 'running', 'athletic', 'performance'],
      categoryId: createdCategories[2].id,
    },
    {
      name: 'Urban Street Shoes',
      slug: 'urban-street-shoes',
      description: 'Stylish street shoes perfect for urban lifestyle',
      price: 95.00,
      comparePrice: 125.00,
      sku: 'RS-US-006',
      stock: 18,
      images: ['/images/shoe3.jpg', '/images/IMG_7194.jpg'],
      tags: ['urban', 'street', 'casual', 'stylish'],
      categoryId: createdCategories[2].id,
    },
  ]

  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { sku: productData.sku },
      update: {},
      create: productData,
    })
    console.log(`created${product.name}`)
  }

  console.log('completed')
}

main()
  .catch((e) => {
    console.error('Error', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
