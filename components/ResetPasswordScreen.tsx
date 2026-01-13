import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X, Eye, EyeOff, AlertCircle, ArrowRight, Lock } from 'lucide-react';
import { supabase } from '../supabase';

interface ResetPasswordScreenProps {
  onComplete: () => void;
}

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ onComplete }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordStrong) return;
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const Requirement = ({ label, met }: { label: string, met: boolean }) => (
    <div className={`flex items-center gap-1.5 text-xs font-medium ${met ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}`}>
        {met ? <Check size={12} /> : <X size={12} />} <span>{label}</span>
    </div>
  );

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Lock size={32} />
        </div>
        
        <h2 className="text-3xl font-black mb-2 dark:text-white text-center">Secure Your Account</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 text-center">Enter a new strong password below.</p>

        {success ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-6 rounded-3xl text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto">
              <Check size={24} />
            </div>
            <h3 className="text-green-800 dark:text-green-200 font-bold">Password Updated!</h3>
            <p className="text-green-600 dark:text-green-400 text-xs">Your account is now secure. Redirecting to your dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">New Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="At least 8 characters" 
                  className="w-full px-5 py-4 pr-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all font-medium" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 inset-y-0 flex items-center pr-4 text-slate-400 hover:text-indigo-500 transition-colors">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {password.length > 0 && (
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 px-3 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    <Requirement label="8+ Chars" met={validation.length} />
                    <Requirement label="Uppercase" met={validation.upper} />
                    <Requirement label="Lowercase" met={validation.lower} />
                    <Requirement label="Number" met={validation.number} />
                    <Requirement label="Special Char" met={validation.special} />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Confirm Password</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Repeat new password" 
                  className={`w-full px-5 py-4 pr-12 rounded-2xl border bg-slate-50 dark:bg-slate-800 focus:ring-2 outline-none dark:text-white transition-all font-medium ${confirmPassword && password !== confirmPassword ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'}`} 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-0 inset-y-0 flex items-center pr-4 text-slate-400 hover:text-indigo-500 transition-colors">
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex gap-3 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle size={18} className="flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading || !isPasswordStrong || password !== confirmPassword} 
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-lg shadow-xl shadow-indigo-500/20"
            >
              {loading ? 'Securing...' : 'Update Password'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};