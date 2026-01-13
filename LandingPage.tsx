import React, { useState, useEffect } from 'react';
import {
    LayoutGrid,
    Zap,
    ArrowRight,
    Chrome,
    AlertCircle,
    HelpCircle,
    ShieldCheck,
    Check,
    X,
    Eye,
    EyeOff,
    Sun,
    Moon,
    Trophy,
    Flame,
    ChevronLeft,
    ChevronRight,
    Calendar,
    ClipboardList,
    BookOpen,
    Briefcase,
    CigaretteOff,
    WineOff,
    Dumbbell,
    Mail,
    Lock,
    ArrowLeft,
    Clock,
    Star,
    Quote,
    BarChart3,
    Target,
    Sparkles,
    Smartphone
} from 'lucide-react';
import { supabase } from './supabase';
import { PricingSection } from './components/PricingSection';

// --- Static Dashboard Preview Component ---

const DashboardPreview = () => {
    // Generate static check patterns that look realistic
    const habits = [
        { name: "Sunlight", icon: Sun, color: "text-amber-500", checks: [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0] },
        { name: "Meditating 10 min", icon: Clock, color: "text-purple-500", checks: [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0] },
        { name: "No smoking", icon: CigaretteOff, color: "text-slate-400", checks: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
        { name: "Deep work", icon: Briefcase, color: "text-orange-500", checks: [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0] },
        { name: "Reading 10 pages", icon: BookOpen, color: "text-blue-500", checks: [1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1] },
        { name: "No alcohol", icon: WineOff, color: "text-rose-500", checks: [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1] },
        { name: "Workout", icon: Dumbbell, color: "text-emerald-500", checks: [1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0] },
    ];

    const stats = [
        { val: 16, goal: 31, percent: 50 },
        { val: 16, goal: 31, percent: 50 },
        { val: 30, goal: 31, percent: 96 },
        { val: 20, goal: 25, percent: 80 },
        { val: 20, goal: 31, percent: 64 },
        { val: 25, goal: 31, percent: 80 },
        { val: 14, goal: 15, percent: 90 },
    ];

    return (
        <div className="w-full bg-white dark:bg-slate-900 rounded-xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200 dark:border-slate-800 overflow-hidden text-left font-sans animate-in fade-in zoom-in-95 duration-700 ring-1 ring-slate-900/5">
            {/* Fake Navigation Bar matching Screenshot */}
            <div className="border-b border-slate-200 dark:border-slate-800 p-3 sm:p-4 flex justify-between items-center bg-white dark:bg-slate-900">
                <div className="flex gap-2 items-center">
                    <div className="hidden sm:flex gap-1.5 mr-4">
                        <div className="w-3 h-3 rounded-full bg-red-400/80" />
                        <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                        <div className="w-3 h-3 rounded-full bg-green-400/80" />
                    </div>
                    <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <div className="px-3 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold rounded-md shadow-sm flex items-center gap-2">
                            <LayoutGrid size={12} /> Monthly
                        </div>
                        <div className="px-3 py-1.5 text-slate-500 dark:text-slate-400 text-xs font-medium rounded-md flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors cursor-default">
                            <Calendar size={12} /> Weekly
                        </div>
                        <div className="px-3 py-1.5 text-slate-500 dark:text-slate-400 text-xs font-medium rounded-md hidden sm:flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors cursor-default">
                            <ClipboardList size={12} /> Review
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">

                </div>
            </div>

            {/* Header Stats matching Screenshot */}
            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="flex items-center justify-between md:justify-start gap-4">
                    <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><ChevronLeft size={20} /></button>
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">December <span className="font-light text-slate-400">2025</span></h2>
                        <p className="text-xs text-slate-500 font-medium">Sunday, December 21, 2025</p>
                    </div>
                    <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><ChevronRight size={20} /></button>
                </div>

                <div className="flex justify-around md:justify-end md:gap-8 lg:gap-12">
                    <div className="text-center">
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Habits</div>
                        <div className="text-xl font-bold text-slate-900 dark:text-white">9</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Completed</div>
                        <div className="text-xl font-bold text-slate-900 dark:text-white">170<span className="text-xs text-slate-400 font-normal">/257</span></div>
                    </div>
                    <div className="text-center hidden sm:block min-w-[100px]">
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 text-left">Progress</div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[66%]" />
                        </div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white mt-1 text-right">66.1%</div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="flex flex-col lg:flex-row bg-white dark:bg-slate-900">
                {/* Habits Table */}
                <div className="flex-1 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <div className="min-w-[600px]">
                        {/* Table Header */}
                        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <div className="w-48 p-3 sticky left-0 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700/50 z-10 pl-6">My Habits</div>
                            <div className="flex-1 p-3 text-center border-r border-slate-200 dark:border-slate-700/50">Week 1</div>
                            <div className="flex-1 p-3 text-center">Week 2</div>
                        </div>

                        {/* Rows */}
                        {habits.map((habit, i) => (
                            <div key={i} className="flex border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors h-10">
                                <div className="w-48 px-4 flex items-center gap-3 border-r border-slate-100 dark:border-slate-800 sticky left-0 bg-white dark:bg-slate-900 z-10">
                                    <habit.icon size={14} className={habit.color} />
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{habit.name}</span>
                                </div>
                                <div className="flex-1 flex">
                                    {habit.checks.map((c, j) => (
                                        <div key={j} className="flex-1 border-r border-slate-100 dark:border-slate-800 flex items-center justify-center">
                                            <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${c ? 'bg-slate-800 dark:bg-slate-200' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                                {c ? <Check size={12} className="text-white dark:text-slate-900" /> : null}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {/* Add Habit Row Placeholder */}
                        <div className="flex h-9 items-center px-4 border-b border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-400">
                            + Add Habit
                        </div>
                    </div>
                </div>

                {/* Achievement Board (Sidebar) */}
                <div className="w-full lg:w-64 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                    <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-100/50 dark:bg-slate-800/50">
                        <Trophy size={14} className="text-amber-500" /> Achievement Board
                    </div>
                    <div className="grid grid-cols-[2fr_1fr_1fr] px-3 py-2 gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center border-b border-slate-200 dark:border-slate-800">
                        <div>Ignition</div>
                        <div>Actual</div>
                        <div>Goal</div>
                    </div>
                    <div className="flex flex-col">
                        {stats.map((stat, i) => (
                            <div key={i} className={`grid grid-cols-[2fr_1fr_1fr] px-2 items-center gap-2 h-10 border-b border-slate-200 dark:border-slate-800 ${i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-transparent'}`}>
                                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${stat.percent}%` }} />
                                </div>
                                <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center">{stat.val}</div>
                                <div className="text-[10px] font-medium text-slate-400 text-center">{stat.goal}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className="p-4 pb-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 text-center bg-slate-200 dark:bg-slate-800 py-1 rounded">Daily Performance Trend (%)</div>
                <div className="h-32 w-full relative mt-4">
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-400">
                        <span>100</span>
                        <span>75</span>
                        <span>50</span>
                        <span>25</span>
                        <span>0</span>
                    </div>
                    <div className="ml-6 h-full relative">
                        {/* Background Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between">
                            {[...Array(5)].map((_, i) => <div key={i} className="w-full h-px bg-slate-200 dark:bg-slate-800/50 dashed" />)}
                        </div>
                        {/* Chart Curve */}
                        <svg viewBox="0 0 100 25" preserveAspectRatio="none" className="w-full h-full absolute top-0 left-0">
                            <defs>
                                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path d="M0,20 C5,15 10,10 15,10 C20,10 25,12 30,15 C35,18 40,8 45,8 C50,8 55,12 60,10 C65,8 70,5 75,8 C80,11 85,8 90,8 C95,8 98,4 100,2 L100,25 L0,25 Z" fill="url(#trendGradient)" />
                            <path d="M0,20 C5,15 10,10 15,10 C20,10 25,12 30,15 C35,18 40,8 45,8 C50,8 55,12 60,10 C65,8 70,5 75,8 C80,11 85,8 90,8 C95,8 98,4 100,2" fill="none" stroke="#22c55e" strokeWidth="0.5" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Stat Item Component for Social Proof Section ---
const StatItem = ({ percentage, text }: { percentage: number, text: string }) => {
    // Precise dimensions for perfect circles
    const size = 72;
    const strokeWidth = 6;
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex items-center gap-6 md:gap-8 group">
            <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
                <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
                    {/* Background Track */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="none"
                        className="text-slate-200 dark:text-slate-800"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="text-slate-900 dark:text-white transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-black text-lg text-slate-900 dark:text-white">
                    {percentage}%
                </div>
            </div>
            <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed text-sm md:text-base">
                {text}
            </p>
        </div>
    );
};

const ReviewCard = ({ name, image, title, text }: { name: string, image: string, title: string, text: string }) => (
    <div className="bg-white dark:bg-slate-900 p-10 rounded-[32px] relative flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300 h-full border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-slate-950/40">
        <div className="absolute top-8 right-8 text-slate-900 dark:text-white opacity-10">
            <Quote size={40} className="text-slate-900 dark:text-white" />
        </div>

        <div className="flex gap-1 mb-6 bg-amber-50 dark:bg-amber-900/10 px-3 py-1.5 rounded-full">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="text-amber-500 fill-amber-500" />
            ))}
        </div>

        <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-4 leading-tight">{title}</h3>

        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed mb-8">
            "{text}"
        </p>

        <div className="mt-auto flex flex-col items-center gap-3">
            <div className="p-1 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
                <img src={image} alt={name} className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-slate-900" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-base">{name}</span>
        </div>
    </div>
);

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
    <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-all duration-300 group">
        <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
            <Icon size={28} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm md:text-base">
            {description}
        </p>
    </div>
);

// --- Main Landing Page ---

type AuthMode = 'signin' | 'signup' | 'forgot';

interface LandingPageProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ isDarkMode, toggleTheme }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [authMode, setAuthMode] = useState<AuthMode>('signin');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{ message: string, code?: string, isSuccess?: boolean } | null>(null);
    const [showAuth, setShowAuth] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [validation, setValidation] = useState({ length: false, upper: false, lower: false, number: false, special: false });

    useEffect(() => {
        setValidation({
            length: password.length >= 8,
            upper: /[A-Z]/.test(password),
            lower: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        });
    }, [password]);

    const isPasswordStrong = Object.values(validation).every(Boolean);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (authMode === 'signup') {
                if (!isPasswordStrong) { setError({ message: "Password is too weak." }); setLoading(false); return; }
                if (password !== confirmPassword) { setError({ message: "Passwords do not match." }); setLoading(false); return; }

                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { full_name: fullName }, emailRedirectTo: window.location.origin }
                });
                if (error) throw error;
                setError({ message: "Success! Check your email to verify account.", isSuccess: true });
            } else if (authMode === 'signin') {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else if (authMode === 'forgot') {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}`,
                });
                if (error) throw error;
                setError({ message: "Password reset link sent! Please check your email.", isSuccess: true });
            }
        } catch (err: any) {
            setError({ message: err.message, code: err.status?.toString() || err.code });
        } finally {
            setLoading(false);
        }
    };

    const signInWithGoogle = async () => {
        setLoading(true);
        try { await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } }); }
        catch (err: any) { setError({ message: err.message, code: "403" }); }
        finally { setLoading(false); }
    };

    const Requirement = ({ label, met }: { label: string, met: boolean }) => (
        <div className={`flex items-center gap-1.5 text-[10px] font-medium ${met ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}`}>
            {met ? <Check size={10} /> : <X size={10} />} <span>{label}</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-x-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-900 dark:selection:text-white relative">

            {/* Auth Modal Overlay */}
            {showAuth && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Blurred Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/20 backdrop-blur-md transition-all duration-300"
                        onClick={() => setShowAuth(false)}
                    />

                    {/* Glass Card */}
                    <div className="relative w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[32px] shadow-2xl overflow-hidden border border-white/50 dark:border-white/10 animate-in zoom-in-95 duration-300 ring-1 ring-black/5">
                        {/* Top Gradient */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                        {/* Close Button */}
                        <button
                            onClick={() => setShowAuth(false)}
                            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100/50 dark:bg-slate-800/50 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors z-20 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 backdrop-blur-sm"
                        >
                            <X size={18} />
                        </button>

                        <div className="p-6 md:p-8 text-center relative overflow-hidden">
                            <div className="w-12 h-12 bg-indigo-50/50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm ring-2 ring-indigo-50/50 dark:ring-indigo-900/20 backdrop-blur-sm">
                                {authMode === 'forgot' ? <Mail size={24} /> : <ShieldCheck size={24} />}
                            </div>

                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">
                                {authMode === 'signup' ? 'Create Account' : authMode === 'signin' ? 'Welcome Back' : 'Recovery'}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-6">
                                {authMode === 'forgot' ? "Enter your email for instructions." : "Join thousands of high-performers today."}
                            </p>

                            <form onSubmit={handleAuth} className="space-y-3 text-left">
                                {authMode === 'signup' && (
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white placeholder:text-slate-400 transition-all font-medium text-sm backdrop-blur-sm"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required
                                        />
                                    </div>
                                )}

                                <div>
                                    <input
                                        type="email"
                                        placeholder="Email address"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white placeholder:text-slate-400 transition-all font-medium text-sm backdrop-blur-sm"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                {authMode !== 'forgot' && (
                                    <div>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Password"
                                                className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white placeholder:text-slate-400 transition-all font-medium text-sm backdrop-blur-sm"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 inset-y-0 flex items-center pr-3 text-slate-400 hover:text-indigo-600 transition-colors">
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>

                                        {authMode === 'signup' && password.length > 0 && (
                                            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 px-3 py-2 mt-2 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
                                                <Requirement label="8+ Chars" met={validation.length} />
                                                <Requirement label="Upper" met={validation.upper} />
                                                <Requirement label="Lower" met={validation.lower} />
                                                <Requirement label="Number" met={validation.number} />
                                                <Requirement label="Special" met={validation.special} />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {authMode === 'signup' && (
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm Password"
                                            className={`w-full px-4 py-3 pr-10 rounded-xl border bg-slate-50/50 dark:bg-slate-800/50 focus:ring-2 outline-none text-slate-900 dark:text-white placeholder:text-slate-400 transition-all font-medium text-sm backdrop-blur-sm ${confirmPassword && password !== confirmPassword ? 'border-red-400' : 'border-slate-200/60 dark:border-slate-700/60'}`}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-0 inset-y-0 flex items-center pr-3 text-slate-400 hover:text-indigo-600 transition-colors">
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                )}

                                {authMode === 'signin' && (
                                    <div className="text-right">
                                        <button type="button" onClick={() => setAuthMode('forgot')} className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Forgot password?</button>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || (authMode === 'signup' && !isPasswordStrong)}
                                    className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 dark:shadow-indigo-500/20 disabled:opacity-50 mt-2"
                                >
                                    {loading ? 'Processing...' : (authMode === 'signup' ? 'Create Account' : authMode === 'signin' ? 'Sign In' : 'Send Link')}
                                    {!loading && <ArrowRight size={18} />}
                                </button>
                            </form>

                            {authMode !== 'forgot' && (
                                <>
                                    <div className="relative my-4">
                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200/50 dark:border-slate-800/50"></div></div>
                                        <div className="relative flex justify-center text-[9px] uppercase tracking-widest font-bold"><span className="px-3 bg-white dark:bg-slate-900 rounded-full text-slate-400">Or continue with</span></div>
                                    </div>

                                    <button onClick={signInWithGoogle} disabled={loading} className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-200/60 dark:border-slate-700/60 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors font-bold text-slate-700 dark:text-white text-sm group backdrop-blur-sm">
                                        <Chrome size={18} className="text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors" />
                                        {loading ? 'Syncing...' : 'Google'}
                                    </button>
                                </>
                            )}

                            {error && (
                                <div className={`mt-4 p-3 rounded-xl text-left text-xs border flex gap-2 backdrop-blur-sm ${error.isSuccess
                                    ? 'bg-green-50/50 border-green-100 text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
                                    : 'bg-red-50/50 border-red-100 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
                                    }`}>
                                    {error.isSuccess ? (
                                        <Check size={14} className="flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                                    )}
                                    <div>
                                        <p className="font-medium">{error.message}</p>
                                    </div>
                                </div>
                            )}

                            <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
                                {authMode === 'signup' ? 'Already have an account?' : authMode === 'signin' ? "Don't have an account?" : "Remember your password?"}
                                <button onClick={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')} className="ml-1.5 font-bold text-slate-900 dark:text-white hover:underline">
                                    {authMode === 'signup' ? 'Sign In' : 'Join Now'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md sticky top-0 z-50">
                <div
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                >
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20"><Check size={18} strokeWidth={3} /></div>
                    <span className="font-bold text-xl tracking-tighter dark:text-white">Bloom Habit</span>
                </div>
                <div className="hidden md:flex items-center gap-10 text-sm font-medium text-slate-600 dark:text-slate-300">
                </div>
                <div className="flex items-center gap-4">
                    <a
                        href="/pricing"
                        onClick={(e) => {
                            e.preventDefault();
                            window.history.pushState({}, '', '/pricing');
                            window.dispatchEvent(new PopStateEvent('popstate'));
                        }}
                        className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                    >
                        Pricing
                    </a>
                    <button
                        onClick={toggleTheme}
                        className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                        aria-label="Toggle theme"
                    >
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>
                    <button onClick={() => { setAuthMode('signin'); setShowAuth(true); }} className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Sign in</button>
                    <button onClick={() => { setAuthMode('signup'); setShowAuth(true); }} className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all">Start Now</button>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
                    {/* Background Gradient similar to reference */}
                    <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-slate-950">
                        <div className="absolute right-0 top-0 h-[800px] w-[800px] bg-indigo-50/50 dark:bg-indigo-900/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/4"></div>
                        <div className="absolute left-0 bottom-0 h-[600px] w-[600px] bg-blue-50/50 dark:bg-blue-900/10 blur-[120px] rounded-full -translate-x-1/3 translate-y-1/4"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                            {/* Left Content */}
                            <div className="flex flex-col items-start text-left z-10 animate-slide-up">
                                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
                                    Habits + Focus. <br />
                                    <span className="text-indigo-600">Everywhere.</span>
                                </h1>
                                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-lg leading-relaxed font-medium">
                                    The habit and focus engine for growing achievers. Track, manage, and improve from one platform. Designed for simplicity.
                                </p>

                                <div className="flex flex-wrap items-center gap-4">
                                    <button
                                        onClick={() => { setAuthMode('signup'); setShowAuth(true); }}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-full text-base font-bold transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-2"
                                    >
                                        Start Now <ArrowRight size={18} />
                                    </button>
                                    <button
                                        onClick={() => { setAuthMode('signin'); setShowAuth(true); }}
                                        className="bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-8 py-3.5 rounded-full text-base font-bold transition-all"
                                    >
                                        Sign in
                                    </button>
                                </div>

                                <div className="mt-12 flex items-center gap-4 text-sm font-medium text-slate-500">
                                    <div className="flex -space-x-3">
                                        <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-950 bg-slate-200 overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop" alt="" />
                                        </div>
                                        <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-950 bg-slate-300 overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop" alt="" />
                                        </div>
                                        <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-950 bg-slate-400 overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop" alt="" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex text-amber-500 gap-0.5">
                                            <Star size={12} fill="currentColor" />
                                            <Star size={12} fill="currentColor" />
                                            <Star size={12} fill="currentColor" />
                                            <Star size={12} fill="currentColor" />
                                            <Star size={12} fill="currentColor" />
                                        </div>
                                        <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-0.5">Trusted by 10,000+ users</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Visual */}
                            <div className="relative lg:h-[600px] flex items-center justify-center lg:justify-end mt-12 lg:mt-0">
                                {/* Dashboard Container */}
                                <div className="relative w-full max-w-[650px] transform lg:scale-90 lg:translate-x-12 perspective-[2000px]" style={{ perspective: '2000px' }}>
                                    <div
                                        className="relative rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-2 transition-transform duration-500 hover:scale-[1.01]"
                                        style={{
                                            transform: 'rotateY(-12deg) rotateX(6deg)',
                                            transformStyle: 'preserve-3d'
                                        }}
                                    >
                                        <DashboardPreview />

                                        {/* Floating Element 1 - Top Right */}
                                        <div
                                            className="absolute -right-4 lg:-right-12 top-8 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 animate-bounce duration-[3000ms] hidden sm:block"
                                            style={{ transform: 'translateZ(40px)' }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                                                    <Check size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Streak</div>
                                                    <div className="text-lg font-bold text-slate-900 dark:text-white">12 Days</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Floating Element 2 - Bottom Left */}
                                        <div
                                            className="absolute -left-4 lg:-left-8 bottom-16 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 animate-pulse delay-700 hidden sm:block"
                                            style={{ transform: 'translateZ(30px)' }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                                                    <Trophy size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Goal Reached</div>
                                                    <div className="text-sm font-bold text-slate-900 dark:text-white">Meditation Master</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Glow effects behind the dashboard */}
                                    <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl -z-10 rounded-[3rem]"></div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* App Showcase Section - Multiple Tilted Pages */}
                <section className="py-24 lg:py-32 bg-slate-900 dark:bg-slate-950 relative overflow-hidden">
                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900 to-slate-900 dark:from-indigo-950/30 dark:via-slate-950 dark:to-slate-950"></div>
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px]"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]"></div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        {/* Section Header */}
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
                                Your Complete Productivity Suite
                            </h2>
                            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                                From monthly habit tracking to weekly planning — everything works together seamlessly.
                            </p>
                        </div>

                        {/* Tilted Screenshots Container */}
                        <div className="relative w-full h-[450px] md:h-[550px] lg:h-[600px]" style={{ perspective: '2500px' }}>
                            {/* Monthly Tracker - Left/Back */}
                            <div
                                className="absolute left-0 md:left-[2%] top-1/2 -translate-y-1/2 w-[75%] md:w-[52%] lg:w-[48%] transition-all duration-500 hover:scale-105 hover:z-30 z-10"
                                style={{
                                    transform: 'translateY(-50%) rotateY(25deg) rotateX(5deg) scale(0.85)',
                                    transformStyle: 'preserve-3d'
                                }}
                            >
                                <div className="rounded-2xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-slate-700/50 bg-slate-900">
                                    {/* Browser Chrome */}
                                    <div className="bg-slate-800 border-b border-slate-700 px-3 py-2 flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                                        </div>
                                        <div className="flex-1 flex justify-center">
                                            <div className="bg-slate-900 rounded-md px-3 py-0.5 text-[10px] text-slate-500 font-medium flex items-center gap-1.5">
                                                <Lock size={8} />
                                                Monthly Tracker
                                            </div>
                                        </div>
                                    </div>
                                    {/* Preview Content */}
                                    <DashboardPreview />
                                </div>
                                {/* Glow */}
                                <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl -z-10 rounded-3xl"></div>
                            </div>

                            {/* Weekly Planner - Right/Front (using same DashboardPreview) */}
                            <div
                                className="absolute right-0 md:right-[2%] top-1/2 -translate-y-1/2 w-[75%] md:w-[48%] lg:w-[45%] transition-all duration-500 hover:scale-105 hover:z-30 z-20"
                                style={{
                                    transform: 'translateY(-50%) rotateY(-15deg) rotateX(3deg) translateZ(60px) scale(0.8)',
                                    transformStyle: 'preserve-3d'
                                }}
                            >
                                <div className="rounded-2xl overflow-hidden shadow-[0_60px_120px_-20px_rgba(0,0,0,0.9)] border border-slate-700/50 bg-slate-900">
                                    {/* Browser Chrome */}
                                    <div className="bg-slate-800 border-b border-slate-700 px-3 py-2 flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                                        </div>
                                        <div className="flex-1 flex justify-center">
                                            <div className="bg-slate-900 rounded-md px-3 py-0.5 text-[10px] text-slate-500 font-medium flex items-center gap-1.5">
                                                <Lock size={8} />
                                                Weekly Planner
                                            </div>
                                        </div>
                                    </div>
                                    {/* Preview Content - Same DashboardPreview */}
                                    <DashboardPreview />
                                </div>
                                {/* Glow */}
                                <div className="absolute -inset-4 bg-purple-500/15 blur-3xl -z-10 rounded-3xl"></div>
                            </div>

                            {/* Floating Streak Element */}
                            <div
                                className="absolute right-[5%] lg:right-[15%] top-[10%] p-3 md:p-4 bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-700/50 z-30 hidden sm:block"
                                style={{ transform: 'translateZ(100px)' }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center text-green-500">
                                        <Check size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Streak</div>
                                        <div className="text-xl font-bold text-white">12 Days</div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Achievement Element */}
                            <div
                                className="absolute left-[5%] lg:left-[12%] bottom-[15%] p-3 md:p-4 bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-700/50 z-30 hidden sm:block"
                                style={{ transform: 'translateZ(80px)' }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 border-2 border-indigo-500/50 flex items-center justify-center text-indigo-400">
                                        <Trophy size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Achievement</div>
                                        <div className="text-sm font-bold text-white">Productivity Master</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature Pills */}
                        <div className="flex flex-wrap justify-center gap-3 mt-8">
                            {['Monthly Tracking', 'Weekly Planning', 'Mental State', 'Analytics', 'Notes'].map((feature) => (
                                <div key={feature} className="bg-slate-800/50 border border-slate-700/50 rounded-full px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur-sm">
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Grid Section */}
                <section className="py-24 bg-white dark:bg-slate-950 relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                                Everything you need to grow
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                                We've distilled the most effective productivity methods into one simple, cohesive interface.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={Target}
                                title="Goal-Oriented"
                                description="Set specific monthly targets. Whether it's 3 times a week or daily, flexible goals keep you moving forward without burnout."
                            />
                            <FeatureCard
                                icon={BarChart3}
                                title="Deep Analytics"
                                description="Visualize your consistency with heatmaps and trend lines. Identify patterns in your behavior instantly."
                            />
                            <FeatureCard
                                icon={Sparkles}
                                title="Mental State"
                                description="Track your mood and motivation alongside your habits. Understand how your feelings impact your productivity."
                            />
                        </div>
                    </div>
                </section>

                {/* Social Proof / Stats Section */}
                <section className="py-24 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                            <div className="text-center lg:text-left sticky top-24">
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                                    It Really Works
                                </h2>
                                <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium max-w-md mx-auto lg:mx-0">
                                    Over 90% of our users have reported measurable improvements in staying consistent with their daily habits.
                                </p>
                                <div className="mt-8 flex gap-4 justify-center lg:justify-start">
                                    <div className="flex -space-x-3">
                                        <img className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="" />
                                        <img className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" alt="" />
                                        <img className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" alt="" />
                                        <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-900 text-white flex items-center justify-center text-xs font-bold">+2k</div>
                                    </div>
                                    <div className="flex flex-col justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                        <div className="flex text-amber-500 gap-0.5"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></div>
                                        <span>Rated 4.9/5 stars</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-12">
                                <StatItem percentage={95} text="have built long-term consistency by tracking their habits every day." />
                                <StatItem percentage={94} text="feel more motivated and accountable after seeing their progress visually." />
                                <StatItem percentage={91} text="have successfully replaced at least one bad habit with a healthier alternative." />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Customer Reviews Section */}
                <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
                    {/* Subtle background pattern for reviews */}
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 dark:opacity-5"></div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                                Reviews from our customers <span className="text-4xl">😊</span>
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400">Join the community of high achievers.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                            <ReviewCard
                                name="Sarah Jenkins"
                                image="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces"
                                title="A complete game-changer."
                                text="I used to juggle three different apps for habits, journaling, and planning. Bloom Habit brought everything into one beautiful dashboard. It's not just about checking boxes; it's about seeing the bigger picture of my life."
                            />
                            <ReviewCard
                                name="Marcus Chen"
                                image="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces"
                                title="The visual feedback is addictive."
                                text="Something about seeing those progress bars fill up just wires my brain to keep going. I've maintained a reading streak for 6 months now, which seemed impossible before. The design is so clean it actually calms me down."
                            />
                            <ReviewCard
                                name="Elena Rodriguez"
                                image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces"
                                title="Simple, yet incredibly powerful."
                                text="Most trackers are either too simple or way too complex. This hits the sweet spot. It took me 2 minutes to set up, and now I have a clear view of my mental state and daily wins. Best investment in myself this year."
                            />
                        </div>
                    </div>
                </section>



                <PricingSection />

                {/* Bottom CTA */}
                <section className="py-20 bg-indigo-600 dark:bg-indigo-900 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Ready to build your best self?</h2>
                        <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">Start tracking today and see the difference a week of consistency makes. No credit card required.</p>
                        <button
                            onClick={() => { setAuthMode('signup'); setShowAuth(true); }}
                            className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-bold hover:scale-105 transition-all shadow-xl flex items-center gap-2 mx-auto"
                        >
                            Get Started Now <ArrowRight size={20} />
                        </button>
                    </div>
                </section>
            </main>

            <footer className="py-12 text-center bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900">
                <div className="flex items-center justify-center gap-2 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default">
                    <div className="w-6 h-6 bg-slate-900 dark:bg-indigo-600 rounded flex items-center justify-center text-white"><LayoutGrid size={12} /></div>
                    <span className="font-black tracking-tighter text-slate-900 dark:text-white">Bloom Habit</span>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        &copy; 2026 Bloom Habit Inc. &bull; Privacy Secure &bull; Cloud Verified
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
                        <a
                            href="/Privacy-Policy"
                            onClick={(e) => {
                                e.preventDefault();
                                window.history.pushState({}, '', '/Privacy-Policy');
                                window.dispatchEvent(new PopStateEvent('popstate'));
                            }}
                            className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:underline uppercase tracking-widest transition-colors cursor-pointer"
                        >
                            Privacy Policy
                        </a>
                        <span className="text-slate-300 dark:text-slate-700 select-none">&bull;</span>
                        <a
                            href="/Refund-Policy"
                            onClick={(e) => {
                                e.preventDefault();
                                window.history.pushState({}, '', '/Refund-Policy');
                                window.dispatchEvent(new PopStateEvent('popstate'));
                            }}
                            className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:underline uppercase tracking-widest transition-colors cursor-pointer"
                        >
                            Refund Policy
                        </a>
                        <span className="text-slate-300 dark:text-slate-700 select-none">&bull;</span>
                        <a
                            href="/support"
                            onClick={(e) => {
                                e.preventDefault();
                                window.history.pushState({}, '', '/support');
                                window.dispatchEvent(new PopStateEvent('popstate'));
                            }}
                            className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:underline uppercase tracking-widest transition-colors cursor-pointer"
                        >
                            Support
                        </a>
                        <span className="text-slate-300 dark:text-slate-700 select-none">&bull;</span>
                        <a
                            href="/terms-and-conditions"
                            onClick={(e) => {
                                e.preventDefault();
                                window.history.pushState({}, '', '/terms-and-conditions');
                                window.dispatchEvent(new PopStateEvent('popstate'));
                            }}
                            className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:underline uppercase tracking-widest transition-colors cursor-pointer"
                        >
                            Terms & Conditions
                        </a>
                    </div>
                </div>
            </footer>
        </div >
    );
};