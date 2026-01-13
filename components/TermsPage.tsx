import React from 'react';
import { ArrowLeft, Check, Shield, FileText, Lock, Scale } from 'lucide-react';

interface TermsPageProps {
    isDarkMode: boolean;
    onBack: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ isDarkMode, onBack }) => {
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
                        <FileText size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Terms of Service</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Last updated: January 2026</p>
                </div>

                {/* Content */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[32px] shadow-xl border border-white/50 dark:border-white/10 p-8 md:p-12 space-y-12 text-slate-600 dark:text-slate-400 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-2">
                            <Scale size={24} className="text-indigo-600" />
                            <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
                        </div>
                        <p>
                            By accessing and using Bloom Habit ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service. We reserve the right to modify these terms at any time, and your continued use of the service constitutes acceptance of those changes.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-2">
                            <Lock size={24} className="text-indigo-600" />
                            <h2 className="text-2xl font-bold">2. User Accounts</h2>
                        </div>
                        <p>
                            To access certain features of Bloom Habit, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>You must be at least 13 years old to use this Service.</li>
                            <li>You must provide accurate and complete information when creating an account.</li>
                            <li>One person may not maintain more than one free account.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-2">
                            <Shield size={24} className="text-indigo-600" />
                            <h2 className="text-2xl font-bold">3. Privacy and Data</h2>
                        </div>
                        <p>
                            Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy. By using Bloom Habit, you consent to the collection and use of this information, including the transfer of this information to relevant jurisdictions for storage and processing.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-2">
                            <Check size={24} className="text-indigo-600" />
                            <h2 className="text-2xl font-bold">4. Acceptable Use</h2>
                        </div>
                        <p>
                            You agree not to use Bloom Habit for any unlawful purpose or in any way that interrupts, damages, or impairs the service. Prohibited activities include but are not limited to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Attempting to gain unauthorized access to our systems.</li>
                            <li>Using the service to distribute spam or malicious content.</li>
                            <li>Reverse engineering or attempting to extract the source code of the service.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-2">
                            <FileText size={24} className="text-indigo-600" />
                            <h2 className="text-2xl font-bold">5. Limitation of Liability</h2>
                        </div>
                        <p>
                            Bloom Habit is provided "as is" without any warranties. In no event shall Bloom Habit be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the service.
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
