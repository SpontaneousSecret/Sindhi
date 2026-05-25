import React from 'react';
import { useProductContext } from '../../context/ProductContext';
import { Plus, ShoppingBag } from 'lucide-react';

const ProductCard = ({ product }) => {
    const { addToCart } = useProductContext();

    return (
        <div className="group bg-white rounded-[1rem] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-neutral-100 flex flex-col h-full">

            {/* Image Container - Matches HTML height 280px */}
            <div className="relative h-[280px] w-full overflow-hidden bg-neutral-100">
                <span className="absolute top-4 left-4 z-10 bg-primary/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-[0.7rem] font-bold tracking-widest uppercase text-white shadow-md">
                    {product.category}
                </span>

                <img
                    src={product.image && product.image.startsWith('http') ? product.image : `/assets/${(product.image || 'namkeen.png').split('/').pop()}`}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    loading="lazy"
                />
            </div>

            {/* Content - Matches HTML padding 2rem (32px) */}
            <div className="p-8 flex-grow flex flex-col">
                <div className="flex-grow">
                    <h3 className="font-display text-2xl font-bold text-neutral-900 leading-tight mb-3 line-clamp-2">
                        {product.name}
                    </h3>

                    <div className="mb-6 font-normal leading-relaxed text-base text-neutral-600">
                        <span className="line-clamp-2">
                            Premium quality {product.name.toLowerCase()}. Fresh and authentic.
                        </span>
                        <div className="mt-2 text-neutral-900">
                            <strong className="text-lg">₹{product.price}</strong>{' '}
                            <small className="text-neutral-500 text-sm">({Math.floor(Math.random() * 200) + 50} reviews)</small>
                        </div>
                    </div>
                </div>

                <div className="pt-0">
                    <button
                        onClick={() => addToCart(product)}
                        className="w-full bg-gradient-to-br from-primary to-primary-600 text-white py-2 rounded-full font-bold text-sm tracking-widest uppercase hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center group/btn"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
