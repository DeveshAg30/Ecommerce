// Fetch and display products
async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        if (response.ok) {
            const products = await response.json();
            // Check which display function to use based on the current page
            if (document.getElementById('products-grid')) {
                displayAllProducts(products);
            } else if (document.getElementById('featured-products')) {
                displayProducts(products);
            }
            return products;
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
    return [];
}

// Display products in the grid
function displayProducts(products) {
    const container = document.getElementById('featured-products');
    if (!container) return;

    container.innerHTML = products.map(product => `
        <div class="col-md-4 col-sm-6">
            <div class="card product-card">
                <img src="https://picsum.photos/300/200?random=${product._id}" class="card-img-top product-image" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text"><strong>₹${product.price.toFixed(2)}</strong></p>
                    <button class="btn btn-primary" onclick="addToCart('${product._id}')">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Add product to cart
async function addToCart(productId) {
    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, quantity: 1 }),
            credentials: 'include'
        });

        if (response.ok) {
            updateCartCount();
            showAlert('Product added to cart', 'success');
        } else {
            const data = await response.json();
            showAlert(data.message, 'danger');
        }
    } catch (error) {
        showAlert('Error adding to cart', 'danger');
    }
}

// Update cart count in navigation
async function updateCartCount() {
    try {
        const response = await fetch('/api/cart', {
            credentials: 'include'
        });

        if (response.ok) {
            const cart = await response.json();
            const count = cart.reduce((total, item) => total + item.quantity, 0);
            document.getElementById('cart-count').textContent = count;
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Display cart items
async function displayCart() {
    try {
        const response = await fetch('/api/cart', {
            credentials: 'include'
        });

        if (response.ok) {
            const cart = await response.json();
            const container = document.getElementById('cart-items');
            if (!container) return;

            if (cart.length === 0) {
                container.innerHTML = '<p>Your cart is empty</p>';
                document.getElementById('cart-subtotal').textContent = '₹0.00';
                document.getElementById('cart-total').textContent = '₹0.00';
                return;
            }

            container.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="row">
                        <div class="col-md-2">
                            <img src="https://picsum.photos/100/100?random=${item.product._id}" class="img-fluid" alt="${item.product.name}">
                        </div>
                        <div class="col-md-4">
                            <h5>${item.product.name}</h5>
                            <p>₹${item.product.price.toFixed(2)}</p>
                        </div>
                        <div class="col-md-3">
                            <input type="number" class="form-control" value="${item.quantity}" 
                                min="1" onchange="updateCartItem('${item.product._id}', this.value)">
                        </div>
                        <div class="col-md-3">
                            <button class="btn btn-danger" onclick="removeFromCart('${item.product._id}')">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');

            // Calculate subtotal and total
            const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
            const total = subtotal; // Since shipping is free
            
            // Update subtotal and total
            document.getElementById('cart-subtotal').textContent = `₹${subtotal.toFixed(2)}`;
            document.getElementById('cart-total').textContent = `₹${total.toFixed(2)}`;
        }
    } catch (error) {
        console.error('Error fetching cart:', error);
    }
}

// Update cart item quantity
async function updateCartItem(productId, quantity) {
    try {
        const response = await fetch(`/api/cart/update/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: parseInt(quantity) }),
            credentials: 'include'
        });

        if (response.ok) {
            displayCart();
            updateCartCount();
        } else {
            const data = await response.json();
            showAlert(data.message, 'danger');
        }
    } catch (error) {
        showAlert('Error updating cart', 'danger');
    }
}

// Remove item from cart
async function removeFromCart(productId) {
    try {
        const response = await fetch(`/api/cart/remove/${productId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            displayCart();
            updateCartCount();
        }
    } catch (error) {
        showAlert('Error removing from cart', 'danger');
    }
}

// Handle checkout
async function handleCheckout(event) {
    event.preventDefault();
    
    const shippingAddress = {
        street: document.getElementById('street').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zipCode').value,
        country: document.getElementById('country').value
    };

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ shippingAddress }),
            credentials: 'include'
        });

        if (response.ok) {
            const order = await response.json();
            window.location.href = `/order-confirmation.html?id=${order._id}`;
        } else {
            const data = await response.json();
            showAlert(data.message, 'danger');
        }
    } catch (error) {
        showAlert('Error processing order', 'danger');
    }
}

// Display all products in the products page
function displayAllProducts(products) {
    const container = document.getElementById('products-grid');
    if (!container) return;

    container.innerHTML = products.map(product => `
        <div class="col-md-4 col-sm-6 mb-4">
            <div class="card product-card h-100">
                <img src="https://picsum.photos/300/200?random=${product._id}" class="card-img-top product-image" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text"><strong>₹${product.price.toFixed(2)}</strong></p>
                    <button class="btn btn-primary" onclick="addToCart('${product._id}')">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Fetch categories
async function fetchCategories() {
    try {
        const response = await fetch('/api/categories', {
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const categories = await response.json();
        if (Array.isArray(categories)) {
            displayCategories(categories);
            return categories;
        } else {
            throw new Error('Invalid categories data received');
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.innerHTML = '<option value="">Error loading categories</option>';
        }
    }
    return [];
}

// Display categories in filter dropdown
function displayCategories(categories) {
    const categoryFilter = document.getElementById('category-filter');
    if (!categoryFilter) return;

    const options = categories.map(category => `
        <option value="${category._id}">${category.name}</option>
    `).join('');

    categoryFilter.innerHTML = `
        <option value="">All Categories</option>
        ${options}
    `;
}

// Filter products based on selected criteria
function filterProducts() {
    const categoryId = document.getElementById('category-filter').value;
    const priceRange = document.getElementById('price-range').value;
    const sortBy = document.getElementById('sort-by').value;

    let filteredProducts = [...window.allProducts || []];

    // Filter by category
    if (categoryId) {
        filteredProducts = filteredProducts.filter(product => 
            product.category && product.category._id === categoryId
        );
    }

    // Filter by price range
    if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        filteredProducts = filteredProducts.filter(product => {
            if (!max) {
                // For "Above ₹5000" case
                return product.price >= min;
            } else {
                return product.price >= min && product.price <= max;
            }
        });
    }

    // Sort products
    switch (sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'newest':
            filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
    }

    displayAllProducts(filteredProducts);
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Check if we're on the products page
        if (document.getElementById('products-grid')) {
            // Fetch products first
            const products = await fetchProducts();
            window.allProducts = products;

            // Then fetch categories
            await fetchCategories();

            // Add event listeners for filters
            document.getElementById('category-filter').addEventListener('change', filterProducts);
            document.getElementById('price-range').addEventListener('change', filterProducts);
            document.getElementById('sort-by').addEventListener('change', filterProducts);
        }
        // Check if we're on the home page
        else if (document.getElementById('featured-products')) {
            await fetchProducts();
        }

        // Check if we're on the cart page
        if (document.getElementById('cart-items')) {
            await displayCart();
        }

        // Check if we're on the checkout page
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', handleCheckout);
        }

        // Update cart count
        await updateCartCount();
    } catch (error) {
        console.error('Error initializing page:', error);
    }
}); 