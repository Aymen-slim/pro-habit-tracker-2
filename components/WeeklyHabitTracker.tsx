import React from 'react';
import { Habit } from '../types';
import { Check, Trophy } from 'lucide-react';

interface WeeklyHabitTrackerProps {
    habits: Habit[];
    weekDates: Date[];
    onToggle: (habitId: string, date: Date) => void;
}

export const WeeklyHabitTracker: React.FC<WeeklyHabitTrackerProps> = ({ habits, weekDates, onToggle }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 h-full overflow-auto">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-700 dark:text-slate-200">Habit Tracker</h3>
            </div>

            <div className="w-full">
                {/* Header Row */}
                <div className="grid grid-cols-[2fr_repeat(7,1fr)_2fr] gap-2 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 text-center">
                    <div className="text-left pl-2">Habit</div>
                    {weekDates.map((date, i) => (
                        <div key={i}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    ))}
                    <div>Progress</div>
                </div>

                {/* Habit Rows */}
                <div className="space-y-2">
                    {habits.map(habit => {
                        const completedCount = weekDates.filter(date => {
                            const dayNum = date.getDate(); // Simplified: assuming habits track by day number within month for now, or we need a better key
                            // The current habit system uses day number (1-31). 
                            // We need to map the week date to that.
                            return habit.completedDays[dayNum];
                        }).length;

                        const progress = Math.round((completedCount / 7) * 100);

                        return (
                            <div key={habit.id} className="grid grid-cols-[2fr_repeat(7,1fr)_2fr] gap-2 items-center text-sm">
                                <div className="text-slate-700 dark:text-slate-300 font-medium truncate pl-2" title={habit.name}>
                                    {habit.name}
                                </div>

                                {weekDates.map((date, i) => {
                                    const dayNum = date.getDate();
                                    const isCompleted = !!habit.completedDays[dayNum];

                                    return (
                                        <div key={i} className="flex justify-center">
                                            <button
                                                onClick={() => onToggle(habit.id, date)}
                                                className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${isCompleted
                                                        ? 'bg-slate-600 text-white'
                                                        : 'bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'
                                                    }`}
                                            >
                                                {isCompleted && <Check size={12} strokeWidth={4} />}
                                            </button>
                                        </div>
                                    );
                                })}

                                <div className="flex items-center gap-2 px-2">
                                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 rounded-full"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 w-8 text-right">{progress}%</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
