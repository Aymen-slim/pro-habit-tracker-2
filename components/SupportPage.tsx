import React from 'react';
import { ArrowLeft, Check, Mail, MessageCircle, Clock, HelpCircle } from 'lucide-react';

interface SupportPageProps {
    isDarkMode: boolean;
    onBack: () => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ isDarkMode, onBack }) => {
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
                        <HelpCircle size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Support Center</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto">
                        We're here to help! Reach out to us and we'll get back to you as soon as possible.
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[32px] shadow-xl border border-white/50 dark:border-white/10 p-8 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">

                    {/* Contact Email Section */}
                    <section className="text-center">
                        <div className="flex items-center justify-center gap-3 text-slate-900 dark:text-white mb-6">
                            <Mail size={28} className="text-indigo-600" />
                            <h2 className="text-2xl font-bold">Contact Us</h2>
                        </div>

                        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                            Have a question, feedback, or need assistance? Send us an email and we'll respond within 24 hours.
                        </p>

                        <a
                            href="mailto:support@bloomhabit.site"
                            className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all shadow-xl shadow-indigo-500/20 group"
                        >
                            <Mail size={24} className="group-hover:scale-110 transition-transform" />
                            support@bloomhabit.site
                        </a>
                    </section>

                    <div className="border-t border-slate-200 dark:border-slate-700"></div>

                    {/* Support Info Cards */}
                    <section className="grid md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400">
                                    <Clock size={20} />
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Response Time</h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                We typically respond within 24 hours during business days. For urgent issues, please indicate this in your email subject.
                            </p>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                                    <MessageCircle size={20} />
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white">What to Include</h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                Please include your account email, a clear description of your issue, and any relevant screenshots to help us assist you faster.
                            </p>
                        </div>
                    </section>

                    {/* Common Topics */}
                    <section>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 text-center">Common Support Topics</h3>
                        <div className="flex flex-wrap justify-center gap-2">
                            {['Account Issues', 'Billing & Payments', 'Feature Requests', 'Bug Reports', 'Premium Upgrade', 'General Questions'].map((topic) => (
                                <span
                                    key={topic}
                                    className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-4 py-2 rounded-full text-sm font-medium"
                                >
                                    {topic}
                                </span>
                            ))}
                        </div>
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
