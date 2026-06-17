import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useProductContext } from '../../context/ProductContext';
import { ShoppingBag, X, Minus, Plus } from 'lucide-react';

const Layout = ({ children }) => {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useProductContext();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const timer = setTimeout(() => {
                const el = document.querySelector(location.hash);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [location]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header toggleCart={() => setIsCartOpen(true)} />

            <main className="flex-grow pt-16">
                {children}
            </main>

            <Footer />

            {/* Cart Sidebar Overlay */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />

                    <div className="absolute inset-y-0 right-0 max-w-full flex">
                        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col h-full transform transition-transform duration-300 ease-in-out">

                            {/* Cart Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <ShoppingBag size={20} className="text-orange-600" />
                                    Your Cart
                                </h2>
                                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Cart Items */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {cart.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-4">
                                        <div className="p-4 bg-gray-50 rounded-full">
                                            <ShoppingBag size={40} className="text-gray-300" />
                                        </div>
                                        <p>Your cart is empty.</p>
                                        <button
                                            onClick={() => setIsCartOpen(false)}
                                            className="text-orange-600 font-medium hover:underline"
                                        >
                                            Start Shopping
                                        </button>
                                    </div>
                                ) : (
                                    cart.map(item => (
                                        <div key={item.cartKey} className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="w-20 h-20 bg-white rounded-lg p-2 flex-shrink-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.displayName || item.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.displayName || item.name}</h3>
                                                    <p className="text-sm text-gray-500 mt-1">₹{item.effectivePrice || item.price}</p>
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-2 py-1">
                                                        <button
                                                            onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                                                            className="text-gray-500 hover:text-orange-600"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                                                            className="text-gray-500 hover:text-orange-600"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.cartKey)}
                                                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Cart Footer */}
                            {cart.length > 0 && (
                                <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-4">
                                    <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>₹{cartTotal}</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsCartOpen(false);
                                            navigate('/checkout');
                                        }}
                                        className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Layout;
