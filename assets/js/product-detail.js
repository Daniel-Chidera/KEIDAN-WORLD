let currentProduct = null;
let selectedColor = 'black';
let selectedSize = 'S';

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', function() {
    loadProductFromURL();
    initColorSelection();
    initSizeSelection();
    initAddToCartButton();
    initFloatingCartButton();
    updateFloatingCartBadge();
    
    console.log('Product detail page initialized');
});

// ========== LOAD PRODUCT FROM URL ==========
function loadProductFromURL() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        console.error('No product ID in URL');
        window.location.href = 'shop.html';
        return;
    }
    
    // Fetch shop.html and extract product data
    fetchProductFromShop(productId);
}

// ========== FETCH PRODUCT FROM SHOP.HTML ==========
function fetchProductFromShop(productId) {
    fetch('shop.html')
        .then(response => response.text())
        .then(html => {
            // Parse HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Find the product card with matching ID
            const productCard = doc.querySelector(`.product-card[data-product-id="${productId}"]`);
            
            if (productCard) {
                // Extract product data from HTML
                const productData = {
                    id: productId,
                    name: productCard.querySelector('.product-name').textContent,
                    price: productCard.querySelector('.product-price').textContent.replace('$', ''),
                    description: productCard.querySelector('.product-description').textContent,
                    image: productCard.querySelector('.product-image').src,
                    category: productCard.getAttribute('data-category')
                };
                
                currentProduct = productData;
                displayProduct(productData);
                loadRelatedProducts(productData.category);
            } else {
                console.error('Product not found in shop.html');
                window.location.href = 'shop.html';
            }
        })
        .catch(error => {
            console.error('Error fetching shop.html:', error);
            window.location.href = 'shop.html';
        });
}

// ========== DISPLAY PRODUCT ==========
function displayProduct(product) {
    // Update page elements
    document.getElementById('mainProductImage').src = product.image;
    document.getElementById('mainProductImage').alt = product.name;
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productSubheading').textContent = 'Subheading';
    document.getElementById('productDescription').textContent = product.description;
    document.getElementById('productPrice').textContent = `$${product.price}`;
    
    // Update page title
    document.title = `${product.name} - Keidan`;
}

// ========== COLOR SELECTION ==========
function initColorSelection() {
    const colorButtons = document.querySelectorAll('.color-btn');
    
    colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            colorButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            selectedColor = this.getAttribute('data-color');
            console.log('Selected color:', selectedColor);
        });
    });
}

// ========== SIZE SELECTION ==========
function initSizeSelection() {
    const sizeButtons = document.querySelectorAll('.size-btn');
    
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            selectedSize = this.getAttribute('data-size');
            console.log('Selected size:', selectedSize);
        });
    });
}

// ========== ADD TO CART ==========
function initAddToCartButton() {
    const addToCartBtn = document.getElementById('addToCartBtn');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            if (!currentProduct) return;
            
            if (window.KeidanCart) {
                window.KeidanCart.addToCart({
                    id: currentProduct.id,
                    name: currentProduct.name,
                    price: parseFloat(currentProduct.price),
                    image: currentProduct.image,
                    quantity: 1,
                    size: selectedSize,
                    color: selectedColor
                });
                
                updateFloatingCartBadge();
                
                // Visual feedback
                addToCartBtn.textContent = 'Added! ✓';
                addToCartBtn.style.background = '#4CAF50';
                
                setTimeout(() => {
                    addToCartBtn.textContent = 'Add to cart';
                    addToCartBtn.style.background = '#000';
                }, 2000);
            }
        });
    }
}

// ========== FLOATING CART BUTTON ==========
function initFloatingCartButton() {
    const floatingCartBtn = document.getElementById('floatingCartBtn');
    
    if (floatingCartBtn) {
        floatingCartBtn.addEventListener('click', function() {
            window.location.href = 'cart-page.html';
        });
    }
}

function updateFloatingCartBadge() {
    const badge = document.getElementById('floatingCartBadge');
    
    if (badge && window.KeidanCart) {
        const count = window.KeidanCart.getCartCount();
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

// ========== LOAD RELATED PRODUCTS ==========
function loadRelatedProducts(category) {
    // Fetch shop.html to get related products
    fetch('shop.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Get all products from same category
            const categoryProducts = doc.querySelectorAll(`.product-card[data-category="${category}"]`);
            const relatedProducts = [];
            
            categoryProducts.forEach(card => {
                const productId = card.getAttribute('data-product-id');
                
                // Exclude current product
                if (productId !== currentProduct.id) {
                    relatedProducts.push({
                        id: productId,
                        name: card.querySelector('.product-name').textContent,
                        price: card.querySelector('.product-price').textContent.replace('$', ''),
                        description: card.querySelector('.product-description').textContent,
                        image: card.querySelector('.product-image').src
                    });
                }
            });
            
            // Show only first 6
            displayRelatedProducts(relatedProducts.slice(0, 6));
        })
        .catch(error => {
            console.error('Error loading related products:', error);
        });
}

// ========== DISPLAY RELATED PRODUCTS ==========
function displayRelatedProducts(products) {
    const grid = document.getElementById('relatedProductsGrid');
    grid.innerHTML = '';
    
    products.forEach(product => {
        const card = createRelatedProductCard(product);
        grid.appendChild(card);
    });
}

function createRelatedProductCard(product) {
    const card = document.createElement('div');
    card.className = 'related-product-card';
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="related-product-image">
        <div class="related-product-info">
            <p class="related-product-label">Product</p>
            <h3 class="related-product-name">${product.name}</h3>
            <p class="related-product-description">${product.description}</p>
            <p class="related-product-price">$${product.price}</p>
        </div>
    `;
    
    // Click to view product
    card.addEventListener('click', function() {
        window.location.href = `product-detail.html?id=${product.id}`;
    });
    
    return card;
}

// ========== EXPORT FUNCTIONS ==========
window.KeidanProductDetail = {
    getCurrentProduct: () => currentProduct,
    getSelectedColor: () => selectedColor,
    getSelectedSize: () => selectedSize
};

console.log('Keidan Product Detail JS loaded successfully!');