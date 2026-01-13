import React, { useState, useEffect } from 'react';
import { MentalState, WeeklyGroup } from '../types';
import { AnalysisChart } from './AnalysisChart';

interface MentalStateTrackerProps {
  weeks: WeeklyGroup[];
  state: MentalState[];
  onUpdate: (day: number, field: 'mood' | 'motivation', value: number) => void;
  isDarkMode: boolean;
}

// Controlled input cell that saves on blur
const InputCell: React.FC<{
  value: number;
  day: number;
  field: 'mood' | 'motivation';
  isWeekend: boolean;
  onUpdate: (day: number, field: 'mood' | 'motivation', value: number) => void;
}> = ({ value, day, field, isWeekend, onUpdate }) => {
  const [localValue, setLocalValue] = useState(value === 0 ? '' : value.toString());

  // Sync local state when prop changes
  useEffect(() => {
    setLocalValue(value === 0 ? '' : value.toString());
  }, [value]);

  const handleBlur = () => {
    const numValue = parseInt(localValue) || 0;
    if (numValue !== value) {
      onUpdate(day, field, numValue);
    }
  };

  return (
    <td
      className={`border-r border-b border-slate-200 dark:border-slate-700 p-0 text-center min-w-[34px] ${isWeekend ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}`}
    >
      <input
        type="number"
        min="0"
        max="10"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        className="w-full h-full text-center text-xs bg-transparent focus:outline-none focus:bg-indigo-50 dark:focus:bg-indigo-900/20 text-slate-800 dark:text-slate-100 appearance-none p-0"
        style={{ MozAppearance: 'textfield' }}
      />
    </td>
  );
};

export const MentalStateTracker: React.FC<MentalStateTrackerProps> = ({ weeks, state, onUpdate, isDarkMode }) => {
  const allDays = weeks.flatMap(w => w.days);
  const getMetric = (day: number) => state.find(s => s.day === day);

  const renderInputRow = (label: string, field: 'mood' | 'motivation') => (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors h-9">
      <td className="sticky left-0 bg-slate-50 dark:bg-slate-800 z-10 px-3 text-xs font-bold text-slate-600 dark:text-slate-400 border-r border-b border-slate-200 dark:border-slate-700 min-w-[120px]">
        {label}
      </td>
      {allDays.map((d) => {
        const metric = getMetric(d.day);
        const val = metric ? metric[field] : 0;
        return (
          <InputCell
            key={`${field}-${d.day}`}
            value={val}
            day={d.day}
            field={field}
            isWeekend={d.isWeekend}
            onUpdate={onUpdate}
          />
        );
      })}
    </tr>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Tracker Table */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900">
        <div className="bg-slate-200/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 py-1.5 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Mental State Tracker
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-bold border-b border-slate-200 dark:border-slate-700">
                <th className="sticky left-0 z-10 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 px-3 py-2 min-w-[120px] text-left">Day</th>
                {allDays.map((d) => (
                  <th
                    key={d.day}
                    className={`border-r border-slate-200 dark:border-slate-700 px-1 min-w-[34px] text-center ${d.isWeekend ? 'bg-slate-100/50 dark:bg-slate-800/50' : ''}`}
                  >
                    {d.day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {renderInputRow("Mood (1-10)", "mood")}
              {renderInputRow("Motivation (1-10)", "motivation")}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visualization Chart */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#0f172a] shadow-sm transition-all duration-300">
        <div className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 py-2.5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Mental State Visualization
        </div>
        <div className="p-1">
          <AnalysisChart
            data={state}
            isDarkMode={isDarkMode}
            dataKeys={[
              { key: 'mood', color: '#ff4b91', fill: 'url(#colorMood)' },
              { key: 'motivation', color: '#a855f7', fill: 'url(#colorMotivation)' }
            ]}
          />
        </div>
      </div>
    </div>
  );
};