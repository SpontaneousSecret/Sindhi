import axios from 'axios';

// API Base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    // No Content-Type default: Axios sets application/json automatically for
    // plain-object bodies, and leaves it unset for FormData so the browser
    // can inject the correct multipart/form-data boundary.
});

const TOKEN_KEY = 'sindhi_admin_token';

// Set or clear the DRF token used for admin write operations.
// Token is persisted to localStorage so it survives page reloads.
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Token ${token}`;
        localStorage.setItem(TOKEN_KEY, token);
    } else {
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem(TOKEN_KEY);
    }
};

// Restore token from localStorage on app start (before verifyAdminSession).
export const restoreAuthToken = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        api.defaults.headers.common['Authorization'] = `Token ${token}`;
    }
    return token;
};

// Request interceptor for logging (development only)
if (import.meta.env.DEV) {
    api.interceptors.request.use(
        (config) => {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
            return config;
        },
        (error) => {
            console.error('[API Request Error]', error);
            return Promise.reject(error);
        }
    );
}

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with error status
            console.error('[API Error]', error.response.status, error.response.data);
        } else if (error.request) {
            // Request made but no response
            console.error('[API Error] No response from server');
        } else {
            // Error in request setup
            console.error('[API Error]', error.message);
        }
        return Promise.reject(error);
    }
);

// ==================== PRODUCTS API ====================

/**
 * Fetch all products with optional filters
 * @param {Object} params - Query parameters
 * @param {string} params.category__slug - Filter by category slug
 * @param {boolean} params.is_featured - Filter featured products
 * @param {string} params.search - Search query
 * @param {string} params.ordering - Sort order (price, -price, created_at, -created_at)
 * @param {number} params.page - Page number for pagination
 */
export const getProducts = async (params = {}) => {
    try {
        const response = await api.get('/products/', { params });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch products');
    }
};

/**
 * Fetch single product by slug
 * @param {string} slug - Product slug
 */
export const getProduct = async (slug) => {
    try {
        const response = await api.get(`/products/${slug}/`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch product details');
    }
};

/**
 * Fetch featured products
 */
export const getFeaturedProducts = async () => {
    try {
        const response = await api.get('/products/featured/');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch featured products');
    }
};

// ==================== CATEGORIES API ====================

/**
 * Fetch all categories
 * @param {Object} params - Query parameters (e.g., page_size)
 */
export const getCategories = async (params = {}) => {
    try {
        const response = await api.get('/categories/', { params });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch categories');
    }
};

/**
 * Fetch single category by slug
 * @param {string} slug - Category slug
 */
export const getCategory = async (slug) => {
    try {
        const response = await api.get(`/categories/${slug}/`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch category details');
    }
};

// ==================== ORDERS API ====================

/**
 * Create new order (COD checkout)
 * @param {Object} orderData - Order details
 * @param {string} orderData.customer_name
 * @param {string} orderData.customer_email
 * @param {string} orderData.customer_phone
 * @param {string} orderData.shipping_address_line1
 * @param {string} orderData.shipping_address_line2
 * @param {string} orderData.shipping_city
 * @param {string} orderData.shipping_state
 * @param {string} orderData.shipping_pincode
 * @param {string} orderData.delivery_slot
 * @param {string} orderData.customer_notes
 * @param {Array} orderData.items - [{product: id, quantity: number}]
 */
export const createOrder = async (orderData) => {
    try {
        const response = await api.post('/orders/', orderData);
        return response.data;
    } catch (error) {
        if (error.response?.data) {
            // Return validation errors from backend
            throw error.response.data;
        }
        throw new Error('Failed to create order');
    }
};

/**
 * Fetch order details by order number
 * @param {string} orderNumber - Order number
 */
export const getOrder = async (orderNumber) => {
    try {
        const response = await api.get(`/orders/${orderNumber}/`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch order details');
    }
};

// ==================== ADMIN API ====================

/**
 * Admin login with Django superuser credentials
 * @param {string} username - Admin username
 * @param {string} password - Admin password
 */
export const adminLogin = async (username, password) => {
    try {
        const response = await api.post('/admin/login/', { username, password });
        if (response.data.token) {
            setAuthToken(response.data.token);
        }
        return response.data;
    } catch (error) {
        if (error.response?.data) {
            throw error.response.data;
        }
        throw new Error('Failed to login');
    }
};

/**
 * Admin logout — deletes token on server and clears it locally.
 */
export const adminLogout = async () => {
    try {
        await api.post('/admin/logout/');
    } catch (error) {
        // clear locally even if server call fails
    } finally {
        setAuthToken(null);
    }
};

/**
 * Verify admin token — restores token from localStorage before calling.
 */
export const verifyAdminSession = async () => {
    restoreAuthToken();
    try {
        const response = await api.get('/admin/verify/');
        return response.data;
    } catch (error) {
        return { authenticated: false };
    }
};

// ==================== PRODUCT CRUD (ADMIN) ====================

/**
 * Create new product
 * @param {FormData} formData - Product data with image
 */
export const createProduct = async (formData) => {
    try {
        // Do NOT set Content-Type — axios auto-sets multipart/form-data with boundary
        const response = await api.post('/products/', formData);
        return response.data;
    } catch (error) {
        if (error.response?.data) {
            throw error.response.data;
        }
        throw new Error('Failed to create product');
    }
};

/**
 * Update existing product
 * @param {number} productId - Product ID
 * @param {FormData} formData - Updated product data
 */
export const updateProduct = async (productId, formData) => {
    try {
        const response = await api.patch(`/products/${productId}/`, formData);
        return response.data;
    } catch (error) {
        if (error.response?.data) {
            throw error.response.data;
        }
        throw new Error('Failed to update product');
    }
};

/**
 * Delete product
 * @param {number} productId - Product ID
 */
export const deleteProduct = async (productId) => {
    try {
        const response = await api.delete(`/products/${productId}/`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to delete product');
    }
};

// ==================== CATEGORY CRUD (ADMIN) ====================

/**
 * Create new category
 * @param {FormData} formData - Category data with image
 */
export const createCategory = async (formData) => {
    try {
        const response = await api.post('/categories/', formData);
        return response.data;
    } catch (error) {
        if (error.response?.data) {
            throw error.response.data;
        }
        throw new Error('Failed to create category');
    }
};

/**
 * Update existing category
 * @param {number} categoryId - Category ID
 * @param {FormData} formData - Updated category data
 */
export const updateCategory = async (categoryId, formData) => {
    try {
        const response = await api.patch(`/categories/${categoryId}/`, formData);
        return response.data;
    } catch (error) {
        if (error.response?.data) {
            throw error.response.data;
        }
        throw new Error('Failed to update category');
    }
};

/**
 * Delete category
 * @param {number} categoryId - Category ID
 */
export const deleteCategory = async (categoryId) => {
    try {
        const response = await api.delete(`/categories/${categoryId}/`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to delete category');
    }
};

// ==================== FESTIVE OFFERS API (ADMIN) ====================

export const getFestiveOffers = async () => {
    try {
        const response = await api.get('/festive-offers/');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch festive offers');
    }
};

export const createFestiveOffer = async (data) => {
    try {
        const response = await api.post('/festive-offers/', data);
        return response.data;
    } catch (error) {
        if (error.response?.data) throw error.response.data;
        throw new Error('Failed to create festive offer');
    }
};

export const updateFestiveOffer = async (id, data) => {
    try {
        const response = await api.patch(`/festive-offers/${id}/`, data);
        return response.data;
    } catch (error) {
        if (error.response?.data) throw error.response.data;
        throw new Error('Failed to update festive offer');
    }
};

export const deleteFestiveOffer = async (id) => {
    try {
        await api.delete(`/festive-offers/${id}/`);
    } catch (error) {
        throw new Error('Failed to delete festive offer');
    }
};

export const applyFestiveOffer = async (id) => {
    try {
        const response = await api.post(`/festive-offers/${id}/apply/`);
        return response.data;
    } catch (error) {
        if (error.response?.data) throw error.response.data;
        throw new Error('Failed to apply festive offer');
    }
};

export const deactivateFestiveOffer = async (id) => {
    try {
        const response = await api.post(`/festive-offers/${id}/deactivate/`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to deactivate festive offer');
    }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Handle API errors and return user-friendly messages
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
export const handleApiError = (error) => {
    if (error.response) {
        // Server error with response
        const status = error.response.status;
        if (status === 404) return 'Resource not found';
        if (status === 400) return 'Invalid request. Please check your input.';
        if (status === 500) return 'Server error. Please try again later.';
        return error.response.data?.detail || 'An error occurred';
    } else if (error.request) {
        // No response from server
        return 'Unable to connect to server. Please check your internet connection.';
    }
    return error.message || 'An unexpected error occurred';
};

export default api;
