// Products Management
class ProductManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 8;
        this.filters = {
            search: '',
            category: '',
            priceRange: '',
            sort: 'default'
        };
        
        // DOM Elements
        this.productsGrid = document.querySelector('.products-grid');
        this.searchInput = document.getElementById('search-input');
        this.categoryFilter = document.getElementById('category-filter');
        this.priceFilter = document.getElementById('price-filter');
        this.sortFilter = document.getElementById('sort-filter');
        this.loadMoreBtn = document.querySelector('.load-more-btn');
        
        this.init();
    }

    init() {
        // Load products
        this.loadProducts();
        
        // Add event listeners
        this.addEventListeners();
    }

    loadProducts() {
        // In a real application, this would be an API call
        this.products = [
            {
                id: 1,
                name: 'Whole Chicken',
                price: 1200,
                category: 'whole',
                image: 'images/download (4).jpeg',
                description: 'Fresh whole chicken, perfect for family meals',
                weight: '1.5kg'
            },
            {
                id: 2,
                name: 'Chicken Wings',
                price: 800,
                category: 'cuts',
                image: 'images/download (3).jpeg',
                description: 'Premium chicken wings, great for grilling',
                weight: '1kg'
            },
            {
                id: 3,
                name: 'Chicken Breast',
                price: 1000,
                category: 'cuts',
                image: 'images/download (2).jpeg',
                description: 'Boneless chicken breast, ideal for various dishes',
                weight: '1kg'
            },
            {
                id: 4,
                name: 'Chicken Thighs',
                price: 900,
                category: 'cuts',
                image: 'images/download.jpeg',
                description: 'Juicy chicken thighs, perfect for stews',
                weight: '1kg'
            },
            {
                id: 5,
                name: 'Chicken Drumsticks',
                price: 850,
                category: 'cuts',
                image: 'images/download (1).jpeg',
                description: 'Fresh chicken drumsticks, great for frying',
                weight: '1kg'
            },
            {
                id: 6,
                name: 'Chicken Gizzards',
                price: 600,
                category: 'specialty',
                image: 'images/images.jpeg',
                description: 'Cleaned chicken gizzards, perfect for stews',
                weight: '500g'
            },
            {
                id: 7,
                name: 'Chicken Liver',
                price: 500,
                category: 'specialty',
                image: 'images/images (1).jpeg',
                description: 'Fresh chicken liver, rich in nutrients',
                weight: '500g'
            },
            {
                id: 8,
                name: 'Chicken Feet',
                price: 400,
                category: 'specialty',
                image: 'images/images (2).jpeg',
                description: 'Cleaned chicken feet, great for soups',
                weight: '500g'
            },
            {
                id: 9,
                name: 'Whole Chicken (Large)',
                price: 1500,
                category: 'whole',
                image: 'images/download (5).jpeg',
                description: 'Large whole chicken, perfect for big families',
                weight: '2kg'
            },
            {
                id: 10,
                name: 'Chicken Breast Fillet',
                price: 1200,
                category: 'cuts',
                image: 'https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg?w=800&auto=format&fit=crop&q=60',
                description: 'Premium chicken breast fillet, skinless and boneless',
                weight: '1kg'
            }
        ];

        this.applyFilters();
    }

    addEventListeners() {
        // Search input
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }

        // Category filter
        if (this.categoryFilter) {
            this.categoryFilter.addEventListener('change', (e) => {
                this.filters.category = e.target.value;
                this.applyFilters();
            });
        }

        // Price filter
        if (this.priceFilter) {
            this.priceFilter.addEventListener('change', (e) => {
                this.filters.priceRange = e.target.value;
                this.applyFilters();
            });
        }

        // Sort filter
        if (this.sortFilter) {
            this.sortFilter.addEventListener('change', (e) => {
                this.filters.sort = e.target.value;
                this.applyFilters();
            });
        }

        // Load more button
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => {
                this.currentPage++;
                this.renderProducts();
            });
        }
    }

    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // Search filter
            if (this.filters.search && !product.name.toLowerCase().includes(this.filters.search)) {
                return false;
            }

            // Category filter
            if (this.filters.category && product.category !== this.filters.category) {
                return false;
            }

            // Price range filter
            if (this.filters.priceRange) {
                const [min, max] = this.filters.priceRange.split('-').map(Number);
                if (max && (product.price < min || product.price > max)) {
                    return false;
                } else if (!max && product.price < min) {
                    return false;
                }
            }

            return true;
        });

        // Apply sorting
        this.sortProducts();

        // Reset pagination
        this.currentPage = 1;
        
        // Render products
        this.renderProducts();
    }

    sortProducts() {
        switch (this.filters.sort) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                // Default sorting (by ID)
                this.filteredProducts.sort((a, b) => a.id - b.id);
        }
    }

    renderProducts() {
        if (!this.productsGrid) return;

        const startIndex = 0;
        const endIndex = this.currentPage * this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        if (this.currentPage === 1) {
            this.productsGrid.innerHTML = '';
        }

        if (productsToShow.length === 0) {
            this.productsGrid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search"></i>
                    <p>No products found matching your criteria</p>
                </div>
            `;
            this.loadMoreBtn.style.display = 'none';
            return;
        }

        productsToShow.forEach(product => {
            const productCard = this.createProductCard(product);
            this.productsGrid.appendChild(productCard);
        });

        // Show/hide load more button
        this.loadMoreBtn.style.display = 
            endIndex < this.filteredProducts.length ? 'block' : 'none';
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card animate-on-scroll';
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="product-category">${this.getCategoryLabel(product.category)}</div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-meta">
                    <span class="product-weight">${product.weight}</span>
                    <span class="product-price">KES ${product.price.toLocaleString()}</span>
                </div>
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

    getCategoryLabel(category) {
        const labels = {
            'whole': 'Whole Chicken',
            'cuts': 'Chicken Cuts',
            'specialty': 'Specialty Products'
        };
        return labels[category] || category;
    }
}

// Initialize product manager
document.addEventListener('DOMContentLoaded', () => {
    const productManager = new ProductManager();
}); 