/**
 * Seed script - creates admin and sample products.
 * Run: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const { connectDB } = require('../config/db');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern-shopping';

const sampleProducts = [
  {
    title: 'Classic White T-Shirt',
    description: 'Soft cotton tee — perfect for daily wear.',
    price: 19.99,
    images: ['https://picsum.photos/seed/tshirt/600/600'],
    category: 'clothing',
    countInStock: 120
  },
  {
    title: 'Blue Denim Jacket',
    description: 'Stylish denim jacket with comfortable fit.',
    price: 79.99,
    images: ['https://picsum.photos/seed/jacket/600/600'],
    category: 'clothing',
    countInStock: 40
  },
  {
    title: 'Running Sneakers',
    description: 'Lightweight sneakers for jogging and gym.',
    price: 99.99,
    images: ['https://picsum.photos/seed/sneakers/600/600'],
    category: 'shoes',
    countInStock: 60
  },
  {
    title: 'Slim Fit Jeans',
    description: 'Modern slim fit, stretch denim.',
    price: 59.99,
    images: ['https://picsum.photos/seed/jeans/600/600'],
    category: 'clothing',
    countInStock: 85
  },
  {
    title: 'Leather Wallet',
    description: 'Genuine leather wallet with multiple pockets.',
    price: 39.99,
    images: ['https://picsum.photos/seed/wallet/600/600'],
    category: 'accessories',
    countInStock: 200
  },
  {
    title: 'Wireless Headphones',
    description: 'Over-ear wireless headphones with noise cancellation.',
    price: 149.99,
    images: ['https://picsum.photos/seed/headphones/600/600'],
    category: 'electronics',
    countInStock: 30
  },
  {
    title: 'Minimalist Watch',
    description: 'Sleek watch for casual and formal looks.',
    price: 129.99,
    images: ['https://picsum.photos/seed/watch/600/600'],
    category: 'accessories',
    countInStock: 50
  },
  {
    title: 'Sport Socks (3-pack)',
    description: 'Breathable and comfortable sport socks.',
    price: 12.99,
    images: ['https://picsum.photos/seed/socks/600/600'],
    category: 'clothing',
    countInStock: 300
  },
  {
    title: 'Backpack 20L',
    description: 'Durable backpack with laptop compartment.',
    price: 69.99,
    images: ['https://picsum.photos/seed/backpack/600/600'],
    category: 'bags',
    countInStock: 75
  },
  {
    title: 'Sunglasses',
    description: 'UV protection sunglasses with modern frame.',
    price: 49.99,
    images: ['https://picsum.photos/seed/sunglasses/600/600'],
    category: 'accessories',
    countInStock: 150
  }
];

async function seed() {
  try {
    await connectDB(MONGO_URI);

    // wipe existing sample data (careful in real env)
    console.log('Clearing old data...');
    await User.deleteMany({});
    await Product.deleteMany({});

    console.log('Creating users...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'ChangeMe123!',
      isAdmin: true
    });

    const user = await User.create({
      name: 'Jane Customer',
      email: 'jane@example.com',
      password: 'password123'
    });

    console.log('Creating products...');
    const created = await Product.insertMany(sampleProducts);

    console.log('Seed complete.');
    console.log('Admin credentials: admin@example.com / ChangeMe123!');
    console.log('User credentials: jane@example.com / password123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
