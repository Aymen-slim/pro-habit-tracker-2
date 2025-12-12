import React from 'react';
import { MentalState, WeeklyGroup } from '../types';
import { AnalysisChart } from './AnalysisChart';

interface MentalStateTrackerProps {
  weeks: WeeklyGroup[];
  state: MentalState[];
  onUpdate: (day: number, field: 'mood' | 'motivation', value: number) => void;
}

export const MentalStateTracker: React.FC<MentalStateTrackerProps> = ({ weeks, state, onUpdate }) => {

  // Create a linear array of days matching the table structure
  const allDays = weeks.flatMap(w => w.days);

  const getMetric = (day: number) => state.find(s => s.day === day);

  const renderInputRow = (label: string, field: 'mood' | 'motivation') => (
    <tr className="h-8 hover:bg-slate-50 dark:hover:bg-slate-800/50">
      <td className="sticky left-0 bg-slate-200 dark:bg-slate-800 z-10 px-3 py-1 text-sm font-medium text-slate-700 dark:text-slate-300 border-r border-b border-slate-300 dark:border-slate-700 text-right min-w-[180px]">
        {label}
      </td>
      {allDays.map((d) => {
        const metric = getMetric(d.day);
        const val = metric ? metric[field] : 0;
        return (
          <td key={`${field}-${d.day}`} className="border-r border-b border-slate-300 dark:border-slate-700 p-0 text-center min-w-[32px]">
            <input
              type="number"
              min="0"
              max="10"
              value={val === 0 ? '' : val}
              onChange={(e) => onUpdate(d.day, field, parseInt(e.target.value) || 0)}
              className="w-full h-full text-center text-xs bg-transparent focus:outline-none focus:bg-blue-50 dark:focus:bg-slate-700 text-slate-600 dark:text-slate-300 appearance-none"
              style={{ MozAppearance: 'textfield' }} // Hide spinners in Firefox
            />
          </td>
        );
      })}
    </tr>
  );

  return (
    <div className="mt-8">
      <div className="bg-slate-300 dark:bg-slate-700 border border-slate-400 dark:border-slate-600 py-1 text-center text-sm font-semibold text-slate-700 dark:text-slate-200 mb-0">
        Mental State
      </div>
      <div className="overflow-x-auto border-l border-r border-slate-300 dark:border-slate-700">
        <table className="w-full border-collapse bg-white dark:bg-slate-900">
          <tbody>
            {renderInputRow("Mood", "mood")}
            {renderInputRow("Motivation", "motivation")}
            {/* Day numbers row */}
            <tr className="h-6">
              <td className="sticky left-0 bg-slate-100 dark:bg-slate-700 z-10 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 border-r border-b border-slate-300 dark:border-slate-700 text-right min-w-[180px]">
                Day
              </td>
              {allDays.map((d) => (
                <td key={`day-${d.day}`} className="border-r border-b border-slate-300 dark:border-slate-700 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 min-w-[32px] bg-slate-50 dark:bg-slate-800/50">
                  {d.day}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <AnalysisChart
          data={state}
          dataKeys={[
            { key: 'mood', color: '#ec4899', fill: '#fce7f3' }, // Pink
            { key: 'motivation', color: '#d946ef', fill: '#fae8ff' } // Purple/Pink
          ]}
        />
      </div>
    </div>
  );
};