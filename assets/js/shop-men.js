let currentCategory = null;
let currentPage = 1;
const ITEMS_PER_PAGE = 9;

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', function() {
    initExploreButtons();
    initHeroExploreButton();
    initBackToCategories();
    initFeaturedProducts();
    
    // Check URL for category parameter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
        showCategoryProducts(categoryParam);
    }
    
    console.log('Shop Men page initialized');
});

// ========== EXPLORE BUTTONS ==========
function initExploreButtons() {
    const exploreButtons = document.querySelectorAll('.btn-explore');
    
    exploreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            showCategoryProducts(category);
        });
    });
}

// ========== HERO EXPLORE BUTTON ==========
function initHeroExploreButton() {
    const heroBtn = document.querySelector('.btn-explore-hero');
    
    if (heroBtn) {
        heroBtn.addEventListener('click', function() {
            const categoriesSection = document.querySelector('.categories-section');
            if (categoriesSection) {
                categoriesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// ========== SHOW CATEGORY PRODUCTS ==========
function showCategoryProducts(category) {
    currentCategory = category;
    currentPage = 1;
    
    // Hide categories section
    const categoriesSection = document.querySelector('.categories-section');
    const productsSection = document.getElementById('productsDisplaySection');
    
    if (categoriesSection) categoriesSection.style.display = 'none';
    if (productsSection) productsSection.style.display = 'block';
    
    // Update category title
    const categoryTitle = document.getElementById('productsCategoryTitle');
    if (categoryTitle) {
        const titles = {
            'tops': 'Tops',
            'footwear': 'Footwear',
            'traditional': 'Traditional & African Wear',
            'accessories': 'Accessories'
        };
        categoryTitle.textContent = titles[category] || 'Products';
    }
    
    // Update URL
    const url = new URL(window.location);
    url.searchParams.set('category', category);
    window.history.pushState({}, '', url);
    
    // Load products
    loadMenProducts(category);
    
    // Scroll to products section
    if (productsSection) {
        window.scrollTo({
            top: productsSection.offsetTop - 100,
            behavior: 'smooth'
        });
    }
}

// ========== BACK TO CATEGORIES ==========
function initBackToCategories() {
    const backBtn = document.getElementById('backToCategoriesBtn');
    
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            const categoriesSection = document.querySelector('.categories-section');
            const productsSection = document.getElementById('productsDisplaySection');
            
            if (categoriesSection) categoriesSection.style.display = 'block';
            if (productsSection) productsSection.style.display = 'none';
            
            // Clear URL parameter
            const url = new URL(window.location);
            url.searchParams.delete('category');
            window.history.pushState({}, '', url);
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ========== LOAD MEN'S PRODUCTS ==========
function loadMenProducts(category) {
    // Fetch shop.html to get men's products
    fetch('shop.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Get all products from the category
            // For now, we'll use products from shop.html with matching category
            const categoryProducts = doc.querySelectorAll(`.product-card[data-category="${category}"]`);
            const menProducts = [];
            
            categoryProducts.forEach(card => {
                menProducts.push({
                    id: card.getAttribute('data-product-id'),
                    name: card.querySelector('.product-name').textContent,
                    price: card.querySelector('.product-price').textContent.replace('$', ''),
                    description: card.querySelector('.product-description').textContent,
                    image: card.querySelector('.product-image').src,
                    category: category
                });
            });
            
            displayProducts(menProducts);
        })
        .catch(error => {
            console.error('Error loading products:', error);
        });
}

// ========== DISPLAY PRODUCTS ==========
function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedProducts = products.slice(startIndex, endIndex);
    
    if (paginatedProducts.length === 0) {
        grid.innerHTML = '<p style="text-align: center; padding: 3rem; color: #999;">No products found in this category.</p>';
        return;
    }
    
    paginatedProducts.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
    
    // Update pagination
    updatePagination(products.length);
    
    // Initialize wishlist buttons
    initWishlistButtons();
}

// ========== CREATE PRODUCT CARD ==========
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-product-id', product.id);
    
    const inWishlist = window.KeidanWishlist ? window.KeidanWishlist.isInWishlist(product.id) : false;
    
    card.innerHTML = `
        <div class="product-image-container">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <button class="wishlist-btn ${inWishlist ? 'active' : ''}" 
                    data-wishlist-id="${product.id}"
                    data-wishlist-name="${product.name}"
                    data-wishlist-price="${product.price}"
                    data-wishlist-image="${product.image}">
                ${inWishlist ? '♥' : '♡'}
            </button>
        </div>
        <div class="product-details">
            <p class="product-label">Featured product</p>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-price">$${product.price}</p>
        </div>
    `;
    
    // Click to view product
    card.addEventListener('click', function(e) {
        if (!e.target.closest('.wishlist-btn')) {
            window.location.href = `product-detail.html?id=${product.id}`;
        }
    });
    
    return card;
}

// ========== WISHLIST BUTTONS ==========
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
                
                // Animate
                this.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    this.style.transition = 'transform 0.2s ease';
                    this.style.transform = 'scale(1)';
                }, 200);
            }
        });
    });
}

// ========== PAGINATION ==========
function updatePagination(totalProducts) {
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
    const pagination = document.getElementById('pagination');
    const prevBtn = pagination.querySelector('.prev-btn');
    const nextBtn = pagination.querySelector('.next-btn');
    
    // Update buttons state
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
            loadMenProducts(currentCategory);
        });
        
        if (nextBtn) {
            pagination.insertBefore(numBtn, nextBtn);
        }
    }
    
    // Prev/Next button handlers
    if (prevBtn) {
        prevBtn.onclick = function() {
            if (currentPage > 1) {
                currentPage--;
                loadMenProducts(currentCategory);
            }
        };
    }
    
    if (nextBtn) {
        nextBtn.onclick = function() {
            if (currentPage < totalPages) {
                currentPage++;
                loadMenProducts(currentCategory);
            }
        };
    }
    
    // Hide pagination if only one page
    if (totalPages <= 1) {
        pagination.style.display = 'none';
    } else {
        pagination.style.display = 'flex';
    }
}

// ========== FEATURED PRODUCTS ==========
function initFeaturedProducts() {
    const featuredProducts = document.querySelectorAll('.featured-product');
    
    featuredProducts.forEach(product => {
        product.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            window.location.href = `product-detail.html?id=${productId}`;
        });
    });
}

// ========== EXPORT FUNCTIONS ==========
window.KeidanShopMen = {
    showCategoryProducts,
    getCurrentCategory: () => currentCategory,
    getCurrentPage: () => currentPage
};

console.log('Keidan Shop Men JS loaded successfully!');