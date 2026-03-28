
/* ===================================
   ADMIN DASHBOARD LOGIC
   =================================== */

// State
let currentUser = null;
let editingProductId = null;

// DOM Elements
const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    // Event Listeners
    loginForm.addEventListener('submit', handleLogin);
    productForm.addEventListener('submit', handleSaveProduct);

    // Close modal on outside click
    window.onclick = function (event) {
        if (event.target == productModal) {
            closeModal();
        }
    }
});

/* ===================================
   AUTHENTICATION
   =================================== */

function checkAuth() {
    const user = localStorage.getItem('adminUser');
    if (user) {
        currentUser = user;
        showDashboard();
    } else {
        showLogin();
    }
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value; // In real app, hash this!

    if (username === 'admin' && password === 'admin123') {
        currentUser = username;
        localStorage.setItem('adminUser', username);
        showDashboard();
    } else {
        alert('Invalid credentials!');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('adminUser');
    showLogin();
}

function showLogin() {
    loginSection.style.display = 'block';
    dashboardSection.style.display = 'none';
    logoutBtn.style.display = 'none';
}

function showDashboard() {
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    logoutBtn.style.display = 'block';
    updateDashboard();
}

/* ===================================
   DASHBOARD UI
   =================================== */

function updateDashboard() {
    updateStats();
    renderInventory();
    renderOrders();
}

function updateStats() {
    const products = ProductService.getAll();
    const orders = OrderService.getAll();

    document.getElementById('totalProducts').innerText = products.length;
    document.getElementById('totalOrders').innerText = orders.length;
}

function switchTab(tabName) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

/* ===================================
   INVENTORY MANAGEMENT
   =================================== */

function renderInventory() {
    const products = ProductService.getAll();
    const tbody = document.getElementById('inventoryTableBody');
    tbody.innerHTML = '';

    products.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${p.id}</td>
            <td><img src="${p.image}" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover;"></td>
            <td><strong>${p.name}</strong></td>
            <td><span style="padding: 2px 8px; background: #eee; border-radius: 12px; font-size: 0.8em;">${p.category}</span></td>
            <td>₹${p.price}</td>
            <td>
                <button class="action-btn btn-edit" onclick="editProduct(${p.id})">Edit</button>
                <button class="action-btn btn-delete" onclick="deleteProduct(${p.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openProductModal(product = null) {
    const title = document.getElementById('modalTitle');
    const idInput = document.getElementById('editProductId');
    const nameInput = document.getElementById('prodName');
    const catInput = document.getElementById('prodCategory');
    const priceInput = document.getElementById('prodPrice');

    if (product) {
        title.innerText = 'Edit Product';
        editingProductId = product.id;
        idInput.value = product.id;
        nameInput.value = product.name;
        catInput.value = product.category;
        priceInput.value = product.price;
    } else {
        title.innerText = 'Add New Product';
        editingProductId = null;
        idInput.value = '';
        nameInput.value = '';
        catInput.value = 'Namkeen';
        priceInput.value = '';
    }

    productModal.classList.add('active');
}

function closeModal() {
    productModal.classList.remove('active');
}

function editProduct(id) {
    const products = ProductService.getAll();
    const product = products.find(p => p.id === id);
    if (product) {
        openProductModal(product);
    }
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        ProductService.delete(id);
        updateDashboard();
    }
}

function handleSaveProduct(e) {
    e.preventDefault();

    const name = document.getElementById('prodName').value;
    const category = document.getElementById('prodCategory').value;
    const price = parseInt(document.getElementById('prodPrice').value);

    // Simple image selection based on category for demo
    let image = 'assets/namkeen.png';
    if (category === 'Sweet') image = 'assets/hero.png';
    if (category === 'Dry Fruits') image = 'assets/dryfruits.png';

    const productData = {
        name,
        category,
        price,
        image,
        rating: 4.5,
        reviews: 0
    };

    if (editingProductId) {
        // Update existing (hacky way since Service.add handles new ID but not update properly in my simplified service)
        // In a real app, Service.update would be used. Here I'll delete then add with same ID or adjust Service logic.
        // Let's adjust logic:
        let products = ProductService.getAll();
        const index = products.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
            localStorage.setItem('products', JSON.stringify(products));
        }
    } else {
        ProductService.add(productData);
    }

    closeModal();
    updateDashboard();
}

/* ===================================
   ORDER MANAGEMENT
   =================================== */

// Mock generate data if empty
if (OrderService.getAll().length === 0) {
    OrderService.add({ customer: 'Rahul Kumar', items: '2x Premium Namkeen', total: 320, status: 'Pending' });
    OrderService.add({ customer: 'Priya Singh', items: '1x Cashews (500g)', total: 850, status: 'Delivered' });
    OrderService.add({ customer: 'Amit Shah', items: '1x Gift Hamper', total: 1500, status: 'Processing' });
}

function renderOrders() {
    const orders = OrderService.getAll();
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = '';

    orders.forEach(order => {
        const tr = document.createElement('tr');

        let statusColor = '#f0ad4e';
        if (order.status === 'Delivered') statusColor = '#5cb85c';
        if (order.status === 'Processing') statusColor = '#5bc0de';

        tr.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.items}</td>
            <td>₹${order.total}</td>
            <td><span style="padding: 2px 8px; background: ${statusColor}; color: white; border-radius: 4px; font-size: 0.8em;">${order.status}</span></td>
            <td>
                <button class="action-btn" onclick="alert('View Details functionality coming soon')">View</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}
