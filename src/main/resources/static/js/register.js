// Registration JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('Registration module loaded');
    
    // Initialize registration form
    initRegistrationForm();
    initPasswordStrength();
    initFormValidation();
    initPasswordToggle();
});

// Initialize registration form
function initRegistrationForm() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
}

// Handle registration form submission
async function handleRegistration(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    
    // Get form values
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const username = formData.get('username');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const role = formData.get('role');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const agreeTerms = formData.get('agreeTerms');
    
    // Validation
    if (!validateRegistrationForm(firstName, lastName, username, email, role, password, confirmPassword, agreeTerms)) {
        return;
    }
    
    // Show loading state
    setButtonLoading(submitBtn, true);
    
    try {
        // Real API call to Spring Boot backend
        const response = await realRegistrationAPI({
            firstName,
            lastName,
            username,
            email,
            phone,
            role,
            password
        });
        
        if (response.success) {
            showNotification('Registration successful! Please login.', 'success');
            
            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            
        } else {
            showNotification(response.message || 'Registration failed', 'error');
        }
        
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('An error occurred during registration', 'error');
    } finally {
        setButtonLoading(submitBtn, false);
    }
}

// Validate registration form
function validateRegistrationForm(firstName, lastName, username, email, role, password, confirmPassword, agreeTerms) {
    let isValid = true;
    
    // Check required fields
    if (!firstName || !lastName || !username || !email || !role || !password || !confirmPassword) {
        showNotification('Please fill in all required fields', 'error');
        isValid = false;
    }
    
    // Check password match
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        isValid = false;
    }
    
    // Check password strength
    if (password && password.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        isValid = false;
    }
    
    // Check terms agreement
    if (!agreeTerms) {
        showNotification('Please agree to the terms and conditions', 'error');
        isValid = false;
    }
    
    // Check email format
    if (email && !isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        isValid = false;
    }
    
    // Check username format
    if (username && !isValidUsername(username)) {
        showNotification('Username must be 3-20 characters and contain only letters, numbers, and underscores', 'error');
        isValid = false;
    }
    
    return isValid;
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate username format
function isValidUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
}

// Real registration API call to Spring Boot backend
async function realRegistrationAPI(userData) {
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                firstName: userData.firstName,
                lastName: userData.lastName,
                username: userData.username,
                email: userData.email,
                phone: userData.phone,
                role: userData.role,
                password: userData.password
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || 'Registration failed'
            };
        }

        const data = await response.json();
        return {
            success: true,
            user: data.user,
            message: 'Registration successful'
        };
    } catch (error) {
        console.error('Network error:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.'
        };
    }
}

// Initialize password strength checker
function initPasswordStrength() {
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', checkPasswordStrength);
    }
}

// Check password strength
function checkPasswordStrength(event) {
    const password = event.target.value;
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!strengthFill || !strengthText) return;
    
    let strength = 0;
    let strengthLabel = 'Weak';
    let strengthClass = 'weak';
    
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    if (strength >= 5) {
        strengthLabel = 'Strong';
        strengthClass = 'strong';
    } else if (strength >= 3) {
        strengthLabel = 'Medium';
        strengthClass = 'medium';
    } else if (strength >= 1) {
        strengthLabel = 'Weak';
        strengthClass = 'weak';
    } else {
        strengthLabel = 'Very Weak';
        strengthClass = 'weak';
    }
    
    // Update strength bar
    strengthFill.className = `strength-fill ${strengthClass}`;
    strengthText.textContent = `Password strength: ${strengthLabel}`;
    
    // Add color to text based on strength
    strengthText.className = 'strength-text';
    if (strengthClass === 'strong') {
        strengthText.style.color = '#28a745';
    } else if (strengthClass === 'medium') {
        strengthText.style.color = '#ffc107';
    } else {
        strengthText.style.color = '#dc3545';
    }
}

// Initialize form validation for registration
function initFormValidation() {
    const inputs = document.querySelectorAll('.auth-form input[required], .auth-form select[required]');
    
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
    
    // Special validation for confirm password
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', validateConfirmPassword);
    }
}

// Validate confirm password field
function validateConfirmPassword(event) {
    const confirmPassword = event.target.value;
    const password = document.getElementById('password').value;
    const formGroup = event.target.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    formGroup.classList.remove('error');
    
    if (confirmPassword && password !== confirmPassword) {
        formGroup.classList.add('error');
        errorMessage.textContent = 'Passwords do not match';
        errorMessage.style.display = 'block';
        return false;
    }
    
    errorMessage.style.display = 'none';
    return true;
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
        if (!isValidEmail(input.value)) {
            formGroup.classList.add('error');
            errorMessage.textContent = 'Please enter a valid email address';
            errorMessage.style.display = 'block';
            return false;
        }
    }
    
    // Username validation
    if (input.name === 'username' && input.value) {
        if (!isValidUsername(input.value)) {
            formGroup.classList.add('error');
            errorMessage.textContent = 'Username must be 3-20 characters and contain only letters, numbers, and underscores';
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
    } else if (input.name === 'username') {
        return 'Username must be 3-20 characters and contain only letters, numbers, and underscores';
    } else if (input.name === 'role') {
        return 'Please select your role';
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
        button.innerHTML = button.getAttribute('data-original-text') || 'Create Account';
    }
}

// Social registration handlers
function handleGoogleRegistration() {
    showNotification('Google registration functionality coming soon!', 'info');
}

function handleFacebookRegistration() {
    showNotification('Facebook registration functionality coming soon!', 'info');
}

// Add social registration event listeners
document.addEventListener('DOMContentLoaded', function() {
    const googleBtn = document.querySelector('.btn-google');
    const facebookBtn = document.querySelector('.btn-facebook');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', handleGoogleRegistration);
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', handleFacebookRegistration);
    }
});

// Export functions for use in other scripts
window.Register = {
    handleRegistration,
    validateRegistrationForm,
    checkPasswordStrength,
    isValidEmail,
    isValidUsername
};
