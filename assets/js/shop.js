// STATE MANAGEMENT
let currentCategory = 'new-arrivals';
let currentPage = 1;
const ITEMS_PER_PAGE = 9;

// INITIALIZE
document.addEventListener('DOMContentLoaded', function() {
    initCategoryTabs();
    initPagination();
    initExploreButton();
    initProductCards();
    initWishlistButtons();
    initAddToCartButtons();
    
    // Check URL for category parameter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        switchCategory(categoryParam, false);
    } else {
        filterProducts(currentCategory);
    }
    
    console.log('Shop page initialized');
});

// CATEGORY TABS
function initCategoryTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            switchCategory(category, true);
        });
    });
}

function switchCategory(category, showNotification = true) {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeTab = document.querySelector(`.tab-btn[data-category="${category}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Update state
    currentCategory = category;
    currentPage = 1;
    
    // Update URL without refresh
    const url = new URL(window.location);
    url.searchParams.set('category', category);
    window.history.pushState({}, '', url);
    
    // Filter products
    filterProducts(category);
    
    // Show notification
    if (showNotification && window.KeidanUtils) {
        const categoryNames = {
            'new-arrivals': 'New Arrivals',
            'limited-editions': 'Limited Editions',
            'collections': 'Collections',
            'accessories': 'Accessories',
            'sales': 'Sales'
        };
        window.KeidanUtils.showNotification(
            `Viewing ${categoryNames[category]}`,
            'info'
        );
    }
}

// FILTER PRODUCTS
function filterProducts(category) {
    const allProducts = document.querySelectorAll('.product-card');
    const emptyState = document.querySelector('.empty-state');
    let visibleCount = 0;
    
    // Hide all products first
    allProducts.forEach(product => {
        product.style.display = 'none';
    });
    
    // Show only products in the selected category
    const categoryProducts = document.querySelectorAll(`.product-card[data-category="${category}"]`);
    
    // Calculate pagination
    const totalProducts = categoryProducts.length;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    // Show products for current page
    categoryProducts.forEach((product, index) => {
        if (index >= startIndex && index < endIndex) {
            product.style.display = 'block';
            visibleCount++;
        }
    });
    
    // Show or hide empty state
    if (visibleCount === 0) {
        if (emptyState) emptyState.style.display = 'block';
    } else {
        if (emptyState) emptyState.style.display = 'none';
    }
    
    // Update pagination
    updatePagination(totalProducts);
    
    // Scroll to products section
    const productsSection = document.querySelector('.products-section');
    if (productsSection) {
        window.scrollTo({
            top: productsSection.offsetTop - 100,
            behavior: 'smooth'
        });
    }
}

// PRODUCT CARDS CLICK
function initProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking wishlist button or add to cart button
            if (e.target.closest('.wishlist-btn') || e.target.closest('.btn-add-to-cart')) {
                return;
            }
            
            const productId = this.getAttribute('data-product-id');
            window.location.href = `product-detail.html?id=${productId}`;
        });
    });
}

// ADD TO CART BUTTONS
function initAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // PREVENT OPENING PRODUCT PAGE
            
            const productCard = this.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPriceText = productCard.querySelector('.product-price').textContent;
            const productPrice = parseFloat(productPriceText.replace('₦', '').replace(',', ''));
            const productImage = productCard.querySelector('.product-image').src;
            
            // Add to cart (using window.KeidanCart if available)
            if (window.KeidanCart) {
                window.KeidanCart.addToCart({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }
            
            // Show notification
            if (window.KeidanUtils) {
                window.KeidanUtils.showNotification(
                    `${productName} added to cart!`,
                    'success'
                );
            }
            
            console.log('Added to cart:', {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage
            });
        });
    });
}

// WISHLIST BUTTONS
function initWishlistButtons() {
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (window.KeidanWishlist) {
                const productId = this.getAttribute('data-wishlist-id');
                const productName = this.getAttribute('data-wishlist-name');
                const productPrice = this.getAttribute('data-wishlist-price');
                const productImage = this.getAttribute('data-wishlist-image');
                
                // Toggle wishlist
                const added = window.KeidanWishlist.toggleWishlist({
                    id: productId,
                    name: productName,
                    price: parseFloat(productPrice),
                    image: productImage
                });
                
                // Update button
                if (added) {
                    this.classList.add('active');
                    this.textContent = '♥';
                } else {
                    this.classList.remove('active');
                    this.textContent = '♡';
                }
                
                // Animate button
                this.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    this.style.transition = 'transform 0.2s ease';
                    this.style.transform = 'scale(1)';
                }, 200);
            }
        });
    });
    
    // Update wishlist hearts on page load
    if (window.KeidanWishlist) {
        wishlistButtons.forEach(button => {
            const productId = button.getAttribute('data-wishlist-id');
            if (window.KeidanWishlist.isInWishlist(productId)) {
                button.classList.add('active');
                button.textContent = '♥';
            }
        });
    }
}

// PAGINATION
function initPagination() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                filterProducts(currentCategory);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const categoryProducts = document.querySelectorAll(`.product-card[data-category="${currentCategory}"]`);
            const totalPages = Math.ceil(categoryProducts.length / ITEMS_PER_PAGE);
            
            if (currentPage < totalPages) {
                currentPage++;
                filterProducts(currentCategory);
            }
        });
    }
}

function updatePagination(totalProducts) {
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
    const pagination = document.getElementById('pagination');
    
    if (!pagination) return;
    
    const prevBtn = pagination.querySelector('.prev-btn');
    const nextBtn = pagination.querySelector('.next-btn');
    
    // Update prev/next button states
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    // Remove existing number buttons
    const existingNumbers = pagination.querySelectorAll('.pagination-number');
    existingNumbers.forEach(btn => btn.remove());
    
    // Create new number buttons
    const maxButtons = Math.min(totalPages, 5);
    for (let i = 1; i <= maxButtons; i++) {
        const numBtn = document.createElement('button');
        numBtn.className = 'pagination-number';
        numBtn.setAttribute('data-page', i);
        numBtn.textContent = i;
        
        if (i === currentPage) {
            numBtn.classList.add('active');
        }
        
        numBtn.addEventListener('click', function() {
            currentPage = i;
            filterProducts(currentCategory);
        });
        
        // Insert before next button
        if (nextBtn) {
            pagination.insertBefore(numBtn, nextBtn);
        }
    }
    
    // Hide pagination if only one page or no products
    if (totalPages <= 1) {
        pagination.style.display = 'none';
    } else {
        pagination.style.display = 'flex';
    }
}

// EXPLORE BUTTON
function initExploreButton() {
    const exploreBtn = document.querySelector('.btn-explore-shop');
    
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function() {
            const productsSection = document.querySelector('.products-section');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// EXPORT FUNCTIONS
window.KeidanShop = {
    switchCategory,
    filterProducts,
    getCurrentCategory: () => currentCategory,
    getCurrentPage: () => currentPage
};

console.log('Keidan Shop JS loaded successfully!');