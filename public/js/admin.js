// Admin Dashboard Functions
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is admin
    checkAdminAuth();
    
    // Load dashboard data
    loadDashboardData();
    
    // Set up event listeners
    setupEventListeners();
});

// Check if user is admin
async function checkAdminAuth() {
    try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        
        if (!data.user || data.user.role !== 'admin') {
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error checking admin auth:', error);
        window.location.href = '/';
    }
}

// Load dashboard data
async function loadDashboardData() {
    try {
        // Load stats
        const statsResponse = await fetch('/api/admin/stats');
        const stats = await statsResponse.json();
        
        document.getElementById('total-products').textContent = stats.totalProducts;
        document.getElementById('total-orders').textContent = stats.totalOrders;
        document.getElementById('total-users').textContent = stats.totalUsers;
        document.getElementById('total-revenue').textContent = `₹${stats.totalRevenue.toFixed(2)}`;
        
        // Load initial tab data
        loadProducts();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showAlert('Error loading dashboard data', 'danger');
    }
}

// Set up event listeners
function setupEventListeners() {
    // Tab change events
    document.getElementById('products-tab').addEventListener('click', loadProducts);
    document.getElementById('orders-tab').addEventListener('click', loadOrders);
    document.getElementById('users-tab').addEventListener('click', loadUsers);
    document.getElementById('categories-tab').addEventListener('click', loadCategories);
    
    // Order filter buttons
    document.getElementById('filter-pending').addEventListener('click', () => loadOrders('pending'));
    document.getElementById('filter-processing').addEventListener('click', () => loadOrders('processing'));
    document.getElementById('filter-completed').addEventListener('click', () => loadOrders('completed'));
    document.getElementById('filter-cancelled').addEventListener('click', () => loadOrders('cancelled'));
    
    // Add product form
    document.getElementById('save-product-btn').addEventListener('click', saveProduct);
}

// Load products
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        
        const tbody = document.getElementById('products-table');
        tbody.innerHTML = '';
        
        products.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${product._id}</td>
                <td>${product.name}</td>
                <td>${product.category.name}</td>
                <td>₹${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editProduct('${product._id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product._id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error loading products:', error);
        showAlert('Error loading products', 'danger');
    }
}

// Load orders
async function loadOrders(status = '') {
    try {
        const url = status ? `/api/orders?status=${status}` : '/api/orders';
        const response = await fetch(url);
        const orders = await response.json();
        
        const tbody = document.getElementById('orders-table');
        tbody.innerHTML = '';
        
        orders.forEach(order => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${order._id}</td>
                <td>${order.user.username}</td>
                <td>₹${order.total.toFixed(2)}</td>
                <td>
                    <select class="form-select form-select-sm" onchange="updateOrderStatus('${order._id}', this.value)">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="viewOrder('${order._id}')">View</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error loading orders:', error);
        showAlert('Error loading orders', 'danger');
    }
}

// Load users
async function loadUsers() {
    try {
        const response = await fetch('/api/users');
        const users = await response.json();
        
        const tbody = document.getElementById('users-table');
        tbody.innerHTML = '';
        
        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user._id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editUser('${user._id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser('${user._id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error loading users:', error);
        showAlert('Error loading users', 'danger');
    }
}

// Load categories
async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        const categories = await response.json();
        
        const tbody = document.getElementById('categories-table');
        tbody.innerHTML = '';
        
        categories.forEach(category => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${category._id}</td>
                <td>${category.name}</td>
                <td>${category.description}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editCategory('${category._id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCategory('${category._id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
        showAlert('Error loading categories', 'danger');
    }
}

// Save product
async function saveProduct() {
    try {
        const form = document.getElementById('add-product-form');
        const formData = new FormData(form);
        
        const response = await fetch('/api/products', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            showAlert('Product added successfully', 'success');
            loadProducts();
            bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
        } else {
            throw new Error('Failed to add product');
        }
    } catch (error) {
        console.error('Error saving product:', error);
        showAlert('Error saving product', 'danger');
    }
}

// Update order status
async function updateOrderStatus(orderId, status) {
    try {
        const response = await fetch(`/api/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            showAlert('Order status updated successfully', 'success');
            loadOrders();
        } else {
            throw new Error('Failed to update order status');
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        showAlert('Error updating order status', 'danger');
    }
}

// Show alert
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
} 