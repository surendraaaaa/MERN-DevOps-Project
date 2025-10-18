const Order = require('../models/Order');
const Product = require('../models/Product');

// POST /api/orders
async function createOrder(req, res, next) {
  try {
    const {
      orderItems = [],
      shippingAddress = {},
      paymentMethod = 'mock',
      taxPrice = 0,
      shippingPrice = 0,
      totalPrice = 0
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    // decrease stock in simple manner
    for (const item of orderItems) {
      if (item.product) {
        const p = await Product.findById(item.product);
        if (p) {
          p.countInStock = Math.max(0, p.countInStock - item.qty);
          await p.save();
        }
      }
    }

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/:id
async function getOrderById(req, res, next) {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // allow owner or admin
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/myorders
async function getMyOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

// admin: GET /api/orders
async function getAllOrders(req, res, next) {
  try {
    const orders = await Order.find().populate('user', 'id name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

// PUT /api/orders/:id/pay
async function updateOrderToPaid(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id || 'mock',
      status: req.body.status || 'COMPLETED',
      update_time: req.body.update_time || new Date().toISOString(),
      email_address: req.body.email_address || ''
    };

    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
}

// PUT /api/orders/:id/deliver (admin)
async function updateOrderToDelivered(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderToPaid,
  updateOrderToDelivered
};
