/**
 * Admin Dashboard Logic
 */

window.SindhiApp = window.SindhiApp || {};

(function () {
    'use strict';

    // Services
    const ProductService = window.SindhiApp.Services.Products;
    const OrderService = window.SindhiApp.Services.Orders;

    // State
    let editingProductId = null;

    // DOM Elements
    const els = {};

    document.addEventListener('DOMContentLoaded', () => {
        cacheElements();
        checkAuth();
        bindEvents();
    });

    function cacheElements() {
        els.loginSection = document.getElementById('loginSection');
        els.dashboardSection = document.getElementById('dashboardSection');
        els.loginForm = document.getElementById('loginForm');
        els.logoutBtn = document.getElementById('logoutBtn');
        els.productModal = document.getElementById('productModal');
        els.productForm = document.getElementById('productForm');
        els.totalProducts = document.getElementById('totalProducts');
        els.totalOrders = document.getElementById('totalOrders');
        els.inventoryBody = document.getElementById('inventoryTableBody');
        els.ordersBody = document.getElementById('ordersTableBody');
    }

    function bindEvents() {
        els.loginForm.addEventListener('submit', handleLogin);
        els.productForm.addEventListener('submit', handleSaveProduct);
        els.logoutBtn.addEventListener('click', logout);

        window.onclick = (e) => {
            if (e.target === els.productModal) closeModal();
        };

        // Tab Switching
        window.switchTab = function (tabName) {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            // Find clicked button (this approach relies on inline onclick, which we should ideally replace, but for now we keep it compatible with HTML)
            // Better: event delegation or finding button by text/attribute.
            // Since onclick="switchTab()" is in HTML, event.target works.
            if (event && event.target) event.target.classList.add('active');

            document.getElementById(`${tabName}Tab`).classList.add('active');
        };

        // Expose global functions for HTML onclicks
        window.openProductModal = openProductModal;
        window.closeModal = closeModal;
        window.editProduct = editProduct;
        window.deleteProduct = deleteProduct;
        window.logout = logout;
    }

    /* ===================================
       AUTH
       =================================== */

    function checkAuth() {
        if (localStorage.getItem('adminUser')) {
            showDashboard();
        } else {
            showLogin();
        }
    }

    function handleLogin(e) {
        e.preventDefault();
        const u = document.getElementById('username').value;
        const p = document.getElementById('password').value;

        if (u === 'admin' && p === 'admin123') {
            localStorage.setItem('adminUser', u);
            showDashboard();
        } else {
            alert('Invalid credentials');
        }
    }

    function logout() {
        localStorage.removeItem('adminUser');
        showLogin();
    }

    function showLogin() {
        els.loginSection.style.display = 'block';
        els.dashboardSection.style.display = 'none';
        els.logoutBtn.style.display = 'none';
    }

    function showDashboard() {
        els.loginSection.style.display = 'none';
        els.dashboardSection.style.display = 'block';
        els.logoutBtn.style.display = 'block';
        updateDashboard();
    }

    /* ===================================
       DASHBOARD LOGIC
       =================================== */

    function updateDashboard() {
        const products = ProductService.getAll();
        const orders = OrderService.getAll();

        els.totalProducts.innerText = products.length;
        els.totalOrders.innerText = orders.length;

        renderInventory(products);
        renderOrders(orders);
    }

    function renderInventory(products) {
        els.inventoryBody.innerHTML = products.map(p => {
            const stockBadge = p.inStock !== false
                ? '<span class="badge-stock stock-in">In Stock</span>'
                : '<span class="badge-stock stock-out">Sold Out</span>';

            return `
            <tr>
                <td>#${p.id}</td>
                <td><img src="${p.image}" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover;"></td>
                <td><strong>${p.name}</strong></td>
                <td><span style="padding: 2px 8px; background: #eee; border-radius: 12px; font-size: 0.8em;">${p.category}</span></td>
                <td>₹${p.price}</td>
                <td>${stockBadge}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="editProduct(${p.id})">Edit</button>
                    <button class="action-btn btn-delete" onclick="deleteProduct(${p.id})">Delete</button>
                </td>
            </tr>
        `}).join('');
    }

    function renderOrders(orders) {
        els.ordersBody.innerHTML = orders.map(o => {
            let color = o.status === 'Delivered' ? '#5cb85c' : o.status === 'Processing' ? '#5bc0de' : '#f0ad4e';

            // Handle Customer Name (Support both string and object)
            const customerName = typeof o.customer === 'object' ? o.customer.name : o.customer;

            // Handle Items Summary
            const itemsSummary = Array.isArray(o.items)
                ? o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')
                : o.items;

            return `
                <tr>
                    <td>#${o.id.toString().slice(-6)}</td> <!-- Short ID -->
                    <td>${customerName}</td>
                    <td><div style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${itemsSummary}">${itemsSummary}</div></td>
                    <td>₹${o.total}</td>
                    <td><span style="padding: 2px 8px; background: ${color}; color: white; border-radius: 4px; font-size: 0.8em;">${o.status}</span></td>
                    <td><button class="action-btn" onclick="alert('Full Details:\\nCustomer: ${customerName}\\nItems: ${itemsSummary}\\nDelivery: ${o.delivery}')">View</button></td>
                </tr>
            `;
        }).join('');
    }

    /* ===================================
       CRUD ACTIONS
       =================================== */

    function openProductModal(product = null) {
        const title = document.getElementById('modalTitle');
        const idInput = document.getElementById('editProductId');
        const nameInput = document.getElementById('prodName');
        const catInput = document.getElementById('prodCategory');
        const priceInput = document.getElementById('prodPrice');
        const stockInput = document.getElementById('prodStock');

        if (product) {
            title.innerText = 'Edit Product';
            editingProductId = product.id;
            idInput.value = product.id;
            nameInput.value = product.name;
            catInput.value = product.category;
            priceInput.value = product.price;
            stockInput.checked = product.inStock !== false;
        } else {
            title.innerText = 'Add New Product';
            editingProductId = null;
            idInput.value = '';
            nameInput.value = '';
            catInput.value = 'Namkeen';
            priceInput.value = '';
            stockInput.checked = true;
        }
        els.productModal.classList.add('active');
    }

    function closeModal() {
        els.productModal.classList.remove('active');
    }

    function editProduct(id) {
        const products = ProductService.getAll();
        const p = products.find(x => x.id === id);
        if (p) openProductModal(p);
    }

    function deleteProduct(id) {
        if (confirm('Delete this product?')) {
            ProductService.delete(id);
            updateDashboard();
        }
    }

    function handleSaveProduct(e) {
        e.preventDefault();
        const name = document.getElementById('prodName').value;
        const category = document.getElementById('prodCategory').value;
        const price = parseInt(document.getElementById('prodPrice').value);
        const inStock = document.getElementById('prodStock').checked;

        if (editingProductId) {
            // MERGE Logic
            const existing = ProductService.getAll().find(p => p.id === editingProductId);
            if (existing) {
                const updatedProduct = {
                    ...existing,
                    name,
                    category,
                    price,
                    inStock
                };
                ProductService.update(updatedProduct);
            }
        } else {
            // New Product Logic
            let image = 'assets/namkeen.png';
            if (category.toLowerCase().includes('fruit') ||
                category.toLowerCase().includes('seeds') ||
                category.toLowerCase().includes('dates')) {
                image = 'assets/dryfruits.png';
            } else if (category.toLowerCase().includes('cookies')) {
                image = 'assets/hero.png';
            }

            const newProduct = {
                name,
                category,
                price,
                image,
                inStock,
                rating: 4.5,
                reviews: 0
            };
            ProductService.add(newProduct);
        }

        closeModal();
        updateDashboard();
    }

})();
