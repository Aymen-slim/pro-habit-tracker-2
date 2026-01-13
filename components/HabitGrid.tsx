import React from 'react';
import { Habit, WeeklyGroup } from '../types';
import { HabitIcon } from './HabitIcon';
import { Pencil, Plus, Trash2, Check, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface HabitGridProps {
  weeks: WeeklyGroup[];
  daysInMonth: number;
  habits: Habit[];
  currentDate: Date;
  onToggle: (habitId: string, day: number) => void;
  onEditHabit: (habit: Habit) => void;
  onAddHabit: () => void;
  onDeleteHabit: (habitId: string) => void;
  onReorderHabits: (activeId: string, overId: string) => void;
  isPremium: boolean;
}

interface SortableHabitRowProps {
  habit: Habit;
  idx: number;
  allDays: any[];
  onToggle: (habitId: string, day: number) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
}

const SortableHabitRow: React.FC<SortableHabitRowProps> = ({ habit, allDays, onToggle, onEditHabit, onDeleteHabit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: habit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    position: 'relative' as const,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDeleteClick = (e: React.MouseEvent, habitId: string) => {
    e.stopPropagation();
    onDeleteHabit(habitId);
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`group h-9 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${isDragging ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''}`}
    >
      <td className="sticky left-0 z-20 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 px-3 py-1 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/80">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <GripVertical size={14} />
            </div>
            <HabitIcon iconKey={habit.icon} />
            <span className="font-bold text-slate-700 dark:text-slate-200 truncate max-w-[100px]">
              {habit.name}
            </span>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
            <button onClick={() => onEditHabit(habit)} className="p-1 text-slate-400 hover:text-blue-500 transition-colors"><Pencil size={12} /></button>
            <button onClick={(e) => handleDeleteClick(e, habit.id)} className="p-1 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
          </div>
        </div>
      </td>

      {allDays.map((d) => {
        const done = !!habit.completedDays[d.day];
        return (
          <td
            key={d.day}
            onClick={() => onToggle(habit.id, d.day)}
            className={`border-r border-slate-200 dark:border-slate-800 text-center p-0 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors
              ${d.isWeekend ? 'bg-slate-50/40 dark:bg-slate-800/20' : ''}
              `}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${done ? 'bg-slate-700 dark:bg-slate-300' : 'bg-slate-200/50 dark:bg-slate-700/50 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>
                {done && <Check size={12} className="text-white dark:text-slate-900" />}
              </div>
            </div>
          </td>
        );
      })}
    </tr>
  );
};

export const HabitGrid: React.FC<HabitGridProps> = ({ weeks, daysInMonth, habits, currentDate, onToggle, onEditHabit, onAddHabit, onDeleteHabit, onReorderHabits, isPremium }) => {
  const allDays = weeks.flatMap(w => w.days);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorderHabits(active.id as string, over.id as string);
    }
  };

  const today = new Date();
  const isCurrentMonthView = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();
  const todayDay = today.getDate();
  const habitLimit = isPremium ? 15 : 5;
  const isAtHabitLimit = habits.length >= habitLimit;

  const statsPerDay = allDays.map(d => {
    let done = 0;
    habits.forEach(h => {
      if (h.completedDays[d.day]) done++;
    });
    const total = habits.length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    return { day: d.day, done, notDone: total - done, percent };
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <div className="flex-grow w-full overflow-hidden border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 shadow-sm">
        <div className="overflow-x-auto scrollbar-thin">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <table className="border-collapse w-full min-w-max text-[11px] font-sans">
              <thead>
                <tr className="bg-slate-100/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <th className="sticky left-0 z-30 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-800 p-3 min-w-[180px] text-left">
                    MY HABITS
                  </th>
                  {weeks.map((week, idx) => (
                    <th key={idx} colSpan={week.days.length} className="border-r border-slate-200 dark:border-slate-800 py-2 text-center">
                      {week.name}
                    </th>
                  ))}
                </tr>

                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
                  <th className="sticky left-0 z-30 bg-inherit border-r border-slate-200 dark:border-slate-800 p-2 min-w-[180px]"></th>
                  {allDays.map((d) => {
                    const isToday = isCurrentMonthView && d.day === todayDay;
                    return (
                      <th
                        key={d.day}
                        className={`border-r border-slate-200 dark:border-slate-800 min-w-[32px] py-1 text-center transition-colors
                          ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-slate-400'}
                          `}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] font-medium opacity-80">{d.label}</span>
                          <span className="text-[10px] font-bold">{d.day}</span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <SortableContext items={habits.map(h => h.id)} strategy={verticalListSortingStrategy}>
                  {habits.map((habit, idx) => (
                    <SortableHabitRow
                      key={habit.id}
                      habit={habit}
                      idx={idx}
                      allDays={allDays}
                      onToggle={onToggle}
                      onEditHabit={onEditHabit}
                      onDeleteHabit={onDeleteHabit}
                    />
                  ))}
                </SortableContext>

                <tr className="h-9">
                  <td
                    className={`sticky left-0 z-20 border-r border-slate-200 dark:border-slate-800 px-3 text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 group hover:text-indigo-600 dark:hover:text-indigo-400 h-full bg-white dark:bg-slate-900 ${isAtHabitLimit ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={onAddHabit}
                  >
                    <Plus size={14} className="group-hover:scale-110 transition-transform" />
                    <span>Add Habit</span>
                  </td>
                  <td colSpan={allDays.length} className="bg-slate-50/20 dark:bg-slate-800/10"></td>
                </tr>
              </tbody>

              <tfoot className="border-t-2 border-slate-200 dark:border-slate-800 bg-slate-100/30 dark:bg-slate-800/30 font-bold text-slate-600 dark:text-slate-300">
                <tr className="h-8">
                  <td className="sticky left-0 z-20 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-800 px-3 text-right uppercase text-[9px]">Progress</td>
                  {statsPerDay.map(s => (
                    <td key={s.day} className="border-r border-slate-200 dark:border-slate-800 text-center text-[10px]">
                      {s.percent}%
                    </td>
                  ))}
                </tr>
                <tr className="h-8">
                  <td className="sticky left-0 z-20 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-800 px-3 text-right uppercase text-[9px]">Done</td>
                  {statsPerDay.map(s => (
                    <td key={s.day} className="border-r border-slate-200 dark:border-slate-800 text-center text-[10px]">
                      {s.done}
                    </td>
                  ))}
                </tr>
                <tr className="h-8 border-b border-slate-200 dark:border-slate-800">
                  <td className="sticky left-0 z-20 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-800 px-3 text-right uppercase text-[9px]">Not Done</td>
                  {statsPerDay.map(s => (
                    <td key={s.day} className="border-r border-slate-200 dark:border-slate-800 text-center text-[10px]">
                      {s.notDone}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </DndContext>
        </div>
      </div>

      <div className="w-full lg:w-72 flex-shrink-0 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-[#e9ecf1] dark:bg-slate-900 shadow-sm flex flex-col">
        <div className="bg-[#f3f5f8] dark:bg-slate-800 p-3 text-center border-b border-slate-300 dark:border-slate-700">
          <h3 className="text-sm font-black text-[#5a6b82] dark:text-slate-200 tracking-tight">Analysis</h3>
        </div>

        <div className="grid grid-cols-[1fr_1fr_2fr] bg-white dark:bg-slate-900/50 p-2 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase text-center border-b border-slate-200 dark:border-slate-800">
          <div>Goal</div>
          <div>Actual</div>
          <div>Progress</div>
        </div>

        <div className="bg-white dark:bg-slate-900 flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
          {habits.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 italic">No habits to analyze</div>
          ) : (
            habits.map((habit) => {
              const actual = Object.values(habit.completedDays).filter(Boolean).length;
              const goal = habit.goal || daysInMonth;
              const progress = Math.min((actual / goal) * 100, 100);

              return (
                <div key={habit.id} className="grid grid-cols-[1fr_1fr_2fr] items-center h-10 px-1">
                  <div className="text-center text-[11px] font-medium text-slate-400">{goal}</div>
                  <div className="text-center text-[11px] font-bold text-slate-700 dark:text-slate-200">{actual}</div>
                  <div className="px-2">
                    <div className="w-full h-2.5 bg-[#f0f3f6] dark:bg-slate-800 rounded-sm overflow-hidden">
                      <div
                        className="h-full bg-[#2ecc71] rounded-sm transition-all duration-700"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-800 bg-[#f8f9fb] dark:bg-slate-800/40 text-center italic text-[10px] text-slate-400">
          Daily aggregates
        </div>
      </div>
    </div>
  );
};
