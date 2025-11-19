let wishlistItems = [];
const WISHLIST_STORAGE_KEY = 'keidan_wishlist';

// Initialize wishlist from storage (if available)
function initWishlist() {
    // Uncomment this when deploying to use localStorage
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (stored) {
        try {
            wishlistItems = JSON.parse(stored);
        } catch (e) {
            console.error('Error loading wishlist:', e);
            wishlistItems = [];
        }
    }

    updateWishlistBadge();
    updateWishlistHearts();
    console.log('Wishlist initialized:', wishlistItems);
}

// Save wishlist to storage
function saveWishlist() {
    try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch (e) {
        console.error('Error saving wishlist:', e);
    }
    
    updateWishlistBadge();
    updateWishlistHearts();
}

// ADD TO WISHLIST 
function addToWishlist(product) {
    // Product should have: id, name, price, image
    const {
        id,
        name,
        price,
        image,
        description = null,
        category = null
    } = product;
    
    // Check if item already exists in wishlist
    const exists = wishlistItems.some(item => item.id === id);
    
    if (exists) {
        if (window.KeidanUtils) {
            window.KeidanUtils.showNotification(
                `${name} is already in your wishlist`,
                'info'
            );
        }
        return false;
    }
    
    // Add new item to wishlist
    const wishlistItem = {
        id,
        name,
        price,
        image,
        description,
        category,
        addedAt: new Date().toISOString()
    };
    
    wishlistItems.push(wishlistItem);
    
    if (window.KeidanUtils) {
        window.KeidanUtils.showNotification(
            `Added to wishlist: ${name} ♡`,
            'success'
        );
    }
    
    saveWishlist();
    console.log('Wishlist after add:', wishlistItems);
    
    return true;
}

// REMOVE FROM WISHLIST
function removeFromWishlist(productId) {
    const initialLength = wishlistItems.length;
    const removedItem = wishlistItems.find(item => item.id === productId);
    
    wishlistItems = wishlistItems.filter(item => item.id !== productId);
    
    if (wishlistItems.length < initialLength) {
        if (window.KeidanUtils && removedItem) {
            window.KeidanUtils.showNotification(
                `Removed from wishlist: ${removedItem.name}`,
                'info'
            );
        }
        
        saveWishlist();
        console.log('Wishlist after remove:', wishlistItems);
        return true;
    }
    
    return false;
}

// TOGGLE WISHLIST
function toggleWishlist(product) {
    const exists = isInWishlist(product.id);
    
    if (exists) {
        removeFromWishlist(product.id);
    } else {
        addToWishlist(product);
    }
    
    return !exists; // Return new state
}

// GET WISHLIST
function getWishlist() {
    return [...wishlistItems]; // Return a copy
}

// GET WISHLIST COUNT
function getWishlistCount() {
    return wishlistItems.length;
}

// CHECK IF ITEM IN WISHLIST
function isInWishlist(productId) {
    return wishlistItems.some(item => item.id === productId);
}

// GET SPECIFIC WISHLIST ITEM
function getWishlistItem(productId) {
    return wishlistItems.find(item => item.id === productId);
}

// CLEAR WISHLIST 
function clearWishlist() {
    wishlistItems = [];
    saveWishlist();
    
    if (window.KeidanUtils) {
        window.KeidanUtils.showNotification(
            'Wishlist cleared',
            'info'
        );
    }
    
    console.log('Wishlist cleared');
}

//  MOVE TO CART
function moveToCart(productId) {
    const item = getWishlistItem(productId);
    
    if (item && window.KeidanCart) {
        // Add to cart
        window.KeidanCart.addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1
        });
        
        // Remove from wishlist
        removeFromWishlist(productId);
        
        if (window.KeidanUtils) {
            window.KeidanUtils.showNotification(
                `${item.name} moved to cart`,
                'success'
            );
        }
        
        return true;
    }
    
    return false;
}

// MOVE ALL TO CART
function moveAllToCart() {
    if (wishlistItems.length === 0) {
        if (window.KeidanUtils) {
            window.KeidanUtils.showNotification(
                'Your wishlist is empty',
                'info'
            );
        }
        return false;
    }
    
    if (window.KeidanCart) {
        wishlistItems.forEach(item => {
            window.KeidanCart.addToCart({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: 1
            });
        });
        
        const count = wishlistItems.length;
        clearWishlist();
        
        if (window.KeidanUtils) {
            window.KeidanUtils.showNotification(
                `${count} item(s) moved to cart`,
                'success'
            );
        }
        
        return true;
    }
    
    return false;
}

// UPDATE WISHLIST BADGE
function updateWishlistBadge() {
    const wishlistIcon = document.querySelectorAll('.nav-icon')[1]; // Heart is 2nd icon
    
    if (wishlistIcon) {
        const count = getWishlistCount();
        
        // Remove existing badge
        const existingBadge = wishlistIcon.querySelector('.wishlist-badge');
        if (existingBadge) {
            existingBadge.remove();
        }
        
        // Add badge if count > 0
        if (count > 0) {
            const badge = document.createElement('span');
            badge.className = 'wishlist-badge';
            badge.textContent = count > 99 ? '99+' : count;
            badge.style.cssText = `
                position: absolute;
                top: -8px;
                right: -8px;
                background: #ff4444;
                color: white;
                font-size: 0.7rem;
                font-weight: 700;
                padding: 0.2rem 0.4rem;
                border-radius: 50%;
                min-width: 18px;
                height: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            wishlistIcon.style.position = 'relative';
            wishlistIcon.appendChild(badge);
        }
    }
}

// UPDATE HEART ICONS ON PAGE
function updateWishlistHearts() {
    // Update all heart buttons on the page
    const heartButtons = document.querySelectorAll('[data-wishlist-id]');
    
    heartButtons.forEach(button => {
        const productId = button.getAttribute('data-wishlist-id');
        const inWishlist = isInWishlist(productId);
        
        if (inWishlist) {
            button.classList.add('active');
            button.style.color = '#ff4444';
            button.textContent = '♥';
        } else {
            button.classList.remove('active');
            button.style.color = '';
            button.textContent = '♡';
        }
    });
}

// WISHLIST ICON CLICK
function initWishlistIcon() {
    const wishlistIcon = document.querySelectorAll('.nav-icon')[1]; // Heart icon
    
    if (wishlistIcon) {
        wishlistIcon.style.cursor = 'pointer';
        
        wishlistIcon.addEventListener('click', function() {
            const count = getWishlistCount();
            
            if (count > 0) {
                // Navigate to wishlist page
                window.location.href = 'wishlist.html';
            } else {
                if (window.KeidanUtils) {
                    window.KeidanUtils.showNotification(
                        'Your wishlist is empty',
                        'info'
                    );
                }
            }
        });
    }
}

// VIEW WISHLIST 
function viewWishlist() {
    window.location.href = 'wishlist.html';
}

// INITIALIZE WISHLIST BUTTONS 
function initWishlistButtons() {
    const wishlistButtons = document.querySelectorAll('[data-wishlist-id]');
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = this.getAttribute('data-wishlist-id');
            const productName = this.getAttribute('data-wishlist-name');
            const productPrice = this.getAttribute('data-wishlist-price');
            const productImage = this.getAttribute('data-wishlist-image');
            
            if (productId) {
                const product = {
                    id: productId,
                    name: productName || 'Product',
                    price: parseFloat(productPrice) || 0,
                    image: productImage || 'placeholder.jpg'
                };
                
                toggleWishlist(product);
                
                // Animate button
                this.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    this.style.transition = 'transform 0.2s ease';
                    this.style.transform = 'scale(1)';
                }, 200);
            }
        });
    });
}

//  QUICK ADD TO WISHLIST
function quickAddToWishlist(element) {
    const productId = element.getAttribute('data-product-id');
    const productName = element.getAttribute('data-product-name');
    const productPrice = element.getAttribute('data-product-price');
    const productImage = element.getAttribute('data-product-image');
    
    if (productId && productName && productPrice) {
        addToWishlist({
            id: productId,
            name: productName,
            price: parseFloat(productPrice),
            image: productImage || 'placeholder.jpg'
        });
    }
}

// INITIALIZE 
document.addEventListener('DOMContentLoaded', function() {
    initWishlist();
    initWishlistIcon();
    initWishlistButtons();
    console.log('Wishlist system initialized');
});

// EXPORT FUNCTIONS
window.KeidanWishlist = {
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    getWishlist,
    getWishlistCount,
    isInWishlist,
    getWishlistItem,
    clearWishlist,
    moveToCart,
    moveAllToCart,
    viewWishlist,
    quickAddToWishlist,
    updateWishlistBadge,
    updateWishlistHearts
};

// FOR BACKEND INTEGRATION
// When you connect to Python backend, use these functions:

// Sync wishlist with backend
async function syncWishlistWithBackend() {
    try {
        const response = await fetch('/api/wishlist/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add auth token here
            },
            body: JSON.stringify({
                items: wishlistItems
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('Wishlist synced with backend:', data);
        }
    } catch (error) {
        console.error('Error syncing wishlist:', error);
    }
}

// Load wishlist from backend
async function loadWishlistFromBackend() {
    try {
        const response = await fetch('/api/wishlist', {
            headers: {
                // Add auth token here
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            wishlistItems = data.items || [];
            saveWishlist();
            console.log('Wishlist loaded from backend:', wishlistItems);
        }
    } catch (error) {
        console.error('Error loading wishlist from backend:', error);
    }
}

window.KeidanWishlist.syncWishlistWithBackend = syncWishlistWithBackend;
window.KeidanWishlist.loadWishlistFromBackend = loadWishlistFromBackend;

console.log('Keidan Wishlist JS loaded successfully!');