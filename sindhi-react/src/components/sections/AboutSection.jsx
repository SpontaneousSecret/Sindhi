import React from 'react';
import { ShieldCheck, Clock, Heart } from 'lucide-react';

const AboutSection = () => {
    return (
        <section id="about" className="py-24 bg-bg-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-widest uppercase mb-3">
                            Our Story
                        </span>
                        <h2 className="font-display text-4xl font-bold text-neutral-900 mb-6">
                            A Legacy of Quality & Trust
                        </h2>
                        <p className="text-neutral-600 mb-6 leading-relaxed">
                            At Sindhi Namkeen & Dry Fruits, we take pride in offering the finest quality Indian snacks and dry fruits. Our commitment to freshness, authenticity, and customer satisfaction has made us a trusted name among snack lovers.
                        </p>
                        <p className="text-neutral-600 mb-8 leading-relaxed">
                            Every product we offer is carefully selected and prepared to ensure you get the best taste and quality. From traditional namkeen recipes passed down through generations to premium dry fruits sourced from the finest orchards, we bring you the authentic flavors of India.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
                                    <ShieldCheck className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-display font-semibold text-neutral-900 mb-1">Quality Assured</h4>
                                    <p className="text-sm text-neutral-500">Premium ingredients only</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
                                    <Clock className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-display font-semibold text-neutral-900 mb-1">Always Fresh</h4>
                                    <p className="text-sm text-neutral-500">Made fresh daily</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
                                    <Heart className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-display font-semibold text-neutral-900 mb-1">Made with Love</h4>
                                    <p className="text-sm text-neutral-500">Traditional recipes</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative rounded-[2rem] overflow-hidden shadow-card-hover group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent z-10" />
                            <img
                                src={`${import.meta.env.VITE_CDN_URL || ''}/assets/hero.png`}
                                alt="Our Store"
                                className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white px-8 py-6 rounded-2xl shadow-xl flex items-center gap-8 z-20 w-max">
                            <div className="flex flex-col items-center pr-8 border-r border-neutral-200">
                                <span className="font-display text-3xl font-bold text-primary leading-none">100+</span>
                                <span className="text-xs text-neutral-500 uppercase tracking-widest mt-2">Products</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="font-display text-3xl font-bold text-primary leading-none">1000+</span>
                                <span className="text-xs text-neutral-500 uppercase tracking-widest mt-2">Happy Customers</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
