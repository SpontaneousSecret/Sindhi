/* ===================================
   SINDHI NAMKEEN & DRY FRUITS
   JavaScript Interactivity
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    initPillNavigation();
    initMobileMenu();
    initSmoothScroll();
    initScrollReveal();
    initHeaderScroll();
    initProductCatalog(); // Initialize products
});

/* ===================================
   PILL NAVIGATION
   =================================== */

function initPillNavigation() {
    const pillNav = document.getElementById('pillNav');
    const pillIndicator = document.getElementById('pillIndicator');
    const navItems = document.querySelectorAll('.pill-nav-item');

    if (!pillNav || !pillIndicator || navItems.length === 0) return;

    // Position the pill indicator on the active item
    function updateIndicator(item) {
        const itemRect = item.getBoundingClientRect();
        const navRect = pillNav.getBoundingClientRect();

        pillIndicator.style.width = `${itemRect.width}px`;
        pillIndicator.style.left = `${itemRect.left - navRect.left}px`;
    }

    // Initialize indicator position
    const activeItem = pillNav.querySelector('.pill-nav-item.active');
    if (activeItem) {
        // Delay to ensure layout is complete
        setTimeout(() => updateIndicator(activeItem), 100);
    }

    // Handle click on nav items
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            // Update indicator position
            updateIndicator(this);
        });
    });

    // Update active state based on scroll position
    function updateActiveOnScroll() {
        const sections = ['home', 'products', 'about', 'contact'];
        const scrollPosition = window.scrollY + 200;

        for (let i = sections.length - 1; i >= 0; i--) {
            const section = document.getElementById(sections[i]);
            if (section && section.offsetTop <= scrollPosition) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.dataset.section === sections[i]) {
                        item.classList.add('active');
                        updateIndicator(item);
                    }
                });
                break;
            }
        }
    }

    // Debounce scroll handler
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(updateActiveOnScroll);
    });

    // Update indicator on window resize
    window.addEventListener('resize', () => {
        const active = pillNav.querySelector('.pill-nav-item.active');
        if (active) {
            updateIndicator(active);
        }
    });
}

/* ===================================
   MOBILE MENU
   =================================== */

function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            toggle.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            toggle.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ===================================
   SMOOTH SCROLL
   =================================== */

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ===================================
   SCROLL REVEAL ANIMATIONS
   =================================== */

function initScrollReveal() {
    // Add reveal class to elements
    const revealElements = document.querySelectorAll(
        '.product-card, .about-feature, .contact-card, .section-header'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    // Intersection Observer for reveal
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));

    // Stagger animation for product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 100}ms`;
    });

    // Stagger animation for about features
    const aboutFeatures = document.querySelectorAll('.about-feature');
    aboutFeatures.forEach((feature, index) => {
        feature.style.transitionDelay = `${index * 150}ms`;
    });

    // Stagger animation for contact cards
    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 100}ms`;
    });
}

/* ===================================
   HEADER SCROLL EFFECT
   =================================== */

function initHeaderScroll() {
    const header = document.querySelector('.header');

    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        // Add shadow when scrolled
        if (currentScroll > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });
}

/* ===================================
   UTILITY FUNCTIONS
   =================================== */

// Debounce function
function debounce(func, wait = 100) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit = 100) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ===================================
   PRODUCT CATALOG
   =================================== */

const ITEMS_PER_PAGE = 12;
let currentCategory = 'All';
let currentPage = 1;
let allProducts = [];

function initProductCatalog() {
    setupFilterButtons();
    loadProducts();
}

function setupFilterButtons() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update filter
            currentCategory = btn.dataset.filter;
            currentPage = 1; // Reset to first page
            loadProducts();
        });
    });
}

function loadProducts() {
    const grid = document.getElementById('productsGrid');
    const pagination = document.getElementById('pagination');

    if (!grid) return;

    // Get products from Service (assumes data.js is loaded)
    const products = ProductService.getByCategory(currentCategory);

    // Calculate pagination
    const startIndex = 0;
    const endIndex = currentPage * ITEMS_PER_PAGE;
    const displayedProducts = products.slice(startIndex, endIndex);
    const hasMore = products.length > endIndex;

    // Render Grid
    if (currentPage === 1) {
        grid.innerHTML = displayedProducts.map(createProductCard).join('');
    } else {
        // Find newly added products
        const newProducts = products.slice((currentPage - 1) * ITEMS_PER_PAGE, endIndex);
        const newHtml = newProducts.map(createProductCard).join('');
        grid.insertAdjacentHTML('beforeend', newHtml);
    }

    // Re-initialize animations for new elements
    const newCards = grid.querySelectorAll('.product-card:not(.reveal)');
    newCards.forEach(card => card.classList.add('reveal', 'active')); // Immediate show for now or use observer

    // Render Pagination/Load More
    if (hasMore) {
        pagination.innerHTML = `<button class="load-more-btn" onclick="loadMore()">Load More (${products.length - endIndex} remaining)</button>`;
    } else {
        pagination.innerHTML = '';
    }
}

// Global function for Load More button
window.loadMore = function () {
    currentPage++;
    loadProducts();
};

function createProductCard(product) {
    return `
        <article class="product-card">
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-overlay">
                    <span class="product-tag">${product.category}</span>
                </div>
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">
                    Premium quality ${product.name.toLowerCase()}. Fresh and authentic.
                    <br>
                    <strong>₹${product.price}</strong> <small>(${product.reviews} reviews)</small>
                </p>
                <div class="product-features">
                    <button class="btn btn-primary" onclick="addToCart(${product.id})" style="padding: 0.5rem 1rem; width: 100%;">Add to Cart</button>
                </div>
            </div>
        </article>
    `;
}

// Mock Add to Cart
window.addToCart = function (id) {
    alert(`Product ${id} added to cart! (This is a demo)`);
};
