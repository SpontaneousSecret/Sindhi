/**
 * Safe Storage Service
 * Wraps localStorage with try-catch to prevent crashes on quota exceeded or private mode.
 */

window.SindhiApp = window.SindhiApp || {};
window.SindhiApp.Services = window.SindhiApp.Services || {};

(function () {
    'use strict';

    const StorageService = {
        get: (key, defaultValue = null) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error('Storage Read Error:', e);
                return defaultValue;
            }
        },

        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Storage Write Error:', e);
                window.SindhiApp.Utils.ErrorHandler.showError('Storage Full! Unable to save data.');
                return false;
            }
        },

        remove: (key) => {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.error('Storage Remove Error:', e);
            }
        }
    };

    // Expose
    window.SindhiApp.Services.Storage = StorageService;

})();
