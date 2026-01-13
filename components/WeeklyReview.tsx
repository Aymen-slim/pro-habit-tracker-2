import React, { useState, useMemo, useEffect } from 'react';
import { Save, ChevronLeft, ChevronRight, History, Star, ArrowRight, CalendarDays } from 'lucide-react';
import { useStorage } from '../context/StorageContext';
import { ReviewData } from '../types';

interface WeeklyReviewProps {
    currentDate: Date;
    onPrevWeek: () => void;
    onNextWeek: () => void;
    onSelectDate: (date: Date) => void;
    onNavigateToPricing: () => void;
}

export const WeeklyReview: React.FC<WeeklyReviewProps> = ({ currentDate, onPrevWeek, onNextWeek, onSelectDate, onNavigateToPricing }) => {
    const { data, updateReview } = useStorage();
    const isPremium = data.userProfile?.tier === 'premium';
    const [showHistory, setShowHistory] = useState(false);
    const [savedMessage, setSavedMessage] = useState('');

    // Calculate start of the week key (e.g. "2023-10-22")
    const weekKey = useMemo(() => {
        const date = new Date(currentDate);
        const day = date.getDay();
        // Fix: Ensure week starts on Monday to match other views
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const startOfWeek = new Date(date.setDate(diff));
        return startOfWeek.toISOString().split('T')[0];
    }, [currentDate]);

    // Get review for this week or default
    const reflection = useMemo(() => {
        return data.reviews[weekKey] || { wins: '', challenges: '', focus: '', rating: 5 };
    }, [data.reviews, weekKey]);

    // Local state for editing (saves only on blur)
    const [localWins, setLocalWins] = useState(reflection.wins);
    const [localChallenges, setLocalChallenges] = useState(reflection.challenges);
    const [localFocus, setLocalFocus] = useState(reflection.focus);
    const [localRating, setLocalRating] = useState(reflection.rating);

    // Sync local state when weekKey changes
    useEffect(() => {
        setLocalWins(reflection.wins);
        setLocalChallenges(reflection.challenges);
        setLocalFocus(reflection.focus);
        setLocalRating(reflection.rating);
    }, [weekKey, reflection.wins, reflection.challenges, reflection.focus, reflection.rating]);

    // Sorted history for list view
    const reviewHistory = useMemo(() => {
        // Explicitly cast to [string, ReviewData][] to avoid TS unknown errors
        const entries = Object.entries(data.reviews) as [string, ReviewData][];
        return entries
            .filter(([_, review]) => review.wins || review.challenges || review.focus) // Only show non-empty reviews
            .sort((a, b) => b[0].localeCompare(a[0]))
            .map(([date, review]) => ({ date, ...review }));
    }, [data.reviews]);

    const handleSave = () => {
        const newReview = { wins: localWins, challenges: localChallenges, focus: localFocus, rating: localRating };
        updateReview(weekKey, newReview);
        setSavedMessage('Review saved successfully!');
        setTimeout(() => setSavedMessage(''), 3000);
    };


    const navigateToReview = (dateStr: string) => {
        // Create date from YYYY-MM-DD string
        // Append time to ensure it doesn't shift due to timezone when parsing
        const date = new Date(dateStr + 'T12:00:00');
        onSelectDate(date);
        setShowHistory(false);
    };

    return (
        <div className="relative">
            <div className={`max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 ${!isPremium ? 'blur-md pointer-events-none select-none' : ''}`}>


                {/* Navigation Header */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start order-2 sm:order-1">
                        <button onClick={onPrevWeek} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500" disabled={showHistory}>
                            <ChevronLeft size={20} />
                        </button>
                        <div className="text-center sm:text-left">
                            <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                                {showHistory ? 'Review History' : `Week of ${weekKey}`}
                            </h2>
                            <span className="text-xs text-slate-500">
                                {showHistory ? 'All past reflections' : 'Reflect & Adapt'}
                            </span>
                        </div>
                        <button onClick={onNextWeek} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500" disabled={showHistory}>
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className={`order-1 sm:order-2 w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${showHistory ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200' : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50'}`}
                    >
                        {showHistory ? <CalendarDays size={18} /> : <History size={18} />}
                        {showHistory ? 'Current Review' : 'View History'}
                    </button>
                </div>

                {showHistory ? (
                    // --- History List View ---
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reviewHistory.length === 0 ? (
                            <div className="col-span-full py-16 text-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500">
                                <History size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No reviews found.</p>
                                <button
                                    onClick={() => setShowHistory(false)}
                                    className="mt-4 text-indigo-500 hover:underline text-sm"
                                >
                                    Start your first review
                                </button>
                            </div>
                        ) : (
                            reviewHistory.map((review) => (
                                <div
                                    key={review.date}
                                    onClick={() => navigateToReview(review.date)}
                                    className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-indigo-300 dark:hover:border-indigo-700/50"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                            <CalendarDays size={16} />
                                            <span className="font-semibold text-slate-700 dark:text-slate-200">{review.date}</span>
                                        </div>
                                        <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded text-xs font-bold text-green-700 dark:text-green-400">
                                            <span>{review.rating}</span>
                                            <Star size={10} fill="currentColor" />
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        {review.focus && (
                                            <div className="text-sm">
                                                <span className="text-xs text-slate-400 uppercase font-bold">Focus:</span>
                                                <p className="text-slate-600 dark:text-slate-300 line-clamp-1">{review.focus}</p>
                                            </div>
                                        )}
                                        {review.wins && (
                                            <div className="text-sm">
                                                <span className="text-xs text-slate-400 uppercase font-bold">Wins:</span>
                                                <p className="text-slate-600 dark:text-slate-300 line-clamp-2">{review.wins}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-end text-indigo-500 text-xs font-medium group-hover:translate-x-1 transition-transform">
                                        Read Review <ArrowRight size={12} className="ml-1" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    // --- Edit Form View ---
                    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    What went well this week? (Wins)
                                </label>
                                <textarea
                                    className="w-full h-32 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 focus:border-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400"
                                    placeholder="List your achievements..."
                                    value={localWins}
                                    onChange={(e) => setLocalWins(e.target.value)}

                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    What didn't go well? (Challenges)
                                </label>
                                <textarea
                                    className="w-full h-32 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 focus:border-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400"
                                    placeholder="Identify obstacles..."
                                    value={localChallenges}
                                    onChange={(e) => setLocalChallenges(e.target.value)}

                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Next Week's Focus
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 focus:border-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400"
                                    placeholder="One main goal..."
                                    value={localFocus}
                                    onChange={(e) => setLocalFocus(e.target.value)}

                                />
                            </div>

                            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="w-full sm:w-auto">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Weekly Rating (1-10)
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={localRating}
                                            onChange={(e) => setLocalRating(parseInt(e.target.value))}

                                            className="w-full sm:w-48 accent-green-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                                        />
                                        <span className="font-bold text-xl text-green-600 min-w-[1.5rem] text-center">{localRating}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                                    {savedMessage && <span className="text-green-600 text-sm animate-pulse">{savedMessage}</span>}
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors w-full sm:w-auto"
                                    >
                                        <Save size={18} />
                                        Save Review
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {!isPremium && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-slate-50/10 dark:bg-slate-950/10 backdrop-blur-[2px]">
                    <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6 animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/20">
                            <Star size={40} fill="currentColor" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Unlock Weekly Reviews</h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                Reflect on your progress and plan your success with our premium review tools.
                            </p>
                        </div>
                        <div className="space-y-4 pt-2">
                            <button
                                onClick={onNavigateToPricing}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 group"
                            >
                                Upgrade to Pro
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <p className="text-xs text-slate-400 font-medium">Join 500+ users tracking with Pro</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};