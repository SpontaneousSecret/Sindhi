import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useProductContext } from '../../context/ProductContext';
import {
    LayoutDashboard,
    Package,
    FolderOpen,
    ShoppingCart,
    Tag,
    LogOut,
    Menu,
    X,
    User
} from 'lucide-react';

const AdminLayout = ({ children }) => {
    const { adminUser, logout } = useProductContext();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = async () => {
        await logout();
        navigate('/admin');
    };

    const navItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/products', icon: Package, label: 'Products' },
        { path: '/admin/categories', icon: FolderOpen, label: 'Categories' },
        { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
        { path: '/admin/festive-offers', icon: Tag, label: 'Festive Offers' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900 text-white transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-20'
                    }`}
            >
                {/* Logo Section */}
                <div className="p-6 border-b border-neutral-700/50">
                    <div className="flex items-center justify-between">
                        {sidebarOpen && (
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                                    Sindhi Namkeen
                                </h1>
                                <p className="text-xs text-neutral-400 mt-1">Admin Portal</p>
                            </div>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-neutral-700/50 rounded-lg transition-colors"
                        >
                            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-r from-primary to-orange-600 shadow-lg shadow-primary/30'
                                    : 'hover:bg-neutral-700/50'
                                    }`}
                            >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                {sidebarOpen && (
                                    <span className="font-medium">{item.label}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-700/50">
                    {sidebarOpen ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 px-4 py-3 bg-neutral-700/30 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
                                    <User className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">
                                        {adminUser?.username || 'Admin'}
                                    </p>
                                    <p className="text-xs text-neutral-400 truncate">
                                        {adminUser?.email || 'admin@sindhi.com'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                            >
                                <LogOut className="h-5 w-5" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="w-full p-3 rounded-xl hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all flex items-center justify-center"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main
                className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'
                    }`}
            >
                {/* Header */}
                <header className="bg-white border-b border-neutral-200 px-8 py-6 sticky top-0 z-40 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-800">
                                {navItems.find(item => item.path === location.pathname)?.label || 'Admin'}
                            </h2>
                            <p className="text-sm text-neutral-500 mt-1">
                                Manage your Sindhi Namkeen store
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-neutral-700">
                                    {adminUser?.username}
                                </p>
                                <p className="text-xs text-neutral-500">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
