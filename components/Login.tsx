import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
    onLogin: (password: string) => boolean;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const success = onLogin(password);
        if (!success) {
            setError(true);
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-200">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-800">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 text-white shadow-lg shadow-blue-500/30">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-center">
                        Please enter your password to access your habit tracker
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError(false);
                                }}
                                className={`w-full px-4 py-3 pr-12 rounded-xl border ${error
                                        ? 'border-red-500 focus:ring-red-500/20'
                                        : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                                    } bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-4 transition-all`}
                                placeholder="Enter password"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {error && (
                            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                                Incorrect password. Please try again.
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Access Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};
