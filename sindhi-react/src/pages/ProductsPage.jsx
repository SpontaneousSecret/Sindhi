import React, { useState, useEffect } from 'react';
import { useProductContext } from '../context/ProductContext';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, X, ChevronDown, ChevronRight } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';

const ProductsPage = () => {
    const { products, addToCart } = useProductContext();
    const [searchParams, setSearchParams] = useSearchParams();

    // State
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [maxPrice, setMaxPrice] = useState(5000);
    const [selectedWeights, setSelectedWeights] = useState([]);

    // Derived Data
    const categories = ['All', ...new Set(products.map(p => p.category))];

    // Extract unique weights from ALL products for filter options
    // product.name is "Name (Weight)"
    const allWeights = [...new Set(products.map(p => {
        const match = p.name.match(/\((.*?)\)/);
        return match ? match[1] : null;
    }).filter(Boolean))].sort();

    // Initial Load & URL Sync
    useEffect(() => {
        const catParam = searchParams.get('category');
        if (catParam && categories.includes(catParam)) {
            setSelectedCategory(catParam);
        }
    }, [searchParams, products]);

    // Filtering Logic
    useEffect(() => {
        let result = products;

        // Category Filter
        if (selectedCategory !== 'All') {
            result = result.filter(p => p.category === selectedCategory);
        }

        // Search Filter
        if (searchQuery) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Price Filter
        result = result.filter(p => p.price <= maxPrice);

        // Weight Filter
        if (selectedWeights.length > 0) {
            result = result.filter(p => {
                const match = p.name.match(/\((.*?)\)/);
                const weight = match ? match[1] : null;
                return selectedWeights.includes(weight);
            });
        }

        setFilteredProducts(result);
    }, [products, selectedCategory, searchQuery, maxPrice, selectedWeights]);

    const handleCategoryClick = (cat) => {
        setSelectedCategory(cat);
        setSearchParams({ category: cat !== 'All' ? cat : '' });
        setIsSidebarOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleWeight = (weight) => {
        setSelectedWeights(prev =>
            prev.includes(weight) ? prev.filter(w => w !== weight) : [...prev, weight]
        );
    };

    // Helper Component for Collapsible Sections
    const CollapsibleSection = ({ title, children, defaultOpen = true }) => {
        const [isOpen, setIsOpen] = useState(defaultOpen);
        return (
            <div className="border-b border-neutral-100 py-4">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-full text-left mb-2 group"
                >
                    <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">{title}</h3>
                    <ChevronDown size={16} className={`text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    {children}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-bg-primary pt-24 pb-12">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Mobile Filter Toggle */}
                <div className="lg:hidden mb-4 flex gap-2">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-neutral-200 text-neutral-700"
                    >
                        <Filter size={18} />
                        Filters
                    </button>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-primary"
                        />
                        <Search className="absolute left-3 top-2.5 text-neutral-400" size={16} />
                    </div>
                </div>

                <div className="flex gap-8 items-start">
                    {/* Sidebar (Desktop & Mobile) */}
                    <aside className={`
                        fixed inset-y-0 left-0 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[60] 
                        lg:translate-x-0 lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] lg:shadow-none lg:bg-transparent lg:w-1/4 lg:z-30
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}>
                        <div className="h-full overflow-y-auto p-6 lg:p-0 space-y-2 custom-scrollbar">
                            {/* Mobile Header */}
                            <div className="flex justify-between items-center mb-6 lg:hidden">
                                <h2 className="text-xl font-bold text-neutral-800">Filters</h2>
                                <button onClick={() => setIsSidebarOpen(false)} className="text-neutral-500 hover:text-red-500 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Search (Desktop) */}
                            <div className="hidden lg:block mb-8 relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                                />
                                <Search className="absolute left-3.5 top-3.5 text-neutral-400" size={18} />
                            </div>

                            {/* Categories */}
                            <CollapsibleSection title="Categories">
                                <div className="space-y-1 mt-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => handleCategoryClick(cat)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group ${selectedCategory === cat
                                                ? 'bg-primary/5 text-primary'
                                                : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                                                }`}
                                        >
                                            {cat}
                                            {selectedCategory === cat && <ChevronRight size={14} />}
                                        </button>
                                    ))}
                                </div>
                            </CollapsibleSection>

                            {/* Price Filter */}
                            <CollapsibleSection title="Price Range">
                                <div className="px-1 py-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm text-neutral-600">Up to:</span>
                                        <span className="text-lg font-bold text-primary">₹{maxPrice}</span>
                                    </div>

                                    <input
                                        type="range"
                                        min="0"
                                        max="5000"
                                        step="50"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                                        className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
                                    />

                                    <div className="flex justify-between text-xs text-neutral-400 mt-2">
                                        <span>₹0</span>
                                        <span>₹5000</span>
                                    </div>
                                </div>
                            </CollapsibleSection>

                            {/* Weight Filter */}
                            <CollapsibleSection title="Pack Size" defaultOpen={false}>
                                <div className="space-y-2 mt-2 max-h-40 overflow-y-auto">
                                    {allWeights.map(weight => (
                                        <label key={weight} className="flex items-center gap-3 text-sm text-neutral-600 cursor-pointer hover:text-neutral-900">
                                            <input
                                                type="checkbox"
                                                checked={selectedWeights.includes(weight)}
                                                onChange={() => toggleWeight(weight)}
                                                className="w-4 h-4 rounded border-neutral-300 text-primary focus:ring-primary"
                                            />
                                            {weight}
                                        </label>
                                    ))}
                                </div>
                            </CollapsibleSection>

                        </div>
                    </aside>

                    {/* Overlay for mobile */}
                    {isSidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    )}

                    {/* Main Content */}
                    <main className="flex-1 w-full">
                        <div className="mb-6 flex justify-between items-end">
                            <div>
                                <h1 className="text-3xl font-display font-bold text-neutral-800">{selectedCategory}</h1>
                                <p className="text-neutral-500 mt-1">{filteredProducts.length} items found</p>
                            </div>
                        </div>

                        {/* Product Grid */}
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id || product.name} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-2xl border border-neutral-100 border-dashed">
                                <p className="text-neutral-400">No products found matching your criteria.</p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory('All');
                                        setSearchQuery('');
                                    }}
                                    className="mt-4 text-primary font-medium hover:underline"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
