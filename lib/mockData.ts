import { Product } from './types';

export const products: Product[] = [
  {
    id: 'prod_1',
    name: 'Premium Leather Shoe',
    slug: 'premium-leather-shoe',
    description: 'High quality leather shoe',
    price: 299.99,
    comparePrice: null,
    sku: 'SKU001',
    stock: 20,
    images: ['/hero-shoe.png'],
    tags: ['shoes', 'leather'],
    isActive: true,
    categoryId: null,
  },
  {
    id: 'prod_2',
    name: 'Classic Oxford',
    slug: 'classic-oxford',
    description: 'Classic formal oxford shoe',
    price: 249.99,
    comparePrice: null,
    sku: 'SKU002',
    stock: 15,
    images: ['/hero-shoe.png'],
    tags: ['shoes', 'formal'],
    isActive: true,
    categoryId: null,
  },
];
