import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Header } from './Header';
import { HabitGrid } from './HabitGrid';
import { MentalStateTracker } from './MentalStateTracker';
import { INITIAL_HABITS, generateMonthData } from '../constants';
import { Habit, MentalState } from '../types';
import { Modal } from './Modal';
import { HabitForm } from './HabitForm';

const STORAGE_KEY = 'pro-habit-tracker-data';

interface DashboardProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ currentDate, onPrevMonth, onNextMonth, isDarkMode, onToggleTheme }) => {
  // Generate calendar data based on the passed date
  const { weeks, daysInMonth } = useMemo(() => generateMonthData(currentDate), [currentDate]);

  // Use a key specific to the month so data is organized by period
  const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;

  // --- State Initialization with Local Storage ---

  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      // 1. Try to load data specific to this month
      const savedData = localStorage.getItem(`${STORAGE_KEY}-habits-${monthKey}`);
      if (savedData) {
        const loadedHabits = JSON.parse(savedData);
        // Ensure order field exists for all habits
        return loadedHabits.map((h: Habit, idx: number) => ({
          ...h,
          order: h.order !== undefined ? h.order : idx
        }));
      }

      // 2. If no data for this month, search backward up to 12 months for the most recent data
      for (let i = 1; i <= 12; i++) {
        const searchDate = new Date(currentDate);
        searchDate.setMonth(searchDate.getMonth() - i);
        const searchMonthKey = `${searchDate.getFullYear()}-${searchDate.getMonth()}`;
        const searchMonthData = localStorage.getItem(`${STORAGE_KEY}-habits-${searchMonthKey}`);

        if (searchMonthData) {
          const foundHabits: Habit[] = JSON.parse(searchMonthData);
          // Return habits with their properties but reset completion for the new month
          return foundHabits.map((h, idx) => ({
            ...h,
            completedDays: {},
            order: h.order !== undefined ? h.order : idx
          }));
        }
      }

    } catch (error) {
      console.error("Failed to load habits from storage", error);
    }
    // Initialize INITIAL_HABITS with order
    return INITIAL_HABITS.map((h, idx) => ({ ...h, order: idx }));
  });

  // Initialize mental state, checking storage or creating fresh template
  const [mentalState, setMentalState] = useState<MentalState[]>(() => {
    const template = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      mood: 0,
      motivation: 0
    }));

    try {
      const savedData = localStorage.getItem(`${STORAGE_KEY}-mental-${monthKey}`);
      if (savedData) {
        const parsed: MentalState[] = JSON.parse(savedData);
        // Merge with template to ensure all days exist (protects against month length changes)
        return template.map(t => parsed.find(p => p.day === t.day) || t);
      }
    } catch (error) {
      console.error("Failed to load mental state", error);
    }
    return template;
  });

  // --- Persistence Effects ---

  useEffect(() => {
    // Only save habits for current or past months
    // Future months should always reload from the most recent past month
    const today = new Date();
    const currentMonthKey = `${today.getFullYear()}-${today.getMonth()}`;
    const thisMonthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;

    // Convert to timestamps for comparison
    const currentMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Only save if this month is not in the future
    if (thisMonthDate <= currentMonthDate) {
      localStorage.setItem(`${STORAGE_KEY}-habits-${monthKey}`, JSON.stringify(habits));
    }
  }, [habits, monthKey, currentDate]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}-mental-${monthKey}`, JSON.stringify(mentalState));
  }, [mentalState, monthKey]);

  // --- App Logic ---

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);

  const toggleHabit = useCallback((habitId: string, day: number) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;

      const newCompletedDays = { ...habit.completedDays };
      if (newCompletedDays[day]) {
        delete newCompletedDays[day];
      } else {
        newCompletedDays[day] = true;
      }

      return { ...habit, completedDays: newCompletedDays };
    }));
  }, []);

  const updateMentalState = useCallback((day: number, field: 'mood' | 'motivation', value: number) => {
    setMentalState(prev => prev.map(m => {
      if (m.day !== day) return m;
      return { ...m, [field]: value };
    }));
  }, []);

  // --- CRUD Handlers ---

  const handleAddHabitClick = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const handleEditHabitClick = (habit: Habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleSaveHabit = (name: string, icon: string, goal: number) => {
    if (editingHabit) {
      // Edit mode
      setHabits(prev => prev.map(h =>
        h.id === editingHabit.id ? { ...h, name, icon, goal } : h
      ));
    } else {
      // Add mode - assign highest order value
      const maxOrder = habits.length > 0 ? Math.max(...habits.map(h => h.order || 0)) : -1;
      const newHabit: Habit = {
        id: Date.now().toString(),
        name,
        icon,
        goal,
        completedDays: {},
        order: maxOrder + 1
      };
      setHabits(prev => [...prev, newHabit]);
    }
    setIsModalOpen(false);
    setEditingHabit(null);
  };

  const handleMoveHabitUp = useCallback((habitId: string) => {
    setHabits(prev => {
      const sortedHabits = [...prev].sort((a, b) => (a.order || 0) - (b.order || 0));
      const idx = sortedHabits.findIndex(h => h.id === habitId);

      if (idx <= 0) return prev; // Already at top or not found

      // Swap order values
      const newHabits = [...sortedHabits];
      const tempOrder = newHabits[idx].order || idx;
      newHabits[idx] = { ...newHabits[idx], order: newHabits[idx - 1].order || (idx - 1) };
      newHabits[idx - 1] = { ...newHabits[idx - 1], order: tempOrder };

      return newHabits;
    });
  }, []);

  const handleMoveHabitDown = useCallback((habitId: string) => {
    setHabits(prev => {
      const sortedHabits = [...prev].sort((a, b) => (a.order || 0) - (b.order || 0));
      const idx = sortedHabits.findIndex(h => h.id === habitId);

      if (idx < 0 || idx >= sortedHabits.length - 1) return prev; // Already at bottom or not found

      // Swap order values
      const newHabits = [...sortedHabits];
      const tempOrder = newHabits[idx].order || idx;
      newHabits[idx] = { ...newHabits[idx], order: newHabits[idx + 1].order || (idx + 1) };
      newHabits[idx + 1] = { ...newHabits[idx + 1], order: tempOrder };

      return newHabits;
    });
  }, []);

  const handleDeleteHabitRequest = (id: string) => {
    setIsModalOpen(false);
    setEditingHabit(null);
    setHabitToDelete(id);
  };

  const confirmDelete = () => {
    if (habitToDelete) {
      setHabits(prev => prev.filter(h => h.id !== habitToDelete));
      setHabitToDelete(null);
    }
  };

  const cancelDelete = () => {
    setHabitToDelete(null);
  };

  const habitToDeleteName = habits.find(h => h.id === habitToDelete)?.name;

  const handleResetData = () => {
    if (confirm('Are you sure you want to delete all saved data? This cannot be undone.')) {
      // Clear all localStorage keys related to the habit tracker
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('pro-habit-tracker-data')) {
          localStorage.removeItem(key);
        }
      });
      // Also clear theme preference if desired
      // localStorage.removeItem('theme');

      // Reload the page to reinitialize with fresh data
      window.location.reload();
    }
  };

  // Sort habits by order before rendering
  const sortedHabits = useMemo(
    () => [...habits].sort((a, b) => (a.order || 0) - (b.order || 0)),
    [habits]
  );

  return (
    <div className="max-w-[1400px] mx-auto bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-xl rounded-sm overflow-hidden transition-colors duration-200">

      {/* Top Header Section */}
      <Header
        habits={sortedHabits}
        currentDate={currentDate}
        daysInMonth={daysInMonth}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
        onResetData={handleResetData}
      />

      <div className="p-4 md:p-6 space-y-8">
        {/* Main Habit Grid & Analysis */}
        <HabitGrid
          weeks={weeks}
          daysInMonth={daysInMonth}
          habits={sortedHabits}
          onToggle={toggleHabit}
          onEditHabit={handleEditHabitClick}
          onAddHabit={handleAddHabitClick}
          onDeleteHabit={handleDeleteHabitRequest}
          onMoveUp={handleMoveHabitUp}
          onMoveDown={handleMoveHabitDown}
        />

        {/* Mental State Section */}
        <MentalStateTracker
          weeks={weeks}
          state={mentalState}
          onUpdate={updateMentalState}
        />
      </div>

      <div className="bg-white dark:bg-slate-900 border-t border-slate-300 dark:border-slate-800 p-4 text-center text-slate-500 dark:text-slate-400 text-xs">
        Pro Habit Tracker &bull; Built with React
      </div>

      {/* Add/Edit Modal */}
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

      {/* Delete Confirmation Modal */}
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
    </div>
  );
};