const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Create order
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).populate('cart.product');
        if (user.cart.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate total and prepare order items
        let total = 0;
        const items = user.cart.map(item => {
            const price = item.product.price;
            total += price * item.quantity;
            return {
                product: item.product._id,
                quantity: item.quantity,
                price
            };
        });

        // Create order
        const order = new Order({
            user: user._id,
            items,
            total,
            shippingAddress: req.body.shippingAddress
        });

        // Update product stock
        for (const item of user.cart) {
            await Product.findByIdAndUpdate(
                item.product._id,
                { $inc: { stock: -item.quantity } }
            );
        }

        // Clear user's cart
        user.cart = [];
        await user.save();
        await order.save();

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
});

// Get user's orders
router.get('/my-orders', isAuthenticated, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.session.userId })
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

// Get all orders (admin only)
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'username email')
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

// Update order status (admin only)
router.put('/:id/status', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('items.product');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
});

// Get single order
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is authorized to view this order
        if (order.user.toString() !== req.session.userId && req.session.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
});

module.exports = router; 