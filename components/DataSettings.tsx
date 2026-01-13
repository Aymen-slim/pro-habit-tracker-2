import React, { useState, useEffect } from 'react';
import { Trash2, AlertTriangle, Mail, ShieldAlert, Calendar, HelpCircle, Sparkles, User as UserIcon } from 'lucide-react';
import { useStorage } from '../context/StorageContext';
import { supabase } from '../supabase';
import { Modal } from './Modal';

export const DataSettings: React.FC = () => {
    const { data, wipeAllData } = useStorage();
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [user, setUser] = useState<any>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showSqlHelp, setShowSqlHelp] = useState(false);
    const isPremium = data.userProfile?.tier === 'premium';

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });
    }, []);

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            // This function will attempt to call the 'delete_user_account' RPC
            await wipeAllData();

            // Final logout
            await supabase.auth.signOut();
        } catch (err: any) {
            console.error(err);
            if (err.message === "ACCOUNT_DELETE_RPC_FAILED") {
                setMessage({ text: 'User data wiped, but Auth account removal failed. Ensure the delete_user_account SQL function is created in Supabase.', type: 'error' });
                setShowSqlHelp(true);
            } else {
                setMessage({ text: 'An unexpected error occurred during deletion.', type: 'error' });
            }
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User";
    const avatarUrl = user?.user_metadata?.avatar_url;
    const createdAt = user?.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown';

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">

            {/* Profile Header */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 p-8 flex flex-col items-center sm:flex-row sm:items-start gap-6">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-2xl shadow-xl border-4 border-white dark:border-slate-800 object-cover" />
                    ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl text-white font-bold shadow-xl border-4 border-white dark:border-slate-800">
                            {displayName[0]?.toUpperCase()}
                        </div>
                    )}
                    <div className="text-center sm:text-left pt-2 flex-1">
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1 tracking-tight">{displayName}</h2>
                        <div className="flex flex-col gap-1.5 mb-4">
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-500 dark:text-slate-400">
                                <Mail size={14} />
                                <span className="text-sm font-medium">{user?.email}</span>
                            </div>
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-400 dark:text-slate-500">
                                <Calendar size={14} />
                                <span className="text-xs uppercase tracking-wider font-bold">Joined {createdAt}</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                            {isPremium ? (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-100 to-yellow-200 dark:from-yellow-900/40 dark:to-amber-900/40 text-amber-900 dark:text-amber-200 text-[10px] font-black uppercase tracking-wider rounded-full ring-1 ring-amber-300 dark:ring-amber-700 shadow-sm">
                                    <Sparkles size={10} fill="currentColor" />
                                    Premium Account
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider rounded-full ring-1 ring-slate-200 dark:ring-slate-600">
                                    <UserIcon size={10} />
                                    Basic Account
                                </span>
                            )}
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider rounded-full ring-1 ring-green-200 dark:ring-green-800">Verified User</span>
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-full ring-1 ring-blue-200 dark:ring-blue-800">Cloud Sync Active</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-slate-700/50">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{Object.keys(data.monthlyData).length}</div>
                            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tight mt-1">Months tracked</div>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{data.tasks.length}</div>
                            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tight mt-1">Total Tasks</div>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{data.notes.length}</div>
                            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tight mt-1">Personal Notes</div>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{Object.keys(data.reviews).length}</div>
                            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tight mt-1">Weekly Reviews</div>
                        </div>
                    </div>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 border border-green-100 dark:border-green-800' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 border border-red-100 dark:border-red-800'}`}>
                    <div className="flex items-center gap-2">
                        {message.type === 'success' ? null : <ShieldAlert size={18} />}
                        <span className="text-sm font-medium">{message.text}</span>
                    </div>
                    {showSqlHelp && (
                        <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg text-xs">
                            <div className="flex items-center gap-2 font-bold mb-2">
                                <HelpCircle size={14} />
                                Action Required:
                            </div>
                            <p className="mb-2">Run this in your Supabase SQL Editor to enable full account deletion:</p>
                            <pre className="bg-slate-900 text-slate-100 p-2 rounded overflow-x-auto text-[10px]">
                                {`CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void AS $$
BEGIN
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`}
                            </pre>
                        </div>
                    )}
                </div>
            )}

            {/* Danger Zone */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30 p-8">
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                    <ShieldAlert size={20} />
                    Danger Zone
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                    Deleting your account will permanently remove your <span className="font-bold">email address, profile information</span>, and all tracked data from our servers.
                    <span className="font-bold text-red-600 dark:text-red-400 block mt-2"> This action is final and cannot be reversed.</span>
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white border border-red-200 dark:border-red-900/50 transition-all font-bold text-sm shadow-sm"
                    >
                        <Trash2 size={18} />
                        Permanently Delete Account
                    </button>
                </div>
            </div>

            {/* Deletion Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
                title="Account Deletion Request"
            >
                <div className="space-y-6">
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/50 flex gap-3">
                        <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
                        <div className="text-sm text-red-800 dark:text-red-200">
                            <p className="font-bold mb-1 uppercase tracking-wider text-xs">Security Check</p>
                            <p className="opacity-80">You are about to delete <span className="font-bold">{user?.email}</span>. This will destroy all linked cloud backups and authentication records.</p>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            disabled={isDeleting}
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
                        >
                            Keep Account
                        </button>
                        <button
                            disabled={isDeleting}
                            onClick={handleDeleteAccount}
                            className="flex-1 px-4 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isDeleting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Deleting...
                                </>
                            ) : (
                                'Delete Everything'
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};