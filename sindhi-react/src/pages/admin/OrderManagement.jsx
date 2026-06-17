import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
    ShoppingCart,
    Search,
    X,
    Loader2,
    AlertCircle,
    CheckCircle,
    ChevronDown,
    Package,
    Truck,
    MapPin,
    Phone,
    Mail,
    User,
    Calendar,
    RefreshCw,
} from 'lucide-react';
import { getOrders, updateOrderStatus } from '../../services/api';

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending', color: 'bg-amber-100 text-amber-700' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-700' },
    { value: 'processing', label: 'Processing', color: 'bg-orange-100 text-orange-700' },
    { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-700' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-700' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-700' },
];

const statusMeta = Object.fromEntries(STATUS_OPTIONS.map(s => [s.value, s]));

const StatusBadge = ({ status }) => {
    const meta = statusMeta[status] || { label: status, color: 'bg-neutral-100 text-neutral-700' };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${meta.color}`}>
            {meta.label}
        </span>
    );
};

const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
};

const formatDateTime = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
};

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [adminNotes, setAdminNotes] = useState('');

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const params = {};
            if (statusFilter) params.status = statusFilter;
            if (searchQuery.trim()) params.search = searchQuery.trim();
            const data = await getOrders(params);
            setOrders(data.results || []);
            setTotalCount(data.count || 0);
        } catch (err) {
            setError('Failed to load orders. Make sure you are logged in as admin.');
        } finally {
            setLoading(false);
        }
    }, [statusFilter, searchQuery]);

    useEffect(() => {
        const timer = setTimeout(fetchOrders, 300);
        return () => clearTimeout(timer);
    }, [fetchOrders]);

    useEffect(() => {
        const interval = setInterval(fetchOrders, 15000);
        return () => clearInterval(interval);
    }, [fetchOrders]);

    const openDetail = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setAdminNotes(order.admin_notes || '');
    };

    const closeDetail = () => {
        setSelectedOrder(null);
        setNewStatus('');
        setAdminNotes('');
    };

    const handleStatusUpdate = async () => {
        if (!selectedOrder) return;
        setUpdatingStatus(true);
        try {
            const updated = await updateOrderStatus(selectedOrder.order_number, {
                status: newStatus,
                admin_notes: adminNotes,
            });
            setOrders(prev => prev.map(o => o.order_number === updated.order_number ? updated : o));
            setSelectedOrder(updated);
            setSuccess(`Order ${updated.order_number} updated to "${statusMeta[updated.status]?.label}"`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(typeof err === 'string' ? err : 'Failed to update order status');
            setTimeout(() => setError(''), 4000);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const statusCounts = STATUS_OPTIONS.map(s => ({
        ...s,
        count: orders.filter(o => o.status === s.value).length,
    }));

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-800">Order Management</h1>
                        <p className="text-neutral-600 mt-1">{totalCount} orders total</p>
                    </div>
                    <button
                        onClick={fetchOrders}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-semibold transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {/* Alerts */}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 shrink-0" />
                        <span className="font-medium">{success}</span>
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {/* Status filter tabs */}
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setStatusFilter('')}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${statusFilter === '' ? 'bg-primary text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary hover:text-primary'}`}
                    >
                        All ({totalCount})
                    </button>
                    {STATUS_OPTIONS.map(s => (
                        <button
                            key={s.value}
                            onClick={() => setStatusFilter(s.value)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${statusFilter === s.value ? 'bg-primary text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary hover:text-primary'}`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="bg-white rounded-xl p-4 shadow-lg border border-neutral-200/50">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search by order number, customer name, phone, or email..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-neutral-200/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-50 border-b border-neutral-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">Order #</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">Customer</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">Items</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">Total</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">Date</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                                            <p className="text-neutral-600">Loading orders...</p>
                                        </td>
                                    </tr>
                                ) : orders.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-16 text-center">
                                            <ShoppingCart className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                                            <p className="text-neutral-500 font-medium">No orders found</p>
                                            {(searchQuery || statusFilter) && (
                                                <p className="text-neutral-400 text-sm mt-1">Try adjusting your search or filter</p>
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map(order => (
                                        <tr key={order.order_number} className="hover:bg-neutral-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-sm font-semibold text-neutral-800">
                                                    {order.order_number}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-neutral-800">{order.customer_name}</p>
                                                <p className="text-sm text-neutral-500">{order.customer_phone}</p>
                                            </td>
                                            <td className="px-6 py-4 text-neutral-700">
                                                {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-neutral-800">
                                                ₹{Number(order.total_amount).toLocaleString('en-IN')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td className="px-6 py-4 text-sm text-neutral-600">
                                                {formatDateTime(order.created_at)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => openDetail(order)}
                                                    className="px-4 py-1.5 text-sm font-semibold text-primary border border-primary/30 hover:bg-primary hover:text-white rounded-lg transition-colors"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-neutral-200 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div>
                                <h2 className="text-xl font-bold text-neutral-800">
                                    Order {selectedOrder.order_number}
                                </h2>
                                <p className="text-sm text-neutral-500 mt-0.5">
                                    Placed on {formatDateTime(selectedOrder.created_at)}
                                </p>
                            </div>
                            <button
                                onClick={closeDetail}
                                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status Update */}
                            <div className="bg-neutral-50 rounded-xl p-4 space-y-3">
                                <h3 className="font-semibold text-neutral-800">Update Status</h3>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <div className="relative flex-1 min-w-40">
                                        <select
                                            value={newStatus}
                                            onChange={e => setNewStatus(e.target.value)}
                                            className="w-full px-4 py-2.5 pr-10 rounded-xl border-2 border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none bg-white appearance-none font-medium"
                                        >
                                            {STATUS_OPTIONS.map(s => (
                                                <option key={s.value} value={s.value}>{s.label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                                    </div>
                                    <button
                                        onClick={handleStatusUpdate}
                                        disabled={updatingStatus || newStatus === selectedOrder.status}
                                        className="px-5 py-2.5 bg-gradient-to-r from-primary to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {updatingStatus ? (
                                            <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                                        ) : 'Save Status'}
                                    </button>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-1">Admin Notes</label>
                                    <textarea
                                        value={adminNotes}
                                        onChange={e => setAdminNotes(e.target.value)}
                                        rows="2"
                                        placeholder="Internal notes (not visible to customer)"
                                        className="w-full px-3 py-2 rounded-xl border-2 border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none resize-none text-sm"
                                    />
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div>
                                <h3 className="font-semibold text-neutral-800 mb-3 flex items-center gap-2">
                                    <User className="h-4 w-4" /> Customer
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                    <div className="flex items-center gap-2 text-neutral-700">
                                        <User className="h-4 w-4 text-neutral-400 shrink-0" />
                                        {selectedOrder.customer_name}
                                    </div>
                                    <div className="flex items-center gap-2 text-neutral-700">
                                        <Phone className="h-4 w-4 text-neutral-400 shrink-0" />
                                        {selectedOrder.customer_phone}
                                    </div>
                                    {selectedOrder.customer_email && (
                                        <div className="flex items-center gap-2 text-neutral-700 sm:col-span-2">
                                            <Mail className="h-4 w-4 text-neutral-400 shrink-0" />
                                            {selectedOrder.customer_email}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                                <h3 className="font-semibold text-neutral-800 mb-3 flex items-center gap-2">
                                    <MapPin className="h-4 w-4" /> Delivery Address
                                </h3>
                                <p className="text-sm text-neutral-700 leading-relaxed">
                                    {selectedOrder.shipping_address_line1}
                                    {selectedOrder.shipping_address_line2 && `, ${selectedOrder.shipping_address_line2}`}
                                    <br />
                                    {selectedOrder.shipping_city}, {selectedOrder.shipping_state} – {selectedOrder.shipping_pincode}
                                </p>
                                {selectedOrder.delivery_slot && (
                                    <p className="text-sm text-neutral-500 mt-1 flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        Slot: {selectedOrder.delivery_slot}
                                    </p>
                                )}
                            </div>

                            {/* Items */}
                            <div>
                                <h3 className="font-semibold text-neutral-800 mb-3 flex items-center gap-2">
                                    <Package className="h-4 w-4" /> Items
                                </h3>
                                <div className="space-y-2">
                                    {selectedOrder.items?.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 bg-neutral-50 rounded-xl p-3">
                                            {item.product_image_url ? (
                                                <img
                                                    src={item.product_image_url}
                                                    alt={item.product_name}
                                                    className="w-12 h-12 rounded-lg object-cover bg-neutral-200 shrink-0"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-neutral-200 flex items-center justify-center text-xl shrink-0">
                                                    🥘
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-neutral-800 text-sm truncate">{item.product_name}</p>
                                                {item.size_name && (
                                                    <p className="text-xs text-neutral-500">{item.size_name}</p>
                                                )}
                                                <p className="text-xs text-neutral-500">
                                                    {item.quantity} × ₹{Number(item.unit_price).toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-neutral-800 text-sm shrink-0">
                                                ₹{Number(item.total_price).toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="border-t border-neutral-200 pt-4 space-y-2 text-sm">
                                <div className="flex justify-between text-neutral-600">
                                    <span>Subtotal</span>
                                    <span>₹{Number(selectedOrder.subtotal).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-neutral-600">
                                    <span>Shipping</span>
                                    <span>{Number(selectedOrder.shipping_cost) === 0 ? 'Free' : `₹${Number(selectedOrder.shipping_cost).toLocaleString('en-IN')}`}</span>
                                </div>
                                <div className="flex justify-between font-bold text-neutral-800 text-base pt-1 border-t border-neutral-200">
                                    <span>Total</span>
                                    <span>₹{Number(selectedOrder.total_amount).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-neutral-500">
                                    <span>Payment</span>
                                    <span className="capitalize">{selectedOrder.payment_method?.replace('_', ' ') || 'COD'}</span>
                                </div>
                            </div>

                            {/* Timestamps */}
                            <div className="border-t border-neutral-200 pt-4">
                                <h3 className="font-semibold text-neutral-800 mb-3 flex items-center gap-2">
                                    <Truck className="h-4 w-4" /> Timeline
                                </h3>
                                <div className="space-y-1.5 text-sm text-neutral-600">
                                    <div className="flex justify-between">
                                        <span>Order placed</span>
                                        <span>{formatDateTime(selectedOrder.created_at)}</span>
                                    </div>
                                    {selectedOrder.confirmed_at && (
                                        <div className="flex justify-between">
                                            <span>Confirmed</span>
                                            <span>{formatDateTime(selectedOrder.confirmed_at)}</span>
                                        </div>
                                    )}
                                    {selectedOrder.shipped_at && (
                                        <div className="flex justify-between">
                                            <span>Shipped</span>
                                            <span>{formatDateTime(selectedOrder.shipped_at)}</span>
                                        </div>
                                    )}
                                    {selectedOrder.delivered_at && (
                                        <div className="flex justify-between">
                                            <span>Delivered</span>
                                            <span>{formatDateTime(selectedOrder.delivered_at)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Customer Notes */}
                            {selectedOrder.customer_notes && (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                    <p className="text-sm font-semibold text-amber-800 mb-1">Customer Note</p>
                                    <p className="text-sm text-amber-700">{selectedOrder.customer_notes}</p>
                                </div>
                            )}

                            {/* Admin Notes (read) */}
                            {selectedOrder.admin_notes && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <p className="text-sm font-semibold text-blue-800 mb-1">Admin Notes</p>
                                    <p className="text-sm text-blue-700">{selectedOrder.admin_notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default OrderManagement;
