// INITIALIZE ON PAGE LOAD
document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initBackButton();
    initNewsletterForm();
    initSocialIcons();
    initAppButtons();
    initScrollEffects();
    initPageTransition();
    
    console.log('Keidan Main JS initialized successfully!');
});

// NAVBAR FUNCTIONALITY
function initNavbar() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navCenter = document.querySelector('.nav-center');
    const navRight = document.querySelector('.nav-right');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navCenter.classList.toggle('active');
            navRight.classList.toggle('active');
            
            // Change icon
            if (navCenter.classList.contains('active')) {
                menuToggle.textContent = '✕';
            } else {
                menuToggle.textContent = '☰';
            }
        });
    }

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navCenter.classList.remove('active');
                navRight.classList.remove('active');
                if (menuToggle) menuToggle.textContent = '☰';
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar')) {
            navCenter.classList.remove('active');
            navRight.classList.remove('active');
            if (menuToggle) menuToggle.textContent = '☰';
        }
    });

    // Navbar scroll effect 
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.style.transform = 'translateY(0)';
            return;
        }
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

// BACK BUTTON FUNCTIONALITY
function initBackButton() {
    const backArrow = document.querySelector('.back-arrow');
    
    if (backArrow) {
        backArrow.addEventListener('click', function() {
            // Check if there's history to go back to
            if (window.history.length > 1) {
                window.history.back();
            } else {
                // If no history, go to home page
                window.location.href = 'index.html';
            }
        });
    }
}

// NEWSLETTER FORM
// function initNewsletterForm() {
//     const newsletterForm = document.querySelector('.newsletter-form');
//     const emailInput = document.querySelector('.email-input');
//     const joinButton = document.querySelector('.btn-join');
    
//     if (joinButton && emailInput) {
//         joinButton.addEventListener('click', function(e) {
//             e.preventDefault();
            
//             const email = emailInput.value.trim();
            
//             // Validation
//             if (email === '') {
//                 showNotification('Please enter your email address', 'error');
//                 return;
//             }
            
//             // Email format validation
//             const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//             if (!emailRegex.test(email)) {
//                 showNotification('Please enter a valid email address', 'error');
//                 return;
//             }
            
//             // Success
//             showNotification('Thank you for subscribing! 🎉', 'success');
//             emailInput.value = '';
            
//             // Here you would normally send to backend
//             console.log('Newsletter subscription:', email);
//         });
        
//         // Allow Enter key to submit
//         emailInput.addEventListener('keypress', function(e) {
//             if (e.key === 'Enter') {
//                 joinButton.click();
//             }
//         });
//     }
// }

// SOCIAL ICONS
function initSocialIcons() {
    const socialIcons = document.querySelectorAll('.social-icons span');
    
    socialIcons.forEach((icon, index) => {
        icon.addEventListener('click', function() {
            const platforms = ['Facebook', 'Twitter', 'Instagram', 'YouTube'];
            const platform = platforms[index] || 'Social Media';
            
            showNotification(`Opening ${platform}...`, 'info');
            
            // Here you would add actual social media links
            console.log(`${platform} clicked`);
        });
    });
}

// APP STORE BUTTONS
function initAppButtons() {
    const appButtons = document.querySelectorAll('.btn-app');
    
    appButtons.forEach(button => {
        button.addEventListener('click', function() {
            const store = button.textContent.includes('App Store') ? 'App Store' : 'Play Store';
            showNotification(`Redirecting to ${store}...`, 'info');
            
            // Here you would add actual app store links
            console.log(`${store} button clicked`);
        });
    });
}

// SCROLL EFFECTS
function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just '#'
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Fade in elements on scroll (simple alternative to AOS)
    const fadeElements = document.querySelectorAll('[data-aos]');
    
    if (fadeElements.length > 0) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        fadeElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// PAGE TRANSITION
function initPageTransition() {
    // Fade in page on load
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '1';
    }, 100);
}

// NOTIFICATION SYSTEM
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style notification
    const bgColors = {
        success: '#4CAF50',
        error: '#f44336',
        info: '#000'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColors[type] || bgColors.info};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 9999;
        font-size: 0.95rem;
        font-weight: 500;
        animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s;
        max-width: 350px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add notification animations to document
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// UTILITY FUNCTIONS

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Export utility functions for use in other scripts
window.KeidanUtils = {
    showNotification,
    isInViewport,
    debounce,
    formatCurrency
};

console.log('Keidan Utilities loaded');