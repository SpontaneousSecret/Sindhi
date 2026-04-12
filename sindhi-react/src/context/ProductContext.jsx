import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProducts, getCategories, createOrder, handleApiError, adminLogin as apiAdminLogin, adminLogout as apiAdminLogout, verifyAdminSession } from '../services/api';

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

    // Fetch Products from API
    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch products with pagination disabled (get all)
            const response = await getProducts({ page_size: 1000 });

            // Transform API response to match frontend format
            const transformedProducts = response.results.map(product => ({
                id: product.id,
                name: product.name,
                slug: product.slug,
                category: product.category_name,
                price: parseFloat(product.price),
                effectivePrice: parseFloat(product.effective_price),
                discount: parseFloat(product.effective_discount),
                image: product.image_url || '/assets/namkeen.png',
                description: product.short_description || '',
                in_stock: product.in_stock,
                stock_quantity: product.stock_quantity,
                isFeatured: product.is_featured,
                weight: product.weight || '',
            }));

            setProducts(transformedProducts);

            // Sync cart prices against fresh product data so discounts
            // (added or removed) are reflected immediately.
            setCart(prevCart => prevCart.map(cartItem => {
                const fresh = transformedProducts.find(p => p.id === cartItem.id);
                if (!fresh) return cartItem;
                return {
                    ...cartItem,
                    price: fresh.price,
                    effectivePrice: fresh.effectivePrice,
                    discount: fresh.discount,
                };
            }));
        } catch (err) {
            console.error('Failed to fetch products:', err);
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Fetch Categories from API
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
            console.error('Failed to fetch categories:', err);
            setError(handleApiError(err));
            // Fallback to 'All' if categories fail to load
            setCategories(['All']);
            setFullCategories([]);
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
