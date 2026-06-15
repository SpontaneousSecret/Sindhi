import React from 'react';

const Section = ({ title, children }) => (
    <div className="mb-10">
        <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4 pb-2 border-b border-neutral-200">{title}</h2>
        {children}
    </div>
);

const P = ({ children }) => (
    <p className="text-neutral-600 leading-relaxed mb-3">{children}</p>
);

const CancellationRefundPage = () => {
    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-primary to-primary/80 py-16 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">Cancellation & Refund Policy</h1>
                    <p className="text-white/70 text-sm">Last updated: June 16, 2026</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6 py-14">
                <P>
                    At Sindhi Namkeen DryFruit, we take pride in the quality of our products. Please read this policy
                    carefully before placing an order.
                </P>

                <Section title="Order Cancellation">
                    <P>
                        Orders can be cancelled within <strong>5 minutes</strong> of being placed. Once this window has
                        passed, the order enters preparation and can no longer be cancelled.
                    </P>
                    <P>
                        To cancel your order within the 5-minute window, please contact us immediately at{' '}
                        <a href="mailto:sindhinamkeen250@gmail.com" className="text-primary font-semibold hover:underline">
                            sindhinamkeen250@gmail.com
                        </a>{' '}
                        with your order number.
                    </P>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
                        <p className="text-amber-800 text-sm font-medium">
                            Note: No cancellations will be accepted after 5 minutes of placing the order, regardless of the reason.
                        </p>
                    </div>
                </Section>

                <Section title="Refund Policy">
                    <P>
                        We do not offer monetary refunds on any orders once they have been delivered.
                    </P>
                    <P>
                        All sales are considered final upon delivery.
                    </P>
                </Section>

                <Section title="Exchange Policy">
                    <P>
                        We offer an exchange on eligible products within <strong>30 days</strong> of delivery, subject to
                        the following conditions:
                    </P>
                    <ul className="list-disc list-outside ml-5 space-y-3 text-neutral-600 leading-relaxed mb-4">
                        <li>The exchange must be done <strong>physically at our store</strong>.</li>
                        <li>You must carry the <strong>original bill</strong> received at the time of delivery.</li>
                        <li>The product must be unused, unopened, and in its original packaging.</li>
                        <li>Exchanges are only valid within 30 days from the date of delivery — requests beyond this period will not be accepted.</li>
                    </ul>
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mt-4">
                        <p className="text-primary text-sm font-medium">
                            Please retain your delivery bill as it is required for any exchange request. No exchange will be processed without it.
                        </p>
                    </div>
                </Section>

                <Section title="Contact Us">
                    <P>
                        If you have any questions about our Cancellation & Refund Policy, please contact us:
                    </P>
                    <div className="inline-flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-5 py-3">
                        <span className="text-neutral-600">By email:</span>
                        <a
                            href="mailto:sindhinamkeen250@gmail.com"
                            className="text-primary font-semibold hover:underline"
                        >
                            sindhinamkeen250@gmail.com
                        </a>
                    </div>
                </Section>
            </div>
        </div>
    );
};

export default CancellationRefundPage;
