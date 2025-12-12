import React from 'react';
import { Habit } from '../types';
import { ChevronLeft, ChevronRight, Sun, Moon, Trash2 } from 'lucide-react';

interface HeaderProps {
  habits: Habit[];
  currentDate: Date;
  daysInMonth: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({ habits, currentDate, daysInMonth, onPrevMonth, onNextMonth, isDarkMode, onToggleTheme, onResetData }) => {
  // Calculate total goal as sum of all habit goals
  const totalGoal = habits.reduce((acc, habit) => acc + habit.goal, 0);

  const completedCount = habits.reduce((acc, habit) => {
    return acc + Object.values(habit.completedDays).filter(Boolean).length;
  }, 0);

  const percentage = totalGoal > 0
    ? (completedCount / totalGoal) * 100
    : 0;

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  const formattedDate = currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-white dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 p-6 flex flex-col lg:flex-row items-center justify-between mb-6 shadow-sm gap-6 transition-colors duration-200">
      <div className="text-center lg:text-left">
        <div className="flex items-center gap-4 justify-center lg:justify-start">
          <button
            onClick={onPrevMonth}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            aria-label="Previous month"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-3xl font-semibold text-black dark:text-white tracking-tight min-w-[200px] text-center">{monthName} <span className="text-slate-500 dark:text-slate-400 font-light">{year}</span></h1>
          <button
            onClick={onNextMonth}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            aria-label="Next month"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium pl-0 lg:pl-16 text-center lg:text-left">{formattedDate}</div>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mt-4 lg:mt-0 text-sm md:text-base">
        <div className="flex flex-col items-center">
          <span className="text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">Number of habits</span>
          <span className="font-bold text-black dark:text-white text-lg">{habits.length}</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">Completed habits</span>
          <span className="font-bold text-black dark:text-white text-lg">{completedCount}</span>
        </div>

        <div className="flex flex-col items-center min-w-[150px]">
          <span className="text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider mb-1">Progress</span>
          <div className="w-full h-4 bg-gray-200 dark:bg-slate-700 rounded-sm overflow-hidden relative">
            <div
              className="h-full bg-green-500 transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">Progress in %</span>
          <span className="font-bold text-black dark:text-white text-lg">{percentage.toFixed(2)}%</span>
        </div>

        <div className="border-l border-slate-300 dark:border-slate-700 pl-8 ml-2 flex gap-2">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all shadow-sm"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={onResetData}
            className="p-2 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all shadow-sm"
            aria-label="Reset All Data"
            title="Clear all saved data"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};