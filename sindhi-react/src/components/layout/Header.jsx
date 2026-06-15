import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useProductContext } from '../../context/ProductContext';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';

const Header = ({ toggleCart }) => {
    const { cartCount, searchQuery, setSearchQuery } = useProductContext();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'About', path: '/#about' },
        { name: 'Contact', path: '/#contact' },
        { name: 'Refunds', path: '/cancellation-refund' },
    ];

    const handleNavClick = (path) => {
        if (!path.includes('#')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/95 backdrop-blur-xl border-b border-primary/10 transition-all duration-300">
            <div className="w-full max-w-[1200px] mx-auto px-6">
                <div className="flex items-center justify-between h-20">

                    {/* Brand Logo */}
                    <Link to="/" className="flex flex-col group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <span className="font-display text-2xl md:text-3xl font-bold text-primary leading-none group-hover:text-primary-600 transition-colors">
                            Sindhi
                        </span>
                        <span className="text-[0.65rem] md:text-xs font-medium text-secondary-700 uppercase tracking-widest mt-0.5">
                            Namkeen & Dry Fruits
                        </span>
                    </Link>

                    {/* Desktop Navigation (Transparent) */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => {
                            // Strict Active State Logic
                            let isActive = false;
                            if (link.path === '/') {
                                isActive = location.pathname === '/' && !location.hash;
                            } else if (link.path.includes('#')) {
                                const hash = link.path.split('#')[1];
                                isActive = location.hash === `#${hash}`;
                            } else {
                                isActive = location.pathname === link.path;
                            }

                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => handleNavClick(link.path)}
                                    className={`relative px-5 py-2 rounded-full text-base font-medium transition-all duration-300 ${isActive
                                            ? 'bg-primary text-white shadow-md shadow-primary/30'
                                            : 'text-neutral-600 hover:text-primary'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Search Bar - Desktop */}
                        <div className="hidden lg:flex items-center relative w-64 group">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-full text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm group-hover:shadow-md"
                            />
                            <Search className="absolute left-3.5 w-4 h-4 text-neutral-400 group-hover:text-primary transition-colors" />
                        </div>

                        {/* Cart Button */}
                        <button
                            onClick={toggleCart}
                            className="relative p-2.5 text-neutral-700 hover:text-primary hover:bg-primary/5 rounded-full transition-all group"
                        >
                            <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-primary rounded-full border-2 border-bg-primary shadow-sm transform scale-100 group-hover:scale-110 transition-transform">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        >
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-bg-primary border-t border-neutral-200 shadow-xl overflow-hidden animate-in slide-in-from-top-2">
                    <div className="p-4 space-y-2">
                        {/* Mobile Search */}
                        <div className="relative mb-6">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-neutral-400" />
                        </div>

                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => {
                                    handleNavClick(link.path);
                                    setIsMobileMenuOpen(false);
                                }}
                                className="block px-4 py-3 text-neutral-800 font-medium hover:bg-neutral-50 hover:text-primary rounded-xl transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
