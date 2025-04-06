// Checkout form validation and processing
document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkout-form');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const orderItems = document.getElementById('order-items');
    const orderSubtotal = document.getElementById('order-subtotal');
    const orderTotal = document.getElementById('order-total');

    // Load cart items and calculate totals
    async function loadCartItems() {
        try {
            const response = await fetch('/api/cart', {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cart');
            }

            const cart = await response.json();
            let subtotal = 0;
            
            orderItems.innerHTML = '';
            
            if (!cart || cart.length === 0) {
                const emptyCartMessage = document.createElement('div');
                emptyCartMessage.className = 'text-center text-muted my-3';
                emptyCartMessage.innerHTML = 'Your cart is empty';
                orderItems.appendChild(emptyCartMessage);
                
                // Disable place order button when cart is empty
                placeOrderBtn.disabled = true;
                placeOrderBtn.classList.add('disabled');
            } else {
                // Enable place order button
                placeOrderBtn.disabled = false;
                placeOrderBtn.classList.remove('disabled');
                
                cart.forEach(item => {
                    if (!item.product) return;
                    
                    const price = parseFloat(item.product.price) || 0;
                    const quantity = parseInt(item.quantity) || 0;
                    const itemTotal = price * quantity;
                    subtotal += itemTotal;
                    
                    const itemElement = document.createElement('div');
                    itemElement.className = 'd-flex justify-content-between mb-2';
                    itemElement.innerHTML = `
                        <span>${item.product.name} x ${quantity}</span>
                        <span>₹${itemTotal.toFixed(2)}</span>
                    `;
                    orderItems.appendChild(itemElement);
                });
            }

            // Ensure subtotal is a valid number
            subtotal = parseFloat(subtotal.toFixed(2)) || 0;
            orderSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
            orderTotal.textContent = `₹${subtotal.toFixed(2)}`;
        } catch (error) {
            console.error('Error loading cart:', error);
            const errorMessage = document.createElement('div');
            errorMessage.className = 'text-center text-danger my-3';
            errorMessage.innerHTML = 'Error loading cart. Please try again.';
            orderItems.innerHTML = '';
            orderItems.appendChild(errorMessage);
        }
    }

    // Form validation
    function validateForm() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const address = document.getElementById('address').value.trim();
        const city = document.getElementById('city').value.trim();
        const state = document.getElementById('state').value.trim();
        const zip = document.getElementById('zip').value.trim();

        // Name validation (at least 2 words)
        if (!name ) {
            alert('Please enter your full name');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return false;
        }

        // Address validation
        if (address.length < 10) {
            alert('Please enter a complete address');
            return false;
        }

        // City validation
        if (!city) {
            alert('Please enter your city');
            return false;
        }

        // State validation
        if (!state) {
            alert('Please enter your state');
            return false;
        }

        // ZIP code validation (6 digits for Indian postal codes)
        const zipRegex = /^\d{6}$/;
        if (!zipRegex.test(zip)) {
            alert('Please enter a valid 6-digit ZIP code');
            return false;
        }

        return true;
    }

    // Handle order submission
    async function handleOrderSubmission() {
        if (!validateForm()) return;

        const orderData = {
            shippingAddress: {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                address: document.getElementById('address').value.trim(),
                city: document.getElementById('city').value.trim(),
                state: document.getElementById('state').value.trim(),
                zipCode: document.getElementById('zip').value.trim()
            }
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to place order');
            }

            const order = await response.json();
            alert('Order placed successfully!');
            window.location.href = `/order-confirmation.html?id=${order._id}`;
        } catch (error) {
            console.error('Error placing order:', error);
            alert('There was an error placing your order. Please try again.');
        }
    }

    // Event listeners
    placeOrderBtn.addEventListener('click', handleOrderSubmission);

    // Load cart items when page loads
    loadCartItems();
}); 