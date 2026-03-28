/**
 * Global Error Handler for Sindhi App
 * Catches unhandled errors and displays a toast notification.
 */

// Initialize Namespace
window.SindhiApp = window.SindhiApp || {};
window.SindhiApp.Utils = window.SindhiApp.Utils || {};

(function () {
    'use strict';

    function initErrorHandler() {
        console.log('SafeGuard: Error Shield Active');

        window.onerror = function (msg, url, line, col, error) {
            const errorMessage = `Error: ${msg} \nAt: ${url}:${line}:${col}`;
            console.error(errorMessage);
            // Ignore generic cross-origin script error notifications in UI toast
            if (msg !== 'Script error.') {
                showErrorToast(msg);
            }
            return false; // Let default handler run too
        };

        window.addEventListener('unhandledrejection', function (event) {
            console.error('Unhandled Promise Rejection:', event.reason);
            showErrorToast('An unexpected network or logic error occurred.');
        });
    }

    function showErrorToast(message) {
        let toast = document.getElementById('error-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'error-toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #e74c3c;
                color: white;
                padding: 1rem 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 9999;
                font-family: sans-serif;
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';

        setTimeout(() => {
            toast.style.transform = 'translateY(100px)';
            toast.style.opacity = '0';
        }, 5000);
    }

    // Expose
    window.SindhiApp.Utils.ErrorHandler = {
        init: initErrorHandler,
        showError: showErrorToast
    };

    // Auto-init
    initErrorHandler();

})();
