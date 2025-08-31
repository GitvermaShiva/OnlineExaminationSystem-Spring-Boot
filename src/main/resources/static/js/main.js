// Main JavaScript file for Online Examination System

document.addEventListener('DOMContentLoaded', function() {
    console.log('Online Examination System loaded successfully!');
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add scroll effect to header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 8px 32px rgba(31, 38, 135, 0.5)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 8px 32px rgba(31, 38, 135, 0.37)';
        }
    });
    
    // Add animation to feature cards on scroll
    const featureCards = document.querySelectorAll('.feature-card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-content h2');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }
    
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click ripple effect to buttons
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Enhanced mobile menu functionality
    const nav = document.querySelector('.nav');
    const navToggle = document.createElement('button');
    navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    navToggle.classList.add('nav-toggle');
    navToggle.setAttribute('aria-label', 'Toggle navigation menu');
    navToggle.style.display = 'none';
    
    // Insert toggle button before nav
    nav.parentNode.insertBefore(navToggle, nav);
    
    // Enhanced mobile menu styles
    const mobileStyle = document.createElement('style');
    mobileStyle.textContent = `
        @media (max-width: 768px) {
            .nav-toggle {
                display: block !important;
                background: none;
                border: none;
                font-size: 1.5rem;
                color: #667eea;
                cursor: pointer;
                padding: 0.75rem;
                min-width: 44px;
                min-height: 44px;
                border-radius: 8px;
                transition: all 0.3s ease;
            }
            
            .nav-toggle:hover {
                background: rgba(102, 126, 234, 0.1);
            }
            
            .nav-toggle:active {
                transform: scale(0.95);
            }
            
            .nav {
                display: none;
                width: 100%;
                margin-top: 1rem;
                background: rgba(255, 255, 255, 0.98);
                border-radius: 15px;
                padding: 1rem;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                animation: slideDown 0.3s ease;
            }
            
            .nav.active {
                display: block;
            }
            
            .nav ul {
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .nav ul li {
                width: 100%;
            }
            
            .nav ul li a {
                display: block;
                padding: 0.875rem 1rem;
                border-radius: 8px;
                transition: all 0.3s ease;
                text-align: center;
            }
            
            .nav ul li a:hover {
                background: rgba(102, 126, 234, 0.1);
                color: #667eea;
                transform: translateX(5px);
            }
            
            .nav ul li a.active {
                background: #667eea;
                color: white;
            }
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
            .nav-toggle:hover {
                background: none;
            }
            
            .nav ul li a:hover {
                background: none;
                transform: none;
            }
        }
    `;
    document.head.appendChild(mobileStyle);
    
    // Enhanced mobile menu toggle
    navToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        nav.classList.toggle('active');
        
        // Update toggle button icon
        const icon = this.querySelector('i');
        if (nav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
            nav.classList.remove('active');
            const icon = navToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close mobile menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            nav.classList.remove('active');
            const icon = navToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Add swipe gesture support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && nav.classList.contains('active')) {
                // Swipe left - close menu
                nav.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            } else if (diff < 0 && !nav.classList.contains('active')) {
                // Swipe right - open menu
                nav.classList.add('active');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        }
    }
    
    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // Add loading styles
    const loadingStyle = document.createElement('style');
    loadingStyle.textContent = `
        body {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        body.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(loadingStyle);
    
    // Initialize the page
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add notification styles
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 2rem;
                border-radius: 10px;
                color: white;
                font-weight: 600;
                z-index: 1000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-info {
                background: #667eea;
            }
            
            .notification-success {
                background: #28a745;
            }
            
            .notification-error {
                background: #dc3545;
            }
            
            .notification-warning {
                background: #ffc107;
                color: #333;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Database utility functions
async function fetchFromDatabase(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    // Add authorization header if token exists
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    // Merge options
    const finalOptions = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(`/api${endpoint}`, finalOptions);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Request failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Database fetch error:', error);
        throw error;
    }
}

async function saveToDatabase(endpoint, data, method = 'POST') {
    const token = localStorage.getItem('token');
    
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    };

    // Add authorization header if token exists
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`/api${endpoint}`, options);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Save failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Database save error:', error);
        throw error;
    }
}

// Export functions for use in other scripts
window.OnlineExam = {
    showNotification: showNotification,
    fetchFromDatabase: fetchFromDatabase,
    saveToDatabase: saveToDatabase
};
