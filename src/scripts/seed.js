require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('../models/Product.model');

const products = [
  {
    name: 'Samsung Galaxy S24', slug: 'samsung-galaxy-s24', brand: 'Samsung', category: 'Smartphones',
    description: 'Latest Samsung flagship with 6.1 inch OLED display.',
    basePrice: 799, comparePrice: 899, status: 'active', isFeatured: true,
    specs: [{ key: 'Display', value: '6.1" OLED' }, { key: 'Battery', value: '4000mAh' }],
    variants: [{ sku: 'SGS24-BLK-128', color: 'Black', storage: '128GB', price: 799, stock: 50,
      images: ['https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?w=600&h=600&fit=crop'] }]
  },
  {
    name: 'Apple iPhone 15 Pro', slug: 'apple-iphone-15-pro', brand: 'Apple', category: 'Smartphones',
    description: 'Apple iPhone 15 Pro with A17 Pro chip, titanium design, and 48MP main camera.',
    basePrice: 999, comparePrice: 1099, status: 'active', isFeatured: true,
    specs: [{ key: 'Display', value: '6.1" Super Retina XDR' }, { key: 'Chip', value: 'A17 Pro' }, { key: 'Storage', value: '128GB' }],
    variants: [
      { sku: 'IP15P-NTT-128', color: 'Natural Titanium', storage: '128GB', price: 999, stock: 40,
        images: ['https://images.unsplash.com/photo-1720357632099-6d84cd7ee044?w=600&h=600&fit=crop'] },
      { sku: 'IP15P-BLK-256', color: 'Black Titanium', storage: '256GB', price: 1099, stock: 25,
        images: ['https://images.unsplash.com/photo-1609692814858-f7cd2f0afa4f?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'Sony WH-1000XM5', slug: 'sony-wh-1000xm5', brand: 'Sony', category: 'Headphones',
    description: 'Industry-leading noise cancelling headphones with 30-hour battery life and crystal clear hands-free calling.',
    basePrice: 349, comparePrice: 399, status: 'active', isFeatured: true,
    specs: [{ key: 'Battery', value: '30 hours' }, { key: 'Connectivity', value: 'Bluetooth 5.2' }, { key: 'Weight', value: '250g' }],
    variants: [
      { sku: 'SWH5-BLK', color: 'Black', storage: '', price: 349, stock: 60,
        images: ['https://images.unsplash.com/photo-1612858249816-5a91a9fb9886?w=600&h=600&fit=crop'] },
      { sku: 'SWH5-SLV', color: 'Silver', storage: '', price: 349, stock: 35,
        images: ['https://images.unsplash.com/photo-1721300217761-e580569047f5?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'Apple MacBook Air M2', slug: 'apple-macbook-air-m2', brand: 'Apple', category: 'Laptops',
    description: 'Supercharged by the next-generation M2 chip, MacBook Air is strikingly thin and fast.',
    basePrice: 1099, comparePrice: 1199, status: 'active', isFeatured: true,
    specs: [{ key: 'Chip', value: 'Apple M2' }, { key: 'RAM', value: '8GB' }, { key: 'Display', value: '13.6" Liquid Retina' }],
    variants: [
      { sku: 'MBA-M2-SLV-256', color: 'Silver', storage: '256GB', price: 1099, stock: 20,
        images: ['https://images.unsplash.com/photo-1651241680016-cc9e407e7dc3?w=600&h=600&fit=crop'] },
      { sku: 'MBA-M2-MDN-512', color: 'Midnight', storage: '512GB', price: 1299, stock: 15,
        images: ['https://images.unsplash.com/photo-1609385688196-7625a7bfed34?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'Samsung 65" QLED 4K TV', slug: 'samsung-65-qled-4k-tv', brand: 'Samsung', category: 'TVs',
    description: 'Quantum HDR, Neo Quantum Processor 4K, and Object Tracking Sound for an immersive experience.',
    basePrice: 1299, comparePrice: 1499, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '65" QLED 4K' }, { key: 'HDR', value: 'Quantum HDR 12x' }, { key: 'Refresh Rate', value: '120Hz' }],
    variants: [
      { sku: 'SAM-TV65-QLED', color: 'Black', storage: '', price: 1299, stock: 15,
        images: ['https://images.unsplash.com/photo-1730324443683-c636fe56bb50?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'Logitech MX Master 3S', slug: 'logitech-mx-master-3s', brand: 'Logitech', category: 'Accessories',
    description: 'Advanced wireless mouse with ultra-fast MagSpeed scrolling, 8K DPI sensor, and ergonomic design.',
    basePrice: 99, comparePrice: 119, status: 'active', isFeatured: false,
    specs: [{ key: 'DPI', value: '200–8000' }, { key: 'Battery', value: '70 days' }, { key: 'Connectivity', value: 'Bluetooth & USB' }],
    variants: [
      { sku: 'LGT-MXM3S-GRY', color: 'Graphite', storage: '', price: 99, stock: 80,
        images: ['https://images.unsplash.com/photo-1586349906319-48d20e9d17e5?w=600&h=600&fit=crop'] },
      { sku: 'LGT-MXM3S-WHT', color: 'Pale Grey', storage: '', price: 99, stock: 60,
        images: ['https://images.unsplash.com/photo-1632488507953-20bedb3b9602?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'iPad Pro 12.9" M2', slug: 'ipad-pro-12-9-m2', brand: 'Apple', category: 'Tablets',
    description: 'The ultimate iPad experience with the M2 chip, Liquid Retina XDR display, and Apple Pencil hover.',
    basePrice: 1099, comparePrice: 1199, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '12.9" Liquid Retina XDR' }, { key: 'Chip', value: 'Apple M2' }, { key: 'Battery', value: '10 hours' }],
    variants: [
      { sku: 'IPP-M2-SLV-128', color: 'Silver', storage: '128GB', price: 1099, stock: 18,
        images: ['https://images.unsplash.com/photo-1666451907573-41a93d07864b?w=600&h=600&fit=crop'] },
      { sku: 'IPP-M2-SPC-256', color: 'Space Grey', storage: '256GB', price: 1299, stock: 12,
        images: ['https://images.unsplash.com/photo-1662731340473-0a29611314b2?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'Dell XPS 15', slug: 'dell-xps-15', brand: 'Dell', category: 'Laptops',
    description: 'Thin and powerful laptop with Intel Core i7, NVIDIA RTX 4060, and InfinityEdge OLED display.',
    basePrice: 1599, comparePrice: 1799, status: 'active', isFeatured: false,
    specs: [{ key: 'CPU', value: 'Intel Core i7-13700H' }, { key: 'GPU', value: 'NVIDIA RTX 4060' }, { key: 'Display', value: '15.6" OLED' }],
    variants: [
      { sku: 'DXPS15-SLV-512', color: 'Platinum Silver', storage: '512GB', price: 1599, stock: 10,
        images: ['https://images.unsplash.com/photo-1554246247-6993b606e8b9?w=600&h=600&fit=crop'] },
      { sku: 'DXPS15-SLV-1TB', color: 'Platinum Silver', storage: '1TB', price: 1899, stock: 8,
        images: ['https://images.unsplash.com/photo-1724322535079-11b08f7f5c88?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'Google Pixel 8 Pro', slug: 'google-pixel-8-pro', brand: 'Google', category: 'Smartphones',
    description: 'Google Pixel 8 Pro with Tensor G3 chip, 50MP triple camera, and 7 years of OS updates.',
    basePrice: 899, comparePrice: 999, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '6.7" LTPO OLED' }, { key: 'Chip', value: 'Google Tensor G3' }, { key: 'Battery', value: '5050mAh' }],
    variants: [
      { sku: 'GPX8P-OBS-128', color: 'Obsidian', storage: '128GB', price: 899, stock: 35,
        images: ['https://images.unsplash.com/photo-1724438192699-89f587b04c24?w=600&h=600&fit=crop'] },
      { sku: 'GPX8P-PRC-256', color: 'Porcelain', storage: '256GB', price: 999, stock: 20,
        images: ['https://images.unsplash.com/photo-1654852360714-3899af1f5be7?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'Samsung Galaxy Tab S9', slug: 'samsung-galaxy-tab-s9', brand: 'Samsung', category: 'Tablets',
    description: 'Premium Android tablet with Dynamic AMOLED 2X display, Snapdragon 8 Gen 2, and S Pen included.',
    basePrice: 699, comparePrice: 799, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '11" Dynamic AMOLED 2X' }, { key: 'Chip', value: 'Snapdragon 8 Gen 2' }, { key: 'Battery', value: '8400mAh' }],
    variants: [
      { sku: 'SGT-S9-GRY-128', color: 'Graphite', storage: '128GB', price: 699, stock: 25,
        images: ['https://images.unsplash.com/photo-1630970287099-25b6ab374cf9?w=600&h=600&fit=crop'] },
      { sku: 'SGT-S9-BEG-256', color: 'Beige', storage: '256GB', price: 799, stock: 15,
        images: ['https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'Apple AirPods Pro 2nd Gen', slug: 'apple-airpods-pro-2', brand: 'Apple', category: 'Headphones',
    description: 'Active Noise Cancellation, Transparency mode, Adaptive Audio. Now with USB-C.',
    basePrice: 249, comparePrice: 279, status: 'active', isFeatured: false,
    specs: [{ key: 'Battery', value: '30 hours total' }, { key: 'Connectivity', value: 'Bluetooth 5.3' }],
    variants: [{ sku: 'APP2-WHT', color: 'White', storage: '', price: 249, stock: 45,
      images: ['https://images.unsplash.com/photo-1553545204-4f7d339aa06a?w=600&h=600&fit=crop'] }]
  },
  {
    name: 'Samsung Galaxy Watch 6', slug: 'samsung-galaxy-watch-6', brand: 'Samsung', category: 'Wearables',
    description: 'Advanced health monitoring with BioActive Sensor, sleep tracking, and GPS.',
    basePrice: 299, comparePrice: 349, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '1.4" Super AMOLED' }, { key: 'Battery', value: '40 hours' }],
    variants: [
      { sku: 'SGW6-BLK-44', color: 'Black', storage: '44mm', price: 299, stock: 30,
        images: ['https://images.unsplash.com/photo-1725137801173-1698d4cca0cd?w=600&h=600&fit=crop'] },
      { sku: 'SGW6-SLV-40', color: 'Silver', storage: '40mm', price: 279, stock: 25,
        images: ['https://images.unsplash.com/photo-1612036781124-847f8939b154?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'Nintendo Switch OLED', slug: 'nintendo-switch-oled', brand: 'Nintendo', category: 'Gaming',
    description: 'Play at home or on the go with a 7-inch OLED screen and enhanced audio.',
    basePrice: 349, comparePrice: 379, status: 'active', isFeatured: true,
    specs: [{ key: 'Display', value: '7" OLED' }, { key: 'Battery', value: '4.5-9 hours' }],
    variants: [
      { sku: 'NSW-OLED-WHT', color: 'White', storage: '', price: 349, stock: 20,
        images: ['https://images.unsplash.com/photo-1749264292585-858660898055?w=600&h=600&fit=crop'] },
      { sku: 'NSW-OLED-NEO', color: 'Neon', storage: '', price: 349, stock: 18,
        images: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'Sony PlayStation 5', slug: 'sony-playstation-5', brand: 'Sony', category: 'Gaming',
    description: 'Experience lightning-fast loading with ultra-high speed SSD and 4K gaming.',
    basePrice: 499, comparePrice: 549, status: 'active', isFeatured: true,
    specs: [{ key: 'Storage', value: '825GB SSD' }, { key: 'Resolution', value: '4K 120fps' }],
    variants: [{ sku: 'PS5-DISC', color: 'White', storage: '', price: 499, stock: 10,
      images: ['https://images.unsplash.com/photo-1617780421749-ebd0ef657b2e?w=600&h=600&fit=crop'] }]
  },
  {
    name: 'Microsoft Surface Pro 9', slug: 'microsoft-surface-pro-9', brand: 'Microsoft', category: 'Laptops',
    description: '2-in-1 tablet and laptop with Intel Core i5, 13-inch touchscreen display.',
    basePrice: 999, comparePrice: 1099, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '13" PixelSense' }, { key: 'CPU', value: 'Intel Core i5' }],
    variants: [
      { sku: 'MSP9-GRY-256', color: 'Graphite', storage: '256GB', price: 999, stock: 12,
        images: ['https://images.unsplash.com/photo-1617780421544-c5575a324c47?w=600&h=600&fit=crop'] },
      { sku: 'MSP9-PLT-512', color: 'Platinum', storage: '512GB', price: 1199, stock: 8,
        images: ['https://images.unsplash.com/photo-1657223143985-1e06ecb9c506?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'Bose QuietComfort 45', slug: 'bose-quietcomfort-45', brand: 'Bose', category: 'Headphones',
    description: 'World-class noise cancellation with high-fidelity audio and 24-hour battery.',
    basePrice: 279, comparePrice: 329, status: 'active', isFeatured: false,
    specs: [{ key: 'Battery', value: '24 hours' }, { key: 'Connectivity', value: 'Bluetooth 5.1' }],
    variants: [
      { sku: 'BQC45-BLK', color: 'Black', storage: '', price: 279, stock: 35,
        images: ['https://images.unsplash.com/photo-1650160915212-54509f7ad12d?w=600&h=600&fit=crop'] },
      { sku: 'BQC45-WHT', color: 'White', storage: '', price: 279, stock: 28,
        images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'Apple Watch Series 9', slug: 'apple-watch-series-9', brand: 'Apple', category: 'Wearables',
    description: 'Advanced health features with Double Tap gesture and Always-On Retina display.',
    basePrice: 399, comparePrice: 429, status: 'active', isFeatured: true,
    specs: [{ key: 'Display', value: '45mm Always-On' }, { key: 'Chip', value: 'Apple S9' }],
    variants: [
      { sku: 'AWS9-MID-45', color: 'Midnight', storage: '45mm', price: 399, stock: 22,
        images: ['https://images.unsplash.com/photo-1602174528367-7ed9fc0737e4?w=600&h=600&fit=crop'] },
      { sku: 'AWS9-STL-41', color: 'Starlight', storage: '41mm', price: 379, stock: 20,
        images: ['https://images.unsplash.com/photo-1634571799202-619a5d4c086e?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'LG 27" 4K Monitor', slug: 'lg-27-4k-monitor', brand: 'LG', category: 'Accessories',
    description: '27-inch UHD 4K IPS display with USB-C connectivity and HDR10 support.',
    basePrice: 449, comparePrice: 499, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '27" IPS 4K' }, { key: 'Refresh Rate', value: '60Hz' }],
    variants: [{ sku: 'LG27-4K-BLK', color: 'Black', storage: '', price: 449, stock: 15,
      images: ['https://images.unsplash.com/photo-1603406136476-85d8c3ec76a5?w=600&h=600&fit=crop'] }]
  },
  {
    name: 'Kindle Paperwhite', slug: 'kindle-paperwhite', brand: 'Amazon', category: 'Tablets',
    description: 'The thinnest, lightest Kindle with a 6.8" display and adjustable warm light.',
    basePrice: 139, comparePrice: 159, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '6.8" 300ppi' }, { key: 'Battery', value: '10 weeks' }],
    variants: [
      { sku: 'KPW-BLK-8', color: 'Black', storage: '8GB', price: 139, stock: 40,
        images: ['https://images.unsplash.com/photo-1738830257599-bd2c11131efd?w=600&h=600&fit=crop'] },
      { sku: 'KPW-BLK-16', color: 'Black', storage: '16GB', price: 159, stock: 30,
        images: ['https://images.unsplash.com/photo-1738830257599-bd2c11131efd?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'DJI Mini 4 Pro', slug: 'dji-mini-4-pro', brand: 'DJI', category: 'Accessories',
    description: 'Lightweight drone with 4K/60fps video, obstacle sensing, and 34-min flight time.',
    basePrice: 759, comparePrice: 799, status: 'active', isFeatured: true,
    specs: [{ key: 'Camera', value: '4K/60fps' }, { key: 'Flight Time', value: '34 minutes' }],
    variants: [{ sku: 'DJI-M4P', color: 'Grey', storage: '', price: 759, stock: 8,
      images: ['https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=600&h=600&fit=crop'] }]
  },
  {
    name: 'Apple MacBook Air M3', slug: 'apple-macbook-air-m3', brand: 'Apple', category: 'Laptops',
    description: 'MacBook Air with the powerful M3 chip — faster CPU and GPU, up to 18-hour battery life, and a stunning 13.6" Liquid Retina display.',
    basePrice: 1299, comparePrice: 1399, status: 'active', isFeatured: true,
    tags: ['apple', 'laptop', 'macbook', 'm3'],
    specs: [
      { key: 'Chip',     value: 'Apple M3' },
      { key: 'RAM',      value: '8GB Unified Memory' },
      { key: 'Display',  value: '13.6" Liquid Retina' },
      { key: 'Battery',  value: 'Up to 18 hours' },
      { key: 'Weight',   value: '1.24 kg' },
    ],
    variants: [
      { sku: 'MBA-M3-MDN-256', color: 'Midnight', storage: '256GB SSD', price: 1299, stock: 25,
        images: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=600&fit=crop'] },
      { sku: 'MBA-M3-SLV-512', color: 'Silver', storage: '512GB SSD', price: 1499, stock: 15,
        images: ['https://images.unsplash.com/photo-1550520920-27ba45c38740?w=600&h=600&fit=crop'] },
      { sku: 'MBA-M3-STG-512', color: 'Starlight', storage: '512GB SSD', price: 1499, stock: 10,
        images: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=600&fit=crop'] },
    ]
  },
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('Seeded!');
  process.exit();
});
