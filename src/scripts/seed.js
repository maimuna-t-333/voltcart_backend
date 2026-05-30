require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product.model');

const products = [
  {
    name: 'Samsung Galaxy S24', slug: 'samsung-galaxy-s24', brand: 'Samsung', category: 'Smartphones',
    description: 'Latest Samsung flagship with 6.1 inch OLED display.',
    basePrice: 799, comparePrice: 899, status: 'active', isFeatured: true,
    specs: [{ key: 'Display', value: '6.1" OLED' }, { key: 'Battery', value: '4000mAh' }],
    variants: [{
      sku: 'SGS24-BLK-128', color: 'Black', storage: '128GB', price: 799, stock: 50,
      images: ['https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?w=600&h=600&fit=crop']
    }]
  },
  {
    name: 'Apple iPhone 15 Pro', slug: 'apple-iphone-15-pro', brand: 'Apple', category: 'Smartphones',
    description: 'Apple iPhone 15 Pro with A17 Pro chip, titanium design, and 48MP main camera.',
    basePrice: 999, comparePrice: 1099, status: 'active', isFeatured: true,
    specs: [{ key: 'Display', value: '6.1" Super Retina XDR' }, { key: 'Chip', value: 'A17 Pro' }, { key: 'Storage', value: '128GB' }],
    variants: [
      {
        sku: 'IP15P-NTT-128', color: 'Natural Titanium', storage: '128GB', price: 999, stock: 40,
        images: ['https://images.unsplash.com/photo-1720357632099-6d84cd7ee044?w=600&h=600&fit=crop']
      },
      {
        sku: 'IP15P-BLK-256', color: 'Black Titanium', storage: '256GB', price: 1099, stock: 25,
        images: ['https://images.unsplash.com/photo-1609692814858-f7cd2f0afa4f?w=600&h=600&fit=crop']
      }
    ]
  },
  {
    name: 'Sony WH-1000XM5', slug: 'sony-wh-1000xm5', brand: 'Sony', category: 'Headphones',
    description: 'Industry-leading noise cancelling headphones with 30-hour battery life and crystal clear hands-free calling.',
    basePrice: 349, comparePrice: 399, status: 'active', isFeatured: true,
    specs: [{ key: 'Battery', value: '30 hours' }, { key: 'Connectivity', value: 'Bluetooth 5.2' }, { key: 'Weight', value: '250g' }],
    variants: [
      {
        sku: 'SWH5-BLK', color: 'Black', storage: '', price: 349, stock: 60,
        images: ['https://images.unsplash.com/photo-1612858249816-5a91a9fb9886?w=600&h=600&fit=crop']
      },
      {
        sku: 'SWH5-SLV', color: 'Silver', storage: '', price: 349, stock: 35,
        images: ['https://images.unsplash.com/photo-1721300217761-e580569047f5?w=600&h=600&fit=crop']
      }
    ]
  },
  {
    name: 'Apple MacBook Air M2', slug: 'apple-macbook-air-m2', brand: 'Apple', category: 'Laptops',
    description: 'Supercharged by the next-generation M2 chip, MacBook Air is strikingly thin and fast.',
    basePrice: 1099, comparePrice: 1199, status: 'active', isFeatured: true,
    specs: [{ key: 'Chip', value: 'Apple M2' }, { key: 'RAM', value: '8GB' }, { key: 'Display', value: '13.6" Liquid Retina' }],
    variants: [
      {
        sku: 'MBA-M2-SLV-256', color: 'Silver', storage: '256GB', price: 1099, stock: 20,
        images: ['https://images.unsplash.com/photo-1651241680016-cc9e407e7dc3?w=600&h=600&fit=crop']
      },
      {
        sku: 'MBA-M2-MDN-512', color: 'Midnight', storage: '512GB', price: 1299, stock: 15,
        images: ['https://images.unsplash.com/photo-1609385688196-7625a7bfed34?w=600&h=600&fit=crop']
      }
    ]
  },
  {
    name: 'Samsung 65" QLED 4K TV', slug: 'samsung-65-qled-4k-tv', brand: 'Samsung', category: 'TVs',
    description: 'Quantum HDR, Neo Quantum Processor 4K, and Object Tracking Sound for an immersive experience.',
    basePrice: 1299, comparePrice: 1499, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '65" QLED 4K' }, { key: 'HDR', value: 'Quantum HDR 12x' }, { key: 'Refresh Rate', value: '120Hz' }],
    variants: [
      {
        sku: 'SAM-TV65-QLED', color: 'Black', storage: '', price: 1299, stock: 15,
        images: ['https://images.unsplash.com/photo-1730324443683-c636fe56bb50?w=600&h=600&fit=crop']
      }
    ]
  },
  {
    name: 'Logitech MX Master 3S', slug: 'logitech-mx-master-3s', brand: 'Logitech', category: 'Accessories',
    description: 'Advanced wireless mouse with ultra-fast MagSpeed scrolling, 8K DPI sensor, and ergonomic design.',
    basePrice: 99, comparePrice: 119, status: 'active', isFeatured: false,
    specs: [{ key: 'DPI', value: '200–8000' }, { key: 'Battery', value: '70 days' }, { key: 'Connectivity', value: 'Bluetooth & USB' }],
    variants: [
      {
        sku: 'LGT-MXM3S-GRY', color: 'Graphite', storage: '', price: 99, stock: 80,
        images: ['https://images.unsplash.com/photo-1586349906319-48d20e9d17e5?w=600&h=600&fit=crop']
      },
      {
        sku: 'LGT-MXM3S-WHT', color: 'Pale Grey', storage: '', price: 99, stock: 60,
        images: ['https://images.unsplash.com/photo-1632488507953-20bedb3b9602?w=600&h=600&fit=crop']
      }
    ]
  },
  {
    name: 'iPad Pro 12.9" M2', slug: 'ipad-pro-12-9-m2', brand: 'Apple', category: 'Tablets',
    description: 'The ultimate iPad experience with the M2 chip, Liquid Retina XDR display, and Apple Pencil hover.',
    basePrice: 1099, comparePrice: 1199, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '12.9" Liquid Retina XDR' }, { key: 'Chip', value: 'Apple M2' }, { key: 'Battery', value: '10 hours' }],
    variants: [
      {
        sku: 'IPP-M2-SLV-128', color: 'Silver', storage: '128GB', price: 1099, stock: 18,
        images: ['https://images.unsplash.com/photo-1666451907573-41a93d07864b?w=600&h=600&fit=crop']
      },
      {
        sku: 'IPP-M2-SPC-256', color: 'Space Grey', storage: '256GB', price: 1299, stock: 12,
        images: ['https://images.unsplash.com/photo-1662731340473-0a29611314b2?w=600&h=600&fit=crop']
      }
    ]
  },
  {
    name: 'Dell XPS 15', slug: 'dell-xps-15', brand: 'Dell', category: 'Laptops',
    description: 'Thin and powerful laptop with Intel Core i7, NVIDIA RTX 4060, and InfinityEdge OLED display.',
    basePrice: 1599, comparePrice: 1799, status: 'active', isFeatured: false,
    specs: [{ key: 'CPU', value: 'Intel Core i7-13700H' }, { key: 'GPU', value: 'NVIDIA RTX 4060' }, { key: 'Display', value: '15.6" OLED' }],
    variants: [
      {
        sku: 'DXPS15-SLV-512', color: 'Platinum Silver', storage: '512GB', price: 1599, stock: 10,
        images: ['https://images.unsplash.com/photo-1554246247-6993b606e8b9?w=600&h=600&fit=crop']
      },
      {
        sku: 'DXPS15-SLV-1TB', color: 'Platinum Silver', storage: '1TB', price: 1899, stock: 8,
        images: ['https://images.unsplash.com/photo-1724322535079-11b08f7f5c88?w=600&h=600&fit=crop']
      }
    ]
  },
  {
    name: 'Google Pixel 8 Pro', slug: 'google-pixel-8-pro', brand: 'Google', category: 'Smartphones',
    description: 'Google Pixel 8 Pro with Tensor G3 chip, 50MP triple camera, and 7 years of OS updates.',
    basePrice: 899, comparePrice: 999, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '6.7" LTPO OLED' }, { key: 'Chip', value: 'Google Tensor G3' }, { key: 'Battery', value: '5050mAh' }],
    variants: [
      {
        sku: 'GPX8P-OBS-128', color: 'Obsidian', storage: '128GB', price: 899, stock: 35,
        images: ['https://images.unsplash.com/photo-1724438192699-89f587b04c24?w=600&h=600&fit=crop']
      },
      {
        sku: 'GPX8P-PRC-256', color: 'Porcelain', storage: '256GB', price: 999, stock: 20,
        images: ['https://images.unsplash.com/photo-1654852360714-3899af1f5be7?w=600&h=600&fit=crop']
      }
    ]
  },
  {
    name: 'Samsung Galaxy Tab S9', slug: 'samsung-galaxy-tab-s9', brand: 'Samsung', category: 'Tablets',
    description: 'Premium Android tablet with Dynamic AMOLED 2X display, Snapdragon 8 Gen 2, and S Pen included.',
    basePrice: 699, comparePrice: 799, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '11" Dynamic AMOLED 2X' }, { key: 'Chip', value: 'Snapdragon 8 Gen 2' }, { key: 'Battery', value: '8400mAh' }],
    variants: [
      {
        sku: 'SGT-S9-GRY-128', color: 'Graphite', storage: '128GB', price: 699, stock: 25,
        images: ['https://images.unsplash.com/photo-1630970287099-25b6ab374cf9?w=600&h=600&fit=crop']
      },
      {
        sku: 'SGT-S9-BEG-256', color: 'Beige', storage: '256GB', price: 799, stock: 15,
        images: ['https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&h=600&fit=crop']
      }
    ]
  },
  {
    name: 'Apple AirPods Pro 2nd Gen', slug: 'apple-airpods-pro-2', brand: 'Apple', category: 'Headphones',
    description: 'Active Noise Cancellation, Transparency mode, Adaptive Audio. Now with USB-C.',
    basePrice: 249, comparePrice: 279, status: 'active', isFeatured: false,
    specs: [{ key: 'Battery', value: '30 hours total' }, { key: 'Connectivity', value: 'Bluetooth 5.3' }],
    variants: [
      {
        sku: 'APP2-WHT', color: 'White', storage: '', price: 249, stock: 45,
        images: ['https://images.unsplash.com/photo-1553545204-4f7d339aa06a?w=600&h=600&fit=crop']
      }
    ]
  },
  {
    name: 'Samsung Galaxy Watch 6', slug: 'samsung-galaxy-watch-6', brand: 'Samsung', category: 'Wearables',
    description: 'Advanced health monitoring with BioActive Sensor, sleep tracking, and GPS.',
    basePrice: 299, comparePrice: 349, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '1.4" Super AMOLED' }, { key: 'Battery', value: '40 hours' }],
    variants: [
      {
        sku: 'SGW6-BLK-44', color: 'Black', storage: '44mm', price: 299, stock: 30,
        images: ['https://images.unsplash.com/photo-1725137801173-1698d4cca0cd?w=600&h=600&fit=crop']
      },
      {
        sku: 'SGW6-SLV-40', color: 'Silver', storage: '40mm', price: 279, stock: 25,
        images: ['https://images.unsplash.com/photo-1612036781124-847f8939b154?w=600&h=600&fit=crop']
      }
    ]
  },
  {
    name: 'Nintendo Switch OLED', slug: 'nintendo-switch-oled', brand: 'Nintendo', category: 'Gaming',
    description: 'Play at home or on the go with a 7-inch OLED screen and enhanced audio.',
    basePrice: 349, comparePrice: 379, status: 'active', isFeatured: true,
    specs: [{ key: 'Display', value: '7" OLED' }, { key: 'Battery', value: '4.5-9 hours' }],
    variants: [
      {
        sku: 'NSW-OLED-WHT', color: 'White', storage: '', price: 349, stock: 20,
        images: ['https://images.unsplash.com/photo-1749264292585-858660898055?w=600&h=600&fit=crop']
      },
      {
        sku: 'NSW-OLED-NEO', color: 'Neon', storage: '', price: 349, stock: 18,
        images: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop']
      }
    ]
  },
  {
    name: 'Sony PlayStation 5', slug: 'sony-playstation-5', brand: 'Sony', category: 'Gaming',
    description: 'Experience lightning-fast loading with ultra-high speed SSD and 4K gaming.',
    basePrice: 499, comparePrice: 549, status: 'active', isFeatured: true,
    specs: [{ key: 'Storage', value: '825GB SSD' }, { key: 'Resolution', value: '4K 120fps' }],
    variants: [{
      sku: 'PS5-DISC', color: 'White', storage: '', price: 499, stock: 10,
      images: ['https://images.unsplash.com/photo-1617780421749-ebd0ef657b2e?w=600&h=600&fit=crop']
    }]
  },
  {
    name: 'Microsoft Surface Pro 9', slug: 'microsoft-surface-pro-9', brand: 'Microsoft', category: 'Laptops',
    description: '2-in-1 tablet and laptop with Intel Core i5, 13-inch touchscreen display.',
    basePrice: 999, comparePrice: 1099, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '13" PixelSense' }, { key: 'CPU', value: 'Intel Core i5' }],
    variants: [
      {
        sku: 'MSP9-GRY-256', color: 'Graphite', storage: '256GB', price: 999, stock: 12,
        images: ['https://images.unsplash.com/photo-1617780421544-c5575a324c47?w=600&h=600&fit=crop']
      },
      {
        sku: 'MSP9-PLT-512', color: 'Platinum', storage: '512GB', price: 1199, stock: 8,
        images: ['https://images.unsplash.com/photo-1657223143985-1e06ecb9c506?w=600&h=600&fit=crop']
      }
    ]
  },
  {
    name: 'Bose QuietComfort 45', slug: 'bose-quietcomfort-45', brand: 'Bose', category: 'Headphones',
    description: 'World-class noise cancellation with high-fidelity audio and 24-hour battery.',
    basePrice: 279, comparePrice: 329, status: 'active', isFeatured: false,
    specs: [{ key: 'Battery', value: '24 hours' }, { key: 'Connectivity', value: 'Bluetooth 5.1' }],
    variants: [
      {
        sku: 'BQC45-BLK', color: 'Black', storage: '', price: 279, stock: 35,
        images: ['https://images.unsplash.com/photo-1650160915212-54509f7ad12d?w=600&h=600&fit=crop']
      },
      {
        sku: 'BQC45-WHT', color: 'White', storage: '', price: 279, stock: 28,
        images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop']
      }
    ]
  },
  {
    name: 'Apple Watch Series 9', slug: 'apple-watch-series-9', brand: 'Apple', category: 'Wearables',
    description: 'Advanced health features with Double Tap gesture and Always-On Retina display.',
    basePrice: 399, comparePrice: 429, status: 'active', isFeatured: true,
    specs: [{ key: 'Display', value: '45mm Always-On' }, { key: 'Chip', value: 'Apple S9' }],
    variants: [
      {
        sku: 'AWS9-MID-45', color: 'Midnight', storage: '45mm', price: 399, stock: 22,
        images: ['https://images.unsplash.com/photo-1602174528367-7ed9fc0737e4?w=600&h=600&fit=crop']
      },
      {
        sku: 'AWS9-STL-41', color: 'Starlight', storage: '41mm', price: 379, stock: 20,
        images: ['https://images.unsplash.com/photo-1634571799202-619a5d4c086e?w=600&h=600&fit=crop']
      }
    ]
  },
  {
    name: 'LG 27" 4K Monitor', slug: 'lg-27-4k-monitor', brand: 'LG', category: 'Accessories',
    description: '27-inch UHD 4K IPS display with USB-C connectivity and HDR10 support.',
    basePrice: 449, comparePrice: 499, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '27" IPS 4K' }, { key: 'Refresh Rate', value: '60Hz' }],
    variants: [{
      sku: 'LG27-4K-BLK', color: 'Black', storage: '', price: 449, stock: 15,
      images: ['https://images.unsplash.com/photo-1603406136476-85d8c3ec76a5?w=600&h=600&fit=crop']
    }]
  },
  {
    name: 'Kindle Paperwhite', slug: 'kindle-paperwhite', brand: 'Amazon', category: 'Tablets',
    description: 'The thinnest, lightest Kindle with a 6.8" display and adjustable warm light.',
    basePrice: 139, comparePrice: 159, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '6.8" 300ppi' }, { key: 'Battery', value: '10 weeks' }],
    variants: [
      {
        sku: 'KPW-BLK-8', color: 'Black', storage: '8GB', price: 139, stock: 40,
        images: ['https://images.unsplash.com/photo-1738830257599-bd2c11131efd?w=600&h=600&fit=crop']
      },
      {
        sku: 'KPW-BLK-16', color: 'Black', storage: '16GB', price: 159, stock: 30,
        images: ['https://images.unsplash.com/photo-1738830257599-bd2c11131efd?w=600&h=600&fit=crop']
      }
    ]
  },
  {
    name: 'DJI Mini 4 Pro', slug: 'dji-mini-4-pro', brand: 'DJI', category: 'Accessories',
    description: 'Lightweight drone with 4K/60fps video, obstacle sensing, and 34-min flight time.',
    basePrice: 759, comparePrice: 799, status: 'active', isFeatured: true,
    specs: [{ key: 'Camera', value: '4K/60fps' }, { key: 'Flight Time', value: '34 minutes' }],
    variants: [{
      sku: 'DJI-M4P', color: 'Grey', storage: '', price: 759, stock: 8,
      images: ['https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=600&h=600&fit=crop']
    }]
  },
  {
    name: 'Apple MacBook Air M3', slug: 'apple-macbook-air-m3', brand: 'Apple', category: 'Laptops',
    description: 'MacBook Air with the powerful M3 chip — faster CPU and GPU, up to 18-hour battery life, and a stunning 13.6" Liquid Retina display.',
    basePrice: 1299, comparePrice: 1399, status: 'active', isFeatured: true,
    tags: ['apple', 'laptop', 'macbook', 'm3'],
    specs: [
      { key: 'Chip', value: 'Apple M3' },
      { key: 'RAM', value: '8GB Unified Memory' },
      { key: 'Display', value: '13.6" Liquid Retina' },
      { key: 'Battery', value: 'Up to 18 hours' },
      { key: 'Weight', value: '1.24 kg' },
    ],
    variants: [
      {
        sku: 'MBA-M3-MDN-256', color: 'Midnight', storage: '256GB SSD', price: 1299, stock: 25,
        images: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=600&fit=crop']
      },
      {
        sku: 'MBA-M3-SLV-512', color: 'Silver', storage: '512GB SSD', price: 1499, stock: 15,
        images: ['https://images.unsplash.com/photo-1550520920-27ba45c38740?w=600&h=600&fit=crop']
      },
      {
        sku: 'MBA-M3-STG-512', color: 'Starlight', storage: '512GB SSD', price: 1499, stock: 10,
        images: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=600&fit=crop']
      },
    ]
  },
  {
    name: 'Samsung Galaxy S24 Ultra', slug: 'samsung-galaxy-s24-ultra', brand: 'Samsung', category: 'Smartphones',
    description: 'The ultimate Galaxy with built-in S Pen, 200MP camera, and titanium frame.',
    basePrice: 1299, comparePrice: 1399, status: 'active', isFeatured: true,
    specs: [{ key: 'Display', value: '6.8" Dynamic AMOLED' }, { key: 'Camera', value: '200MP' }, { key: 'Battery', value: '5000mAh' }],
    variants: [
      { sku: 'SGS24U-BLK-256', color: 'Titanium Black', storage: '256GB', price: 1299, stock: 20, images: ['https://images.unsplash.com/photo-1610792516820-2bff50c652a2?w=600&h=600&fit=crop'] },
      { sku: 'SGS24U-GRY-512', color: 'Titanium Gray', storage: '512GB', price: 1499, stock: 15, images: ['https://images.unsplash.com/photo-1652352555142-42839464497e?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'Apple iPhone 15', slug: 'apple-iphone-15', brand: 'Apple', category: 'Smartphones',
    description: 'iPhone 15 with Dynamic Island, 48MP camera, and USB-C charging.',
    basePrice: 799, comparePrice: 899, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '6.1" Super Retina XDR' }, { key: 'Chip', value: 'A16 Bionic' }, { key: 'Battery', value: '3349mAh' }],
    variants: [
      { sku: 'IP15-PNK-128', color: 'Pink', storage: '128GB', price: 799, stock: 30, images: ['https://images.unsplash.com/photo-1574755454156-573f69b7b276?w=600&h=600&fit=crop'] },
      { sku: 'IP15-BLU-256', color: 'Blue', storage: '256GB', price: 899, stock: 25, images: ['https://images.unsplash.com/photo-1726828537956-61ae115d7d7a?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'OnePlus 12', slug: 'oneplus-12', brand: 'OnePlus', category: 'Smartphones',
    description: 'Flagship killer with Snapdragon 8 Gen 3, Hasselblad camera, and 100W fast charging.',
    basePrice: 799, comparePrice: 849, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '6.82" LTPO AMOLED' }, { key: 'Chip', value: 'Snapdragon 8 Gen 3' }, { key: 'Battery', value: '5400mAh' }],
    variants: [
      { sku: 'OP12-BLK-256', color: 'Silky Black', storage: '256GB', price: 799, stock: 25, images: ['https://images.unsplash.com/photo-1592121467900-c04150f4b735?w=600&h=600&fit=crop'] },
      { sku: 'OP12-GRN-256', color: 'Flowy Emerald', storage: '256GB', price: 799, stock: 20, images: ['https://images.unsplash.com/photo-1572579488439-e290b88591e3?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'Xiaomi 14 Pro', slug: 'xiaomi-14-pro', brand: 'Xiaomi', category: 'Smartphones',
    description: 'Leica-powered camera system, Snapdragon 8 Gen 3, and 120W HyperCharge.',
    basePrice: 899, comparePrice: 999, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '6.73" LTPO AMOLED' }, { key: 'Camera', value: '50MP Leica' }, { key: 'Battery', value: '4880mAh' }],
    variants: [
      { sku: 'XMI14P-BLK-256', color: 'Black', storage: '256GB', price: 899, stock: 18, images: ['https://images.unsplash.com/photo-1702451462735-3f0ba7679641?w=600&h=600&fit=crop'] },
      { sku: 'XMI14P-WHT-512', color: 'White', storage: '512GB', price: 999, stock: 12, images: ['https://images.unsplash.com/photo-1695733349397-c6048dc7051a?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'Sony Xperia 1 VI', slug: 'sony-xperia-1-vi', brand: 'Sony', category: 'Smartphones',
    description: 'Professional-grade smartphone with 4K HDR OLED display and Zeiss optics.',
    basePrice: 1299, comparePrice: 1399, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '6.5" 4K HDR OLED' }, { key: 'Camera', value: 'Zeiss 52MP' }, { key: 'Battery', value: '5000mAh' }],
    variants: [
      { sku: 'SXP1VI-BLK-256', color: 'Black', storage: '256GB', price: 1299, stock: 10, images: ['https://images.unsplash.com/photo-1695435478239-0828b8bfc8c1?w=600&h=600&fit=crop'] },
      { sku: 'SXP1VI-PLA-256', color: 'Platinum Silver', storage: '256GB', price: 1299, stock: 8, images: ['https://images.unsplash.com/photo-1565967249821-083c4775e5bc?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'Samsung Galaxy A55', slug: 'samsung-galaxy-a55', brand: 'Samsung', category: 'Smartphones',
    description: 'Mid-range powerhouse with 50MP OIS camera, IP67 water resistance, and 5000mAh battery.',
    basePrice: 449, comparePrice: 499, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '6.6" Super AMOLED' }, { key: 'Camera', value: '50MP OIS' }, { key: 'Battery', value: '5000mAh' }],
    variants: [
      { sku: 'SGA55-BLU-128', color: 'Awesome Iceblue', storage: '128GB', price: 449, stock: 40, images: ['https://images.unsplash.com/photo-1772182137994-4158ac33bddd?w=600&h=600&fit=crop'] },
      { sku: 'SGA55-LIL-256', color: 'Awesome Lilac', storage: '256GB', price: 499, stock: 30, images: ['https://images.unsplash.com/photo-1772182150308-7490b57d9e9c?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'Nothing Phone 2', slug: 'nothing-phone-2', brand: 'Nothing', category: 'Smartphones',
    description: 'Iconic Glyph Interface, Snapdragon 8+ Gen 1, and clean Android experience.',
    basePrice: 599, comparePrice: 649, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '6.7" LTPO OLED' }, { key: 'Chip', value: 'Snapdragon 8+ Gen 1' }, { key: 'Battery', value: '4700mAh' }],
    variants: [
      { sku: 'NTH2-WHT-256', color: 'White', storage: '256GB', price: 599, stock: 22, images: ['https://images.unsplash.com/photo-1661962399580-80301d32d791?w=600&h=600&fit=crop'] },
      { sku: 'NTH2-DRK-512', color: 'Black', storage: '512GB', price: 699, stock: 15, images: ['https://images.unsplash.com/photo-1658954382306-5c03f08a5de0?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'Motorola Edge 50 Pro', slug: 'motorola-edge-50-pro', brand: 'Motorola', category: 'Smartphones',
    description: 'Sleek smartphone with 50MP OIS camera, 125W TurboPower charging, and curved pOLED display.',
    basePrice: 599, comparePrice: 649, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '6.7" pOLED 144Hz' }, { key: 'Chip', value: 'Snapdragon 7 Gen 3' }, { key: 'Battery', value: '4500mAh' }],
    variants: [
      { sku: 'MOTE50P-BLK-256', color: 'Black Beauty', storage: '256GB', price: 599, stock: 20, images: ['https://images.unsplash.com/photo-1779006396329-849db434331e?w=600&h=600&fit=crop'] },
      { sku: 'MOTE50P-IVR-256', color: 'Ivory', storage: '256GB', price: 599, stock: 15, images: ['https://images.unsplash.com/photo-1779006396299-89ea468824b5?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'Oppo Find X7 Ultra', slug: 'oppo-find-x7-ultra', brand: 'Oppo', category: 'Smartphones',
    description: 'Dual periscope telephoto camera system with Snapdragon 8 Gen 3 and 100W SUPERVOOC charging.',
    basePrice: 1099, comparePrice: 1199, status: 'active', isFeatured: false,
    specs: [{ key: 'Display', value: '6.82" LTPO AMOLED' }, { key: 'Chip', value: 'Snapdragon 8 Gen 3' }, { key: 'Battery', value: '5000mAh' }],
    variants: [
      { sku: 'OPFX7U-BLK-256', color: 'Black', storage: '256GB', price: 1099, stock: 12, images: ['https://images.unsplash.com/photo-1779171204070-d0d45ec4b58a?w=600&h=600&fit=crop'] },
      { sku: 'OPFX7U-BRN-512', color: 'White', storage: '512GB', price: 1199, stock: 8, images: ['https://images.unsplash.com/photo-1778850757291-81e5a3f0e317?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'Apple MacBook Pro 14" M3', slug: 'apple-macbook-pro-14-m3', brand: 'Apple', category: 'Laptops',
    description: 'Pro performance with M3 chip, Liquid Retina XDR display, and all-day battery.',
    basePrice: 1999, comparePrice: 2199, status: 'active', isFeatured: true,
    specs: [{ key: 'Chip', value: 'Apple M3 Pro' }, { key: 'RAM', value: '18GB' }, { key: 'Display', value: '14.2" Liquid Retina XDR' }],
    variants: [
      { sku: 'MBP14-M3-SPC-512', color: 'Space Black', storage: '512GB SSD', price: 1999, stock: 12, images: ['https://images.unsplash.com/photo-1514826786317-59744fe2a548?w=600&h=600&fit=crop'] },
      { sku: 'MBP14-M3-SLV-1TB', color: 'Silver', storage: '1TB SSD', price: 2399, stock: 8, images: ['https://images.unsplash.com/photo-1651241680016-cc9e407e7dc3?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'ASUS ROG Zephyrus G14', slug: 'asus-rog-zephyrus-g14', brand: 'ASUS', category: 'Laptops',
    description: 'Compact gaming powerhouse with AMD Ryzen 9, RTX 4060, and 165Hz OLED display.',
    basePrice: 1499, comparePrice: 1699, status: 'active', isFeatured: false,
    specs: [{ key: 'CPU', value: 'AMD Ryzen 9 7940HS' }, { key: 'GPU', value: 'RTX 4060' }, { key: 'Display', value: '14" OLED 165Hz' }],
    variants: [
      { sku: 'ROG-G14-WHT-512', color: 'Moonlight Black', storage: '512GB', price: 1499, stock: 10, images: ['https://images.unsplash.com/photo-1633617216243-4b0629ae46b4?w=600&h=600&fit=crop'] },
      { sku: 'ROG-G14-ECL-1TB', color: 'Eclipse Gray', storage: '1TB', price: 1699, stock: 8, images: ['https://images.unsplash.com/photo-1636211990414-8edec17ba047?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon', slug: 'lenovo-thinkpad-x1-carbon', brand: 'Lenovo', category: 'Laptops',
    description: 'Ultra-lightweight business laptop with Intel Core i7, 14" IPS display, and military-grade durability.',
    basePrice: 1399, comparePrice: 1599, status: 'active', isFeatured: false,
    specs: [{ key: 'CPU', value: 'Intel Core i7-1365U' }, { key: 'RAM', value: '16GB' }, { key: 'Weight', value: '1.12 kg' }],
    variants: [
      { sku: 'TPX1C-BLK-512', color: 'Deep Black', storage: '512GB', price: 1399, stock: 12, images: ['https://plus.unsplash.com/premium_photo-1683736986779-987763ccc545?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'HP Spectre x360 14', slug: 'hp-spectre-x360-14', brand: 'HP', category: 'Laptops',
    description: '2-in-1 laptop with Intel Core i7, OLED touch display, and 360° hinge design.',
    basePrice: 1299, comparePrice: 1499, status: 'active', isFeatured: false,
    specs: [{ key: 'CPU', value: 'Intel Core i7-1355U' }, { key: 'Display', value: '14" OLED Touch' }, { key: 'Battery', value: '17 hours' }],
    variants: [
      { sku: 'HPSX360-NTB-512', color: 'Silver', storage: '512GB', price: 1299, stock: 10, images: ['https://images.unsplash.com/photo-1663354027456-ce6a7e07d212?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'Acer Swift 5', slug: 'acer-swift-5', brand: 'Acer', category: 'Laptops',
    description: 'Ultra-thin lightweight laptop with Intel Core i5, 14" IPS display, and all-day battery.',
    basePrice: 899, comparePrice: 999, status: 'active', isFeatured: false,
    specs: [{ key: 'CPU', value: 'Intel Core i5-1335U' }, { key: 'RAM', value: '16GB' }, { key: 'Weight', value: '0.99 kg' }],
    variants: [
      { sku: 'ACS5-GRN-512', color: 'Blue', storage: '512GB', price: 899, stock: 15, images: ['https://images.unsplash.com/photo-1572509018340-1fc13b5df491?w=600&h=600&fit=crop'] },
      { sku: 'ACS5-GLD-512', color: 'Gold', storage: '512GB', price: 899, stock: 12, images: ['https://images.unsplash.com/photo-1588620353253-206c5086e4fc?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'Samsung Galaxy Buds3 Pro', slug: 'samsung-galaxy-buds3-pro', brand: 'Samsung', category: 'Headphones',
    description: 'Premium earbuds with Intelligent ANC, 360 Audio, and blade-inspired design.',
    basePrice: 249, comparePrice: 279, status: 'active', isFeatured: false,
    specs: [{ key: 'Battery', value: '30 hours total' }, { key: 'Connectivity', value: 'Bluetooth 5.4' }, { key: 'ANC', value: 'Intelligent ANC' }],
    variants: [
      { sku: 'SGBB3P-SLV', color: 'Brown', storage: '', price: 249, stock: 30, images: ['https://images.unsplash.com/photo-1600374808258-9b6612195d42?w=600&h=600&fit=crop'] },
      { sku: 'SGBB3P-WHT', color: 'White', storage: '', price: 249, stock: 25, images: ['https://images.unsplash.com/photo-1705825859831-1fc8459c2d9c?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'Sennheiser Momentum 4', slug: 'sennheiser-momentum-4', brand: 'Sennheiser', category: 'Headphones',
    description: 'Audiophile-grade sound with 60-hour battery, adaptive ANC, and foldable design.',
    basePrice: 349, comparePrice: 399, status: 'active', isFeatured: false,
    specs: [{ key: 'Battery', value: '60 hours' }, { key: 'Connectivity', value: 'Bluetooth 5.2' }, { key: 'Driver', value: '42mm' }],
    variants: [
      { sku: 'SHM4-BLK', color: 'Black', storage: '', price: 349, stock: 20, images: ['https://images.unsplash.com/photo-1754142654796-cafbcb9f633b?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'Jabra Evolve2 85', slug: 'jabra-evolve2-85', brand: 'Jabra', category: 'Headphones',
    description: 'Professional wireless headset with best-in-class ANC and 37-hour battery.',
    basePrice: 449, comparePrice: 499, status: 'active', isFeatured: false,
    specs: [{ key: 'Battery', value: '37 hours' }, { key: 'Microphones', value: '10-mic ANC' }, { key: 'Connectivity', value: 'Bluetooth 5.0' }],
    variants: [
      { sku: 'JBE285-BLK', color: 'Black', storage: '', price: 449, stock: 15, images: ['https://images.unsplash.com/photo-1624978960894-bed9218acd39?w=600&h=600&fit=crop'] },
      { sku: 'JBE285-BEG', color: 'Brown', storage: '', price: 449, stock: 10, images: ['https://images.unsplash.com/photo-1606135185526-1bd767d76d65?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'Marshall Major V', slug: 'marshall-major-v', brand: 'Marshall', category: 'Headphones',
    description: 'Iconic on-ear headphones with 100-hour battery and classic Marshall design.',
    basePrice: 149, comparePrice: 179, status: 'active', isFeatured: false,
    specs: [{ key: 'Battery', value: '100 hours' }, { key: 'Connectivity', value: 'Bluetooth 5.2' }, { key: 'Weight', value: '166g' }],
    variants: [
      { sku: 'MMJV-BLK', color: 'Black & Brass', storage: '', price: 149, stock: 35, images: ['https://images.unsplash.com/photo-1602833703296-0b79f0b08b0e?w=600&h=600&fit=crop'] },
      { sku: 'MMJV-BRN', color: 'Brown', storage: '', price: 149, stock: 28, images: ['https://images.unsplash.com/photo-1745789888337-ffc89563f087?w=600&h=600&fit=crop'] }
    ]
  },
  {
    name: 'JBL Tune 770NC', slug: 'jbl-tune-770nc', brand: 'JBL', category: 'Headphones',
    description: 'Adaptive ANC headphones with JBL Pure Bass Sound and 70-hour battery life.',
    basePrice: 129, comparePrice: 149, status: 'active', isFeatured: false,
    specs: [{ key: 'Battery', value: '70 hours' }, { key: 'ANC', value: 'Adaptive ANC' }, { key: 'Connectivity', value: 'Bluetooth 5.3' }],
    variants: [
      { sku: 'JBLT770-BLK', color: 'Black', storage: '', price: 129, stock: 45, images: ['https://images.unsplash.com/photo-1552585140-bdeefd6b9d6a?w=600&h=600&fit=crop'] },
      { sku: 'JBLT770-BLU', color: 'Blue', storage: '', price: 129, stock: 35, images: ['https://images.unsplash.com/photo-1645537335717-67b4f48def4d?w=600&h=600&fit=crop'] }
    ]
  }
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('Seeded!');
  process.exit();
});