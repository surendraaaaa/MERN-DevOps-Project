const jwt = require('jsonwebtoken');
const User = require('../models/User');

function generateToken(user) {
  return jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET || 'change_me_please', {
    expiresIn: process.env.JWT_EXPIRES || '7d'
  });
}

// POST /api/auth/register
async function registerUser(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Please provide all fields' });
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user)
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function authUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user)
      });
    }
    res.status(401).json({ message: 'Invalid email or password' });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/profile
async function getProfile(req, res, next) {
  try {
    if (!req.user) return res.status(404).json({ message: 'User not found' });
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.isAdmin
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { registerUser, authUser, getProfile };
