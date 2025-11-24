// ========== CART DATA STORAGE ==========
let cartItems = [];
const CART_STORAGE_KEY = 'keidan_cart';

// Initialize cart from storage 
function initCart() {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
        try {
            cartItems = JSON.parse(stored);
        } catch (e) {
            console.error('Error loading cart:', e);
            cartItems = [];
        }
    }   
    updateCartBadge();
    console.log('Cart initialized:', cartItems);
}

// Save cart to storage
function saveCart() {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
        console.error('Error saving cart:', e);
    }
    updateCartBadge();
}

// ========== ADD TO CART ==========
function addToCart(product) {
    // id, name, price, image, quantity, size, color
    const {
        id,
        name,
        price,
        image,
        quantity = 1,
        size = null,
        color = null
    } = product;
    
    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(item => {
        if (size && color) {
            return item.id === id && item.size === size && item.color === color;
        } else if (size) {
            return item.id === id && item.size === size;
        } else if (color) {
            return item.id === id && item.color === color;
        } else {
            return item.id === id;
        }
    });
    
    if (existingItemIndex > -1) {
        // Item exists, update quantity
        cartItems[existingItemIndex].quantity += quantity;
        
        if (window.KeidanUtils) {
            window.KeidanUtils.showNotification(
                `Updated quantity in cart: ${name}`,
                'success'
            );
        }
    } else {
        const cartItem = {
            id,
            name,
            price,
            image,
            quantity,
            size,
            color,
            addedAt: new Date().toISOString()
        };
        
        cartItems.push(cartItem);
        
        if (window.KeidanUtils) {
            window.KeidanUtils.showNotification(
                `Added to cart: ${name}`,
                'success'
            );
        }
    }
    
    saveCart();
    console.log('Cart after add:', cartItems);
    
    return true;
}

// REMOVE FROM CART
function removeFromCart(productId, size = null, color = null) {
    const initialLength = cartItems.length;
    
    cartItems = cartItems.filter(item => {
        if (size && color) {
            return !(item.id === productId && item.size === size && item.color === color);
        } else if (size) {
            return !(item.id === productId && item.size === size);
        } else if (color) {
            return !(item.id === productId && item.color === color);
        } else {
            return item.id !== productId;
        }
    });
    
    if (cartItems.length < initialLength) {
        if (window.KeidanUtils) {
            window.KeidanUtils.showNotification(
                'Item removed from cart',
                'info'
            );
        }
        
        saveCart();
        console.log('Cart after remove:', cartItems);
        return true;
    }
    
    return false;
}

// UPDATE QUANTITY
function updateQuantity(productId, newQuantity, size = null, color = null) {
    const item = cartItems.find(item => {
        if (size && color) {
            return item.id === productId && item.size === size && item.color === color;
        } else if (size) {
            return item.id === productId && item.size === size;
        } else if (color) {
            return item.id === productId && item.color === color;
        } else {
            return item.id === productId;
        }
    });
    
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId, size, color);
        } else {
            item.quantity = newQuantity;
            saveCart();
            console.log('Quantity updated:', item);
        }
        return true;
    }
    
    return false;
}

// GET CART
function getCart() {
    return [...cartItems];
}

// GET CART ITEM COUNT
function getCartCount() {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
}

// GET CART TOTAL
function getCartTotal() {
    return cartItems.reduce((total, item) => {
        const itemPrice = parseFloat(item.price);
        return total + (itemPrice * item.quantity);
    }, 0);
}

// GET CART SUBTOTAL 
function getCartSubtotal() {
    return getCartTotal();
}

// CLEAR CART
function clearCart() {
    cartItems = [];
    saveCart();
    
    if (window.KeidanUtils) {
        window.KeidanUtils.showNotification(
            'Cart cleared',
            'info'
        );
    }
    
    console.log('Cart cleared');
}

//  CHECK IF ITEM IN CART
function isInCart(productId, size = null, color = null) {
    return cartItems.some(item => {
        if (size && color) {
            return item.id === productId && item.size === size && item.color === color;
        } else if (size) {
            return item.id === productId && item.size === size;
        } else if (color) {
            return item.id === productId && item.color === color;
        } else {
            return item.id === productId;
        }
    });
}

// GET SPECIFIC CART ITEM
function getCartItem(productId, size = null, color = null) {
    return cartItems.find(item => {
        if (size && color) {
            return item.id === productId && item.size === size && item.color === color;
        } else if (size) {
            return item.id === productId && item.size === size;
        } else if (color) {
            return item.id === productId && item.color === color;
        } else {
            return item.id === productId;
        }
    });
}

// UPDATE CART BADGE
function updateCartBadge() {
    const cartIcon = document.querySelectorAll('.nav-icon')[2]; // Cart is 3rd icon
    
    if (cartIcon) {
        const count = getCartCount();
        
        // Remove existing badge
        const existingBadge = cartIcon.querySelector('.cart-badge');
        if (existingBadge) {
            existingBadge.remove();
        }
        
        // Add badge if count > 0
        if (count > 0) {
            const badge = document.createElement('span');
            badge.className = 'cart-badge';
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
            
            cartIcon.style.position = 'relative';
            cartIcon.appendChild(badge);
        }
    }
}

//  CART ICON CLICK
function initCartIcon() {
    const cartIcon = document.querySelectorAll('.nav-icon')[2]; // Cart icon
    
    if (cartIcon) {
        cartIcon.style.cursor = 'pointer';
        
        cartIcon.addEventListener('click', function() {
            const count = getCartCount();
            
            if (count > 0) {
                window.location.href = 'cart-page.html';
            } else {
                if (window.KeidanUtils) {
                    window.KeidanUtils.showNotification(
                        'Your cart is empty',
                        'info'
                    );
                }
            }
        });
    }
}

//  VIEW CART
function viewCart() {
    window.location.href = 'cart-page.html';
}

//  QUICK ADD TO CART
function quickAddToCart(element) {
    // This can be called from product cards with data attributes
    const productId = element.getAttribute('data-product-id');
    const productName = element.getAttribute('data-product-name');
    const productPrice = element.getAttribute('data-product-price');
    const productImage = element.getAttribute('data-product-image');
    
    if (productId && productName && productPrice) {
        addToCart({
            id: productId,
            name: productName,
            price: parseFloat(productPrice),
            image: productImage || 'placeholder.jpg',
            quantity: 1
        });
    }
}

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', function() {
    initCart();
    initCartIcon();
    console.log('Cart system initialized');
});

// ========== EXPORT FUNCTIONS ==========
window.KeidanCart = {
    addToCart,
    removeFromCart,
    updateQuantity,
    getCart,
    getCartCount,
    getCartTotal,
    getCartSubtotal,
    clearCart,
    isInCart,
    getCartItem,
    viewCart,
    quickAddToCart,
    updateCartBadge
};

// ========== FOR BACKEND INTEGRATION ==========
// When you connect to Python backend, use these functions:

// Sync cart with backend
async function syncCartWithBackend() {
    try {
        const response = await fetch('/api/cart/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add auth token here
            },
            body: JSON.stringify({
                items: cartItems
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('Cart synced with backend:', data);
        }
    } catch (error) {
        console.error('Error syncing cart:', error);
    }
}

// Load cart from backend
async function loadCartFromBackend() {
    try {
        const response = await fetch('/api/cart', {
            headers: {
                // Add auth token here
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            cartItems = data.items || [];
            saveCart();
            console.log('Cart loaded from backend:', cartItems);
        }
    } catch (error) {
        console.error('Error loading cart from backend:', error);
    }
}

window.KeidanCart.syncCartWithBackend = syncCartWithBackend;
window.KeidanCart.loadCartFromBackend = loadCartFromBackend;

console.log('Keidan Cart JS loaded successfully!');