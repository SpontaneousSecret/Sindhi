import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
    Tag, Plus, Edit2, Trash2, X, Loader2, AlertCircle, CheckCircle,
    Zap, ZapOff, Package, FolderOpen, ShoppingBag, Calendar
} from 'lucide-react';
import {
    getFestiveOffers, createFestiveOffer, updateFestiveOffer,
    deleteFestiveOffer, applyFestiveOffer, deactivateFestiveOffer,
    getProducts, getCategories
} from '../../services/api';

const EMPTY_FORM = {
    name: '',
    discount_percentage: '',
    offer_type: 'all',
    products: [],
    categories: [],
    starts_at: '',
    ends_at: '',
    is_active: false,
};

const FestiveOffers = () => {
    const [offers, setOffers] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingOffer, setEditingOffer] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);

    const fetchData = async () => {
        try {
            const [offersData, productsData, categoriesData] = await Promise.all([
                getFestiveOffers(),
                getProducts({ page_size: 200 }),
                getCategories({ page_size: 100 }),
            ]);
            setOffers(offersData.results || offersData);
            setAllProducts(productsData.results || productsData);
            setAllCategories(categoriesData.results || categoriesData);
        } catch {
            setError('Failed to load data');
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const showSuccess = (msg) => {
        setSuccess(msg);
        setTimeout(() => setSuccess(''), 3000);
    };

    const openCreate = () => {
        setEditingOffer(null);
        setFormData(EMPTY_FORM);
        setError('');
        setShowModal(true);
    };

    const openEdit = (offer) => {
        setEditingOffer(offer);
        setFormData({
            name: offer.name,
            discount_percentage: offer.discount_percentage,
            offer_type: offer.offer_type,
            products: offer.products || [],
            categories: offer.categories || [],
            starts_at: offer.starts_at ? offer.starts_at.slice(0, 16) : '',
            ends_at: offer.ends_at ? offer.ends_at.slice(0, 16) : '',
            is_active: offer.is_active,
        });
        setError('');
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const toggleSelection = (field, id) => {
        setFormData(prev => {
            const current = prev[field];
            return {
                ...prev,
                [field]: current.includes(id) ? current.filter(x => x !== id) : [...current, id],
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const payload = {
                name: formData.name,
                discount_percentage: parseFloat(formData.discount_percentage),
                offer_type: formData.offer_type,
                products: formData.offer_type === 'product' ? formData.products : [],
                categories: formData.offer_type === 'category' ? formData.categories : [],
                starts_at: formData.starts_at || null,
                ends_at: formData.ends_at || null,
                is_active: formData.is_active,
            };
            if (editingOffer) {
                await updateFestiveOffer(editingOffer.id, payload);
                showSuccess('Offer updated successfully!');
            } else {
                await createFestiveOffer(payload);
                showSuccess('Offer created successfully!');
            }
            setShowModal(false);
            await fetchData();
        } catch (err) {
            setError(typeof err === 'string' ? err : err?.detail || err?.name?.[0] || 'Failed to save offer');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (offer) => {
        setLoading(true);
        try {
            await applyFestiveOffer(offer.id);
            showSuccess(`"${offer.name}" applied! Products updated.`);
            await fetchData();
        } catch {
            setError('Failed to apply offer');
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async (offer) => {
        setLoading(true);
        try {
            await deactivateFestiveOffer(offer.id);
            showSuccess(`"${offer.name}" deactivated.`);
            await fetchData();
        } catch {
            setError('Failed to deactivate offer');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (offer) => {
        setLoading(true);
        try {
            await deleteFestiveOffer(offer.id);
            setDeleteConfirm(null);
            showSuccess('Offer deleted.');
            await fetchData();
        } catch {
            setError('Failed to delete offer');
        } finally {
            setLoading(false);
        }
    };

    const offerTypeIcon = (type) => {
        if (type === 'product') return <Package className="h-4 w-4" />;
        if (type === 'category') return <FolderOpen className="h-4 w-4" />;
        return <ShoppingBag className="h-4 w-4" />;
    };

    const offerTypeLabel = (type) => {
        if (type === 'product') return 'Specific Products';
        if (type === 'category') return 'Entire Categories';
        return 'All Products';
    };

    const offerTypeColor = (type) => {
        if (type === 'product') return 'bg-blue-100 text-blue-700';
        if (type === 'category') return 'bg-purple-100 text-purple-700';
        return 'bg-orange-100 text-orange-700';
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-800">Festive Offers</h1>
                        <p className="text-neutral-600 mt-1">
                            Create and apply bulk discounts for special occasions
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="px-6 py-3 bg-gradient-to-r from-primary to-orange-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center gap-2"
                    >
                        <Plus className="h-5 w-5" />
                        New Offer
                    </button>
                </div>

                {/* Alerts */}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium">{success}</span>
                    </div>
                )}
                {error && !showModal && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {/* Info Banner */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 flex gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Tag className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-amber-900">How Festive Offers Work</p>
                        <p className="text-sm text-amber-700 mt-1">
                            Create an offer, choose the scope (specific products, entire categories, or all products),
                            set a discount %, then hit <strong>Apply</strong> to instantly update product discounts.
                            Deactivating an offer only marks it inactive — it does not reset product discounts.
                        </p>
                    </div>
                </div>

                {/* Offers Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-neutral-200/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-50 border-b border-neutral-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">Offer</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">Discount</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">Scope</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">Date Range</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">Status</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200">
                                {pageLoading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                                        </td>
                                    </tr>
                                ) : offers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-16 text-center">
                                            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Tag className="h-8 w-8 text-neutral-400" />
                                            </div>
                                            <p className="text-neutral-500 font-medium">No festive offers yet</p>
                                            <p className="text-neutral-400 text-sm mt-1">Create your first offer to get started</p>
                                        </td>
                                    </tr>
                                ) : (
                                    offers.map(offer => (
                                        <tr key={offer.id} className="hover:bg-neutral-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-neutral-800">{offer.name}</p>
                                                {offer.offer_type === 'product' && offer.products_detail?.length > 0 && (
                                                    <p className="text-xs text-neutral-500 mt-1">
                                                        {offer.products_detail.map(p => p.name).join(', ')}
                                                    </p>
                                                )}
                                                {offer.offer_type === 'category' && offer.categories_detail?.length > 0 && (
                                                    <p className="text-xs text-neutral-500 mt-1">
                                                        {offer.categories_detail.map(c => c.name).join(', ')}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-2xl font-bold text-primary">
                                                    {offer.discount_percentage}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${offerTypeColor(offer.offer_type)}`}>
                                                    {offerTypeIcon(offer.offer_type)}
                                                    {offerTypeLabel(offer.offer_type)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-neutral-600">
                                                {offer.starts_at || offer.ends_at ? (
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                                                        <span>
                                                            {offer.starts_at ? new Date(offer.starts_at).toLocaleDateString() : '∞'}
                                                            {' – '}
                                                            {offer.ends_at ? new Date(offer.ends_at).toLocaleDateString() : '∞'}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-neutral-400">No restriction</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${offer.is_active ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                                                    {offer.is_active ? '● Active' : '○ Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    {/* Apply */}
                                                    <button
                                                        onClick={() => handleApply(offer)}
                                                        disabled={loading}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-primary to-orange-500 text-white text-xs font-semibold rounded-lg hover:shadow-md transition-all disabled:opacity-50"
                                                        title="Apply this offer to products"
                                                    >
                                                        <Zap className="h-3.5 w-3.5" />
                                                        Apply
                                                    </button>
                                                    {/* Deactivate */}
                                                    {offer.is_active && (
                                                        <button
                                                            onClick={() => handleDeactivate(offer)}
                                                            disabled={loading}
                                                            className="p-2 hover:bg-neutral-100 text-neutral-500 rounded-lg transition-colors"
                                                            title="Deactivate offer"
                                                        >
                                                            <ZapOff className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    {/* Edit */}
                                                    <button
                                                        onClick={() => openEdit(offer)}
                                                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                                        title="Edit offer"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    {/* Delete */}
                                                    <button
                                                        onClick={() => setDeleteConfirm(offer)}
                                                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                                        title="Delete offer"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create / Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-neutral-200 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center">
                                    <Tag className="h-5 w-5 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-neutral-800">
                                    {editingOffer ? 'Edit Offer' : 'Create Festive Offer'}
                                </h2>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
                                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                    <span className="text-sm font-medium">{error}</span>
                                </div>
                            )}

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">Offer Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Diwali Sale, New Year Offer"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                />
                            </div>

                            {/* Discount */}
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">Discount Percentage (%) *</label>
                                <input
                                    type="number"
                                    name="discount_percentage"
                                    value={formData.discount_percentage}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    placeholder="e.g. 20"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                />
                            </div>

                            {/* Offer Type */}
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-3">Apply To *</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: 'all', icon: ShoppingBag, label: 'All Products', desc: 'Every product in the store' },
                                        { value: 'category', icon: FolderOpen, label: 'Categories', desc: 'All products in selected categories' },
                                        { value: 'product', icon: Package, label: 'Products', desc: 'Specific products you pick' },
                                    ].map(opt => {
                                        const Icon = opt.icon;
                                        const active = formData.offer_type === opt.value;
                                        return (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, offer_type: opt.value, products: [], categories: [] }))}
                                                className={`p-4 rounded-xl border-2 text-left transition-all ${active ? 'border-primary bg-primary/5' : 'border-neutral-200 hover:border-neutral-300'}`}
                                            >
                                                <Icon className={`h-5 w-5 mb-2 ${active ? 'text-primary' : 'text-neutral-400'}`} />
                                                <p className={`text-sm font-semibold ${active ? 'text-primary' : 'text-neutral-700'}`}>{opt.label}</p>
                                                <p className="text-xs text-neutral-500 mt-0.5">{opt.desc}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Product Multi-select */}
                            {formData.offer_type === 'product' && (
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                        Select Products *
                                        <span className="ml-2 text-xs font-normal text-neutral-500">({formData.products.length} selected)</span>
                                    </label>
                                    <div className="border-2 border-neutral-200 rounded-xl max-h-56 overflow-y-auto divide-y divide-neutral-100">
                                        {allProducts.map(p => (
                                            <label key={p.id} className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.products.includes(p.id)}
                                                    onChange={() => toggleSelection('products', p.id)}
                                                    className="w-4 h-4 text-primary rounded"
                                                />
                                                <span className="flex-1 text-sm text-neutral-700">{p.name}</span>
                                                <span className="text-xs text-neutral-500">₹{p.price}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Category Multi-select */}
                            {formData.offer_type === 'category' && (
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                        Select Categories *
                                        <span className="ml-2 text-xs font-normal text-neutral-500">({formData.categories.length} selected)</span>
                                    </label>
                                    <div className="border-2 border-neutral-200 rounded-xl max-h-56 overflow-y-auto divide-y divide-neutral-100">
                                        {allCategories.map(c => (
                                            <label key={c.id} className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.categories.includes(c.id)}
                                                    onChange={() => toggleSelection('categories', c.id)}
                                                    className="w-4 h-4 text-primary rounded"
                                                />
                                                <span className="text-sm text-neutral-700">{c.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Date Range */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Start Date (optional)</label>
                                    <input
                                        type="datetime-local"
                                        name="starts_at"
                                        value={formData.starts_at}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2">End Date (optional)</label>
                                    <input
                                        type="datetime-local"
                                        name="ends_at"
                                        value={formData.ends_at}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Active Toggle */}
                            <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 text-primary border-neutral-300 rounded"
                                />
                                <label htmlFor="is_active" className="text-sm font-semibold text-neutral-700 cursor-pointer">
                                    Mark as active
                                    <span className="block text-xs font-normal text-neutral-500 mt-0.5">
                                        Active offers are highlighted — use "Apply" to actually update product discounts.
                                    </span>
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-orange-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-primary/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? <><Loader2 className="h-5 w-5 animate-spin" /><span>Saving...</span></> : <span>{editingOffer ? 'Update Offer' : 'Create Offer'}</span>}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-800 mb-2">Delete Offer?</h3>
                            <p className="text-neutral-600">
                                Are you sure you want to delete <strong>"{deleteConfirm.name}"</strong>?
                                Product discounts will not be reset.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? <><Loader2 className="h-5 w-5 animate-spin" /><span>Deleting...</span></> : <span>Delete</span>}
                            </button>
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-semibold transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default FestiveOffers;
