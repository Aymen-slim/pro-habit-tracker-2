import React from 'react';
import { ArrowLeft, Check, Receipt, CreditCard, RefreshCw, AlertCircle } from 'lucide-react';

interface RefundPolicyProps {
    isDarkMode: boolean;
    onBack: () => void;
}

export const RefundPolicy: React.FC<RefundPolicyProps> = ({ isDarkMode, onBack }) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans selection:bg-indigo-500/30 selection:text-indigo-900 dark:selection:text-white">
            {/* Navigation */}
            <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md sticky top-0 z-50">
                <div
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={onBack}
                >
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                        <Check size={18} strokeWidth={3} />
                    </div>
                    <span className="font-bold text-xl tracking-tighter dark:text-white">Bloom Habit</span>
                </div>
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft size={18} />
                    Back to Home
                </button>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-16 lg:py-24">
                {/* Header */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm ring-2 ring-indigo-50/50 dark:ring-indigo-900/20 backdrop-blur-sm">
                        <Receipt size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Refund Policy</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Last updated: January 2026</p>
                </div>

                {/* Content */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[32px] shadow-xl border border-white/50 dark:border-white/10 p-8 md:p-12 space-y-12 text-slate-600 dark:text-slate-400 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-2">
                            <CreditCard size={24} className="text-indigo-600" />
                            <h2 className="text-2xl font-bold">1. Subscription Cancellations</h2>
                        </div>
                        <p>
                            You may cancel your Bloom Habit Premium subscription at any time. Upon cancellation, your premium features will remain active until the end of your current billing period. No further charges will be applied.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-2">
                            <RefreshCw size={24} className="text-indigo-600" />
                            <h2 className="text-2xl font-bold">2. Refund Requests</h2>
                        </div>
                        <p>
                            We offer a 5-day money-back guarantee for initial subscription purchases. If you are not satisfied with Bloom Habit Premium, you may request a full refund within 5 days of your first payment.
                        </p>
                        <p>
                            Refund requests made after the 5-day window will generally not be granted, except as required by law or in exceptional circumstances at our sole discretion.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-2">
                            <AlertCircle size={24} className="text-indigo-600" />
                            <h2 className="text-2xl font-bold">3. How to Request a Refund</h2>
                        </div>
                        <p>
                            To request a refund, please contact our support team at support@bloomhabit.site with your account email and transaction details. We typically process refund requests within 5-10 business days.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-2">
                            <Check size={24} className="text-indigo-600" />
                            <h2 className="text-2xl font-bold">4. Chargebacks</h2>
                        </div>
                        <p>
                            We encourage you to contact us directly to resolve any billing issues. Initiating a chargeback with your bank without first contacting us may result in the permanent suspension of your account.
                        </p>
                    </section>

                </div>

                {/* Footer */}
                <div className="mt-16 text-center text-slate-500 dark:text-slate-400 text-sm">
                    <p>&copy; 2026 Bloom Habit Inc. All rights reserved.</p>
                    <button
                        onClick={onBack}
                        className="mt-4 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                        Go back to home page
                    </button>
                </div>
            </main>
        </div>
    );
};
