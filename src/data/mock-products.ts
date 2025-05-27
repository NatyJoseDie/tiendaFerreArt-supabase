import type { Product } from '@/lib/types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'VisionPro Smartwatch',
    description: 'Stay connected and track your fitness with our flagship smartwatch.',
    longDescription:
      'The VisionPro Smartwatch is the ultimate companion for your active lifestyle. Featuring a vibrant AMOLED display, heart rate monitoring, GPS, and a long-lasting battery. Syncs with all major smartphones. Choose from a variety of stylish bands.',
    price: 299.99,
    currency: 'USD',
    category: 'Electronics',
    images: [
      'https://placehold.co/600x600.png?data-ai-hint=smartwatch modern',
      'https://placehold.co/600x600.png?data-ai-hint=smartwatch display',
      'https://placehold.co/600x600.png?data-ai-hint=smartwatch lifestyle',
    ],
    stock: 150,
    featured: true,
    brand: 'ShopVision',
    sku: 'SV-SW-001',
    tags: ['smartwatch', 'wearable', 'fitness', 'tech'],
    specifications: [
      { key: 'Display', value: '1.4" AMOLED' },
      { key: 'Battery Life', value: 'Up to 7 days' },
      { key: 'Water Resistance', value: '5ATM' },
      { key: 'Connectivity', value: 'Bluetooth 5.0, Wi-Fi, GPS' },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Alex P.',
        rating: 5,
        comment: 'Amazing smartwatch! The battery life is incredible.',
        date: '2024-07-15',
        avatarUrl: 'https://placehold.co/40x40.png?data-ai-hint=person avatar',
      },
      {
        id: 'r2',
        author: 'Jamie L.',
        rating: 4,
        comment: 'Great features, a bit pricey but worth it.',
        date: '2024-07-10',
        avatarUrl: 'https://placehold.co/40x40.png?data-ai-hint=user profile',
      },
    ],
  },
  {
    id: '2',
    name: 'Aura Wireless Headphones',
    description: 'Immersive sound quality with noise-cancelling technology.',
    longDescription:
      'Experience crystal-clear audio with Aura Wireless Headphones. Active noise cancellation, plush earcups for maximum comfort, and up to 30 hours of playtime. Perfect for music lovers and frequent travelers.',
    price: 199.50,
    currency: 'USD',
    category: 'Electronics',
    images: [
      'https://placehold.co/600x600.png?data-ai-hint=headphones wireless',
      'https://placehold.co/600x600.png?data-ai-hint=headphones design',
      'https://placehold.co/600x600.png?data-ai-hint=headphones audio',
    ],
    stock: 85,
    featured: true,
    brand: 'AuraSound',
    sku: 'AS-HP-002',
    tags: ['headphones', 'audio', 'wireless', 'noise-cancelling'],
    specifications: [
      { key: 'Driver Size', value: '40mm' },
      { key: 'Playtime', value: 'Up to 30 hours' },
      { key: 'Noise Cancellation', value: 'Active Noise Cancellation' },
      { key: 'Weight', value: '250g' },
    ],
    reviews: [
       {
        id: 'r3',
        author: 'Casey B.',
        rating: 5,
        comment: 'Best headphones I have ever owned. The noise cancellation is top-notch.',
        date: '2024-06-20',
        avatarUrl: 'https://placehold.co/40x40.png?data-ai-hint=person avatar',
      },
    ],
  },
  {
    id: '3',
    name: 'ErgoComfort Office Chair',
    description: 'Premium ergonomic chair for ultimate comfort and support.',
    longDescription:
      'Upgrade your workspace with the ErgoComfort Office Chair. Designed for long hours of sitting, it features adjustable lumbar support, breathable mesh back, and customizable armrests. Boost your productivity and well-being.',
    price: 349.00,
    currency: 'USD',
    category: 'Furniture',
    images: [
      'https://placehold.co/600x600.png?data-ai-hint=office chair',
      'https://placehold.co/600x600.png?data-ai-hint=ergonomic chair',
      'https://placehold.co/600x600.png?data-ai-hint=chair comfort',
    ],
    stock: 40,
    featured: false,
    brand: 'ComfortZone',
    sku: 'CZ-OC-003',
    tags: ['office', 'furniture', 'ergonomic', 'comfort'],
    specifications: [
      { key: 'Material', value: 'Breathable Mesh, High-density Foam' },
      { key: 'Max Weight', value: '300 lbs' },
      { key: 'Adjustments', value: 'Height, Lumbar, Armrests, Tilt' },
    ],
    reviews: [
       {
        id: 'r4',
        author: 'Morgan R.',
        rating: 4,
        comment: 'Very comfortable chair, helps with my back pain.',
        date: '2024-05-10',
        avatarUrl: 'https://placehold.co/40x40.png?data-ai-hint=customer photo',
      },
    ],
  },
  {
    id: '4',
    name: 'EcoBlend Coffee Maker',
    description: 'Brew delicious coffee sustainably with our EcoBlend maker.',
    longDescription: 'Start your day right with the EcoBlend Coffee Maker. Uses reusable filters and energy-saving technology. Brews up to 12 cups of rich, flavorful coffee. Sleek design that complements any kitchen.',
    price: 79.99,
    currency: 'USD',
    category: 'Appliances',
    images: [
      'https://placehold.co/600x600.png?data-ai-hint=coffee maker',
      'https://placehold.co/600x600.png?data-ai-hint=kitchen appliance',
      'https://placehold.co/600x600.png?data-ai-hint=coffee brewing',
    ],
    stock: 200,
    featured: true,
    brand: 'EcoHome',
    sku: 'EH-CM-004',
    tags: ['coffee', 'kitchen', 'appliance', 'eco-friendly'],
    specifications: [
      { key: 'Capacity', value: '12 Cups' },
      { key: 'Filter Type', value: 'Reusable Mesh Filter' },
      { key: 'Power', value: '900W' },
      { key: 'Material', value: 'Stainless Steel, BPA-free Plastic' },
    ],
     reviews: [
       {
        id: 'r5',
        author: 'Riley T.',
        rating: 5,
        comment: 'Love this coffee maker! Easy to use and clean.',
        date: '2024-07-01',
        avatarUrl: 'https://placehold.co/40x40.png?data-ai-hint=person smiling',
      },
      {
        id: 'r6',
        author: 'Devon S.',
        rating: 3,
        comment: 'It\'s okay, but the carafe feels a bit flimsy.',
        date: '2024-06-15',
        avatarUrl: 'https://placehold.co/40x40.png?data-ai-hint=avatar person',
      },
    ],
  },
   {
    id: '5',
    name: 'Nomad Adventure Backpack',
    description: 'Durable and spacious backpack for all your adventures.',
    longDescription: 'The Nomad Adventure Backpack is built to withstand the toughest conditions. Made from water-resistant materials, it offers ample storage with multiple compartments, a padded laptop sleeve, and comfortable shoulder straps. Ideal for hiking, travel, and daily commutes.',
    price: 120.00,
    currency: 'USD',
    category: 'Accessories',
    images: [
      'https://placehold.co/600x600.png?data-ai-hint=backpack adventure',
      'https://placehold.co/600x600.png?data-ai-hint=travel backpack',
      'https://placehold.co/600x600.png?data-ai-hint=durable backpack',
    ],
    stock: 75,
    featured: false,
    brand: 'OutdoorGear',
    sku: 'OG-BP-005',
    tags: ['backpack', 'travel', 'hiking', 'durable', 'accessories'],
    specifications: [
      { key: 'Material', value: 'Water-resistant Nylon' },
      { key: 'Capacity', value: '35 Liters' },
      { key: 'Laptop Sleeve', value: 'Fits up to 15.6" laptop' },
      { key: 'Dimensions', value: '20" x 12" x 8"' },
    ],
    reviews: [],
  },
];

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  return mockProducts.filter(product => product.featured);
};

export const getAllProducts = (): Product[] => {
  return mockProducts;
};

export const getCategories = (): string[] => {
  const categories = new Set(mockProducts.map(p => p.category));
  return Array.from(categories);
};
