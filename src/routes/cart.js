const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const { isAuthenticated } = require('../middleware/auth');

// Get cart
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId)
            .populate('cart.product');
        res.json(user.cart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
});

// Add to cart
router.post('/add', isAuthenticated, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        
        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if product is in stock
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        const user = await User.findById(req.session.userId);
        
        // Check if product is already in cart
        const existingItem = user.cart.find(item => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.cart.push({ product: productId, quantity });
        }

        await user.save();
        res.json({ message: 'Product added to cart' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding to cart', error: error.message });
    }
});

// Update cart item quantity
router.put('/update/:productId', isAuthenticated, async (req, res) => {
    try {
        const { quantity } = req.body;
        const user = await User.findById(req.session.userId);
        
        const cartItem = user.cart.find(item => item.product.toString() === req.params.productId);
        if (!cartItem) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Check if product is in stock
        const product = await Product.findById(req.params.productId);
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        cartItem.quantity = quantity;
        await user.save();
        res.json({ message: 'Cart updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart', error: error.message });
    }
});

// Remove from cart
router.delete('/remove/:productId', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        user.cart = user.cart.filter(item => item.product.toString() !== req.params.productId);
        await user.save();
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing from cart', error: error.message });
    }
});

// Clear cart
router.delete('/clear', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        user.cart = [];
        await user.save();
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing cart', error: error.message });
    }
});

module.exports = router; 