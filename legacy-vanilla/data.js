// Product Categories
const CATEGORIES = {
    SWEET: 'Sweet',
    NAMKEEN: 'Namkeen',
    DRY_FRUITS: 'Dry Fruits'
};

// Base products to generate variations from
const BASE_PRODUCTS = [
    { name: 'Classic Salted', category: CATEGORIES.NAMKEEN, basePrice: 150, image: 'assets/namkeen.png' },
    { name: 'Spicy Masala', category: CATEGORIES.NAMKEEN, basePrice: 160, image: 'assets/namkeen.png' },
    { name: 'Aloo Bhujia', category: CATEGORIES.NAMKEEN, basePrice: 180, image: 'assets/namkeen.png' },
    { name: 'Navratan Mix', category: CATEGORIES.NAMKEEN, basePrice: 200, image: 'assets/namkeen.png' },
    { name: 'Moong Dal', category: CATEGORIES.NAMKEEN, basePrice: 170, image: 'assets/namkeen.png' },
    { name: 'Kaju Katli', category: CATEGORIES.SWEET, basePrice: 800, image: 'assets/hero.png' }, // Placeholder image
    { name: 'Gulab Jamun', category: CATEGORIES.SWEET, basePrice: 300, image: 'assets/hero.png' },
    { name: 'Rasgulla', category: CATEGORIES.SWEET, basePrice: 280, image: 'assets/hero.png' },
    { name: 'Soan Papdi', category: CATEGORIES.SWEET, basePrice: 250, image: 'assets/hero.png' },
    { name: 'Premium Almonds', category: CATEGORIES.DRY_FRUITS, basePrice: 900, image: 'assets/dryfruits.png' },
    { name: 'Cashews', category: CATEGORIES.DRY_FRUITS, basePrice: 850, image: 'assets/dryfruits.png' },
    { name: 'Pistachios', category: CATEGORIES.DRY_FRUITS, basePrice: 1200, image: 'assets/dryfruits.png' },
    { name: 'Walnuts', category: CATEGORIES.DRY_FRUITS, basePrice: 1100, image: 'assets/dryfruits.png' },
    { name: 'Raisins', category: CATEGORIES.DRY_FRUITS, basePrice: 400, image: 'assets/dryfruits.png' }
];

// Generate 400 products
function generateProducts() {
    let products = [];
    for (let i = 1; i <= 400; i++) {
        const base = BASE_PRODUCTS[Math.floor(Math.random() * BASE_PRODUCTS.length)];
        products.push({
            id: i,
            name: `${base.name} - Pack ${i}`,
            category: base.category,
            price: base.basePrice + Math.floor(Math.random() * 50),
            image: base.image,
            rating: (4 + Math.random()).toFixed(1),
            reviews: Math.floor(Math.random() * 500)
        });
    }
    return products;
}

// Initialize data if not in localStorage
function initData() {
    if (!localStorage.getItem('products')) {
        const products = generateProducts();
        localStorage.setItem('products', JSON.stringify(products));
    }
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }
}

// Data Access Layer
const ProductService = {
    getAll: () => {
        return JSON.parse(localStorage.getItem('products') || '[]');
    },
    getByCategory: (category) => {
        const products = ProductService.getAll();
        if (category === 'All') return products;
        return products.filter(p => p.category === category);
    },
    add: (product) => {
        const products = ProductService.getAll();
        product.id = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.unshift(product);
        localStorage.setItem('products', JSON.stringify(products));
        return product;
    },
    delete: (id) => {
        let products = ProductService.getAll();
        products = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
    }
};

const OrderService = {
    getAll: () => {
        return JSON.parse(localStorage.getItem('orders') || '[]');
    },
    add: (order) => {
        const orders = OrderService.getAll();
        order.id = Date.now();
        order.date = new Date().toISOString();
        order.status = 'Pending';
        orders.unshift(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        return order;
    }
};

// Initialize on load
initData();
