// Check authentication status
async function checkAuth() {
    try {
        const response = await $.ajax({
            url: '/api/auth/me',
            xhrFields: {
                withCredentials: true
            }
        });
        
        updateNavForLoggedInUser(response);
        return response;
    } catch (error) {
        console.error('Error checking auth status:', error);
        updateNavForLoggedOutUser();
        return null;
    }
}

// Update navigation based on auth status
function updateNavForLoggedInUser(user) {
    $('#login-nav, #register-nav').hide();
    $('#logout-nav').show();
    
    if (user.role === 'admin') {
        const adminLink = $('<li>', { class: 'nav-item' })
            .append($('<a>', { 
                class: 'nav-link',
                href: '/admin.html',
                text: 'Admin'
            }));
        $('.navbar-nav').prepend(adminLink);
    }
}

function updateNavForLoggedOutUser() {
    $('#login-nav, #register-nav').show();
    $('#logout-nav').hide();
    
    $('.nav-item a[href="/admin.html"]').parent().remove();
}

// Handle login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = $('#email').val();
    const password = $('#password').val();
    
    try {
        const response = await $.ajax({
            url: '/api/auth/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email, password }),
            xhrFields: {
                withCredentials: true
            }
        });
        
        window.location.href = '/';
    } catch (error) {
        showAlert(error.responseJSON?.message || 'Error logging in', 'danger');
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

    $.each(checks, (id, isValid) => {
        const $element = $(`#${id}`);
        if ($element.length) {
            $element.css('color', isValid ? 'green' : 'red')
                .html(`${isValid ? '✓' : '✗'} ${$element.html().replace(/[✓✗] /, '')}`);
        }
    });
}

// Handle registration
async function handleRegister(event) {
    event.preventDefault();
    
    const username = $('#username').val();
    const email = $('#email').val();
    const password = $('#password').val();
    const confirmPassword = $('#confirmPassword').val();
    
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
        const response = await $.ajax({
            url: '/api/auth/register',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, email, password }),
            xhrFields: {
                withCredentials: true
            }
        });
        
        window.location.href = '/';
    } catch (error) {
        showAlert(error.responseJSON?.message || 'Error registering', 'danger');
    }
}

// Handle logout
async function handleLogout() {
    try {
        const response = await $.ajax({
            url: '/api/auth/logout',
            method: 'POST',
            xhrFields: {
                withCredentials: true
            }
        });
        
        window.location.href = '/';
    } catch (error) {
        showAlert('Error logging out', 'danger');
    }
}

// Show alert message
function showAlert(message, type = 'info') {
    const $alertDiv = $('<div>', {
        class: `alert alert-${type} alert-dismissible fade show`,
        html: `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `
    });
    
    $('.container').prepend($alertDiv);
    
    setTimeout(() => {
        $alertDiv.remove();
    }, 5000);
}

// Add event listeners
$(document).ready(() => {
    checkAuth();
    
    $('#login-form').on('submit', handleLogin);
    $('#register-form').on('submit', handleRegister);
    
    // Add real-time password validation
    $('#password').on('input', function() {
        const { validations } = validatePassword($(this).val());
        updatePasswordFeedback(validations);
    });
    
    $('#logout-link').on('click', function(e) {
        e.preventDefault();
        handleLogout();
    });
}); 