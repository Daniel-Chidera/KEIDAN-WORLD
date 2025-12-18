// INITIALIZE
document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    initCheckoutButton();
    
    console.log('Cart page initialized');
});

// LOAD CART ITEMS
function loadCartItems() {
    if (!window.KeidanCart) {
        console.error('Cart system not loaded');
        return;
    }
    
    const cartItems = window.KeidanCart.getCart();
    const container = document.getElementById('cartItemsContainer');
    const emptyState = document.getElementById('emptyCartState');
    const cartSummary = document.getElementById('cartSummary');
    
    // Clear container
    container.innerHTML = '';
    
    if (cartItems.length === 0) {
        // Show empty state
        emptyState.style.display = 'block';
        cartSummary.style.display = 'none';
    } else {
        // Show cart items
        emptyState.style.display = 'none';
        cartSummary.style.display = 'block';
        
        cartItems.forEach(item => {
            const cartItemElement = createCartItemElement(item);
            container.appendChild(cartItemElement);
        });
        
        updateSubtotal();
    }
}

// CREATE CART ITEM ELEMENT
function createCartItemElement(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.setAttribute('data-item-id', item.id);
    cartItem.setAttribute('data-item-size', item.size || '');
    cartItem.setAttribute('data-item-color', item.color || '');
    
    // Calculate delivery date (today + 5 days)
    const deliveryDate = calculateDeliveryDate(5);
    
    // Get color hex value
    const colorHex = getColorHex(item.color);
    
    cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-info">
            <button class="remove-item-btn" onclick="removeCartItem('${item.id}', '${item.size || ''}', '${item.color || ''}')"><i class="fa-solid fa-trash-can"></i></button>
            
            <div>
                <h2 class="cart-product-name">${item.name}</h2>
                <p class="cart-delivery-date">Delivery Date: ${deliveryDate}</p>
                <p class="cart-product-price">₦${item.price}</p>
                <p class="cart-product-description">Body text for describing what this product is and why this product is simply a must-buy.</p>
                
                <div class="cart-options">
                    ${item.color ? `
                    <div class="cart-option-group">
                        <span class="cart-option-label">Color:</span>
                        <div class="cart-color-display" style="background: ${colorHex};"></div>
                    </div>
                    ` : ''}
                    
                    ${item.size ? `
                    <div class="cart-option-group">
                        <span class="cart-option-label">Size:</span>
                        <div class="cart-size-display">${item.size}</div>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="quantity-controls">
                <button class="qty-btn minus" onclick="decreaseQuantity('${item.id}', '${item.size || ''}', '${item.color || ''}')">−</button>
                <input type="number" class="qty-input" value="${item.quantity}" min="1" readonly>
                <button class="qty-btn plus" onclick="increaseQuantity('${item.id}', '${item.size || ''}', '${item.color || ''}')">+</button>
            </div>
        </div>
    `;
    
    return cartItem;
}

// CALCULATE DELIVERY DATE
function calculateDeliveryDate(daysToAdd) {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + daysToAdd);
    
    // Format as DD-MM-YY
    const day = String(deliveryDate.getDate()).padStart(2, '0');
    const month = String(deliveryDate.getMonth() + 1).padStart(2, '0');
    const year = String(deliveryDate.getFullYear()).slice(-2);
    
    return `${day}-${month}-${year}`;
}

// GET COLOR HEX VALUE
function getColorHex(colorName) {
    const colors = {
        'black': '#000000',
        'brown': '#8B4513',
        'gray': '#C0C0C0',
        'grey': '#C0C0C0',
        'white': '#FFFFFF',
        'red': '#FF0000',
        'blue': '#0000FF',
        'green': '#008000',
        'yellow': '#FFFF00',
        'orange': '#FFA500',
        'purple': '#800080',
        'pink': '#FFC0CB'
    };
    
    return colors[colorName?.toLowerCase()] || '#000000';
}

// INCREASE QUANTITY
function increaseQuantity(productId, size, color) {
    if (!window.KeidanCart) return;
    
    const item = window.KeidanCart.getCartItem(productId, size || null, color || null);
    if (item) {
        window.KeidanCart.updateQuantity(productId, item.quantity + 1, size || null, color || null);
        loadCartItems();
    }
}

// DECREASE QUANTITY
function decreaseQuantity(productId, size, color) {
    if (!window.KeidanCart) return;
    
    const item = window.KeidanCart.getCartItem(productId, size || null, color || null);
    if (item && item.quantity > 1) {
        window.KeidanCart.updateQuantity(productId, item.quantity - 1, size || null, color || null);
        loadCartItems();
    }
}

// REMOVE CART ITEM
function removeCartItem(productId, size, color) {
    if (!window.KeidanCart) return;
    
    // Confirm removal
    if (confirm('Are you sure you want to remove this item from your cart?')) {
        window.KeidanCart.removeFromCart(productId, size || null, color || null);
        loadCartItems();
    }
}

// UPDATE SUBTOTAL
function updateSubtotal() {
    if (!window.KeidanCart) return;
    
    const subtotal = window.KeidanCart.getCartTotal();
    const subtotalElement = document.getElementById('subtotalAmount');
    
    if (subtotalElement) {
        subtotalElement.textContent = `₦${subtotal.toFixed(2)}`;
    }
}

// CHECKOUT BUTTON
function initCheckoutButton() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (!window.KeidanCart) return;
            
            const cartItems = window.KeidanCart.getCart();
            
            if (cartItems.length === 0) {
                if (window.KeidanUtils) {
                    window.KeidanUtils.showNotification('Your cart is empty', 'error');
                }
                return;
            }
            
            // Proceed to payment page
            window.location.href = 'payment.html';
        });
    }
}

// MAKE FUNCTIONS GLOBAL
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.removeCartItem = removeCartItem;

console.log('Keidan Cart Page JS loaded successfully!');