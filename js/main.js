// DOM Elements
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.querySelector('.theme-toggle');
const newsletterForm = document.getElementById('newsletter-form');

// Mobile Menu Toggle
function toggleMobileMenu() {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.classList.toggle('menu-open');
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !e.target.closest('.nav-links') && 
        !e.target.closest('.mobile-menu-btn')) {
        toggleMobileMenu();
    }
});

// Theme Toggle
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Newsletter Form
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const emailInput = e.target.querySelector('input[type="email"]');
    const email = emailInput.value.trim();

    if (validateEmail(email)) {
        // Here you would typically send the email to your backend
        showNotification('Thank you for subscribing!', 'success');
        emailInput.value = '';
    } else {
        showNotification('Please enter a valid email address.', 'error');
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Product Grid
function loadFeaturedProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    const products = [
        {
            id: 1,
            name: 'Whole Chicken',
            price: 1200,
            image: 'images/products/whole-chicken.jpg',
            description: 'Fresh whole chicken, perfect for family meals'
        },
        {
            id: 2,
            name: 'Chicken Wings',
            price: 800,
            image: 'images/products/chicken-wings.jpg',
            description: 'Premium chicken wings, great for grilling'
        },
        {
            id: 3,
            name: 'Chicken Breast',
            price: 1000,
            image: 'images/products/chicken-breast.jpg',
            description: 'Boneless chicken breast, ideal for various dishes'
        },
        {
            id: 4,
            name: 'Chicken Thighs',
            price: 900,
            image: 'images/products/chicken-thighs.jpg',
            description: 'Juicy chicken thighs, perfect for stews'
        }
    ];

    products.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">KES ${product.price.toLocaleString()}</div>
            <button class="btn add-to-cart" data-product-id="${product.id}">
                Add to Cart
            </button>
        </div>
    `;

    // Add to cart functionality
    const addToCartBtn = card.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', () => {
        addToCart(product);
        showNotification(`${product.name} added to cart!`, 'success');
    });

    return card;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();

    // Mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Newsletter form
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }

    // Load featured products
    loadFeaturedProducts();
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements with animation classes
document.querySelectorAll('.animate-on-scroll').forEach(element => {
    observer.observe(element);
}); 