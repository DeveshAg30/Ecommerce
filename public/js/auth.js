// Check authentication status
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/me', {
            credentials: 'include'
        });
        
        if (response.ok) {
            const user = await response.json();
            updateNavForLoggedInUser(user);
            return user;
        } else {
            updateNavForLoggedOutUser();
            return null;
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        updateNavForLoggedOutUser();
        return null;
    }
}

// Update navigation based on auth status
function updateNavForLoggedInUser(user) {
    document.getElementById('login-nav').style.display = 'none';
    document.getElementById('register-nav').style.display = 'none';
    document.getElementById('logout-nav').style.display = 'block';
    
    if (user.role === 'admin') {
        const adminLink = document.createElement('li');
        adminLink.className = 'nav-item';
        adminLink.innerHTML = '<a class="nav-link" href="/admin.html">Admin</a>';
        document.querySelector('.navbar-nav').insertBefore(adminLink, document.getElementById('logout-nav'));
    }
}

function updateNavForLoggedOutUser() {
    document.getElementById('login-nav').style.display = 'block';
    document.getElementById('register-nav').style.display = 'block';
    document.getElementById('logout-nav').style.display = 'none';
    
    const adminLink = document.querySelector('.nav-item a[href="/admin.html"]');
    if (adminLink) {
        adminLink.parentElement.remove();
    }
}

// Handle login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });
        
        if (response.ok) {
            window.location.href = '/';
        } else {
            const data = await response.json();
            showAlert(data.message, 'danger');
        }
    } catch (error) {
        showAlert('Error logging in', 'danger');
    }
}

// Password validation functions
function validatePassword(password) {
    const validations = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*]/.test(password)
    };
    
    return {
        isValid: Object.values(validations).every(v => v),
        validations
    };
}

function updatePasswordFeedback(validations) {
    const checks = {
        'length-check': validations.length,
        'uppercase-check': validations.uppercase,
        'lowercase-check': validations.lowercase,
        'number-check': validations.number,
        'special-check': validations.special
    };

    for (const [id, isValid] of Object.entries(checks)) {
        const element = document.getElementById(id);
        if (element) {
            element.style.color = isValid ? 'green' : 'red';
            element.innerHTML = `${isValid ? '✓' : '✗'} ${element.innerHTML.replace(/[✓✗] /, '')}`;
        }
    }
}

// Handle registration
async function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate password
    const { isValid, validations } = validatePassword(password);
    updatePasswordFeedback(validations);
    
    if (!isValid) {
        showAlert('Please meet all password requirements', 'danger');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'danger');
        return;
    }
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password }),
            credentials: 'include'
        });
        
        if (response.ok) {
            window.location.href = '/';
        } else {
            const data = await response.json();
            showAlert(data.message, 'danger');
        }
    } catch (error) {
        showAlert('Error registering', 'danger');
    }
}

// Handle logout
async function handleLogout() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            window.location.href = '/';
        }
    } catch (error) {
        showAlert('Error logging out', 'danger');
    }
}

// Show alert message
function showAlert(message, type = 'info') {
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

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        
        // Add real-time password validation
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
                const { validations } = validatePassword(e.target.value);
                updatePasswordFeedback(validations);
            });
        }
    }
    
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }
}); 