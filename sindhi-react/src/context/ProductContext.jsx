import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProducts, getCategories, createOrder, handleApiError, adminLogin as apiAdminLogin, adminLogout as apiAdminLogout, verifyAdminSession } from '../services/api';
import { PRODUCTS as LOCAL_PRODUCTS, CATEGORIES as LOCAL_CATEGORIES } from '../data/products';

const ProductContext = createContext();

export const useProductContext = () => {
    return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); // String array for filtering
    const [fullCategories, setFullCategories] = useState([]); // Full category objects for display
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminUser, setAdminUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Build a name->image lookup from local data for image fallback
    const localImageMap = Object.fromEntries(
        LOCAL_PRODUCTS.map(p => [p.name, p.image])
    );

    // Fetch Products from API, falling back to local data if unavailable
    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch products with pagination disabled (get all)
            const response = await getProducts({ page_size: 1000 });

            // Transform API response to match frontend format
            // Use local image when backend image_url is missing
            const transformedProducts = response.results.map(product => ({
                id: product.id,
                name: product.name,
                slug: product.slug,
                category: product.category_name,
                price: parseFloat(product.price),
                effectivePrice: parseFloat(product.effective_price),
                discount: parseFloat(product.effective_discount),
                image: product.image_url || localImageMap[product.name] || 'assets/products/dry_fruit_mix.png',
                description: product.short_description || '',
                in_stock: product.in_stock,
                stock_quantity: product.stock_quantity,
                isFeatured: product.is_featured,
                weight: product.weight || '',
            }));

            setProducts(transformedProducts);
        } catch (err) {
            // Backend unavailable — use local products.js data directly
            console.warn('Backend unavailable. Loading from local product data.');
            const localProducts = LOCAL_PRODUCTS.map((product, index) => ({
                id: index + 1,
                name: product.name,
                slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                category: product.category,
                price: product.price,
                effectivePrice: product.price,
                discount: 0,
                image: product.image,
                description: '',
                in_stock: true,
                stock_quantity: 99,
                isFeatured: false,
                weight: '',
            }));
            setProducts(localProducts);
            setError(null); // Don't show error — local data works fine
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Fetch Categories from API, falling back to local data
    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getCategories({ page_size: 1000 });
            // Handle paginated response
            const categoryData = response.results || response;

            // Store full category objects for display (HomePage)
            setFullCategories(categoryData);

            // Store category names for filtering (ProductsPage)
            const categoryNames = categoryData.map(cat => cat.name);
            setCategories(['All', ...categoryNames]);
        } catch (err) {
            // Backend unavailable — derive categories from local data
            console.warn('Backend unavailable. Loading categories from local data.');
            
            const localCategoryImages = {
                'Chana & Peanut': 'assets/products/chana_peanut.png',
                'Chips & Wafers': 'assets/products/chips_wafers.png',
                'Dry Fruit': 'assets/products/almonds.png',
                'Fryums': 'assets/products/fryums.png',
                'Gachak & Laddoo': 'assets/products/gachak_laddoo.png',
                'Golgappe': 'assets/products/golgappe.png',
                'Healthy Snacks': 'assets/products/healthy_snacks.png',
                'Important Dry Fruits': 'assets/products/dry_fruit_mix.png',
                'Imported Dates': 'assets/products/dates.png',
                'Imported Dry Fruit': 'assets/products/berries_mix.png',
                'Jaggery': 'assets/products/jaggery.png',
                'Khakhra': 'assets/products/khakhra.png',
                'Makhana': 'assets/products/makhana.png',
                'Moongfali Roasted': 'assets/products/moongfali_roasted.png',
                'Mouth Freshener': 'assets/products/mouth_freshener.png',
                'Navratra Special': 'assets/products/navratra_special.png',
                'Papad & Badiya': 'assets/products/papad_badi.png',
                'Regular Namkeen': 'assets/products/namkeen_mix.png',
                'Roasted Chips': 'assets/products/roasted_chips.png',
                'Seeds': 'assets/products/seeds.png',
                'Special Achar (Pickle)': 'assets/products/pickle_achar.png',
                'Special Cookies': 'assets/products/cookies_rusk.png',
                'Special Matthi': 'assets/products/matthi_namkeen.png',
                'Spices (Masale)': 'assets/products/spices_masale.png'
            };

            const localCategoryNames = [...new Set(LOCAL_PRODUCTS.map(p => p.category))].sort();
            setCategories(['All', ...localCategoryNames]);
            setFullCategories(localCategoryNames.map(name => ({ 
                name, 
                image_url: `/${localCategoryImages[name] || 'assets/products/dry_fruit_mix.png'}` 
            })));
            setError(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Verify admin session on mount
    useEffect(() => {
        const checkAdminSession = async () => {
            try {
                const response = await verifyAdminSession();
                if (response.authenticated) {
                    setIsAdmin(true);
                    setAdminUser(response.user);
                }
            } catch (error) {
                console.error('Failed to verify admin session:', error);
            }
        };

        checkAdminSession();
    }, []);

    // Load Cart from LocalStorage
    useEffect(() => {
        const storedCart = localStorage.getItem('sindhi_cart');
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    // Save Cart to LocalStorage
    useEffect(() => {
        localStorage.setItem('sindhi_cart', JSON.stringify(cart));
    }, [cart]);

    // Cart Operations
    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const clearCart = () => setCart([]);

    // Checkout with API
    const checkout = async (customerInfo) => {
        try {
            // Transform cart items to API format
            const items = cart.map(item => ({
                product: item.id,
                quantity: item.quantity
            }));

            // Create order via API
            const orderData = {
                ...customerInfo,
                items
            };

            const order = await createOrder(orderData);

            // Clear cart on successful order
            clearCart();

            return { success: true, order };
        } catch (err) {
            console.error('Checkout failed:', err);
            return {
                success: false,
                error: typeof err === 'object' ? err : handleApiError(err)
            };
        }
    };

    // Admin Operations
    const login = async (username, password) => {
        try {
            const response = await apiAdminLogin(username, password);
            if (response.success) {
                setIsAdmin(true);
                setAdminUser(response.user);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const logout = async () => {
        try {
            await apiAdminLogout();
            setIsAdmin(false);
            setAdminUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
            // Clear local state even if API call fails
            setIsAdmin(false);
            setAdminUser(null);
        }
    };

    // Derived State
    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const cartTotal = cart.reduce((total, item) => {
        // Use effective price if available (with discount)
        const price = item.effectivePrice || item.price;
        return total + (price * item.quantity);
    }, 0);

    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    const value = {
        products,
        categories,
        fullCategories, // Add fullCategories to context value
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkout,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        filteredProducts,
        cartTotal,
        cartCount,
        isAdmin,
        adminUser,
        login,
        logout,
        loading,
        error,
        fetchProducts,
        fetchCategories
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};
