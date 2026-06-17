import { useNavigate, Link } from 'react-router-dom';
import { useProductContext } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';
import AboutSection from '../components/sections/AboutSection';
import ContactSection from '../components/sections/ContactSection';
import { ArrowRight } from 'lucide-react';

const CategorySkeleton = () => (
    <div className="aspect-square rounded-2xl bg-neutral-200 animate-pulse" />
);

const ProductSkeleton = () => (
    <div className="rounded-2xl overflow-hidden bg-white shadow-sm">
        <div className="h-[280px] bg-neutral-200 animate-pulse" />
        <div className="p-6 space-y-3">
            <div className="h-4 bg-neutral-200 rounded animate-pulse w-1/3" />
            <div className="h-5 bg-neutral-200 rounded animate-pulse w-2/3" />
            <div className="h-4 bg-neutral-200 rounded animate-pulse w-1/2" />
            <div className="h-10 bg-neutral-200 rounded-full animate-pulse mt-4" />
        </div>
    </div>
);

const HomePage = () => {
    const { products, fullCategories, loading, error } = useProductContext();

    const featuredProducts = products.filter(p => p.isFeatured).slice(0, 12);
    const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 12);

    return (
        <div className="pb-20">
            {/* Hero */}
            <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-dark">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center opacity-40 transform transition-transform duration-[30s] ease-linear hover:scale-105"
                    style={{ backgroundImage: `url('${import.meta.env.VITE_CDN_URL || ''}/assets/hero.png')` }}
                />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1a1412]/70 via-[#1a1412]/40 to-[#1a1412]/80" />

                <div className="relative z-10 text-center max-w-[800px] px-4 mt-24">
                    <div className="inline-block border border-secondary bg-secondary/10 rounded-full px-6 py-2 mb-8 animate-fade-in backdrop-blur-sm">
                        <span className="text-secondary tracking-[0.2em] text-xs font-bold uppercase">
                            Est. Since Years of Trust
                        </span>
                    </div>

                    <h1 className="font-display text-6xl md:text-8xl font-bold text-white leading-none mb-6 tracking-tight drop-shadow-2xl">
                        Sindhi <br />
                        <span className="text-4xl md:text-5xl lg:text-6xl font-normal text-secondary tracking-wide mt-4 block font-display">
                            Namkeen & Dry Fruits
                        </span>
                    </h1>

                    <p className="font-display text-2xl md:text-3xl text-secondary-500 italic mb-6 font-medium tracking-wide drop-shadow-md">
                        Always Fresh, Crispy & Crunchy
                    </p>

                    <p className="text-neutral-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                        Premium quality Indian snacks and dry fruits, crafted with tradition and served with love.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            to="/products"
                            className="px-8 py-4 bg-primary-700 text-white rounded-full font-bold tracking-widest uppercase text-sm shadow-xl shadow-primary/20 hover:bg-primary-600 hover:scale-105 transition-all duration-300 min-w-[180px]"
                        >
                            Explore Products
                        </Link>
                        <Link
                            to="/#contact"
                            className="px-8 py-4 bg-transparent text-white border border-white/30 rounded-full font-bold tracking-widest uppercase text-sm hover:bg-white/10 hover:border-white/50 transition-all duration-300 min-w-[180px]"
                        >
                            Visit Store
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 animate-bounce">
                    <span className="text-white text-xs tracking-[0.3em] uppercase">Scroll</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
                </div>
            </div>

            {/* Shop by Category */}
            <div className="py-20 px-6 w-full max-w-[1200px] mx-auto">
                <div className="text-center mb-16">
                    <h2 className="font-display text-4xl font-bold text-neutral-900 mb-4">Shop by Category</h2>
                    <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {loading
                        ? Array.from({ length: 12 }).map((_, i) => <CategorySkeleton key={i} />)
                        : fullCategories.slice(0, 12).map((category) => (
                            <Link
                                key={category.slug}
                                to={`/products?category=${category.name}`}
                                className="group relative overflow-hidden rounded-2xl aspect-square bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10">
                                    {category.image_url ? (
                                        <img
                                            src={category.image_url}
                                            alt={category.name}
                                            className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="text-8xl opacity-10 group-hover:opacity-20 transition-opacity">
                                                🥘
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="absolute inset-0 flex items-start justify-center pt-6 px-4">
                                    <h3 className="text-lg font-bold text-neutral-800 text-center leading-tight group-hover:text-primary transition-colors z-10">
                                        {category.name}
                                    </h3>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </Link>
                        ))
                    }
                </div>

                <div className="text-center mt-8">
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                    >
                        View all categories
                        <span>→</span>
                    </Link>
                </div>
            </div>

            {/* Featured Products */}
            <div className="py-20 bg-neutral-50">
                <div className="w-full max-w-[1200px] mx-auto px-6">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <span className="text-primary font-bold tracking-widest uppercase text-xs">Our Collection</span>
                            <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 mt-3">Premium Products</h2>
                            <p className="text-neutral-500 mt-2">Handpicked selections of the finest namkeen and dry fruits</p>
                        </div>
                        <Link to="/products" className="hidden md:flex items-center gap-2 text-neutral-600 hover:text-primary transition-colors">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {loading
                        ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
                        : error
                            ? (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-red-600 mb-4">{error}</p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
                                    >
                                        Retry
                                    </button>
                                </div>
                            )
                            : displayProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))
                    }
                </div>

                <div className="text-center mt-8 md:hidden">
                    <Link to="/products" className="text-primary font-semibold hover:underline">
                        View All Products →
                    </Link>
                </div>
            </div>

            <AboutSection />
            <ContactSection />
        </div>
    );
};

export default HomePage;
