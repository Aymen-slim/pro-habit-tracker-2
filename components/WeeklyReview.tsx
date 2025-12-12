import React, { useState, useEffect } from 'react';
import { Save, History, ChevronRight } from 'lucide-react';

interface WeeklyReviewData {
    wins: string;
    challenges: string;
    nextFocus: string;
    rating: number;
}

const STORAGE_KEY = 'pro-habit-tracker-reviews';

export const WeeklyReview: React.FC = () => {
    const [currentDate] = useState(new Date());
    const currentWeekKey = `${currentDate.getFullYear()}-W${getWeekNumber(currentDate)}`;

    const [selectedWeekKey, setSelectedWeekKey] = useState(currentWeekKey);
    const [allReviews, setAllReviews] = useState<Record<string, WeeklyReviewData>>({});

    const [data, setData] = useState<WeeklyReviewData>({
        wins: '',
        challenges: '',
        nextFocus: '',
        rating: 5
    });

    const [saved, setSaved] = useState(false);

    // Load all reviews on mount
    useEffect(() => {
        const loadedReviews = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        setAllReviews(loadedReviews);

        // If data exists for the selected week, load it
        if (loadedReviews[selectedWeekKey]) {
            setData(loadedReviews[selectedWeekKey]);
        } else if (selectedWeekKey === currentWeekKey) {
            // Reset if it's the current week and no data exists yet
            setData({ wins: '', challenges: '', nextFocus: '', rating: 5 });
        }
    }, [selectedWeekKey, currentWeekKey]); // Reload when selection changes

    const handleSave = () => {
        const updatedReviews = { ...allReviews, [selectedWeekKey]: data };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReviews));
        setAllReviews(updatedReviews);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleSelectWeek = (key: string) => {
        setSelectedWeekKey(key);
    };

    const sortedReviewKeys = Object.keys(allReviews).sort((a, b) => {
        // Sort by year and week descending
        const [yearA, weekA] = a.split('-W').map(Number);
        const [yearB, weekB] = b.split('-W').map(Number);
        if (yearA !== yearB) return yearB - yearA;
        return weekB - weekA;
    });

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Weekly Review</h2>
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-sm font-medium">
                        Reflect & Adapt
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Sidebar: History */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-4 text-slate-700 dark:text-slate-200 font-semibold">
                            <History size={18} />
                            <h3>History</h3>
                        </div>

                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            {/* Always show Current Week option */}
                            <button
                                onClick={() => handleSelectWeek(currentWeekKey)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${selectedWeekKey === currentWeekKey
                                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-medium'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }`}
                            >
                                <div className="flex flex-col">
                                    <span>Current Week</span>
                                    <span className="text-[10px] opacity-70">{formatWeekKey(currentWeekKey)}</span>
                                </div>
                                {selectedWeekKey === currentWeekKey && <ChevronRight size={14} />}
                            </button>

                            <div className="h-px bg-slate-100 dark:bg-slate-700 my-2"></div>

                            {sortedReviewKeys.map(key => {
                                const isCurrent = key === currentWeekKey;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => handleSelectWeek(key)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${selectedWeekKey === key
                                                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-medium'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        <span>{formatWeekKey(key)} {isCurrent && '(Current)'}</span>
                                        {selectedWeekKey === key && <ChevronRight size={14} />}
                                    </button>
                                );
                            })}

                            {sortedReviewKeys.length === 0 && (
                                <div className="text-xs text-slate-400 italic px-3">No saved reviews yet</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content: Form */}
                <div className="lg:col-span-9">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">

                        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-4">
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                                {selectedWeekKey === currentWeekKey ? 'Current Week Review' : `Review for ${formatWeekKey(selectedWeekKey)}`}
                            </h3>
                            {selectedWeekKey !== currentWeekKey && (
                                <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-1 rounded">
                                    Read Only Mode (Editable)
                                </span>
                            )}
                        </div>

                        {/* Wins */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                What went well this week? (Wins)
                            </label>
                            <textarea
                                value={data.wins}
                                onChange={(e) => setData({ ...data, wins: e.target.value })}
                                className="w-full h-32 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-green-500 outline-none resize-none transition-all"
                                placeholder="I stuck to my workout routine..."
                            />
                        </div>

                        {/* Challenges */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                What didn't go well? (Challenges)
                            </label>
                            <textarea
                                value={data.challenges}
                                onChange={(e) => setData({ ...data, challenges: e.target.value })}
                                className="w-full h-32 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-green-500 outline-none resize-none transition-all"
                                placeholder="I skipped reading twice..."
                            />
                        </div>

                        {/* Next Focus */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Next Week's Focus
                            </label>
                            <input
                                type="text"
                                value={data.nextFocus}
                                onChange={(e) => setData({ ...data, nextFocus: e.target.value })}
                                className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                placeholder="Prioritize sleep..."
                            />
                        </div>

                        {/* Rating */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                            <div className="space-y-2 flex-1 mr-8">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    How do you feel about this week? (1-10)
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={data.rating}
                                        onChange={(e) => setData({ ...data, rating: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                                    />
                                    <span className="text-xl font-bold text-green-600 dark:text-green-400 w-8 text-center">
                                        {data.rating}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleSave}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-all ${saved ? 'bg-green-600' : 'bg-green-500 hover:bg-green-600 shadow-md hover:shadow-lg'
                                    }`}
                            >
                                <Save size={18} />
                                {saved ? 'Saved!' : 'Save Review'}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper to format week key
function formatWeekKey(key: string) {
    const [year, week] = key.split('-');
    return `Week ${week.replace('W', '')}, ${year}`;
}

// Helper to get ISO week number
function getWeekNumber(d: Date) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    var weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return weekNo;
}
