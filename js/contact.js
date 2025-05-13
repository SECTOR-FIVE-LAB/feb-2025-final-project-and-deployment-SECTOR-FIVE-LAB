class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.nameInput = document.getElementById('name');
        this.emailInput = document.getElementById('email');
        this.phoneInput = document.getElementById('phone');
        this.subjectInput = document.getElementById('subject');
        this.messageInput = document.getElementById('message');
        this.submitButton = document.getElementById('submitBtn');
        
        this.init();
    }
    
    init() {
        if (this.form) {
            this.addEventListeners();
        }
    }
    
    addEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        this.nameInput.addEventListener('input', () => this.validateName());
        this.emailInput.addEventListener('input', () => this.validateEmail());
        this.phoneInput.addEventListener('input', () => this.validatePhone());
        this.subjectInput.addEventListener('input', () => this.validateSubject());
        this.messageInput.addEventListener('input', () => this.validateMessage());
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const isNameValid = this.validateName();
        const isEmailValid = this.validateEmail();
        const isPhoneValid = this.validatePhone();
        const isSubjectValid = this.validateSubject();
        const isMessageValid = this.validateMessage();
        
        if (isNameValid && isEmailValid && isPhoneValid && isSubjectValid && isMessageValid) {
            this.submitForm();
        }
    }
    
    validateName() {
        const name = this.nameInput.value.trim();
        const nameError = document.getElementById('nameError');
        
        if (name.length < 2) {
            this.showError(this.nameInput, nameError, 'Name must be at least 2 characters long');
            return false;
        }
        
        if (!/^[a-zA-Z\s]*$/.test(name)) {
            this.showError(this.nameInput, nameError, 'Name can only contain letters and spaces');
            return false;
        }
        
        this.clearError(this.nameInput, nameError);
        return true;
    }
    
    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailError = document.getElementById('emailError');
        
        if (!email) {
            this.showError(this.emailInput, emailError, 'Email is required');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showError(this.emailInput, emailError, 'Please enter a valid email address');
            return false;
        }
        
        this.clearError(this.emailInput, emailError);
        return true;
    }
    
    validatePhone() {
        const phone = this.phoneInput.value.trim();
        const phoneError = document.getElementById('phoneError');
        
        if (!phone) {
            this.showError(this.phoneInput, phoneError, 'Phone number is required');
            return false;
        }
        
        // Kenyan phone number format: +254 XXX XXX XXX or 0XXX XXX XXX
        const phoneRegex = /^(?:\+254|0)[17]\d{8}$/;
        if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
            this.showError(this.phoneInput, phoneError, 'Please enter a valid Kenyan phone number');
            return false;
        }
        
        this.clearError(this.phoneInput, phoneError);
        return true;
    }
    
    validateSubject() {
        const subject = this.subjectInput.value.trim();
        const subjectError = document.getElementById('subjectError');
        
        if (subject.length < 5) {
            this.showError(this.subjectInput, subjectError, 'Subject must be at least 5 characters long');
            return false;
        }
        
        this.clearError(this.subjectInput, subjectError);
        return true;
    }
    
    validateMessage() {
        const message = this.messageInput.value.trim();
        const messageError = document.getElementById('messageError');
        
        if (message.length < 20) {
            this.showError(this.messageInput, messageError, 'Message must be at least 20 characters long');
            return false;
        }
        
        this.clearError(this.messageInput, messageError);
        return true;
    }
    
    showError(input, errorElement, message) {
        input.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    clearError(input, errorElement) {
        input.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
    
    async submitForm() {
        try {
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            this.showNotification('Message sent successfully! We will get back to you soon.', 'success');
            
            // Reset form
            this.form.reset();
            
        } catch (error) {
            this.showNotification('Failed to send message. Please try again later.', 'error');
        } finally {
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = 'Send Message';
        }
    }
    
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
}); 