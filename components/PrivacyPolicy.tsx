import React from 'react';
import { ArrowLeft, Check, Shield, Lock, Eye, Bell } from 'lucide-react';

interface PrivacyPolicyProps {
    isDarkMode: boolean;
    onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ isDarkMode, onBack }) => {
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
                        <Shield size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Privacy Policy</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Last updated: January 2026</p>
                </div>

                {/* Content */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[32px] shadow-xl border border-white/50 dark:border-white/10 p-8 md:p-12 space-y-12 text-slate-600 dark:text-slate-400 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-2">
                            <Eye size={24} className="text-indigo-600" />
                            <h2 className="text-2xl font-bold">1. Information We Collect</h2>
                        </div>
                        <p>
                            We collect information you provide directly to us when you create an account, use our services, or communicate with us. This may include:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Account information (email address, password)</li>
                            <li>Profile data (name, preferences)</li>
                            <li>Usage data (habits tracked, notes, mental state logs)</li>
                            <li>Device information and IP addresses</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-2">
                            <Lock size={24} className="text-indigo-600" />
                            <h2 className="text-2xl font-bold">2. How We Use Your Information</h2>
                        </div>
                        <p>
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide, maintain, and improve our services</li>
                            <li>Personalize your experience</li>
                            <li>Process transactions and send related information</li>
                            <li>Send technical notices, updates, and security alerts</li>
                            <li>Respond to your comments and questions</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-2">
                            <Shield size={24} className="text-indigo-600" />
                            <h2 className="text-2xl font-bold">3. Data Security</h2>
                        </div>
                        <p>
                            We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. Your data is stored securely using industry-standard encryption.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-2">
                            <Check size={24} className="text-indigo-600" />
                            <h2 className="text-2xl font-bold">4. Your Rights</h2>
                        </div>
                        <p>
                            You have the right to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Access and update your personal information</li>
                            <li>Delete your account and associated data</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Request a copy of your data</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-2">
                            <Bell size={24} className="text-indigo-600" />
                            <h2 className="text-2xl font-bold">5. Changes to This Policy</h2>
                        </div>
                        <p>
                            We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice.
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
