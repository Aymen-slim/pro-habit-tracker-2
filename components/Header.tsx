import React from 'react';
import { Habit } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeaderProps {
  habits: Habit[];
  currentDate: Date;
  daysInMonth: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ habits, currentDate, daysInMonth, onPrevMonth, onNextMonth }) => {
  // Calculate total goal based on each habit's individual goal setting
  const totalGoal = habits.reduce((acc, habit) => {
    // specific goal or default to days in month if 0/undefined
    return acc + (habit.goal || daysInMonth);
  }, 0);

  const completedCount = habits.reduce((acc, habit) => {
    return acc + Object.values(habit.completedDays).filter(Boolean).length;
  }, 0);

  const percentage = totalGoal > 0
    ? (completedCount / totalGoal) * 100
    : 0;

  // Cap visual width at 100% so it doesn't break layout
  const visualPercentage = Math.min(percentage, 100);

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  const fullDate = currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex flex-col xl:flex-row items-center justify-between gap-6 rounded-t-xl">
      {/* Date Navigation */}
      <div className="flex flex-col items-center xl:items-start">
        <div className="flex items-center gap-4">
          <button
            onClick={onPrevMonth}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {monthName} <span className="font-light text-slate-400">{year}</span>
          </h1>
          <button
            onClick={onNextMonth}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 pl-0 xl:pl-12">
          {fullDate}
        </div>
      </div>

      {/* Stats Area */}
      <div className="flex flex-wrap justify-center xl:justify-end items-center gap-8 md:gap-12 w-full xl:w-auto">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Number of habits</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white">{habits.length}</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Completed</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900 dark:text-white">{completedCount}</span>
            <span className="text-xs text-slate-400 font-medium">/ {totalGoal}</span>
          </div>
        </div>

        <div className="flex flex-col items-center min-w-[120px]">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 self-start">Progress</span>
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${visualPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Progress in %</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white">{percentage.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};