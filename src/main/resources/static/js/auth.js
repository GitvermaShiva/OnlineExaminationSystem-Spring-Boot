// Authentication JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('Authentication module loaded');
    
    // Initialize authentication forms
    initLoginForm();
    initPasswordToggle();
    initFormValidation();
});

// Initialize login form
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    
    // Get form values
    const username = formData.get('username');
    const password = formData.get('password');
    const rememberMe = formData.get('rememberMe');
    
    // Basic validation
    if (!username || !password) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Show loading state
    setButtonLoading(submitBtn, true);
    
    try {
        // Real API call to Spring Boot backend
        const response = await realLoginAPI(username, password, rememberMe);
        
        if (response.success) {
            showNotification('Login successful! Redirecting...', 'success');
            
            // Store user data and JWT token in localStorage
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
            localStorage.setItem('isLoggedIn', 'true');
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } else {
            showNotification(response.message || 'Login failed', 'error');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showNotification('An error occurred during login', 'error');
    } finally {
        setButtonLoading(submitBtn, false);
    }
}

// Real login API call to Spring Boot backend
async function realLoginAPI(username, password, rememberMe) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                rememberMe: rememberMe
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || 'Login failed'
            };
        }

        const data = await response.json();
        return {
            success: true,
            user: data.user,
            token: data.token,
            message: 'Login successful'
        };
    } catch (error) {
        console.error('Network error:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.'
        };
    }
}

// Initialize password toggle functionality
function initPasswordToggle() {
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// Initialize form validation
function initFormValidation() {
    const inputs = document.querySelectorAll('.auth-form input[required]');
    
    inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
        
        // Add error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = getErrorMessage(input);
        input.parentNode.appendChild(errorDiv);
    });
}

// Validate individual field
function validateField(event) {
    const input = event.target;
    const formGroup = input.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    // Remove existing error state
    formGroup.classList.remove('error');
    
    // Check if field is empty
    if (!input.value.trim()) {
        formGroup.classList.add('error');
        errorMessage.style.display = 'block';
        return false;
    }
    
    // Email validation
    if (input.type === 'email' && input.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
            formGroup.classList.add('error');
            errorMessage.textContent = 'Please enter a valid email address';
            errorMessage.style.display = 'block';
            return false;
        }
    }
    
    // Password validation
    if (input.type === 'password' && input.value) {
        if (input.value.length < 6) {
            formGroup.classList.add('error');
            errorMessage.textContent = 'Password must be at least 6 characters long';
            errorMessage.style.display = 'block';
            return false;
        }
    }
    
    // Clear error if validation passes
    errorMessage.style.display = 'none';
    return true;
}

// Clear field error on input
function clearFieldError(event) {
    const input = event.target;
    const formGroup = input.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    formGroup.classList.remove('error');
    errorMessage.style.display = 'none';
}

// Get appropriate error message for field
function getErrorMessage(input) {
    if (input.type === 'email') {
        return 'Please enter a valid email address';
    } else if (input.type === 'password') {
        return 'Password is required';
    } else {
        return 'This field is required';
    }
}

// Set button loading state
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.classList.add('btn-loading');
        button.setAttribute('data-original-text', button.innerHTML);
        button.innerHTML = '';
    } else {
        button.disabled = false;
        button.classList.remove('btn-loading');
        button.innerHTML = button.getAttribute('data-original-text') || 'Login';
    }
}

// Social login handlers
function handleGoogleLogin() {
    showNotification('Google login functionality coming soon!', 'info');
}

function handleFacebookLogin() {
    showNotification('Facebook login functionality coming soon!', 'info');
}

// Add social login event listeners
document.addEventListener('DOMContentLoaded', function() {
    const googleBtn = document.querySelector('.btn-google');
    const facebookBtn = document.querySelector('.btn-facebook');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', handleGoogleLogin);
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', handleFacebookLogin);
    }
});

// Utility function to check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Utility function to get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Utility function to logout
function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
}

// Export functions for use in other scripts
window.Auth = {
    isLoggedIn,
    getCurrentUser,
    logout,
    handleLogin,
    validateField
};
