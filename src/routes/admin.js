const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Category = require('../models/Category');

// Get admin dashboard stats
router.get('/stats', isAdmin, async (req, res) => {
    try {
        const [
            totalProducts,
            totalOrders,
            totalUsers,
            totalRevenue
        ] = await Promise.all([
            Product.countDocuments(),
            Order.countDocuments(),
            User.countDocuments(),
            Order.aggregate([
                { $match: { status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$total' } } }
            ])
        ]);

        res.json({
            totalProducts,
            totalOrders,
            totalUsers,
            totalRevenue: totalRevenue[0]?.total || 0
        });
    } catch (error) {
        console.error('Error getting admin stats:', error);
        res.status(500).json({ message: 'Error getting admin stats' });
    }
});

// Get all users (admin only)
router.get('/users', isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ message: 'Error getting users' });
    }
});

// Update user (admin only)
router.put('/users/:id', isAdmin, async (req, res) => {
    try {
        const { username, email, role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { username, email, role },
            { new: true }
        ).select('-password');
        
        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user' });
    }
});

// Delete user (admin only)
router.delete('/users/:id', isAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user' });
    }
});

// Create category (admin only)
router.post('/categories', isAdmin, async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = new Category({ name, description });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Error creating category' });
    }
});

// Update category (admin only)
router.put('/categories/:id', isAdmin, async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );
        res.json(category);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Error updating category' });
    }
});

// Delete category (admin only)
router.delete('/categories/:id', isAdmin, async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Error deleting category' });
    }
});

// Create product (admin only)
router.post('/products', isAdmin, async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;
        const product = new Product({
            name,
            description,
            price,
            stock,
            category
        });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product' });
    }
});

// Update product (admin only)
router.put('/products/:id', isAdmin, async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, price, stock, category },
            { new: true }
        );
        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product' });
    }
});

// Delete product (admin only)
router.delete('/products/:id', isAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product' });
    }
});

module.exports = router; 