import React from 'react';
import { Check, X, Sparkles } from 'lucide-react';

export const PricingSection = ({ userEmail, userId }: { userEmail?: string; userId?: string }) => {
    const features = {
        free: [
            { text: "Up to 5 Habits", included: true },
            { text: "Basic Tracking", included: true },
            { text: "7-Day History", included: true },
            { text: "Weekly Task Tracker", included: false },
            { text: "Weekly Review Page", included: false },
            { text: "Note Page", included: false },
            { text: "Priority Updates", included: false },
        ],
        pro: [
            { text: "Unlimited Habits", included: true },
            { text: "Advanced Analytics", included: true },
            { text: "Lifetime History", included: true },
            { text: "Weekly Task Tracker", included: true },
            { text: "Weekly Review Page", included: true },
            { text: "Note Page", included: true },
            { text: "Priority Updates", included: true },
        ]
    };

    const checkoutUrl = `https://grow010.lemonsqueezy.com/checkout/buy/637b4e07-fe79-491a-9b47-a87a030073ee?embed=1${userId ? `&checkout[custom][user_id]=${userId}` : ''
        }${userEmail ? `&checkout[email]=${encodeURIComponent(userEmail)}` : ''
        }`;

    return (
        <section id="pricing" className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-indigo-600 font-bold tracking-wide uppercase text-sm mb-3">Simple Pricing</h2>
                    <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
                        Pay once, keep it forever. <br />
                        <span className="text-slate-400">No monthly subscriptions.</span>
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                        One simple payment for lifetime access to all Pro features.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/50 hover:-translate-y-1 transition-transform duration-300">
                        <div className="mb-6">
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Starter Plan</h4>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-slate-900 dark:text-white">$0</span>
                            </div>
                            <p className="text-sm text-slate-500 mt-2">For individuals just getting started with habit tracking.</p>
                        </div>

                        <button className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors mb-8">
                            Get Started
                        </button>

                        <div className="space-y-4">
                            {features.free.map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    {feature.included ? (
                                        <Check size={18} className="text-slate-900 dark:text-white flex-shrink-0" />
                                    ) : (
                                        <X size={18} className="text-slate-300 dark:text-slate-700 flex-shrink-0" />
                                    )}
                                    <span className={`text-sm font-medium ${feature.included ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-600'}`}>
                                        {feature.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-1 border-2 border-indigo-500 relative shadow-2xl shadow-indigo-500/20 transform md:scale-105 z-10">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                            Limited Offer
                        </div>
                        <div className="bg-indigo-50/50 dark:bg-indigo-950/10 rounded-[1.8rem] p-7 h-full">
                            <div className="mb-6">
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                    Lifetime Pro <Sparkles size={16} className="text-indigo-500" />
                                </h4>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-black text-slate-900 dark:text-white">$9.99</span>
                                    <span className="text-xl text-slate-400 decoration-slate-400 line-through font-medium">$15.00</span>
                                </div>
                                <p className="text-sm text-slate-500 mt-2">One-time payment. Lifetime access.</p>
                            </div>

                            <a
                                href={checkoutUrl}
                                className="lemonsqueezy-button block w-full text-center py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30 mb-8"
                            >
                                Get Lifetime Access
                            </a>

                            {/* Developer Helper for Localhost Testing */}
                            {typeof window !== 'undefined' && window.location.hostname === 'localhost' && (
                                <button
                                    onClick={() => {
                                        window.location.search = '?payment_success=true';
                                    }}
                                    className="w-full text-[10px] text-slate-400 font-bold hover:text-indigo-500 transition-colors mt-[-20px] mb-8 uppercase tracking-widest"
                                >
                                    [Dev] Simulate Success
                                </button>
                            )}

                            <div className="space-y-4">
                                {features.pro.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="p-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                                            <Check size={14} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-700 dark:text-white">
                                            {feature.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
