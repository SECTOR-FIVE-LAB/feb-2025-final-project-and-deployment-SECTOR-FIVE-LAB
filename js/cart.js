// Cart Management
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.total = 0;
        this.updateCartCount();
        this.updateTotal();
    }

    // Add item to cart
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.updateTotal();
        this.renderCart();
    }

    // Remove item from cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.updateTotal();
        this.renderCart();
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.updateCartCount();
                this.updateTotal();
                this.renderCart();
            }
        }
    }

    // Clear cart
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartCount();
        this.updateTotal();
        this.renderCart();
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    // Update cart count in header
    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    // Calculate and update total
    updateTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    // Render cart items
    renderCart() {
        const cartContainer = document.querySelector('.cart-items');
        if (!cartContainer) return;

        if (this.items.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="products.html" class="btn">Continue Shopping</a>
                </div>
            `;
            return;
        }

        cartContainer.innerHTML = `
            <div class="cart-items-list">
                ${this.items.map(item => this.createCartItemElement(item)).join('')}
            </div>
            <div class="cart-summary">
                <div class="cart-total">
                    <span>Total:</span>
                    <span>KES ${this.total.toLocaleString()}</span>
                </div>
                <button class="btn checkout-btn">Proceed to Checkout</button>
                <button class="btn btn-secondary clear-cart-btn">Clear Cart</button>
            </div>
        `;

        // Add event listeners to cart items
        this.addCartEventListeners();
    }

    // Create cart item element
    createCartItemElement(item) {
        return `
            <div class="cart-item" data-product-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="cart-item-price">KES ${item.price.toLocaleString()}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus">-</button>
                        <input type="number" value="${item.quantity}" min="1" max="99" 
                               class="quantity-input" data-product-id="${item.id}">
                        <button class="quantity-btn plus">+</button>
                    </div>
                </div>
                <button class="remove-item-btn" data-product-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }

    // Add event listeners to cart items
    addCartEventListeners() {
        const cartContainer = document.querySelector('.cart-items');
        if (!cartContainer) return;

        // Quantity buttons
        cartContainer.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('.cart-item').dataset.productId);
                const input = e.target.parentElement.querySelector('.quantity-input');
                const currentValue = parseInt(input.value);
                
                if (e.target.classList.contains('plus')) {
                    this.updateQuantity(productId, currentValue + 1);
                } else if (e.target.classList.contains('minus')) {
                    this.updateQuantity(productId, currentValue - 1);
                }
            });
        });

        // Quantity input
        cartContainer.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                const newQuantity = parseInt(e.target.value);
                this.updateQuantity(productId, newQuantity);
            });
        });

        // Remove buttons
        cartContainer.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('.cart-item').dataset.productId);
                this.removeItem(productId);
            });
        });

        // Clear cart button
        const clearCartBtn = cartContainer.querySelector('.clear-cart-btn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear your cart?')) {
                    this.clearCart();
                }
            });
        }

        // Checkout button
        const checkoutBtn = cartContainer.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                // Here you would typically redirect to a checkout page
                alert('Proceeding to checkout...');
            });
        }
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Add to cart function (used by product cards)
function addToCart(product) {
    cart.addItem(product);
}

// Initialize cart page
document.addEventListener('DOMContentLoaded', () => {
    // Render cart if on cart page
    if (document.querySelector('.cart-items')) {
        cart.renderCart();
    }
}); 