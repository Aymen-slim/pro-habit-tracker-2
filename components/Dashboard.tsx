import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Header } from './Header';
import { HabitGrid } from './HabitGrid';
import { MentalStateTracker } from './MentalStateTracker';
import { INITIAL_HABITS, generateMonthData } from '../constants';
import { Habit, MentalState } from '../types';
import { Modal } from './Modal';
import { HabitForm } from './HabitForm';
import { useStorage } from '../context/StorageContext';
import { AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { arrayMove } from '@dnd-kit/sortable';

interface DashboardProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onNavigateToPricing: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ currentDate, onPrevMonth, onNextMonth, isDarkMode, onToggleTheme, onNavigateToPricing }) => {
  const { data, updateHabits, persistHabits, deleteHabit, updateMentalState, persistMentalState, isLoading } = useStorage();
  const isPremium = data.userProfile?.tier === 'premium';
  const [isSyncing, setIsSyncing] = useState(false);
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mentalSyncTimerRef = useRef<NodeJS.Timeout | null>(null);
  const habitsRef = useRef<Habit[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const { weeks, daysInMonth } = useMemo(() => generateMonthData(currentDate), [currentDate]);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      if (mentalSyncTimerRef.current) clearTimeout(mentalSyncTimerRef.current);
    };
  }, []);
  const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;

  const habits = useMemo(() => {
    const monthData = data.monthlyData[monthKey];
    const currentHabits = (monthData && monthData.habits.length > 0)
      ? monthData.habits
      : data.habitConfig.map(h => ({ ...h, completedDays: {} }));

    habitsRef.current = currentHabits;
    return currentHabits;
  }, [data.monthlyData, data.habitConfig, monthKey]);

  const mentalState = useMemo(() => {
    const monthData = data.monthlyData[monthKey];
    const template = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      mood: 0,
      motivation: 0
    }));

    if (monthData && monthData.mentalState.length > 0) {
      return template.map(t => monthData.mentalState.find(p => p.day === t.day) || t);
    }
    return template;
  }, [data.monthlyData, monthKey, daysInMonth]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const toggleHabit = useCallback((habitId: string, day: number) => {
    const newHabits = habitsRef.current.map(habit => {
      if (habit.id !== habitId) return habit;

      const newCompletedDays = { ...habit.completedDays };
      if (newCompletedDays[day]) {
        delete newCompletedDays[day];
      } else {
        newCompletedDays[day] = true;
      }

      return { ...habit, completedDays: newCompletedDays };
    });

    // 1. Instant local update
    updateHabits(monthKey, newHabits);
    habitsRef.current = newHabits;

    // 2. Debounced Database Sync
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);

    setIsSyncing(true);
    syncTimerRef.current = setTimeout(async () => {
      await persistHabits(monthKey, habitsRef.current);
      setIsSyncing(false);
      syncTimerRef.current = null;
    }, 2000);
  }, [monthKey, updateHabits, persistHabits]);

  // Cleanup timer on unmount handled in mount useEffect above

  const handleUpdateMentalState = (day: number, field: 'mood' | 'motivation', value: number) => {
    const newState = mentalState.map(m => {
      if (m.day !== day) return m;
      return { ...m, [field]: value };
    });

    // 1. Instant local update
    updateMentalState(monthKey, newState);

    // 2. Debounced Database Sync
    if (mentalSyncTimerRef.current) clearTimeout(mentalSyncTimerRef.current);

    setIsSyncing(true);
    mentalSyncTimerRef.current = setTimeout(async () => {
      await persistMentalState(monthKey, newState);
      setIsSyncing(false);
      mentalSyncTimerRef.current = null;
    }, 2000);
  };

  const handleAddHabitClick = () => {
    const limit = isPremium ? 15 : 5;
    if (habits.length >= limit) {
      if (!isPremium) {
        setShowUpgradeModal(true);
      } else {
        setError(`You have reached the limit of ${limit} habits per month.`);
        setTimeout(() => setError(null), 3000);
      }
      return;
    }
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const handleEditHabitClick = (habit: Habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  async function handleSaveHabit(name: string, icon: string, goal: number) {
    let newHabits;
    if (editingHabit) {
      newHabits = habits.map(h =>
        h.id === editingHabit.id ? { ...h, name, icon, goal } : h
      );
    } else {
      if (habits.length >= 15) {
        setError('Limit reached: Maximum 15 habits allowed.');
        return;
      }
      const newHabit: Habit = {
        id: Date.now().toString(),
        name,
        icon,
        goal,
        completedDays: {}
      };
      newHabits = [...habits, newHabit];
    }
    updateHabits(monthKey, newHabits);
    await persistHabits(monthKey, newHabits);
    setIsModalOpen(false);
    setEditingHabit(null);
    setError(null);
  }

  const handleDeleteHabitRequest = (id: string) => {
    setIsModalOpen(false);
    setEditingHabit(null);
    setHabitToDelete(id);
  };

  async function confirmDelete() {
    if (habitToDelete) {
      const idToRemove = habitToDelete;
      const newHabits = habits.filter(h => h.id !== idToRemove);
      setHabitToDelete(null);
      await deleteHabit(idToRemove);
      await persistHabits(monthKey, newHabits);
    }
  }

  const cancelDelete = () => {
    setHabitToDelete(null);
  };

  async function handleReorderHabits(activeId: string, overId: string) {
    const oldIndex = habits.findIndex(h => h.id === activeId);
    const newIndex = habits.findIndex(h => h.id === overId);

    if (oldIndex !== newIndex) {
      const newHabits = arrayMove(habits, oldIndex, newIndex);
      updateHabits(monthKey, newHabits);
      await persistHabits(monthKey, newHabits);
    }
  }

  const habitToDeleteName = habits.find(h => h.id === habitToDelete)?.name;

  const performanceData = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      let completedCount = 0;
      habits.forEach(habit => {
        if (habit.completedDays[day]) completedCount++;
      });
      return {
        day,
        percent: habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0
      };
    });
  }, [habits, daysInMonth]);

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading data...</div>;
  }

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl transition-all duration-300 animate-in fade-in overflow-hidden">
      <Header
        habits={habits}
        currentDate={currentDate}
        daysInMonth={daysInMonth}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
      />

      {isSyncing && (
        <div className="absolute top-24 right-6 flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-full border border-indigo-100 dark:border-indigo-800 animate-pulse z-10">
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></div>
          SYNCING...
        </div>
      )}

      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="p-4 md:p-6 space-y-8">
        <HabitGrid
          weeks={weeks}
          daysInMonth={daysInMonth}
          habits={habits}
          currentDate={currentDate}
          onToggle={toggleHabit}
          onEditHabit={handleEditHabitClick}
          onAddHabit={handleAddHabitClick}
          onDeleteHabit={handleDeleteHabitRequest}
          onReorderHabits={handleReorderHabits}
          isPremium={isPremium}
        />

        {/* Daily Performance Trend Chart */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 mb-6 text-center uppercase tracking-[0.2em]">Daily Performance Trend (%)</h3>
          <div className="h-48 w-full relative" style={{ minHeight: '192px' }}>
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="monthlyPerformanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} opacity={0.5} />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fontWeight: 700, fill: isDarkMode ? '#64748b' : '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fontWeight: 700, fill: isDarkMode ? '#64748b' : '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                  />
                  <RechartsTooltip
                    cursor={{ stroke: '#22c55e', strokeWidth: 1, strokeDasharray: '4 4' }}
                    contentStyle={{
                      background: isDarkMode ? '#1e293b' : '#fff',
                      border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      color: isDarkMode ? '#f8fafc' : '#1e293b'
                    }}
                    labelStyle={{ color: isDarkMode ? '#94a3b8' : '#64748b', marginBottom: '4px' }}
                    itemStyle={{ color: '#22c55e' }}
                    formatter={(value: number) => [`${value}%`, 'Completion']}
                  />
                  <Area
                    type="monotone"
                    dataKey="percent"
                    stroke="#22c55e"
                    strokeWidth={3}
                    fill="url(#monthlyPerformanceGradient)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <MentalStateTracker
          weeks={weeks}
          state={mentalState}
          onUpdate={handleUpdateMentalState}
          isDarkMode={isDarkMode}
        />
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 p-4 text-center text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">
        Pro Habit Tracker &bull; Efficiency & Productivity
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingHabit ? 'Edit Habit' : 'Add New Habit'}
      >
        <HabitForm
          initialHabit={editingHabit}
          daysInMonth={daysInMonth}
          onSave={handleSaveHabit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={!!habitToDelete}
        onClose={cancelDelete}
        title="Delete Habit"
      >
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-300">
            Are you sure you want to delete <span className="font-semibold text-slate-800 dark:text-white">{habitToDeleteName}</span>?
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={cancelDelete}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Upgrade Your Account"
      >
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={32} />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold text-slate-900 dark:text-white">Habit Limit Reached</h4>
            <p className="text-slate-500 dark:text-slate-400">
              Basic accounts are limited to <span className="font-bold text-slate-900 dark:text-white">5 habits</span> per month. Upgrade to Pro for up to 15 habits and more features!
            </p>
          </div>
          <button
            onClick={() => {
              setShowUpgradeModal(false);
              onNavigateToPricing();
            }}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all"
          >
            Upgrade to Pro
          </button>
          <button
            onClick={() => setShowUpgradeModal(false)}
            className="text-sm font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </Modal>
    </div>
  );
};