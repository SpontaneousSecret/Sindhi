import React, { useState } from 'react';
import { useProductContext } from '../context/ProductContext';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Clock, CreditCard, CheckCircle } from 'lucide-react';

const CheckoutPage = () => {
    const { cart, cartTotal, checkout } = useProductContext();
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        address2: '',
        city: 'Gurugram',
        state: 'Haryana',
        zip: ''
    });

    const [deliveryType, setDeliveryType] = useState('standard_3');
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Delivery Costs & Options
    const DELIVERY_CHARGES = {
        standard_3: 0,
        standard_6: 0,
        standard_9: 0,
        urgent: 250
    };

    const deliveryOptions = [
        { id: 'standard_3', label: 'Standard Delivery (3 Hours)', cost: 0, desc: 'Delivered within 3 hours.' },
        { id: 'standard_6', label: 'Standard Delivery (6 Hours)', cost: 0, desc: 'Delivered within 6 hours.' },
        { id: 'standard_9', label: 'Standard Delivery (9 Hours)', cost: 0, desc: 'Delivered within 9 hours.' },
        { id: 'urgent', label: 'Urgent Delivery', cost: 250, desc: 'Priority dispatch. Delivered ASAP.' }
    ];

    const currentDeliveryCost = DELIVERY_CHARGES[deliveryType];
    const finalTotal = cartTotal + currentDeliveryCost;

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Map delivery type to slot description
            const deliverySlots = {
                'standard_3': '3 Hours Delivery',
                'standard_6': '6 Hours Delivery',
                'standard_9': '9 Hours Delivery',
                'urgent': 'Urgent Delivery (ASAP)'
            };

            // Prepare order data for API
            const orderData = {
                customer_name: formData.name,
                customer_email: formData.email,
                customer_phone: formData.phone,
                shipping_address_line1: formData.address,
                shipping_address_line2: formData.address2,
                shipping_city: formData.city,
                shipping_state: formData.state,
                shipping_pincode: formData.zip,
                delivery_slot: deliverySlots[deliveryType],
                customer_notes: ''
            };

            // Call checkout from context (which calls the API)
            const result = await checkout(orderData);

            if (result.success) {
                setOrderNumber(result.order.order_number);
                setOrderPlaced(true);
            } else {
                // Handle validation errors
                if (typeof result.error === 'object') {
                    const errorMessages = Object.entries(result.error)
                        .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                        .join('\n');
                    setError(errorMessages);
                } else {
                    setError(result.error);
                }
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Checkout error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0 && !orderPlaced) {
        return (
            <div className="min-h-screen bg-neutral-50 pt-24 pb-12 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-neutral-800 mb-4">Your cart is empty</h2>
                <Link to="/products" className="text-primary hover:underline">Return to Shop</Link>
            </div>
        );
    }

    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-neutral-50 pt-24 pb-12 flex items-center justify-center px-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-800 mb-2">Order Placed Successfully!</h2>
                    <p className="text-neutral-600 mb-4">Thank you for your order, {formData.name}!</p>
                    <p className="text-sm text-neutral-500 mb-6">Order Number: <strong>{orderNumber}</strong></p>
                    <Link to="/" className="block w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-600 transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link to="/products" className="inline-flex items-center text-neutral-500 hover:text-primary transition-colors">
                        <ChevronLeft size={20} className="mr-1" />
                        Back to Shop
                    </Link>
                    <h1 className="text-3xl font-display font-bold text-neutral-800 mt-4">Checkout</h1>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left Column: Details form */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Shipping Address */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                            <h2 className="text-xl font-bold text-neutral-800 mb-4 flex items-center gap-2">
                                <MapPin size={22} className="text-primary" />
                                Shipping Details
                            </h2>
                            {error && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600 whitespace-pre-line">{error}</p>
                                </div>
                            )}
                            <form id="checkout-form" onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Phone Number</label>
                                    <input
                                        required
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Address Line 1</label>
                                    <input
                                        required
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Address Line 2 (Optional)</label>
                                    <input
                                        type="text"
                                        name="address2"
                                        value={formData.address2}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">City</label>
                                    <input
                                        required
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">State</label>
                                    <input
                                        required
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">PIN Code</label>
                                    <input
                                        required
                                        type="text"
                                        name="zip"
                                        value={formData.zip}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Delivery Options */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                            <h2 className="text-xl font-bold text-neutral-800 mb-4 flex items-center gap-2">
                                <Clock size={22} className="text-primary" />
                                Delivery Speed
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {deliveryOptions.map((option) => (
                                    <label
                                        key={option.id}
                                        className={`relative flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${deliveryType === option.id
                                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                            : 'border-neutral-200 hover:border-primary/50'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="delivery"
                                            value={option.id}
                                            checked={deliveryType === option.id}
                                            onChange={(e) => setDeliveryType(e.target.value)}
                                            className="sr-only"
                                        />
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-neutral-800">{option.label}</span>
                                            {option.cost > 0 && (
                                                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">+₹{option.cost}</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-neutral-500">{option.desc}</p>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                            <h2 className="text-xl font-bold text-neutral-800 mb-4 flex items-center gap-2">
                                <CreditCard size={22} className="text-primary" />
                                Payment Method
                            </h2>
                            <div className="p-4 border border-neutral-200 bg-neutral-50 rounded-xl flex items-center gap-3 opacity-80">
                                <input type="radio" checked readOnly className="w-5 h-5 text-primary" />
                                <div>
                                    <span className="block font-bold text-neutral-800">Cash on Delivery (COD)</span>
                                    <span className="text-sm text-neutral-500">Pay cleanly with cash upon receipt.</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 sticky top-24">
                            <h2 className="text-lg font-bold text-neutral-800 mb-4">Order Summary</h2>
                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <div className="flex gap-2">
                                            <span className="text-neutral-500">{item.quantity}x</span>
                                            <span className="text-neutral-800 line-clamp-1">{item.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-medium">₹{(item.effectivePrice * item.quantity).toFixed(0)}</span>
                                            {item.discount > 0 && (
                                                <span className="block text-xs text-neutral-400 line-through">₹{(item.price * item.quantity).toFixed(0)}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-dashed border-neutral-200 pt-4 space-y-2">
                                <div className="flex justify-between text-neutral-600">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-neutral-600">
                                    <span>Delivery</span>
                                    <span>{currentDeliveryCost === 0 ? 'Free' : `₹${currentDeliveryCost}`}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-neutral-900 pt-2 border-t border-neutral-100 mt-2">
                                    <span>Total</span>
                                    <span>₹{finalTotal}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={isSubmitting}
                                className="w-full mt-6 bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary-600 transition-colors shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Placing Order...' : 'Place Order (COD)'}
                            </button>
                            <p className="text-xs text-center text-neutral-400 mt-4">
                                By placing this order, you agree to our Terms of Service.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
