# E-Commerce Website

A full-featured e-commerce website built with Node.js, Express, and MongoDB.

## Features

- User Authentication (Register/Login)
- Product Catalog with Categories
- Shopping Cart Functionality
- Checkout Process
- Order Management
- Admin Dashboard
- Responsive Design

## Tech Stack

- **Frontend:**
  - HTML5
  - CSS3 (Bootstrap 5)
  - JavaScript (Vanilla)

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/DeveshAg30/Ecommerce.git
cd ecommerce
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory with the following variables:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecommerce
SESSION_SECRET=your-super-secret-key-here
```

4. Start MongoDB service on your machine

5. Run the development server:
```bash
npm start
```

## Project Structure

```
ecommerce/
├── public/           # Static files
│   ├── css/         # Stylesheets
│   ├── js/          # Client-side JavaScript
│   └── images/      # Image assets
├── src/             # Server-side code
│   ├── models/      # Database models
│   ├── routes/      # API routes
│   ├── middleware/  # Custom middleware
│   └── server.js    # Server configuration
├── views/           # View templates
├── .env             # Environment variables
└── package.json     # Project dependencies
```

## Available Scripts

- `npm start` - Starts the server
- `npm run dev` - Starts the server with nodemon for development
- `npm test` - Runs tests (if configured)

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:id` - Update cart item
- `DELETE /api/cart/remove/:id` - Remove item from cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Bootstrap for the UI components
- MongoDB for the database
- Express.js team for the amazing framework
