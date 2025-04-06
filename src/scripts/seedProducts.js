const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
require('dotenv').config();

// Sample product data
const categories = [
    { name: 'Electronics', description: 'Electronic devices and gadgets' },
    { name: 'Clothing', description: 'Fashion and apparel' },
    { name: 'Books', description: 'Books and literature' },
    { name: 'Home & Kitchen', description: 'Home and kitchen appliances' }
];

const products = [
    {
        name: 'Smart Watch',
        price: 249.99,
        description: 'Advanced smartwatch with health tracking features',
        imageURL: 'https://picsum.photos/300/200?random=1',
        stock: 50,
        category: 'Electronics'
    },
    {
        name: 'Wireless Earbuds',
        price: 129.99,
        description: 'High-quality wireless earbuds with noise cancellation',
        imageURL: 'https://picsum.photos/300/200?random=2',
        stock: 100,
        category: 'Electronics'
    },
    {
        name: 'Cotton T-Shirt',
        price: 19.99,
        description: 'Comfortable 100% cotton t-shirt',
        imageURL: 'https://picsum.photos/300/200?random=3',
        stock: 200,
        category: 'Clothing'
    },
    {
        name: 'Denim Jeans',
        price: 49.99,
        description: 'Classic fit denim jeans',
        imageURL: 'https://picsum.photos/300/200?random=4',
        stock: 150,
        category: 'Clothing'
    },
    {
        name: 'Coffee Maker',
        price: 79.99,
        description: 'Programmable coffee maker with 12-cup capacity',
        imageURL: 'https://picsum.photos/300/200?random=5',
        stock: 75,
        category: 'Home & Kitchen'
    },
    {
        name: 'Blender',
        price: 39.99,
        description: 'High-speed blender for smoothies and shakes',
        imageURL: 'https://picsum.photos/300/200?random=6',
        stock: 100,
        category: 'Home & Kitchen'
    },
    {
        name: 'Novel Collection',
        price: 29.99,
        description: 'Collection of bestselling novels',
        imageURL: 'https://picsum.photos/300/200?random=7',
        stock: 80,
        category: 'Books'
    },
    {
        name: 'Cookbook',
        price: 24.99,
        description: 'Comprehensive cookbook with 500+ recipes',
        imageURL: 'https://picsum.photos/300/200?random=8',
        stock: 120,
        category: 'Books'
    },
    {
        name: 'Gaming Laptop',
        price: 1299.99,
        description: 'High-performance gaming laptop with RTX 3070, 16GB RAM, 1TB SSD',
        imageURL: 'https://picsum.photos/300/200?random=9',
        stock: 25,
        category: 'Electronics'
    },
    {
        name: '4K Smart TV',
        price: 799.99,
        description: '55-inch 4K Smart LED TV with HDR and built-in streaming',
        imageURL: 'https://picsum.photos/300/200?random=10',
        stock: 30,
        category: 'Electronics'
    },
    {
        name: 'Leather Jacket',
        price: 199.99,
        description: 'Classic leather jacket with quilted lining',
        imageURL: 'https://picsum.photos/300/200?random=11',
        stock: 45,
        category: 'Clothing'
    },
    {
        name: 'Running Shoes',
        price: 89.99,
        description: 'Lightweight running shoes with cushioned sole',
        imageURL: 'https://picsum.photos/300/200?random=12',
        stock: 120,
        category: 'Clothing'
    },
    {
        name: 'Robot Vacuum',
        price: 299.99,
        description: 'Smart robot vacuum with mapping and WiFi connectivity',
        imageURL: 'https://picsum.photos/300/200?random=13',
        stock: 40,
        category: 'Home & Kitchen'
    },
    {
        name: 'Air Fryer',
        price: 129.99,
        description: 'Digital air fryer with multiple cooking presets',
        imageURL: 'https://picsum.photos/300/200?random=14',
        stock: 60,
        category: 'Home & Kitchen'
    },
    {
        name: 'Science Fiction Box Set',
        price: 79.99,
        description: 'Collection of classic sci-fi novels',
        imageURL: 'https://picsum.photos/300/200?random=15',
        stock: 35,
        category: 'Books'
    },
    {
        name: 'Wireless Mouse',
        price: 29.99,
        description: 'Ergonomic wireless mouse with long battery life',
        imageURL: 'https://picsum.photos/300/200?random=16',
        stock: 150,
        category: 'Electronics'
    },
    {
        name: 'Designer Sunglasses',
        price: 159.99,
        description: 'UV protected polarized designer sunglasses',
        imageURL: 'https://picsum.photos/300/200?random=17',
        stock: 40,
        category: 'Clothing'
    },
    {
        name: 'Stand Mixer',
        price: 249.99,
        description: 'Professional stand mixer with multiple attachments',
        imageURL: 'https://picsum.photos/300/200?random=18',
        stock: 30,
        category: 'Home & Kitchen'
    },
    {
        name: 'Smartphone',
        price: 899.99,
        description: 'Latest smartphone with 5G and pro camera system',
        imageURL: 'https://picsum.photos/300/200?random=19',
        stock: 50,
        category: 'Electronics'
    },
    {
        name: 'Winter Coat',
        price: 149.99,
        description: 'Warm winter coat with water-resistant exterior',
        imageURL: 'https://picsum.photos/300/200?random=20',
        stock: 75,
        category: 'Clothing'
    },
    {
        name: 'Educational Book Series',
        price: 119.99,
        description: 'Complete set of educational books for children',
        imageURL: 'https://picsum.photos/300/200?random=21',
        stock: 45,
        category: 'Books'
    },
    {
        name: 'Dishwasher',
        price: 549.99,
        description: 'Energy-efficient dishwasher with multiple wash cycles',
        imageURL: 'https://picsum.photos/300/200?random=22',
        stock: 20,
        category: 'Home & Kitchen'
    },
    {
        name: 'Tablet',
        price: 399.99,
        description: '10-inch tablet with high-resolution display and stylus support',
        imageURL: 'https://picsum.photos/300/200?random=23',
        stock: 60,
        category: 'Electronics'
    }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Function to seed the database
async function seedDatabase() {
    try {
        // Clear existing data
        await Category.deleteMany({});
        await Product.deleteMany({});
        console.log('Cleared existing data');

        // Insert categories
        const savedCategories = await Category.insertMany(categories);
        console.log('Categories added');

        // Create a map of category names to their IDs
        const categoryMap = {};
        savedCategories.forEach(category => {
            categoryMap[category.name] = category._id;
        });

        // Add category IDs to products
        const productsWithCategories = products.map(product => ({
            ...product,
            category: categoryMap[product.category]
        }));

        // Insert products
        await Product.insertMany(productsWithCategories);
        console.log('Products added');

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seeding function
seedDatabase(); 