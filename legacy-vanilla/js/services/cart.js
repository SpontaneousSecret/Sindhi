/**
 * Cart Service
 * Handles shopping cart operations and persistence.
 */

window.SindhiApp = window.SindhiApp || {};
window.SindhiApp.Services = window.SindhiApp.Services || {};

(function () {
    'use strict';

    const StorageService = window.SindhiApp.Services.Storage;
    const STORAGE_KEY = 'sindhi_cart';

    const CartService = {
        state: {
            items: [],
            total: 0
        },

        init() {
            const savedCart = StorageService.get(STORAGE_KEY);
            if (savedCart) {
                this.state = savedCart;
            }
        },

        getItems() {
            return this.state.items;
        },

        getTotal() {
            return this.state.total;
        },

        addItem(product) {
            const existingItem = this.state.items.find(item => item.id === product.id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.state.items.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }

            this._updateTotal();
            this._persist();
            this._notifyChange();
        },

        removeItem(productId) {
            this.state.items = this.state.items.filter(item => item.id !== productId);
            this._updateTotal();
            this._persist();
            this._notifyChange();
        },

        updateQuantity(productId, quantity) {
            const item = this.state.items.find(item => item.id === productId);
            if (item) {
                item.quantity = parseInt(quantity);
                if (item.quantity <= 0) {
                    this.removeItem(productId);
                } else {
                    this._updateTotal();
                    this._persist();
                    this._notifyChange();
                }
            }
        },

        clear() {
            this.state.items = [];
            this.state.total = 0;
            this._persist();
            this._notifyChange();
        },

        _updateTotal() {
            this.state.total = this.state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        },

        _persist() {
            StorageService.set(STORAGE_KEY, this.state);
        },

        _notifyChange() {
            // Dispatch a custom event for UI updates
            const event = new CustomEvent('cart-updated', { detail: this.state });
            window.dispatchEvent(event);
        }
    };

    // Initialize on load
    CartService.init();

    window.SindhiApp.Services.Cart = CartService;

})();
