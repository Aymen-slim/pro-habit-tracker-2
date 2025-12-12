import React from 'react';
import { Habit, WeeklyGroup } from '../types';
import { HabitIcon } from './HabitIcon';
import { AnalysisChart } from './AnalysisChart';
import { Pencil, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface HabitGridProps {
  weeks: WeeklyGroup[];
  daysInMonth: number;
  habits: Habit[];
  onToggle: (habitId: string, day: number) => void;
  onEditHabit: (habit: Habit) => void;
  onAddHabit: () => void;
  onDeleteHabit: (habitId: string) => void;
  onMoveUp: (habitId: string) => void;
  onMoveDown: (habitId: string) => void;
}

export const HabitGrid: React.FC<HabitGridProps> = ({ weeks, daysInMonth, habits, onToggle, onEditHabit, onAddHabit, onDeleteHabit, onMoveUp, onMoveDown }) => {
  const allDays = weeks.flatMap(w => w.days);

  // --- Calculations for Bottom Summary Rows ---
  const statsPerDay = allDays.map(d => {
    let completed = 0;
    let total = 0;
    habits.forEach(h => {
      total++;
      if (h.completedDays[d.day]) completed++;
    });
    return {
      day: d.day,
      completed,
      notCompleted: total - completed,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  });

  const handleDeleteClick = (e: React.MouseEvent, habit: Habit) => {
    e.stopPropagation();
    onDeleteHabit(habit.id);
  };

  return (
    <div className="flex flex-col gap-4">

      {/* --- Main Table Container --- */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Scrollable Grid Area */}
        <div className="flex-grow overflow-x-auto shadow-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors duration-200">
          <table className="border-collapse w-full min-w-max">
            <thead>
              {/* Header Row 1: Week Groupings */}
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs uppercase">
                <th className="sticky left-0 z-20 bg-slate-200 dark:bg-slate-800 border-r border-b border-slate-300 dark:border-slate-700 p-3 min-w-[200px] text-left font-bold text-slate-700 dark:text-slate-200 h-10 flex items-center justify-between">
                  <span>My Habits</span>
                </th>
                {weeks.map((week, idx) => (
                  <th
                    key={idx}
                    colSpan={week.days.length}
                    className="border-r border-b border-slate-300 dark:border-slate-700 text-center font-medium bg-slate-100 dark:bg-slate-800 py-1"
                  >
                    {week.name}
                  </th>
                ))}
              </tr>

              {/* Header Row 2: Days */}
              <tr className="text-slate-500 dark:text-slate-400 text-xs">
                <th className="sticky left-0 z-20 bg-slate-200 dark:bg-slate-800 border-r border-b border-slate-300 dark:border-slate-700 p-2 text-left font-medium min-w-[200px]">
                  {/* Empty corner cell */}
                </th>
                {allDays.map((d) => (
                  <th
                    key={d.day}
                    className={`border-r border-b border-slate-300 dark:border-slate-700 min-w-[32px] w-8 h-8 text-center bg-slate-50 dark:bg-slate-800/50 ${d.isWeekend ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
                  >
                    <div className="font-medium text-slate-600 dark:text-slate-400">{d.label}</div>
                    <div className="font-light text-slate-400 dark:text-slate-500 text-[10px]">{d.day}</div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Habit Rows */}
              {habits.map((habit, idx) => (
                <tr key={habit.id} className={`hover:bg-blue-50 dark:hover:bg-slate-800/80 group transition-colors ${idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-800/30'}`}>
                  {/* Habit Name Column */}
                  <td className="sticky left-0 z-10 bg-slate-200 dark:bg-slate-800 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 transition-colors border-r border-b border-slate-300 dark:border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 h-9 group/cell relative">
                    <div className="flex items-center justify-between h-full">
                      <div className="flex items-center gap-2">
                        <HabitIcon iconKey={habit.icon} />
                        <span className="truncate max-w-[120px]">{habit.name}</span>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover/cell:opacity-100 transition-opacity">
                        <button
                          onClick={() => onMoveUp(habit.id)}
                          disabled={idx === 0}
                          className="p-1.5 hover:bg-slate-400/30 dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                          title="Move Up"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          onClick={() => onMoveDown(habit.id)}
                          disabled={idx === habits.length - 1}
                          className="p-1.5 hover:bg-slate-400/30 dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                          title="Move Down"
                        >
                          <ChevronDown size={14} />
                        </button>
                        <button
                          onClick={() => onEditHabit(habit)}
                          className="p-1.5 hover:bg-slate-400/30 dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-400 transition-colors"
                          title="Edit Habit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(e, habit)}
                          className="p-1.5 hover:bg-red-200 dark:hover:bg-red-900/50 rounded text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400 transition-colors"
                          title="Delete Habit"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Checkboxes */}
                  {allDays.map((d) => (
                    <td
                      key={d.day}
                      className={`border-r border-b border-slate-300 dark:border-slate-700 text-center p-0 h-9 relative ${d.isWeekend ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={!!habit.completedDays[d.day]}
                        onChange={() => onToggle(habit.id, d.day)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-slate-600 dark:text-blue-500 focus:ring-0 cursor-pointer accent-slate-600 dark:accent-blue-500 grayscale hover:grayscale-0 transition-all dark:bg-slate-800"
                      />
                    </td>
                  ))}
                </tr>
              ))}

              {/* Add New Habit Row */}
              <tr>
                <td
                  className="sticky left-0 z-10 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-r border-b border-slate-300 dark:border-slate-700 px-3 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 cursor-pointer transition-colors h-9"
                  onClick={onAddHabit}
                >
                  <div className="flex items-center gap-2">
                    <Plus size={14} />
                    <span>Add Habit</span>
                  </div>
                </td>
                <td colSpan={allDays.length} className="bg-slate-50/30 dark:bg-slate-800/20 border-b border-slate-300 dark:border-slate-700"></td>
              </tr>


              {/* --- Summary Stats Rows --- */}

              {/* Divider */}
              <tr><td colSpan={allDays.length + 1} className="h-4 bg-slate-100 dark:bg-slate-800 border-b border-t border-slate-300 dark:border-slate-700"></td></tr>

              {/* Progress % Row */}
              <tr className="bg-slate-200/50 dark:bg-slate-800/50">
                <td className="sticky left-0 z-10 bg-slate-300/80 dark:bg-slate-700/80 border-r border-b border-slate-300 dark:border-slate-700 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 text-right">Progress</td>
                {statsPerDay.map(s => (
                  <td key={s.day} className="border-r border-b border-slate-300 dark:border-slate-700 text-center text-[10px] text-slate-600 dark:text-slate-400 py-1">
                    {s.percent}%
                  </td>
                ))}
              </tr>

              {/* Done Count Row */}
              <tr className="bg-slate-200/50 dark:bg-slate-800/50">
                <td className="sticky left-0 z-10 bg-slate-300/80 dark:bg-slate-700/80 border-r border-b border-slate-300 dark:border-slate-700 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 text-right">Done</td>
                {statsPerDay.map(s => (
                  <td key={s.day} className="border-r border-b border-slate-300 dark:border-slate-700 text-center text-[10px] text-slate-600 dark:text-slate-400 py-1">
                    {s.completed}
                  </td>
                ))}
              </tr>

              {/* Not Done Count Row */}
              <tr className="bg-slate-200/50 dark:bg-slate-800/50">
                <td className="sticky left-0 z-10 bg-slate-300/80 dark:bg-slate-700/80 border-r border-b border-slate-300 dark:border-slate-700 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 text-right">Not Done</td>
                {statsPerDay.map(s => (
                  <td key={s.day} className="border-r border-b border-slate-300 dark:border-slate-700 text-center text-[10px] text-slate-600 dark:text-slate-400 py-1">
                    {s.notCompleted}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* --- Analysis Sidebar --- */}
        <div className="w-full lg:w-64 flex-shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-sm self-start hidden lg:block transition-colors duration-200">
          <div className="bg-slate-200 dark:bg-slate-700 p-3 border-b border-slate-300 dark:border-slate-600 text-center font-bold text-slate-700 dark:text-slate-200">Analysis</div>
          <div className="grid grid-cols-[1fr_1fr_2fr] gap-x-1 p-2 text-xs font-medium text-slate-500 dark:text-slate-400 border-b border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <div className="text-center">Goal</div>
            <div className="text-center">Actual</div>
            <div className="text-center">Progress</div>
          </div>
          {habits.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400 dark:text-slate-500 italic">No habits yet</div>
          ) : (
            habits.map((habit, idx) => {
              const actual = Object.values(habit.completedDays).filter(Boolean).length;
              const goal = habit.goal || daysInMonth;
              const rawProgress = (actual / goal) * 100;
              const visualProgress = Math.min(rawProgress, 100);

              return (
                <div key={habit.id} className={`grid grid-cols-[1fr_1fr_2fr] gap-x-2 p-2 items-center border-b border-slate-300 dark:border-slate-700 h-9 text-xs text-slate-700 dark:text-slate-300 ${idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-800'}`}>
                  <div className="text-center">{goal}</div>
                  <div className="text-center">{actual}</div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-sm overflow-hidden relative">
                    <div
                      className={`h-full ${rawProgress > 100 ? 'bg-green-600' : 'bg-green-400'}`}
                      style={{ width: `${visualProgress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })
          )}
          {/* Add spacer to align with bottom rows */}
          <div className="h-9 bg-slate-50 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 italic">
            ...
          </div>

          {/* Summary Stats Matching for Analysis Column */}
          <div className="h-4 bg-slate-100 dark:bg-slate-800 border-b border-t border-slate-300 dark:border-slate-700"></div>
          <div className="p-2 text-xs text-slate-400 dark:text-slate-500 italic text-center">
            Daily aggregates
          </div>
        </div>
      </div>

      {/* --- Progress Chart --- */}
      <div className="mt-2">
        <AnalysisChart
          data={statsPerDay}
          dataKeys={[{ key: 'percent', color: '#84cc16', fill: '#dcfce7' }]}
        />
      </div>

    </div>
  );
};