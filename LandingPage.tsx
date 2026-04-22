import React, { useState, useEffect } from 'react';
import {
    LayoutGrid,
    ArrowRight,
    Chrome,
    AlertCircle,
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
    Clock,
    Star,
    Quote,
    BarChart3,
    Target,
    Sparkles,
    Smartphone,
    Activity,
    Zap,
    BrainCircuit,
    Command,
    Github
} from 'lucide-react';
import { supabase } from './supabase';
import { PricingSection } from './components/PricingSection';

// --- Static Dashboard Preview Component (PRESERVED — do not redesign) ---

const DashboardPreview = () => {
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
            {/* Fake Navigation Bar */}
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
                <div className="flex items-center gap-3"></div>
            </div>

            {/* Header Stats */}
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
                <div className="flex-1 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <div className="min-w-[600px]">
                        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <div className="w-48 p-3 sticky left-0 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700/50 z-10 pl-6">My Habits</div>
                            <div className="flex-1 p-3 text-center border-r border-slate-200 dark:border-slate-700/50">Week 1</div>
                            <div className="flex-1 p-3 text-center">Week 2</div>
                        </div>

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
                        <div className="flex h-9 items-center px-4 border-b border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-400">
                            + Add Habit
                        </div>
                    </div>
                </div>

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

            <div className="p-4 pb-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 text-center bg-slate-200 dark:bg-slate-800 py-1 rounded">Daily Performance Trend (%)</div>
                <div className="h-32 w-full relative mt-4">
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-400">
                        <span>100</span><span>75</span><span>50</span><span>25</span><span>0</span>
                    </div>
                    <div className="ml-6 h-full relative">
                        <div className="absolute inset-0 flex flex-col justify-between">
                            {[...Array(5)].map((_, i) => <div key={i} className="w-full h-px bg-slate-200 dark:bg-slate-800/50 dashed" />)}
                        </div>
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

// --- Bento tile wrapper (Raycast/Framer glass card) ---
const BentoTile: React.FC<{
    className?: string;
    children: React.ReactNode;
    glow?: 'indigo' | 'violet' | 'fuchsia' | 'cyan' | 'amber';
}> = ({ className = '', children, glow = 'indigo' }) => {
    const glowMap = {
        indigo: 'from-indigo-500/25 to-indigo-500/0',
        violet: 'from-violet-500/25 to-violet-500/0',
        fuchsia: 'from-fuchsia-500/25 to-fuchsia-500/0',
        cyan: 'from-cyan-500/25 to-cyan-500/0',
        amber: 'from-amber-500/25 to-amber-500/0',
    } as const;
    return (
        <div className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-500 hover:border-white/20 hover:-translate-y-1 ${className}`}>
            {/* Ambient radial glow on hover */}
            <div aria-hidden className={`pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,var(--tw-gradient-stops))] ${glowMap[glow]}`} />
            {/* Inner highlight */}
            <div aria-hidden className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <div className="relative h-full">{children}</div>
        </div>
    );
};

// --- Glass review card ---
const ReviewGlass: React.FC<{ name: string; role: string; image: string; quote: string }> = ({ name, role, image, quote }) => (
    <div className="group relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 transition-all duration-500 hover:border-white/20 hover:-translate-y-1 hover:bg-white/[0.05] overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <Quote size={28} className="text-indigo-400/60 mb-4" />
        <p className="text-slate-200 text-base leading-relaxed mb-6">&ldquo;{quote}&rdquo;</p>
        <div className="flex items-center gap-3 mt-auto">
            <div className="p-[2px] rounded-full bg-gradient-to-br from-indigo-400 via-violet-500 to-fuchsia-500">
                <img src={image} alt={name} className="w-10 h-10 rounded-full object-cover border-2 border-slate-950" />
            </div>
            <div>
                <div className="font-semibold text-white text-sm">{name}</div>
                <div className="text-xs text-slate-400">{role}</div>
            </div>
            <div className="ml-auto flex gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
            </div>
        </div>
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
        <div className={`flex items-center gap-1.5 text-[10px] font-medium transition-colors ${met ? 'text-emerald-400' : 'text-slate-500'}`}>
            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${met ? 'bg-emerald-500/20 ring-1 ring-emerald-500/40' : 'bg-white/5 ring-1 ring-white/10'}`}>
                {met ? <Check size={8} strokeWidth={3} /> : null}
            </div>
            <span>{label}</span>
        </div>
    );

    const navLink = (label: string, href: string) => (
        <a
            href={href}
            onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', href);
                window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
            {label}
        </a>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-white transition-colors duration-300 overflow-x-hidden font-sans selection:bg-indigo-500/30 selection:text-white relative">

            {/* ─────────── AUTH MODAL (dark glass restyle) ─────────── */}
            {showAuth && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xl transition-all duration-300"
                        onClick={() => setShowAuth(false)}
                    />

                    <div className="relative w-full max-w-md animate-in zoom-in-95 duration-300">
                        {/* Gradient border wrapper */}
                        <div className="absolute -inset-px rounded-[28px] bg-gradient-to-br from-indigo-500/60 via-violet-500/40 to-fuchsia-500/60 opacity-80" aria-hidden />
                        {/* Glass panel */}
                        <div className="relative bg-slate-950/90 backdrop-blur-2xl rounded-[27px] overflow-hidden border border-white/10 shadow-[0_30px_120px_-20px_rgba(99,102,241,0.5)]">
                            {/* Aurora behind */}
                            <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-indigo-500/30 blur-3xl animate-auroraDrift" />
                            <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-fuchsia-500/20 blur-3xl animate-auroraDrift" style={{ animationDelay: '4s' }} />

                            <button
                                onClick={() => setShowAuth(false)}
                                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-20 border border-white/10"
                                aria-label="Close"
                            >
                                <X size={16} />
                            </button>

                            <div className="p-7 md:p-9 text-center relative">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5 text-indigo-300 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 ring-1 ring-white/10">
                                    {authMode === 'forgot' ? <Mail size={22} /> : <ShieldCheck size={22} />}
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-1.5 tracking-tight">
                                    {authMode === 'signup' ? 'Create your account' : authMode === 'signin' ? 'Welcome back' : 'Recover access'}
                                </h2>
                                <p className="text-slate-400 text-sm mb-7">
                                    {authMode === 'forgot' ? 'Enter your email for reset instructions.' : authMode === 'signup' ? 'Build better habits. Starts free.' : 'Sign in to continue your streak.'}
                                </p>

                                <form onSubmit={handleAuth} className="space-y-3 text-left">
                                    {authMode === 'signup' && (
                                        <input
                                            type="text"
                                            placeholder="Full name"
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40 outline-none text-white placeholder:text-slate-500 transition-all text-sm"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required
                                        />
                                    )}

                                    <input
                                        type="email"
                                        placeholder="Email address"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40 outline-none text-white placeholder:text-slate-500 transition-all text-sm"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />

                                    {authMode !== 'forgot' && (
                                        <div>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Password"
                                                    className="w-full px-4 py-3 pr-10 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40 outline-none text-white placeholder:text-slate-500 transition-all text-sm"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 inset-y-0 flex items-center pr-3 text-slate-500 hover:text-indigo-300 transition-colors">
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>

                                            {authMode === 'signup' && password.length > 0 && (
                                                <div className="grid grid-cols-2 gap-x-3 gap-y-1 px-3 py-2.5 mt-2 bg-white/[0.03] rounded-xl border border-white/5">
                                                    <Requirement label="8+ chars" met={validation.length} />
                                                    <Requirement label="Uppercase" met={validation.upper} />
                                                    <Requirement label="Lowercase" met={validation.lower} />
                                                    <Requirement label="Number" met={validation.number} />
                                                    <Requirement label="Symbol" met={validation.special} />
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {authMode === 'signup' && (
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Confirm password"
                                                className={`w-full px-4 py-3 pr-10 rounded-xl bg-white/5 border focus:ring-2 outline-none text-white placeholder:text-slate-500 transition-all text-sm ${confirmPassword && password !== confirmPassword ? 'border-red-400/60 focus:ring-red-500/40' : 'border-white/10 focus:border-indigo-400 focus:ring-indigo-500/40'}`}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-0 inset-y-0 flex items-center pr-3 text-slate-500 hover:text-indigo-300 transition-colors">
                                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    )}

                                    {authMode === 'signin' && (
                                        <div className="text-right">
                                            <button type="button" onClick={() => setAuthMode('forgot')} className="text-xs font-semibold text-indigo-300 hover:text-indigo-200 transition-colors">Forgot password?</button>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || (authMode === 'signup' && !isPasswordStrong)}
                                        className="group relative overflow-hidden w-full bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                                    >
                                        <span aria-hidden className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700" />
                                        <span className="relative">{loading ? 'Processing…' : (authMode === 'signup' ? 'Create account' : authMode === 'signin' ? 'Sign in' : 'Send reset link')}</span>
                                        {!loading && <ArrowRight size={16} className="relative" />}
                                    </button>
                                </form>

                                {authMode !== 'forgot' && (
                                    <>
                                        <div className="relative my-5">
                                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                                            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-semibold"><span className="px-3 bg-slate-950 text-slate-500">or</span></div>
                                        </div>

                                        <button onClick={signInWithGoogle} disabled={loading} className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold text-white text-sm transition-colors">
                                            <Chrome size={18} className="text-indigo-300" />
                                            Continue with Google
                                        </button>
                                    </>
                                )}

                                {error && (
                                    <div className={`mt-4 p-3 rounded-xl text-left text-xs flex gap-2 border ${error.isSuccess
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                        : 'bg-red-500/10 border-red-500/30 text-red-300'
                                        }`}>
                                        {error.isSuccess ? <Check size={14} className="flex-shrink-0 mt-0.5" /> : <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />}
                                        <p className="font-medium">{error.message}</p>
                                    </div>
                                )}

                                <p className="mt-6 text-xs text-slate-400">
                                    {authMode === 'signup' ? 'Already have an account?' : authMode === 'signin' ? "Don't have an account?" : 'Remember your password?'}
                                    <button onClick={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')} className="ml-1.5 font-semibold text-white hover:text-indigo-300 transition-colors">
                                        {authMode === 'signup' ? 'Sign in' : 'Sign up'}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ─────────── NAV ─────────── */}
            <nav className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                            <Check size={16} strokeWidth={3} />
                            <div aria-hidden className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/20" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-white">Bloom Habit</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        {navLink('Features', '#features')}
                        {navLink('Pricing', '/pricing')}
                        {navLink('Reviews', '#reviews')}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                        <button
                            onClick={() => { setAuthMode('signin'); setShowAuth(true); }}
                            className="hidden sm:inline-flex text-sm font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors"
                        >
                            Sign in
                        </button>
                        <button
                            onClick={() => { setAuthMode('signup'); setShowAuth(true); }}
                            className="group relative overflow-hidden bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg shadow-indigo-500/30 transition-all"
                        >
                            <span aria-hidden className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-white/0 via-white/25 to-white/0 transition-transform duration-700" />
                            <span className="relative">Start free</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main>
                {/* ─────────── HERO (3D tracker preserved) ─────────── */}
                <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
                    {/* Background: grid + aurora */}
                    <div aria-hidden className="absolute inset-0 -z-10">
                        <div className="absolute inset-0 bloom-grid-mask" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
                        <div className="absolute right-[-15%] top-[0%] h-[600px] w-[600px] bg-indigo-500/25 blur-[140px] rounded-full animate-auroraDrift" />
                        <div className="absolute left-[-10%] top-[30%] h-[500px] w-[500px] bg-violet-600/20 blur-[140px] rounded-full animate-auroraDrift" style={{ animationDelay: '6s' }} />
                    </div>

                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-10 items-center">

                            {/* Left — copy */}
                            <div className="flex flex-col items-start text-left z-10">
                                <div className="animate-fadeUp" style={{ animationDelay: '0ms' }}>
                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-slate-300 border border-white/10 backdrop-blur">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
                                        </span>
                                        <span>v2.0 &middot; AI habit suggestions are live</span>
                                        <ArrowRight size={12} className="text-slate-500" />
                                    </span>
                                </div>

                                <h1 className="mt-7 text-5xl sm:text-6xl lg:text-[5.25rem] font-semibold tracking-[-0.04em] text-white leading-[0.95] animate-fadeUp" style={{ animationDelay: '120ms' }}>
                                    Build habits<br />
                                    that <span className="font-serif-accent italic font-normal bg-gradient-to-br from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">actually stick</span>.
                                </h1>

                                <p className="mt-7 text-lg text-slate-400 max-w-[52ch] leading-relaxed animate-fadeUp" style={{ animationDelay: '240ms' }}>
                                    The focus &amp; habit engine for people who&rsquo;ve tried every other app. Track, reflect, and improve — all from one beautifully calm dashboard.
                                </p>

                                <div className="mt-9 flex flex-wrap items-center gap-3 animate-fadeUp" style={{ animationDelay: '360ms' }}>
                                    <button
                                        onClick={() => { setAuthMode('signup'); setShowAuth(true); }}
                                        className="group relative overflow-hidden bg-white text-slate-950 px-7 py-3.5 rounded-full text-base font-semibold transition-all shadow-[0_10px_40px_-10px_rgba(255,255,255,0.4)] hover:shadow-[0_14px_44px_-10px_rgba(255,255,255,0.6)] hover:-translate-y-0.5 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                                    >
                                        <span aria-hidden className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-indigo-400/0 via-indigo-400/30 to-indigo-400/0 transition-transform duration-700" />
                                        <span className="relative">Start for free</span>
                                        <ArrowRight size={18} className="relative transition-transform duration-200 group-hover:translate-x-0.5" />
                                    </button>
                                    <button
                                        onClick={() => { setAuthMode('signin'); setShowAuth(true); }}
                                        className="group px-5 py-3.5 rounded-full text-base font-semibold text-slate-300 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all inline-flex items-center gap-2"
                                    >
                                        Sign in
                                        <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                                    </button>
                                </div>

                                {/* Trust row */}
                                <div className="mt-10 flex items-center gap-5 animate-fadeUp" style={{ animationDelay: '480ms' }}>
                                    <div className="flex -space-x-2.5">
                                        <div className="w-9 h-9 rounded-full border-2 border-slate-950 overflow-hidden ring-1 ring-white/10">
                                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop" alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="w-9 h-9 rounded-full border-2 border-slate-950 overflow-hidden ring-1 ring-white/10">
                                            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop" alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="w-9 h-9 rounded-full border-2 border-slate-950 overflow-hidden ring-1 ring-white/10">
                                            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop" alt="" className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex text-amber-400 gap-0.5" aria-label="5 star rating">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                        </div>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            Loved by <span className="tabular-nums font-semibold text-white">10,247+</span> high-performers
                                        </p>
                                    </div>
                                </div>

                                {/* Logo strip */}
                                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 opacity-60 animate-fadeUp" style={{ animationDelay: '600ms' }}>
                                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">As seen on</span>
                                    <span className="text-xs font-bold text-slate-400">Product Hunt</span>
                                    <span className="text-slate-700">&middot;</span>
                                    <span className="text-xs font-bold text-slate-400">Indie Hackers</span>
                                    <span className="text-slate-700">&middot;</span>
                                    <span className="text-xs font-bold text-slate-400">Hacker News</span>
                                </div>
                            </div>

                            {/* Right — 3D tracker (PRESERVED) */}
                            <div className="relative lg:h-[620px] flex items-center justify-center lg:justify-end mt-12 lg:mt-0">
                                <div className="relative w-full max-w-[680px] transform lg:scale-95 lg:translate-x-6" style={{ perspective: '2000px' }}>
                                    <div
                                        className="relative rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-2 transition-transform duration-500 hover:scale-[1.01]"
                                        style={{
                                            transform: 'rotateY(-12deg) rotateX(6deg)',
                                            transformStyle: 'preserve-3d'
                                        }}
                                    >
                                        <DashboardPreview />

                                        {/* Floating Streak chip */}
                                        <div
                                            className="absolute -right-4 lg:-right-12 top-8 p-4 bg-slate-900/90 backdrop-blur-md rounded-xl shadow-2xl border border-white/10 animate-floatY hidden sm:block"
                                            style={{ transform: 'translateZ(40px)' }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                                                    <Flame size={18} />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Streak</div>
                                                    <div className="text-lg font-bold text-white">12 Days</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Floating Trophy chip */}
                                        <div
                                            className="absolute -left-4 lg:-left-8 bottom-20 p-4 bg-slate-900/90 backdrop-blur-md rounded-xl shadow-2xl border border-white/10 animate-floatY hidden sm:block"
                                            style={{ transform: 'translateZ(30px)', animationDelay: '2s' }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                                                    <Trophy size={18} />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Goal Reached</div>
                                                    <div className="text-sm font-bold text-white">Meditation Master</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Glow behind dashboard */}
                                    <div aria-hidden className="absolute -inset-8 bg-indigo-500/25 blur-[80px] -z-10 rounded-[3rem]" />
                                    <div aria-hidden className="absolute -inset-4 bg-violet-500/10 blur-3xl -z-10 rounded-[3rem]" />
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* ─────────── BENTO FEATURES GRID ─────────── */}
                <section id="features" className="relative py-24 lg:py-32 overflow-hidden">
                    <div aria-hidden className="absolute inset-0 -z-10">
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[1000px] bg-indigo-600/10 blur-[160px] rounded-full" />
                    </div>

                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-slate-300 border border-white/10 backdrop-blur mb-5">
                                <Sparkles size={12} className="text-indigo-400" />
                                Everything you need
                            </span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] text-white leading-[1.02]">
                                Not another<br />
                                <span className="font-serif-accent italic font-normal bg-gradient-to-br from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">bloated</span> tracker.
                            </h2>
                            <p className="mt-5 text-slate-400 text-lg leading-relaxed">
                                Ruthlessly simple tools that compound into real change &mdash; without the productivity cult.
                            </p>
                        </div>

                        {/* Bento grid: 4 cols × 3 rows on desktop */}
                        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 md:gap-5 auto-rows-[220px] md:auto-rows-[auto]">

                            {/* Tile A — Heatmap (wide, 2×1) */}
                            <BentoTile glow="indigo" className="md:col-span-2 md:row-span-1 p-7">
                                <div className="flex items-start justify-between mb-5">
                                    <div>
                                        <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-300 mb-2">
                                            <Activity size={14} />
                                            <span className="uppercase tracking-wider">Heatmap</span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-white tracking-tight">Your year, at a glance</h3>
                                        <p className="text-sm text-slate-400 mt-1.5 max-w-xs">Every check-in paints a pixel. Spot patterns before they spot you.</p>
                                    </div>
                                </div>
                                {/* Mini heatmap grid */}
                                <div className="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-[3px] mt-4">
                                    {[...Array(24 * 5)].map((_, i) => {
                                        const seed = (i * 37) % 100;
                                        const level = seed < 25 ? 0 : seed < 55 ? 1 : seed < 80 ? 2 : 3;
                                        const bg = ['bg-white/[0.04]', 'bg-indigo-500/30', 'bg-indigo-500/60', 'bg-indigo-400'][level];
                                        return <div key={i} className={`aspect-square rounded-[3px] ${bg}`} />;
                                    })}
                                </div>
                            </BentoTile>

                            {/* Tile B — Streak flame (1×1) */}
                            <BentoTile glow="amber" className="md:col-span-1 md:row-span-1 p-7 flex flex-col">
                                <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 mb-3">
                                    <Flame size={14} />
                                    <span className="uppercase tracking-wider">Streaks</span>
                                </div>
                                <h3 className="text-lg font-semibold text-white tracking-tight mb-1">Don&rsquo;t break the chain</h3>
                                <p className="text-sm text-slate-400">Streak engine rewards consistency, not perfection.</p>
                                <div className="mt-auto pt-6 flex items-end gap-3">
                                    <div className="text-5xl font-bold text-white tabular-nums">127</div>
                                    <div className="pb-1.5 text-xs text-slate-400">
                                        <div className="text-amber-400 font-semibold">Longest streak</div>
                                        days strong
                                    </div>
                                </div>
                            </BentoTile>

                            {/* Tile C — AI suggestions (tall, 1×2) */}
                            <BentoTile glow="violet" className="md:col-span-1 md:row-span-2 p-7 flex flex-col">
                                <div className="inline-flex items-center gap-2 text-xs font-semibold text-violet-300 mb-3">
                                    <BrainCircuit size={14} />
                                    <span className="uppercase tracking-wider">AI Coach</span>
                                </div>
                                <h3 className="text-lg font-semibold text-white tracking-tight mb-1">Smart suggestions</h3>
                                <p className="text-sm text-slate-400 mb-5">Your habits, analyzed weekly. Gently nudged, never lectured.</p>
                                <div className="mt-auto space-y-2.5">
                                    <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 text-sm text-slate-200">
                                        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-violet-300 mb-1.5">
                                            <Sparkles size={10} /> Insight
                                        </div>
                                        You complete 83% more habits on days you start with meditation.
                                    </div>
                                    <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 text-sm text-slate-200">
                                        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-violet-300 mb-1.5">
                                            <Target size={10} /> Suggestion
                                        </div>
                                        Try stacking &ldquo;Reading&rdquo; right after &ldquo;Workout&rdquo; &mdash; your strongest combo.
                                    </div>
                                </div>
                            </BentoTile>

                            {/* Tile D — Mental state (1×1) */}
                            <BentoTile glow="fuchsia" className="md:col-span-1 md:row-span-1 p-7 flex flex-col">
                                <div className="inline-flex items-center gap-2 text-xs font-semibold text-fuchsia-300 mb-3">
                                    <Zap size={14} />
                                    <span className="uppercase tracking-wider">Mental state</span>
                                </div>
                                <h3 className="text-lg font-semibold text-white tracking-tight mb-1">Track how you feel</h3>
                                <p className="text-sm text-slate-400 mb-auto">See how mood shapes your wins.</p>
                                <div className="mt-5 flex gap-1.5 flex-wrap">
                                    {[
                                        { e: '🔥', label: 'Locked in' },
                                        { e: '😌', label: 'Calm' },
                                        { e: '⚡', label: 'Energized' },
                                        { e: '☁️', label: 'Foggy' },
                                    ].map(m => (
                                        <span key={m.label} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-slate-200">
                                            <span>{m.e}</span>{m.label}
                                        </span>
                                    ))}
                                </div>
                            </BentoTile>

                            {/* Tile E — Analytics (2×1) */}
                            <BentoTile glow="cyan" className="md:col-span-2 md:row-span-1 p-7">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-300 mb-2">
                                            <BarChart3 size={14} />
                                            <span className="uppercase tracking-wider">Analytics</span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-white tracking-tight">Charts that tell the truth</h3>
                                        <p className="text-sm text-slate-400 mt-1.5 max-w-sm">Beautiful, honest data. No vanity metrics, no dark patterns.</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-white tabular-nums">94<span className="text-cyan-400">%</span></div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">This month</div>
                                    </div>
                                </div>
                                {/* Sparkline */}
                                <div className="mt-4 h-20 w-full">
                                    <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="w-full h-full">
                                        <defs>
                                            <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="rgb(34,211,238)" stopOpacity="0.4" />
                                                <stop offset="100%" stopColor="rgb(34,211,238)" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <path d="M0,40 C15,35 25,38 35,30 C45,22 55,28 70,22 C85,16 95,25 115,18 C135,11 150,20 170,12 C185,6 195,10 200,8 L200,60 L0,60 Z" fill="url(#sparkFill)" />
                                        <path d="M0,40 C15,35 25,38 35,30 C45,22 55,28 70,22 C85,16 95,25 115,18 C135,11 150,20 170,12 C185,6 195,10 200,8" fill="none" stroke="rgb(34,211,238)" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </div>
                            </BentoTile>

                            {/* Tile F — Cross-device (2×1) */}
                            <BentoTile glow="indigo" className="md:col-span-2 md:row-span-1 p-7 flex">
                                <div className="flex-1">
                                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-300 mb-3">
                                        <Smartphone size={14} />
                                        <span className="uppercase tracking-wider">Everywhere</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white tracking-tight mb-1">Follows you, quietly</h3>
                                    <p className="text-sm text-slate-400 max-w-xs">Web, iOS, Android. Changes sync in milliseconds. Works offline.</p>
                                </div>
                                {/* Device badges */}
                                <div className="hidden sm:flex flex-col gap-2 items-end self-center">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300"><Smartphone size={12} /> iOS &amp; Android</div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300"><Command size={12} /> Keyboard-first web</div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300"><Github size={12} /> Open changelog</div>
                                </div>
                            </BentoTile>

                        </div>
                    </div>
                </section>

                {/* ─────────── SOCIAL PROOF BAND ─────────── */}
                <section className="relative py-20 border-y border-white/5 bg-white/[0.02]">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
                            <div>
                                <div className="text-4xl md:text-5xl font-semibold text-white tabular-nums tracking-tight">
                                    10k<span className="text-indigo-400">+</span>
                                </div>
                                <div className="text-xs text-slate-500 uppercase tracking-[0.2em] mt-2">Active users</div>
                            </div>
                            <div>
                                <div className="text-4xl md:text-5xl font-semibold text-white tabular-nums tracking-tight">
                                    94<span className="text-indigo-400">%</span>
                                </div>
                                <div className="text-xs text-slate-500 uppercase tracking-[0.2em] mt-2">Hit monthly goals</div>
                            </div>
                            <div>
                                <div className="text-4xl md:text-5xl font-semibold text-white tabular-nums tracking-tight">
                                    <span className="font-serif-accent italic font-normal">4.9</span>
                                </div>
                                <div className="text-xs text-slate-500 uppercase tracking-[0.2em] mt-2 flex items-center justify-center gap-1">
                                    <Star size={10} fill="currentColor" className="text-amber-400" />
                                    App Store
                                </div>
                            </div>
                            <div>
                                <div className="text-4xl md:text-5xl font-semibold text-white tabular-nums tracking-tight">
                                    127<span className="text-indigo-400">d</span>
                                </div>
                                <div className="text-xs text-slate-500 uppercase tracking-[0.2em] mt-2">Avg. streak</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─────────── REVIEWS ─────────── */}
                <section id="reviews" className="relative py-24 lg:py-32 overflow-hidden">
                    <div aria-hidden className="absolute inset-0 -z-10">
                        <div className="absolute right-1/4 top-10 h-[400px] w-[400px] bg-violet-600/10 blur-[140px] rounded-full" />
                    </div>
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center max-w-2xl mx-auto mb-14">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-slate-300 border border-white/10 backdrop-blur mb-5">
                                <Quote size={12} className="text-indigo-400" />
                                Loved by builders
                            </span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] text-white leading-[1.02]">
                                People who <span className="font-serif-accent italic font-normal bg-gradient-to-br from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">actually stuck</span> with it.
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <ReviewGlass
                                name="Sarah Jenkins"
                                role="Product designer"
                                image="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces"
                                quote="I juggled three different apps for habits, journaling, and planning. Bloom Habit replaced all of them. It&rsquo;s not about checking boxes — it&rsquo;s about seeing the bigger picture of my life."
                            />
                            <ReviewGlass
                                name="Marcus Chen"
                                role="Indie founder"
                                image="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces"
                                quote="Something about watching those bars fill up rewires my brain to keep going. Six months reading streak — which used to feel impossible. The interface is so calm it actually slows me down."
                            />
                            <ReviewGlass
                                name="Elena Rodriguez"
                                role="Engineering manager"
                                image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces"
                                quote="Most trackers are either toys or spreadsheets. This hits the sweet spot. Two minutes to set up, and now I have an honest view of my mental state and wins. Best self-investment this year."
                            />
                        </div>
                    </div>
                </section>

                {/* ─────────── PRICING (untouched) ─────────── */}
                <PricingSection />

                {/* ─────────── BOTTOM CTA ─────────── */}
                <section className="relative py-28 overflow-hidden">
                    {/* Gradient canvas */}
                    <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-600 via-violet-700 to-fuchsia-700" />
                    <div aria-hidden className="absolute inset-0 -z-10 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                    <div aria-hidden className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-white/10 blur-3xl animate-auroraDrift" />
                    <div aria-hidden className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-fuchsia-300/30 blur-3xl animate-auroraDrift" style={{ animationDelay: '6s' }} />

                    <div className="max-w-4xl mx-auto px-6 text-center relative">
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-[-0.03em] leading-[0.98]">
                            Your best self is<br />
                            <span className="font-serif-accent italic font-normal">one habit</span> away.
                        </h2>
                        <p className="text-indigo-100/90 text-lg md:text-xl mt-7 max-w-xl mx-auto">
                            Start free. No credit card. Cancel anytime.
                        </p>
                        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                            <button
                                onClick={() => { setAuthMode('signup'); setShowAuth(true); }}
                                className="group relative overflow-hidden bg-white text-indigo-700 px-8 py-4 rounded-full text-lg font-semibold hover:-translate-y-0.5 transition-all shadow-2xl shadow-indigo-950/40 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-700"
                            >
                                <span aria-hidden className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-indigo-400/0 via-indigo-400/20 to-indigo-400/0 transition-transform duration-700" />
                                <span className="relative">Start building — free</span>
                                <ArrowRight size={18} className="relative transition-transform duration-200 group-hover:translate-x-0.5" />
                            </button>
                            <a
                                href="/pricing"
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.history.pushState({}, '', '/pricing');
                                    window.dispatchEvent(new PopStateEvent('popstate'));
                                }}
                                className="px-6 py-4 rounded-full text-base font-semibold text-white/90 hover:text-white border border-white/30 hover:border-white/60 hover:bg-white/10 transition-all"
                            >
                                See pricing
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            {/* ─────────── FOOTER ─────────── */}
            <footer className="border-t border-white/5 bg-slate-950">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white"><Check size={14} strokeWidth={3} /></div>
                            <span className="font-bold tracking-tight text-white">Bloom Habit</span>
                            <span className="text-xs text-slate-500 ml-2 hidden sm:inline">Made for high-performers.</span>
                        </div>

                        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
                            <a
                                href="/Privacy-Policy"
                                onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/Privacy-Policy'); window.dispatchEvent(new PopStateEvent('popstate')); }}
                                className="text-xs font-medium text-slate-400 hover:text-white transition-colors"
                            >Privacy</a>
                            <a
                                href="/Refund-Policy"
                                onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/Refund-Policy'); window.dispatchEvent(new PopStateEvent('popstate')); }}
                                className="text-xs font-medium text-slate-400 hover:text-white transition-colors"
                            >Refunds</a>
                            <a
                                href="/terms-and-conditions"
                                onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/terms-and-conditions'); window.dispatchEvent(new PopStateEvent('popstate')); }}
                                className="text-xs font-medium text-slate-400 hover:text-white transition-colors"
                            >Terms</a>
                            <a
                                href="/support"
                                onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/support'); window.dispatchEvent(new PopStateEvent('popstate')); }}
                                className="text-xs font-medium text-slate-400 hover:text-white transition-colors"
                            >Support</a>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-[11px] text-slate-500">
                            &copy; {new Date().getFullYear()} Bloom Habit Inc. &middot; All rights reserved.
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                            </span>
                            All systems operational
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
