require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('../models/Product.model');

const products = [
  { name: 'Samsung Galaxy S24', slug:'samsung-galaxy-s24', brand: 'Samsung', category: 'Smartphones',
    description: 'Latest Samsung flagship with 6.1 inch OLED display.',
    basePrice: 799, comparePrice: 899, status: 'active', isFeatured: true,
    specs: [{ key: 'Display', value: '6.1" OLED' }, { key: 'Battery', value: '4000mAh' }],
    variants: [{ sku: 'SGS24-BLK-128', color: 'Black', storage: '128GB', price: 799, stock: 50, images: [] }]
  },
  {
    name: 'Apple iPhone 15 Pro', slug: 'apple-iphone-15-pro', brand: 'Apple', category: 'Smartphones',
    description: 'Apple iPhone 15 Pro with A17 Pro chip, titanium design, and 48MP main camera.',
    basePrice: 999, comparePrice: 1099, status: 'active', isFeatured: true,
    specs: [{ key: 'Display', value: '6.1" Super Retina XDR' }, { key: 'Chip', value: 'A17 Pro' }, { key: 'Storage', value: '128GB' }],
    variants: [
      { sku: 'IP15P-NTT-128', color: 'Natural Titanium', storage: '128GB', price: 999, stock: 40, images: [] },
      { sku: 'IP15P-BLK-256', color: 'Black Titanium', storage: '256GB', price: 1099, stock: 25, images: [] }
    ]
  },
  {
    name: 'Sony WH-1000XM5', slug: 'sony-wh-1000xm5', brand: 'Sony', category: 'Headphones',
    description: 'Industry-leading noise cancelling headphones with 30-hour battery life and crystal clear hands-free calling.',
    basePrice: 349, comparePrice: 399, status: 'active', isFeatured: true,
    specs: [{ key: 'Battery', value: '30 hours' }, { key: 'Connectivity', value: 'Bluetooth 5.2' }, { key: 'Weight', value: '250g' }],
    variants: [
      { sku: 'SWH5-BLK', color: 'Black', storage: '', price: 349, stock: 60, images: [] },
      { sku: 'SWH5-SLV', color: 'Silver', storage: '', price: 349, stock: 35, images: [] }
    ]
  },
  {
    name: 'Apple MacBook Air M2', slug: 'apple-macbook-air-m2', brand: 'Apple', category: 'Laptops',
    description: 'Supercharged by the next-generation M2 chip, MacBook Air is strikingly thin and fast.',
    basePrice: 1099, comparePrice: 1199, status: 'active', isFeatured: true,
    specs: [{ key: 'Chip', value: 'Apple M2' }, { key: 'RAM', value: '8GB' }, { key: 'Display', value: '13.6" Liquid Retina' }],
    variants: [
      { sku: 'MBA-M2-SLV-256', color: 'Silver', storage: '256GB', price: 1099, stock: 20, images: [] },
      { sku: 'MBA-M2-MDN-512', color: 'Midnight', storage: '512GB', price: 1299, stock: 15, images: [] }
    ]
  },
  {
    name: 'Samsung 65" QLED 4K TV', slug: 'samsung-65-qled-4k-tv', brand: 'Samsung', category: 'TVs',
    description: 'Quantum HDR, Neo Quantum Processor 4K, and Object Tracking Sound for an immersive experience.',
    basePrice: 1299, comparePrice: 1499, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '65" QLED 4K' }, { key: 'HDR', value: 'Quantum HDR 12x' }, { key: 'Refresh Rate', value: '120Hz' }],
    variants: [
      { sku: 'SAM-TV65-QLED', color: 'Black', storage: '', price: 1299, stock: 15, images: [] }
    ]
  },
  {
    name: 'Logitech MX Master 3S', slug: 'logitech-mx-master-3s', brand: 'Logitech', category: 'Accessories',
    description: 'Advanced wireless mouse with ultra-fast MagSpeed scrolling, 8K DPI sensor, and ergonomic design.',
    basePrice: 99, comparePrice: 119, status: 'active', isFeatured: false,
    specs: [{ key: 'DPI', value: '200–8000' }, { key: 'Battery', value: '70 days' }, { key: 'Connectivity', value: 'Bluetooth & USB' }],
    variants: [
      { sku: 'LGT-MXM3S-GRY', color: 'Graphite', storage: '', price: 99, stock: 80, images: [] },
      { sku: 'LGT-MXM3S-WHT', color: 'Pale Grey', storage: '', price: 99, stock: 60, images: [] }
    ]
  },
  {
    name: 'iPad Pro 12.9" M2', slug: 'ipad-pro-12-9-m2', brand: 'Apple', category: 'Tablets',
    description: 'The ultimate iPad experience with the M2 chip, Liquid Retina XDR display, and Apple Pencil hover.',
    basePrice: 1099, comparePrice: 1199, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '12.9" Liquid Retina XDR' }, { key: 'Chip', value: 'Apple M2' }, { key: 'Battery', value: '10 hours' }],
    variants: [
      { sku: 'IPP-M2-SLV-128', color: 'Silver', storage: '128GB', price: 1099, stock: 18, images: [] },
      { sku: 'IPP-M2-SPC-256', color: 'Space Grey', storage: '256GB', price: 1299, stock: 12, images: [] }
    ]
  },
  {
    name: 'Dell XPS 15', slug: 'dell-xps-15', brand: 'Dell', category: 'Laptops',
    description: 'Thin and powerful laptop with Intel Core i7, NVIDIA RTX 4060, and InfinityEdge OLED display.',
    basePrice: 1599, comparePrice: 1799, status: 'active', isFeatured: false,
    specs: [{ key: 'CPU', value: 'Intel Core i7-13700H' }, { key: 'GPU', value: 'NVIDIA RTX 4060' }, { key: 'Display', value: '15.6" OLED' }],
    variants: [
      { sku: 'DXPS15-SLV-512', color: 'Platinum Silver', storage: '512GB', price: 1599, stock: 10, images: [] },
      { sku: 'DXPS15-SLV-1TB', color: 'Platinum Silver', storage: '1TB', price: 1899, stock: 8, images: [] }
    ]
  },
  {
    name: 'Google Pixel 8 Pro', slug: 'google-pixel-8-pro', brand: 'Google', category: 'Smartphones',
    description: 'Google Pixel 8 Pro with Tensor G3 chip, 50MP triple camera, and 7 years of OS updates.',
    basePrice: 899, comparePrice: 999, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '6.7" LTPO OLED' }, { key: 'Chip', value: 'Google Tensor G3' }, { key: 'Battery', value: '5050mAh' }],
    variants: [
      { sku: 'GPX8P-OBS-128', color: 'Obsidian', storage: '128GB', price: 899, stock: 35, images: [] },
      { sku: 'GPX8P-PRC-256', color: 'Porcelain', storage: '256GB', price: 999, stock: 20, images: [] }
    ]
  },
  {
    name: 'Samsung Galaxy Tab S9', slug: 'samsung-galaxy-tab-s9', brand: 'Samsung', category: 'Tablets',
    description: 'Premium Android tablet with Dynamic AMOLED 2X display, Snapdragon 8 Gen 2, and S Pen included.',
    basePrice: 699, comparePrice: 799, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '11" Dynamic AMOLED 2X' }, { key: 'Chip', value: 'Snapdragon 8 Gen 2' }, { key: 'Battery', value: '8400mAh' }],
    variants: [
      { sku: 'SGT-S9-GRY-128', color: 'Graphite', storage: '128GB', price: 699, stock: 25, images: [] },
      { sku: 'SGT-S9-BEG-256', color: 'Beige', storage: '256GB', price: 799, stock: 15, images: [] }
    ]
  },
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('Seeded!');
  process.exit();
});
