import React, { useEffect, useState } from 'react';
import { useProductContext } from '../../context/ProductContext';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import {
    Package,
    ShoppingCart,
    TrendingUp,
    AlertTriangle,
    ArrowRight,
    DollarSign
} from 'lucide-react';

const AdminDashboard = () => {
    const { products, isAdmin } = useProductContext();
    const navigate = useNavigate();

    // Redirect if not admin
    useEffect(() => {
        if (!isAdmin) {
            navigate('/admin');
        }
    }, [isAdmin, navigate]);

    // Calculate statistics
    const totalProducts = products.length;
    const inStockProducts = products.filter(p => p.in_stock).length;
    const outOfStockProducts = totalProducts - inStockProducts;
    const lowStockProducts = products.filter(p => p.in_stock && p.stock_quantity && p.stock_quantity < 10).length;

    const stats = [
        {
            label: 'Total Products',
            value: totalProducts,
            icon: Package,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
        },
        {
            label: 'In Stock',
            value: inStockProducts,
            icon: TrendingUp,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
        },
        {
            label: 'Out of Stock',
            value: outOfStockProducts,
            icon: AlertTriangle,
            color: 'from-red-500 to-red-600',
            bgColor: 'bg-red-50',
            textColor: 'text-red-600',
        },
        {
            label: 'Low Stock',
            value: lowStockProducts,
            icon: ShoppingCart,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600',
        },
    ];

    const quickActions = [
        {
            label: 'Manage Products',
            description: 'Add, edit, or remove products',
            icon: Package,
            path: '/admin/products',
            color: 'from-primary to-orange-600',
        },
        {
            label: 'Manage Categories',
            description: 'Organize your product categories',
            icon: Package,
            path: '/admin/categories',
            color: 'from-purple-500 to-purple-600',
        },
        {
            label: 'View Orders',
            description: 'Track and manage customer orders',
            icon: ShoppingCart,
            path: '/admin/orders',
            color: 'from-blue-500 to-blue-600',
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-primary to-orange-600 rounded-2xl p-8 text-white shadow-xl">
                    <h1 className="text-3xl font-bold mb-2 text-white">Welcome to Admin Dashboard</h1>
                    <p className="text-white/90">Manage your Sindhi Namkeen store efficiently</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-200/50"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                        <Icon className={`h-6 w-6 ${stat.textColor}`} />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-neutral-600 text-sm font-medium mb-1">
                                        {stat.label}
                                    </p>
                                    <p className="text-3xl font-bold text-neutral-800">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-2xl font-bold text-neutral-800 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {quickActions.map((action, index) => {
                            const Icon = action.icon;
                            return (
                                <button
                                    key={index}
                                    onClick={() => navigate(action.path)}
                                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-200/50 text-left group"
                                >
                                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${action.color} mb-4`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-neutral-800 mb-2 group-hover:text-primary transition-colors">
                                        {action.label}
                                    </h3>
                                    <p className="text-sm text-neutral-600 mb-4">
                                        {action.description}
                                    </p>
                                    <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                                        <span>Go to page</span>
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Low Stock Alert */}
                {lowStockProducts > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-orange-100 rounded-xl">
                                <AlertTriangle className="h-6 w-6 text-orange-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-orange-900 mb-1">
                                    Low Stock Alert
                                </h3>
                                <p className="text-orange-700 mb-4">
                                    {lowStockProducts} product{lowStockProducts !== 1 ? 's' : ''} running low on stock. Consider restocking soon.
                                </p>
                                <button
                                    onClick={() => navigate('/admin/products')}
                                    className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                                >
                                    View Products
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
