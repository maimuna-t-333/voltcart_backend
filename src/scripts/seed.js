require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('../models/Product.model');

const products = [
  { name: 'Samsung Galaxy S24', slug:'samsung-galaxy-s24', brand: 'Samsung', category: 'Smartphones',
    description: 'Latest Samsung flagship with 6.1 inch OLED display.',
    basePrice: 799, comparePrice: 899, status: 'active', isFeatured: true,
    specs: [{ key: 'Display', value: '6.1" OLED' }, { key: 'Battery', value: '4000mAh' }],
    variants: [{ sku: 'SGS24-BLK-128', color: 'Black', storage: '128GB', price: 799, stock: 50, images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600'] }]
  },
  {
    name: 'Apple iPhone 15 Pro', slug: 'apple-iphone-15-pro', brand: 'Apple', category: 'Smartphones',
    description: 'Apple iPhone 15 Pro with A17 Pro chip, titanium design, and 48MP main camera.',
    basePrice: 999, comparePrice: 1099, status: 'active', isFeatured: true,
    specs: [{ key: 'Display', value: '6.1" Super Retina XDR' }, { key: 'Chip', value: 'A17 Pro' }, { key: 'Storage', value: '128GB' }],
    variants: [
      { sku: 'IP15P-NTT-128', color: 'Natural Titanium', storage: '128GB', price: 999, stock: 40, images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600'] },
      { sku: 'IP15P-BLK-256', color: 'Black Titanium', storage: '256GB', price: 1099, stock: 25, images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600'] }
    ]
  },
  {
    name: 'Sony WH-1000XM5', slug: 'sony-wh-1000xm5', brand: 'Sony', category: 'Headphones',
    description: 'Industry-leading noise cancelling headphones with 30-hour battery life and crystal clear hands-free calling.',
    basePrice: 349, comparePrice: 399, status: 'active', isFeatured: true,
    specs: [{ key: 'Battery', value: '30 hours' }, { key: 'Connectivity', value: 'Bluetooth 5.2' }, { key: 'Weight', value: '250g' }],
    variants: [
      { sku: 'SWH5-BLK', color: 'Black', storage: '', price: 349, stock: 60, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'] },
      { sku: 'SWH5-SLV', color: 'Silver', storage: '', price: 349, stock: 35, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'] }
    ]
  },
  {
    name: 'Apple MacBook Air M2', slug: 'apple-macbook-air-m2', brand: 'Apple', category: 'Laptops',
    description: 'Supercharged by the next-generation M2 chip, MacBook Air is strikingly thin and fast.',
    basePrice: 1099, comparePrice: 1199, status: 'active', isFeatured: true,
    specs: [{ key: 'Chip', value: 'Apple M2' }, { key: 'RAM', value: '8GB' }, { key: 'Display', value: '13.6" Liquid Retina' }],
    variants: [
      { sku: 'MBA-M2-SLV-256', color: 'Silver', storage: '256GB', price: 1099, stock: 20, images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600'] },
      { sku: 'MBA-M2-MDN-512', color: 'Midnight', storage: '512GB', price: 1299, stock: 15, images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600'] }
    ]
  },
  {
    name: 'Samsung 65" QLED 4K TV', slug: 'samsung-65-qled-4k-tv', brand: 'Samsung', category: 'TVs',
    description: 'Quantum HDR, Neo Quantum Processor 4K, and Object Tracking Sound for an immersive experience.',
    basePrice: 1299, comparePrice: 1499, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '65" QLED 4K' }, { key: 'HDR', value: 'Quantum HDR 12x' }, { key: 'Refresh Rate', value: '120Hz' }],
    variants: [
      { sku: 'SAM-TV65-QLED', color: 'Black', storage: '', price: 1299, stock: 15, images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600'] }
    ]
  },
  {
    name: 'Logitech MX Master 3S', slug: 'logitech-mx-master-3s', brand: 'Logitech', category: 'Accessories',
    description: 'Advanced wireless mouse with ultra-fast MagSpeed scrolling, 8K DPI sensor, and ergonomic design.',
    basePrice: 99, comparePrice: 119, status: 'active', isFeatured: false,
    specs: [{ key: 'DPI', value: '200–8000' }, { key: 'Battery', value: '70 days' }, { key: 'Connectivity', value: 'Bluetooth & USB' }],
    variants: [
      { sku: 'LGT-MXM3S-GRY', color: 'Graphite', storage: '', price: 99, stock: 80, images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600'] },
      { sku: 'LGT-MXM3S-WHT', color: 'Pale Grey', storage: '', price: 99, stock: 60, images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600'] }
    ]
  },
  {
    name: 'iPad Pro 12.9" M2', slug: 'ipad-pro-12-9-m2', brand: 'Apple', category: 'Tablets',
    description: 'The ultimate iPad experience with the M2 chip, Liquid Retina XDR display, and Apple Pencil hover.',
    basePrice: 1099, comparePrice: 1199, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '12.9" Liquid Retina XDR' }, { key: 'Chip', value: 'Apple M2' }, { key: 'Battery', value: '10 hours' }],
    variants: [
      { sku: 'IPP-M2-SLV-128', color: 'Silver', storage: '128GB', price: 1099, stock: 18, images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600'] },
      { sku: 'IPP-M2-SPC-256', color: 'Space Grey', storage: '256GB', price: 1299, stock: 12, images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600'] }
    ]
  },
  {
    name: 'Dell XPS 15', slug: 'dell-xps-15', brand: 'Dell', category: 'Laptops',
    description: 'Thin and powerful laptop with Intel Core i7, NVIDIA RTX 4060, and InfinityEdge OLED display.',
    basePrice: 1599, comparePrice: 1799, status: 'active', isFeatured: false,
    specs: [{ key: 'CPU', value: 'Intel Core i7-13700H' }, { key: 'GPU', value: 'NVIDIA RTX 4060' }, { key: 'Display', value: '15.6" OLED' }],
    variants: [
      { sku: 'DXPS15-SLV-512', color: 'Platinum Silver', storage: '512GB', price: 1599, stock: 10, images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600'] },
      { sku: 'DXPS15-SLV-1TB', color: 'Platinum Silver', storage: '1TB', price: 1899, stock: 8, images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600'] }
    ]
  },
  {
    name: 'Google Pixel 8 Pro', slug: 'google-pixel-8-pro', brand: 'Google', category: 'Smartphones',
    description: 'Google Pixel 8 Pro with Tensor G3 chip, 50MP triple camera, and 7 years of OS updates.',
    basePrice: 899, comparePrice: 999, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '6.7" LTPO OLED' }, { key: 'Chip', value: 'Google Tensor G3' }, { key: 'Battery', value: '5050mAh' }],
    variants: [
      { sku: 'GPX8P-OBS-128', color: 'Obsidian', storage: '128GB', price: 899, stock: 35, images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600'] },
      { sku: 'GPX8P-PRC-256', color: 'Porcelain', storage: '256GB', price: 999, stock: 20, images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600'] }
    ]
  },
  {
    name: 'Samsung Galaxy Tab S9', slug: 'samsung-galaxy-tab-s9', brand: 'Samsung', category: 'Tablets',
    description: 'Premium Android tablet with Dynamic AMOLED 2X display, Snapdragon 8 Gen 2, and S Pen included.',
    basePrice: 699, comparePrice: 799, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '11" Dynamic AMOLED 2X' }, { key: 'Chip', value: 'Snapdragon 8 Gen 2' }, { key: 'Battery', value: '8400mAh' }],
    variants: [
      { sku: 'SGT-S9-GRY-128', color: 'Graphite', storage: '128GB', price: 699, stock: 25, images: ['https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600'] },
      { sku: 'SGT-S9-BEG-256', color: 'Beige', storage: '256GB', price: 799, stock: 15, images: ['https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600'] }
    ]
  },{
  name: 'Apple AirPods Pro 2nd Gen', slug: 'apple-airpods-pro-2', brand: 'Apple', category: 'Headphones',
  description: 'Active Noise Cancellation, Transparency mode, Adaptive Audio. Now with USB-C.',
  basePrice: 249, comparePrice: 279, status: 'active', isFeatured: false,
  specs: [{ key: 'Battery', value: '30 hours total' }, { key: 'Connectivity', value: 'Bluetooth 5.3' }],
  variants: [{ sku: 'APP2-WHT', color: 'White', storage: '', price: 249, stock: 45,
    images: ['https://images.unsplash.com/photo-1588423771073-b8903fead714?w=600'] }]
},
{
  name: 'Samsung Galaxy Watch 6', slug: 'samsung-galaxy-watch-6', brand: 'Samsung', category: 'Wearables',
  description: 'Advanced health monitoring with BioActive Sensor, sleep tracking, and GPS.',
  basePrice: 299, comparePrice: 349, status: 'active', isFeatured: false,
  specs: [{ key: 'Display', value: '1.4" Super AMOLED' }, { key: 'Battery', value: '40 hours' }],
  variants: [
    { sku: 'SGW6-BLK-44', color: 'Black', storage: '44mm', price: 299, stock: 30,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'] },
    { sku: 'SGW6-SLV-40', color: 'Silver', storage: '40mm', price: 279, stock: 25,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'] }
  ]
},
{
  name: 'Nintendo Switch OLED', slug: 'nintendo-switch-oled', brand: 'Nintendo', category: 'Gaming',
  description: 'Play at home or on the go with a 7-inch OLED screen and enhanced audio.',
  basePrice: 349, comparePrice: 379, status: 'active', isFeatured: true,
  specs: [{ key: 'Display', value: '7" OLED' }, { key: 'Battery', value: '4.5-9 hours' }],
  variants: [
    { sku: 'NSW-OLED-WHT', color: 'White', storage: '', price: 349, stock: 20,
      images: ['https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600'] },
    { sku: 'NSW-OLED-NEO', color: 'Neon', storage: '', price: 349, stock: 18,
      images: ['https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600'] }
  ]
},
{
  name: 'Sony PlayStation 5', slug: 'sony-playstation-5', brand: 'Sony', category: 'Gaming',
  description: 'Experience lightning-fast loading with ultra-high speed SSD and 4K gaming.',
  basePrice: 499, comparePrice: 549, status: 'active', isFeatured: true,
  specs: [{ key: 'Storage', value: '825GB SSD' }, { key: 'Resolution', value: '4K 120fps' }],
  variants: [{ sku: 'PS5-DISC', color: 'White', storage: '', price: 499, stock: 10,
    images: ['https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600'] }]
},
{
  name: 'Microsoft Surface Pro 9', slug: 'microsoft-surface-pro-9', brand: 'Microsoft', category: 'Laptops',
  description: '2-in-1 tablet and laptop with Intel Core i5, 13-inch touchscreen display.',
  basePrice: 999, comparePrice: 1099, status: 'active', isFeatured: false,
  specs: [{ key: 'Display', value: '13" PixelSense' }, { key: 'CPU', value: 'Intel Core i5' }],
  variants: [
    { sku: 'MSP9-GRY-256', color: 'Graphite', storage: '256GB', price: 999, stock: 12,
      images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600'] },
    { sku: 'MSP9-PLT-512', color: 'Platinum', storage: '512GB', price: 1199, stock: 8,
      images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600'] }
  ]
},
{
  name: 'Bose QuietComfort 45', slug: 'bose-quietcomfort-45', brand: 'Bose', category: 'Headphones',
  description: 'World-class noise cancellation with high-fidelity audio and 24-hour battery.',
  basePrice: 279, comparePrice: 329, status: 'active', isFeatured: false,
  specs: [{ key: 'Battery', value: '24 hours' }, { key: 'Connectivity', value: 'Bluetooth 5.1' }],
  variants: [
    { sku: 'BQC45-BLK', color: 'Black', storage: '', price: 279, stock: 35,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'] },
    { sku: 'BQC45-WHT', color: 'White', storage: '', price: 279, stock: 28,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'] }
  ]
},
{
  name: 'Apple Watch Series 9', slug: 'apple-watch-series-9', brand: 'Apple', category: 'Wearables',
  description: 'Advanced health features with Double Tap gesture and Always-On Retina display.',
  basePrice: 399, comparePrice: 429, status: 'active', isFeatured: true,
  specs: [{ key: 'Display', value: '45mm Always-On' }, { key: 'Chip', value: 'Apple S9' }],
  variants: [
    { sku: 'AWS9-MID-45', color: 'Midnight', storage: '45mm', price: 399, stock: 22,
      images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600'] },
    { sku: 'AWS9-STL-41', color: 'Starlight', storage: '41mm', price: 379, stock: 20,
      images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600'] }
  ]
},
{
  name: 'LG 27" 4K Monitor', slug: 'lg-27-4k-monitor', brand: 'LG', category: 'Accessories',
  description: '27-inch UHD 4K IPS display with USB-C connectivity and HDR10 support.',
  basePrice: 449, comparePrice: 499, status: 'active', isFeatured: false,
  specs: [{ key: 'Display', value: '27" IPS 4K' }, { key: 'Refresh Rate', value: '60Hz' }],
  variants: [{ sku: 'LG27-4K-BLK', color: 'Black', storage: '', price: 449, stock: 15,
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600'] }]
},
{
  name: 'Kindle Paperwhite', slug: 'kindle-paperwhite', brand: 'Amazon', category: 'Tablets',
  description: 'The thinnest, lightest Kindle with a 6.8" display and adjustable warm light.',
  basePrice: 139, comparePrice: 159, status: 'active', isFeatured: false,
  specs: [{ key: 'Display', value: '6.8" 300ppi' }, { key: 'Battery', value: '10 weeks' }],
  variants: [
    { sku: 'KPW-BLK-8', color: 'Black', storage: '8GB', price: 139, stock: 40,
      images: ['https://images.unsplash.com/photo-1592434134753-a70baf7979d5?w=600'] },
    { sku: 'KPW-BLK-16', color: 'Black', storage: '16GB', price: 159, stock: 30,
      images: ['https://images.unsplash.com/photo-1592434134753-a70baf7979d5?w=600'] }
  ]
},
{
  name: 'DJI Mini 4 Pro', slug: 'dji-mini-4-pro', brand: 'DJI', category: 'Accessories',
  description: 'Lightweight drone with 4K/60fps video, obstacle sensing, and 34-min flight time.',
  basePrice: 759, comparePrice: 799, status: 'active', isFeatured: true,
  specs: [{ key: 'Camera', value: '4K/60fps' }, { key: 'Flight Time', value: '34 minutes' }],
  variants: [{ sku: 'DJI-M4P', color: 'Grey', storage: '', price: 759, stock: 8,
    images: ['https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600'] }]
},

];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('Seeded!');
  process.exit();
});
