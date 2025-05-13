class CartPage {
    constructor() {
        this.cart = new ShoppingCart();
        this.form = document.getElementById('checkout-form');
        this.deliveryOptions = document.querySelectorAll('input[name="delivery"]');
        this.paymentOptions = document.querySelectorAll('input[name="payment"]');
        
        this.standardDeliveryFee = 200;
        this.expressDeliveryFee = 400;
        
        this.init();
    }
    
    init() {
        // Initialize cart display
        this.renderCart();
        
        // Add event listeners
        this.addEventListeners();
        
        // Update delivery fee based on selected option
        this.updateDeliveryFee();
    }
    
    addEventListeners() {
        // Delivery option change
        this.deliveryOptions.forEach(option => {
            option.addEventListener('change', () => this.updateDeliveryFee());
        });
        
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleCheckout(e));
        
        // Payment method change
        this.paymentOptions.forEach(option => {
            option.addEventListener('change', () => this.handlePaymentMethodChange(option.value));
        });
    }
    
    renderCart() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartItems = this.cart.getItems();
        
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h2>Your cart is empty</h2>
                    <p>Add some delicious chicken products to your cart!</p>
                    <a href="products.html" class="btn">Browse Products</a>
                </div>
            `;
            this.updateSummary(0);
            return;
        }
        
        let cartHTML = '';
        cartItems.forEach(item => {
            cartHTML += this.createCartItemHTML(item);
        });
        
        cartItemsContainer.innerHTML = cartHTML;
        
        // Add event listeners to quantity controls and remove buttons
        this.addCartItemEventListeners();
        
        // Update summary
        this.updateSummary(this.cart.getTotal());
    }
    
    createCartItemHTML(item) {
        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-weight">${item.weight}</p>
                    <p class="item-price">KES ${item.price.toFixed(2)}</p>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn minus" aria-label="Decrease quantity">-</button>
                    <input type="number" value="${item.quantity}" min="1" max="10" aria-label="Item quantity">
                    <button class="quantity-btn plus" aria-label="Increase quantity">+</button>
                </div>
                <div class="item-total">
                    KES ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="remove-item" aria-label="Remove item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }
    
    addCartItemEventListeners() {
        // Quantity controls
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const input = e.target.parentElement.querySelector('input');
                const currentValue = parseInt(input.value);
                
                if (e.target.classList.contains('minus')) {
                    if (currentValue > 1) {
                        input.value = currentValue - 1;
                        this.updateItemQuantity(input);
                    }
                } else if (e.target.classList.contains('plus')) {
                    if (currentValue < 10) {
                        input.value = currentValue + 1;
                        this.updateItemQuantity(input);
                    }
                }
            });
        });
        
        // Quantity input change
        document.querySelectorAll('.item-quantity input').forEach(input => {
            input.addEventListener('change', () => this.updateItemQuantity(input));
        });
        
        // Remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.closest('.cart-item').dataset.id;
                this.removeItem(itemId);
            });
        });
    }
    
    updateItemQuantity(input) {
        const cartItem = input.closest('.cart-item');
        const itemId = cartItem.dataset.id;
        const newQuantity = parseInt(input.value);
        
        this.cart.updateQuantity(itemId, newQuantity);
        this.renderCart();
    }
    
    removeItem(itemId) {
        this.cart.removeItem(itemId);
        this.renderCart();
    }
    
    updateSummary(subtotal) {
        const deliveryFee = this.getSelectedDeliveryFee();
        const total = subtotal + deliveryFee;
        
        document.querySelector('.subtotal').textContent = `KES ${subtotal.toFixed(2)}`;
        document.querySelector('.delivery-fee').textContent = `KES ${deliveryFee.toFixed(2)}`;
        document.querySelector('.total-amount').textContent = `KES ${total.toFixed(2)}`;
    }
    
    updateDeliveryFee() {
        const deliveryFee = this.getSelectedDeliveryFee();
        document.querySelector('.delivery-fee').textContent = `KES ${deliveryFee.toFixed(2)}`;
        this.updateSummary(this.cart.getTotal());
    }
    
    getSelectedDeliveryFee() {
        const selectedDelivery = document.querySelector('input[name="delivery"]:checked').value;
        return selectedDelivery === 'express' ? this.expressDeliveryFee : this.standardDeliveryFee;
    }
    
    handlePaymentMethodChange(method) {
        const mpesaDetails = document.getElementById('mpesa-details');
        
        if (method === 'mpesa' && !mpesaDetails) {
            const paymentOptions = document.querySelector('.payment-options');
            const mpesaHTML = `
                <div id="mpesa-details" class="mpesa-details">
                    <p>You will receive an M-PESA prompt on your phone to complete the payment.</p>
                    <div class="form-group">
                        <label for="mpesa-phone">M-PESA Phone Number</label>
                        <input type="tel" id="mpesa-phone" name="mpesa-phone" required>
                    </div>
                </div>
            `;
            paymentOptions.insertAdjacentHTML('beforeend', mpesaHTML);
        } else if (method === 'cash' && mpesaDetails) {
            mpesaDetails.remove();
        }
    }
    
    async handleCheckout(e) {
        e.preventDefault();
        
        if (this.cart.getItems().length === 0) {
            this.showNotification('Your cart is empty!', 'error');
            return;
        }
        
        // Validate form
        if (!this.validateForm()) {
            return;
        }
        
        // Get form data
        const formData = this.getFormData();
        
        try {
            // Show loading state
            this.setLoadingState(true);
            
            // Process order
            await this.processOrder(formData);
            
            // Clear cart and redirect to success page
            this.cart.clearCart();
            window.location.href = 'order-success.html';
            
        } catch (error) {
            this.showNotification('Failed to process order. Please try again.', 'error');
            console.error('Order processing error:', error);
        } finally {
            this.setLoadingState(false);
        }
    }
    
    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });
        
        // Validate phone number
        const phoneField = document.getElementById('phone');
        if (phoneField.value && !this.isValidPhoneNumber(phoneField.value)) {
            this.showFieldError(phoneField, 'Please enter a valid phone number');
            isValid = false;
        }
        
        // Validate email
        const emailField = document.getElementById('email');
        if (emailField.value && !this.isValidEmail(emailField.value)) {
            this.showFieldError(emailField, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate M-PESA phone if M-PESA is selected
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        if (paymentMethod === 'mpesa') {
            const mpesaPhone = document.getElementById('mpesa-phone');
            if (!mpesaPhone.value || !this.isValidPhoneNumber(mpesaPhone.value)) {
                this.showFieldError(mpesaPhone, 'Please enter a valid M-PESA phone number');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    isValidPhoneNumber(phone) {
        // Kenyan phone number format: +254XXXXXXXXX or 0XXXXXXXXX
        const phoneRegex = /^(?:\+254|0)[17]\d{8}$/;
        return phoneRegex.test(phone.replace(/\s+/g, ''));
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message') || document.createElement('div');
        
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        if (!formGroup.querySelector('.error-message')) {
            formGroup.appendChild(errorElement);
        }
        
        field.classList.add('error');
    }
    
    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        field.classList.remove('error');
    }
    
    getFormData() {
        const formData = new FormData(this.form);
        const data = {
            items: this.cart.getItems(),
            subtotal: this.cart.getTotal(),
            deliveryFee: this.getSelectedDeliveryFee(),
            total: this.cart.getTotal() + this.getSelectedDeliveryFee(),
            deliveryMethod: document.querySelector('input[name="delivery"]:checked').value,
            paymentMethod: document.querySelector('input[name="payment"]:checked').value,
            customerInfo: {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                address: formData.get('address'),
                notes: formData.get('notes')
            }
        };
        
        if (data.paymentMethod === 'mpesa') {
            data.customerInfo.mpesaPhone = formData.get('mpesa-phone');
        }
        
        return data;
    }
    
    async processOrder(orderData) {
        // In a real application, this would make an API call to your backend
        // For now, we'll simulate a successful order processing
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Order processed:', orderData);
                resolve();
            }, 1500);
        });
    }
    
    setLoadingState(isLoading) {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        } else {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Place Order';
        }
    }
    
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize cart page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CartPage();
}); 