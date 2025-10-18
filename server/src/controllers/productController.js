const Product = require('../models/Product');

// GET /api/products?search=&page=1&limit=12
async function getProducts(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 12, 100);
    const search = req.query.search ? req.query.search.trim() : '';
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      products,
      page,
      pages: Math.ceil(count / limit),
      total: count
    });
  } catch (err) {
    next(err);
  }
}

async function getProductById(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

// Admin create (POST /api/products)
async function createProduct(req, res, next) {
  try {
    const { title, description, price, images = [], category = 'general', countInStock = 0 } = req.body;
    const product = new Product({ title, description, price, images, category, countInStock });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

// Admin update
async function updateProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const updates = req.body;
    Object.assign(product, updates);
    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
}

// Admin delete
async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.remove();
    res.json({ message: 'Product removed' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
