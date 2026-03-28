/**
 * Main Application Logic
 * Orchestrates UI, Navigation, Product Rendering, Cart, and Checkout.
 */

window.SindhiApp = window.SindhiApp || {};

(function () {
    'use strict';

    // Services
    const ProductService = window.SindhiApp.Services.Products;
    const CartService = window.SindhiApp.Services.Cart;
    const StorageService = window.SindhiApp.Services.Storage;

    // Constants
    const ITEMS_PER_PAGE = 12;
    const EXPRESS_SURCHARGE = 50;

    // State
    let state = {
        currentCategory: 'All',
        currentPage: 1,
        searchQuery: ''
    };

    document.addEventListener('DOMContentLoaded', () => {
        initApp();
    });

    function initApp() {
        console.log('Sindhi App Initializing...');
        initPillNavigation();
        initMobileMenu();
        initSmoothScroll();
        initScrollReveal();
        initHeaderScroll();
        initProductCatalog();
        initSearch();
        initCartUI();
        initCheckout();
    }

    /* ===================================
       PRODUCT CATALOG LOGIC
       =================================== */

    function initProductCatalog() {
        setupFilterButtons();
        loadProducts();
    }

    function setupFilterButtons() {
        const buttons = document.querySelectorAll('.filter-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active UI
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update State
                state.currentCategory = btn.dataset.filter;
                state.currentPage = 1;
                state.searchQuery = ''; // Reset search on category change
                document.getElementById('searchInput').value = '';
                loadProducts();
            });
        });
    }

    function initSearch() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value.trim().toLowerCase();
            state.currentPage = 1;
            loadProducts();
        });
    }

    function loadProducts() {
        const grid = document.getElementById('productsGrid');
        const pagination = document.getElementById('pagination');

        if (!grid) return;

        // Get products by category
        let products = ProductService.getByCategory(state.currentCategory);

        // Filter by search query if exists
        if (state.searchQuery) {
            products = products.filter(p => p.name.toLowerCase().includes(state.searchQuery));
        }

        // Pagination
        const start = 0;
        const end = state.currentPage * ITEMS_PER_PAGE;
        const displayed = products.slice(start, end);
        const hasMore = products.length > end;

        // Render
        if (state.currentPage === 1) {
            grid.innerHTML = displayed.length ? displayed.map(createProductCard).join('') : '<div class="no-results">No products found matching your criteria.</div>';
        } else {
            const newProducts = products.slice((state.currentPage - 1) * ITEMS_PER_PAGE, end);
            grid.insertAdjacentHTML('beforeend', newProducts.map(createProductCard).join(''));
        }

        // Animate new
        const newCards = grid.querySelectorAll('.product-card:not(.reveal)');
        requestAnimationFrame(() => {
            newCards.forEach(card => card.classList.add('reveal', 'active'));
        });

        // Load More Button
        if (hasMore) {
            pagination.innerHTML = `<button class="load-more-btn" id="loadMoreBtn">Load More (${products.length - end} remaining)</button>`;
            document.getElementById('loadMoreBtn').addEventListener('click', () => {
                state.currentPage++;
                loadProducts();
            });
        } else {
            pagination.innerHTML = '';
        }
    }

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
                    <div class="product-description" style="margin-bottom: 1.5rem; font-size: 1rem; color: var(--neutral-600);">
                        <span style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 0.5rem;">
                            Premium quality ${product.name.toLowerCase()}. Fresh and authentic.
                        </span>
                        <div style="margin-top: 0.5rem; color: var(--neutral-900);">
                            <strong style="font-size: 1.125rem;">₹${product.price}</strong> 
                            <small style="color: var(--neutral-500); font-size: 0.875rem;">(${product.reviews} reviews)</small>
                        </div>
                    </div>
                    <div class="product-actions" style="margin-top: 0;">
                        <button class="btn btn-primary js-add-cart" 
                            data-id="${product.id}" 
                            data-name="${product.name}"
                            data-price="${product.price}"
                            data-image="${product.image}"
                            style="width: 100%; padding: 0.5rem 1rem; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.875rem;"
                            ${product.inStock === false ? 'disabled' : ''}>
                            ${product.inStock !== false ? 'ADD TO CART' : 'SOLD OUT'}
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    /* ===================================
       CART UI LOGIC
       =================================== */

    function initCartUI() {
        // Event delegation for Add to Cart
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('js-add-cart')) {
                const btn = e.target;
                const product = {
                    id: parseInt(btn.dataset.id),
                    name: btn.dataset.name,
                    price: parseFloat(btn.dataset.price),
                    image: btn.dataset.image
                };
                CartService.addItem(product);

                // Visual feedback
                const originalText = btn.innerText;
                btn.innerText = 'Added!';
                btn.style.background = '#27ae60';
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = '';
                }, 1500);
            }
        });

        // Listen for Cart Updates
        window.addEventListener('cart-updated', updateCartUI);

        // Cart Modal Toggles
        const fab = document.getElementById('cartFab');
        const modal = document.getElementById('cartModal');
        const closeBtn = document.getElementById('closeCart');

        if (fab && modal && closeBtn) {
            fab.addEventListener('click', () => {
                renderCartItems();
                modal.classList.add('active');
            });

            closeBtn.addEventListener('click', () => modal.classList.remove('active'));

            // Close on outside click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('active');
            });
        }

        // Initial UI Update
        updateCartUI({ detail: CartService.state });
    }

    function updateCartUI(e) {
        const state = e.detail || CartService.state;
        const badge = document.getElementById('cartBadge');
        const total = document.getElementById('cartTotal');

        // Update Badge
        const count = state.items.reduce((sum, item) => sum + item.quantity, 0);
        if (badge) badge.innerText = count;

        // Update Total in Modal
        if (total) total.innerText = `₹${state.total}`;

        // Re-render items if modal is open
        if (document.getElementById('cartModal').classList.contains('active')) {
            renderCartItems();
        }
    }

    function renderCartItems() {
        const container = document.getElementById('cartItems');
        const items = CartService.getItems();

        if (items.length === 0) {
            container.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <span class="cart-item-title">${item.name}</span>
                    <span class="cart-item-price">₹${item.price} x ${item.quantity}</span>
                </div>
                <div class="cart-item-actions">
                    <button class="qty-btn" onclick="SindhiApp.updateQty(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="SindhiApp.updateQty(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
        `).join('');
    }

    // Expose update helper for onclick handlers
    window.SindhiApp.updateQty = (id, newQty) => {
        CartService.updateQuantity(id, newQty);
    };

    /* ===================================
       CHECKOUT LOGIC
       =================================== */

    function initCheckout() {
        const checkoutBtn = document.getElementById('checkoutBtn');
        const cartModal = document.getElementById('cartModal');
        const checkoutModal = document.getElementById('checkoutModal');
        const backBtn = document.getElementById('backToCart');
        const closeCheckout = document.getElementById('closeCheckout');
        const form = document.getElementById('checkoutForm');

        // Open Checkout
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (CartService.getItems().length === 0) return;
                cartModal.classList.remove('active');
                checkoutModal.classList.add('active');
                updateCheckoutSummary();
            });
        }

        // Back to Cart
        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent form submission
                checkoutModal.classList.remove('active');
                cartModal.classList.add('active');
            });
        }

        // Close Checkout
        if (closeCheckout) {
            closeCheckout.addEventListener('click', () => checkoutModal.classList.remove('active'));
        }

        // Place Order
        const placeOrderBtn = document.getElementById('placeOrderBtn');
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', handlePlaceOrder);
        }

        // Delivery Options Logic
        const expressCheckbox = document.getElementById('expressDelivery');
        const surchargeInfo = document.getElementById('expressSurcharge');
        const surchargeRow = document.getElementById('checkoutSurchargeRow');
        const radioInputs = document.querySelectorAll('input[name="deliverySpeed"]');
        const slotInputs = document.querySelectorAll('.slot-selection input');

        if (expressCheckbox) {
            expressCheckbox.addEventListener('change', () => {
                const isExpress = expressCheckbox.checked;
                surchargeInfo.style.display = isExpress ? 'block' : 'none';
                surchargeRow.style.display = isExpress ? 'flex' : 'none';
                updateCheckoutSummary();

                // If express is checked, uncheck radio options visual focus might be needed
                // But generally, express overrides standard/relaxed in logic.
            });
        }

        // Standard vs Relaxed logic toggles
        radioInputs.forEach(radio => {
            radio.addEventListener('change', () => {
                const slots = document.querySelector('.slot-selection');
                if (radio.value === 'standard') {
                    slots.style.display = 'flex';
                    slots.style.opacity = '1';
                    slots.querySelectorAll('input').forEach(i => i.disabled = false);
                } else {
                    slots.style.opacity = '0.5';
                    slots.querySelectorAll('input').forEach(i => i.disabled = true);
                }
            });
        });
    }

    function updateCheckoutSummary() {
        const subtotal = CartService.getTotal();
        const isExpress = document.getElementById('expressDelivery').checked;
        const total = isExpress ? subtotal + EXPRESS_SURCHARGE : subtotal;

        document.getElementById('checkoutSubtotal').innerText = `₹${subtotal}`;
        document.getElementById('checkoutFinalTotal').innerText = `₹${total}`;
    }

    function handlePlaceOrder(e) {
        e.preventDefault();

        const name = document.getElementById('cxName').value;
        const phone = document.getElementById('cxPhone').value;
        const address = document.getElementById('cxAddress').value;

        if (!name || !phone || !address) {
            alert('Please fill in all details.');
            return;
        }

        // Determine Delivery Method and Cost
        let deliveryMethod = 'Standard';
        const isExpress = document.getElementById('expressDelivery').checked;
        const total = CartService.getTotal() + (isExpress ? EXPRESS_SURCHARGE : 0);

        if (isExpress) {
            deliveryMethod = 'Express (1 Hr)';
        } else {
            const speed = document.querySelector('input[name="deliverySpeed"]:checked').value;
            if (speed === 'relaxed') {
                deliveryMethod = 'Relaxed (Next Day)';
            } else {
                const slot = document.querySelector('input[name="timeSlot"]:checked').value;
                deliveryMethod = `Standard (${slot})`;
            }
        }

        const order = {
            id: 'ORD-' + Date.now(),
            customer: { name, phone, address },
            items: CartService.getItems(),
            total: total,
            delivery: deliveryMethod,
            date: new Date().toISOString(),
            status: 'Pending'
        };

        // Save Order
        saveOrder(order);

        // Clear Cart & UI
        CartService.clear();
        document.getElementById('checkoutModal').classList.remove('active');
        document.getElementById('checkoutForm').reset();

        // Construct WhatsApp Message
        const itemsList = order.items.map(i => `- ${i.name} (x${i.quantity})`).join('%0A');
        const message = `*New Order Placed!* 🛍️%0A%0A*Order ID:* ${order.id}%0A*Customer:* ${name} (${phone})%0A*Address:* ${address}%0A%0A*Items:*%0A${itemsList}%0A%0A*Delivery:* ${deliveryMethod}%0A*Total:* ₹${total}%0A%0A_Sent via Sindhi Namkeen Website_`;

        const waUrl = `https://wa.me/917838304170?text=${message}`;

        // Redirect to WhatsApp
        window.open(waUrl, '_blank');

        // Show Success Alert
        alert('Order Placed Successfully! Redirecting to WhatsApp for confirmation...');
    }

    function saveOrder(order) {
        let orders = StorageService.get('sindhi_orders', []);
        orders.unshift(order); // Add to top
        StorageService.set('sindhi_orders', orders);
    }

    /* ===================================
       CONTACT & NAVIGATION
       =================================== */

    function initContactModal() {
        const modal = document.getElementById('contactModal');
        const closeBtn = document.getElementById('closeContact');
        const contactLinks = document.querySelectorAll('a[href="#contact"]');

        if (!modal) return;

        // Open Modal
        window.openContactModal = () => {
            modal.classList.add('active');
        };

        // Attach to all "Contact" links (pill nav, hero cta, etc)
        contactLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                openContactModal();
            });
        });

        // Close Logic
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }

    /* ===================================
       UI INTERACTIONS (Navigation, etc)
       =================================== */

    function initPillNavigation() {
        const pillNav = document.getElementById('pillNav');
        const navItems = document.querySelectorAll('.pill-nav-item');

        // Init Contact Modal here as part of Navigation
        initContactModal();

        if (!pillNav) return;

        let isManualScroll = false;
        let manualScrollTimeout;

        // Click Handler
        navItems.forEach(item => {
            item.addEventListener('click', function (e) {
                // Prevent scroll spy from interfering
                isManualScroll = true;
                clearTimeout(manualScrollTimeout);
                manualScrollTimeout = setTimeout(() => {
                    isManualScroll = false;
                }, 1000); // Allow time for smooth scroll to complete

                navItems.forEach(n => n.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Scroll listener for active link (Scroll Spy)
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (isManualScroll) return; // Skip if we clicked a link

            if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
            scrollTimeout = requestAnimationFrame(() => {
                const sections = ['home', 'products', 'about', 'contact'];
                // Trigger point: 30% down the viewport
                const scrollPos = window.scrollY + (window.innerHeight * 0.3);

                let currentSectionId = sections[0]; // Default to first

                // Find the last section that satisfies the condition (top-down)
                // This eliminates dead zones between sections
                for (let id of sections) {
                    const el = document.getElementById(id);
                    if (el) {
                        if (scrollPos >= el.offsetTop) {
                            currentSectionId = id;
                        }
                    }
                }

                // Bottom of page detection (force Contact)
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
                    currentSectionId = 'contact';
                }

                navItems.forEach(n => {
                    n.classList.remove('active');
                    if (n.dataset.section === currentSectionId) {
                        n.classList.add('active');
                    }
                });
            });
        });
    }

    function initMobileMenu() {
        const toggle = document.getElementById('mobileMenuToggle');
        const nav = document.getElementById('mobileNav');
        if (!toggle || !nav) return;

        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            nav.classList.toggle('active');
        });

        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            item.addEventListener('click', () => {
                toggle.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerOffset = 80;
                    window.scrollTo({
                        top: target.offsetTop - headerOffset,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    function initHeaderScroll() {
        const header = document.querySelector('.header');
        if (!header) return;
        window.addEventListener('scroll', () => {
            header.style.boxShadow = window.scrollY > 50 ? '0 4px 20px rgba(0,0,0,0.1)' : 'none';
        });
    }

    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.product-card, .section-header, .about-feature').forEach(el => {
            el.classList.add('reveal');
            observer.observe(el);
        });
    }

})();
