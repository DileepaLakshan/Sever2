import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js'; // Adjust the path based on your project structure

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json(user.cart);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, price, name } = req.body;

  const user = await User.findById(req.user._id);

  if (user) {
    const existingItem = user.cart.find((item) => item.productId.toString() === productId);

    if (existingItem) {
      // Update quantity if the item already exists
      existingItem.quantity += quantity;
    } else {
      // Add new item to the cart
      user.cart.push({ productId, quantity, price,name });
    }

    await user.save();
    res.status(201).json(user.cart);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  const user = await User.findById(req.user._id);

  if (user) {
    const item = user.cart.find((item) => item.productId.toString() === req.params.productId);

    if (item) {
      item.quantity = quantity;
      await user.save();
      res.json(user.cart);
    } else {
      res.status(404);
      throw new Error('Item not found in cart');
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeItemFromCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.cart = user.cart.filter((item) => item.productId.toString() !== req.params.productId);
    await user.save();
    res.json(user.cart);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.cart = [];
    await user.save();
    res.json(user.cart);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  addItemToCart, clearCart, getCart, removeItemFromCart, updateCartItem
};

