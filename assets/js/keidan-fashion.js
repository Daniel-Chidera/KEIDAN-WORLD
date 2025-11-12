// ========== INITIALIZE ON PAGE LOAD ==========
document.addEventListener('DOMContentLoaded', function() {
    initGenderToggle();
    initCategoryNavigation();
    initProductCards();
    initCollectionCards();
    initLookbookCards();
    initHeroButton();
    
    console.log('Keidan Fashion JS initialized successfully!');
});

// ========== GENDER TOGGLE (MEN/WOMEN) ==========
function initGenderToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const sidebarTitle = document.querySelector('.sidebar-title');
    const featuredImage = document.getElementById('genderFeaturedImage');
    
    // Images for men and women
    const images = {
        men: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop',
        women: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1000&fit=crop'
    };
    
    let currentGender = 'men'; // Default
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedGender = this.getAttribute('data-gender');
            
            // Don't do anything if clicking the already active button
            if (selectedGender === currentGender) return;
            
            // Update active state
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update current gender
            currentGender = selectedGender;
            
            // Update sidebar title with animation
            if (sidebarTitle) {
                sidebarTitle.style.opacity = '0';
                setTimeout(() => {
                    sidebarTitle.textContent = selectedGender === 'men' ? 'Men' : 'Women';
                    sidebarTitle.style.transition = 'opacity 0.3s ease';
                    sidebarTitle.style.opacity = '1';
                }, 150);
            }
            
            // Update featured image with fade effect
            if (featuredImage) {
                featuredImage.style.opacity = '0';
                setTimeout(() => {
                    featuredImage.src = images[selectedGender];
                    featuredImage.style.transition = 'opacity 0.3s ease';
                    featuredImage.style.opacity = '1';
                }, 150);
            }
            
            // Update URL parameter (optional - for back button consistency)
            const url = new URL(window.location);
            url.searchParams.set('gender', selectedGender);
            window.history.pushState({}, '', url);
            
            // Show notification
            if (window.KeidanUtils) {
                window.KeidanUtils.showNotification(
                    `Switched to ${selectedGender === 'men' ? "Men's" : "Women's"} collection`,
                    'info'
                );
            }
            
            console.log(`Gender switched to: ${selectedGender}`);
        });
    });
    
    // Check URL for gender parameter on page load
    const urlParams = new URLSearchParams(window.location.search);
    const genderParam = urlParams.get('gender');
    
    if (genderParam && (genderParam === 'men' || genderParam === 'women')) {
        const button = document.querySelector(`.toggle-btn[data-gender="${genderParam}"]`);
        if (button) {
            button.click();
        }
    }
}

// ========== CATEGORY NAVIGATION ==========
function initCategoryNavigation() {
    const categoryItems = document.querySelectorAll('.category-item');
    
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            const categoryName = this.querySelector('.category-name').textContent;
            
            // Get current gender
            const activeGenderBtn = document.querySelector('.toggle-btn.active');
            const currentGender = activeGenderBtn ? activeGenderBtn.getAttribute('data-gender') : 'men';
            
            // Add visual feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transition = 'transform 0.2s ease';
                this.style.transform = 'scale(1)';
            }, 100);
            
            // Navigate to shop page with filters
            const shopUrl = `shop-${currentGender}.html?category=${category}`;
            
            console.log(`Navigating to: ${shopUrl}`);
            
            // Show notification before redirect
            if (window.KeidanUtils) {
                window.KeidanUtils.showNotification(
                    `Loading ${categoryName} for ${currentGender === 'men' ? "Men" : "Women"}...`,
                    'info'
                );
            }
            
            // Navigate after short delay
            setTimeout(() => {
                window.location.href = shopUrl;
            }, 500);
        });
        
        // Add hover effect
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f9f9f9';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
        });
    });
}

// ========== PRODUCT CARDS ==========
function initProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking a button inside the card
            if (e.target.closest('button')) return;
            
            const productName = this.querySelector('.product-name').textContent;
            const productId = `product-${index + 1}`; // Generate ID based on position
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transition = 'transform 0.2s ease';
                this.style.transform = '';
            }, 150);
            
            // Navigate to product detail page with ID
            const productUrl = `product-detail.html?id=${productId}`;
            
            console.log(`Opening product: ${productName} (${productId})`);
            
            setTimeout(() => {
                window.location.href = productUrl;
            }, 200);
        });
    });
}

// ========== COLLECTION CARDS ==========
function initCollectionCards() {
    const collectionCards = document.querySelectorAll('.collection-card');
    
    collectionCards.forEach((card, index) => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            
            const collectionName = this.querySelector('.collection-name').textContent;
            const collectionId = collectionName.toLowerCase().replace(/\s+/g, '-');
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transition = 'transform 0.2s ease';
                this.style.transform = '';
            }, 150);
            
            // Navigate to collection page with ID
            const collectionUrl = `collection.html?id=${collectionId}`;
            
            console.log(`Opening collection: ${collectionName} (${collectionId})`);
            
            if (window.KeidanUtils) {
                window.KeidanUtils.showNotification(
                    `Loading ${collectionName} collection...`,
                    'info'
                );
            }
            
            setTimeout(() => {
                window.location.href = collectionUrl;
            }, 300);
        });
    });
}

// ========== LOOKBOOK CARDS ==========
function initLookbookCards() {
    const lookbookCards = document.querySelectorAll('.lookbook-card');
    
    lookbookCards.forEach((card, index) => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            
            const lookbookTitle = this.querySelector('.lookbook-title').textContent;
            const lookbookId = `lookbook-${index + 1}`;
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transition = 'transform 0.2s ease';
                this.style.transform = '';
            }, 150);
            
            // Navigate to lookbook page with ID
            const lookbookUrl = `lookbook.html?id=${lookbookId}`;
            
            console.log(`Opening lookbook: ${lookbookTitle} (${lookbookId})`);
            
            if (window.KeidanUtils) {
                window.KeidanUtils.showNotification(
                    `Loading lookbook...`,
                    'info'
                );
            }
            
            setTimeout(() => {
                window.location.href = lookbookUrl;
            }, 300);
        });
    });
}

// ========== HERO EXPLORE BUTTON ==========
function initHeroButton() {
    const exploreBtn = document.querySelector('.btn-explore');
    
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function(e) {
            console.log('Explore Collection button clicked');
            
            // Add analytics tracking here if needed
            if (window.gtag) {
                gtag('event', 'click', {
                    'event_category': 'Navigation',
                    'event_label': 'Explore Collection from Hero'
                });
            }
        });
    }
}

// ========== SCROLL TO TOP BUTTON (OPTIONAL) ==========
function initScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #000;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top (optional - uncomment if you want it)
// initScrollToTop();

// ========== UTILITY: Get Current Gender ==========
function getCurrentGender() {
    const activeGenderBtn = document.querySelector('.toggle-btn.active');
    return activeGenderBtn ? activeGenderBtn.getAttribute('data-gender') : 'men';
}

// ========== EXPORT FUNCTIONS ==========
window.KeidanFashion = {
    getCurrentGender
};

console.log('Keidan Fashion utilities loaded');