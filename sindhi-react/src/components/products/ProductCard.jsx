import React from 'react';
import { useProductContext } from '../../context/ProductContext';
import { Plus, ShoppingBag } from 'lucide-react';

const ProductCard = ({ product }) => {
    const { addToCart } = useProductContext();

    return (
        <div className="group bg-white rounded-[1rem] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-neutral-100 flex flex-col h-full">

            {/* Image Container - Using aspect-ratio for better responsiveness */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-50">
                <span className="absolute top-3 left-3 z-10 bg-primary/95 backdrop-blur-sm px-3 py-1 rounded-full text-[0.65rem] font-bold tracking-widest uppercase text-white shadow-sm">
                    {product.category}
                </span>

                <img
                    src={`/${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    loading="lazy"
                />
            </div>

            {/* Content - Reduced padding to p-5 (20px) for better space utilization */}
            <div className="p-5 flex-grow flex flex-col">
                <div className="flex-grow">
                    <h3 className="font-display text-xl font-bold text-neutral-900 leading-snug mb-2 line-clamp-2 mix-blend-multiply">
                        {product.name}
                    </h3>

                    <div className="mb-4">
                        <span className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">
                            Premium quality {product.name.toLowerCase()}. Fresh and authentic.
                        </span>
                        <div className="mt-3 flex items-center gap-2">
                            <strong className="text-xl text-primary font-bold">₹{product.price}</strong>
                            <small className="text-neutral-400 text-xs">({Math.floor(Math.random() * 200) + 50} reviews)</small>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-neutral-100">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                        }}
                        className="w-full bg-neutral-900 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold text-sm tracking-wide hover:bg-primary transition-colors duration-300 group/btn"
                    >
                        <ShoppingBag size={16} className="text-white group-hover/btn:scale-110 transition-transform" />
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
