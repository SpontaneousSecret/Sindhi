import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-6">
            <div className="w-full px-6 md:px-12 lg:px-16">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
                            Sindhi Namkeen
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">Authentic Taste Since 1980</p>
                    </div>

                    <div className="flex gap-6 text-sm text-gray-400">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <Link to="/#contact" className="hover:text-white transition-colors">Contact</Link>
                        <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>&copy; 2026 Sindhi Namkeen & Dry Fruits. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
