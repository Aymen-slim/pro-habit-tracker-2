import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { WeeklyPlanner } from './components/WeeklyPlanner';
import { WeeklyReview } from './components/WeeklyReview';
import { Login } from './components/Login';
import { LayoutGrid, Calendar, ClipboardList, LogOut } from 'lucide-react'; // Added LogOut
import { INITIAL_HABITS } from './constants';
import { Habit } from './types';

const STORAGE_KEY = 'pro-habit-tracker-data';
// Simple password protection. In a real app, use a proper auth system.
// You can change this password or use an environment variable (VITE_APP_PASSWORD)
const APP_PASSWORD = import.meta.env.VITE_APP_PASSWORD || 'HabitTracker2025!';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user is already authenticated in this session
    return sessionStorage.getItem('is_authenticated') === 'true';
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'monthly' | 'weekly' | 'review'>('monthly');

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const handleLogin = (password: string) => {
    if (password === APP_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('is_authenticated', 'true');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('is_authenticated');
  };

  // Shared Habit State (lifted from Dashboard to share with WeeklyPlanner)
  // Note: For a full refactor, we should move the complex habit logic from Dashboard to here or a Context.
  // For now, to minimize risk, we will keep the main logic in Dashboard but allow WeeklyPlanner to access
  // the habits via a shared state or just let Dashboard handle the source of truth if we only render one at a time.
  // BUT, if we unmount Dashboard, we lose the state if it's local to Dashboard.
  // The Dashboard component initializes state from localStorage.
  // If we switch views, Dashboard unmounts and remounts.
  // This is fine as long as it saves to localStorage.
  // However, WeeklyPlanner needs to read the habits.
  // We should probably lift the habits reading logic to App, or just duplicate the read for WeeklyPlanner.
  // Given the constraint of "adding a page" and not "refactoring the entire app", 
  // I will let WeeklyPlanner read from the same localStorage key or pass a callback to Dashboard?
  // No, Dashboard has the complex logic.
  // Let's try to keep both mounted or lift the state.
  // Lifting state is safer.

  // Actually, to avoid a massive refactor of Dashboard (which has 300+ lines of logic), 
  // I will implement a simpler approach:
  // WeeklyPlanner will read the habits from localStorage itself for read-only/toggle purposes.
  // Since both components sync to localStorage, it should be okay.
  // The only issue is if we modify in WeeklyPlanner, Dashboard needs to know.
  // If we unmount Dashboard, it will reload from storage on mount. So that works!
  // If we keep Dashboard mounted (hidden), we need to sync.
  // Let's unmount/remount for simplicity.

  // We need to pass habits to WeeklyPlanner.
  // We can duplicate the "load habits" logic in WeeklyPlanner or just pass a fresh read.
  // Let's do a fresh read in WeeklyPlanner for now (it accepts `habits` prop in my design, but I can change it to load internally or pass from App).
  // I defined WeeklyPlanner to take `habits` as a prop.
  // So I should load them here in App or change WeeklyPlanner to load them.
  // Let's change WeeklyPlanner to load them internally if not provided, OR load them in App.
  // Loading in App is better.

  const [habits, setHabits] = useState<Habit[]>([]);

  // Effect to load habits for WeeklyPlanner when view changes to weekly
  useEffect(() => {
    if (view === 'weekly') {
      const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
      const savedData = localStorage.getItem(`${STORAGE_KEY}-habits-${monthKey}`);
      if (savedData) {
        setHabits(JSON.parse(savedData));
      } else {
        // Fallback or try previous months (simplified for now)
        setHabits(INITIAL_HABITS.map((h, idx) => ({ ...h, order: idx, completedDays: {} })));
      }
    }
  }, [view, currentDate]);

  const handleToggleHabitFromWeekly = (habitId: string, day: number) => {
    // Update local state
    const newHabits = habits.map(h => {
      if (h.id !== habitId) return h;
      const newCompleted = { ...h.completedDays };
      if (newCompleted[day]) delete newCompleted[day];
      else newCompleted[day] = true;
      return { ...h, completedDays: newCompleted };
    });
    setHabits(newHabits);

    // Persist immediately to share with Dashboard
    const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
    localStorage.setItem(`${STORAGE_KEY}-habits-${monthKey}`, JSON.stringify(newHabits));
  };


  // Apply theme class to HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  // Use a key to force full remount when month changes
  const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 font-sans transition-colors duration-200">

      {/* View Switcher and Logout */}
      <div className="max-w-[1400px] mx-auto mb-6 flex justify-end gap-4">
        <div className="bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-1 shadow-sm">
          <button
            onClick={() => setView('monthly')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'monthly'
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
          >
            <LayoutGrid size={16} />
            Monthly
          </button>
          <button
            onClick={() => setView('weekly')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'weekly'
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
          >
            <Calendar size={16} />
            Weekly
          </button>
          <button
            onClick={() => setView('review')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'review'
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
          >
            <ClipboardList size={16} />
            Review
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900 transition-colors shadow-sm"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>

      {view === 'monthly' && (
        <Dashboard
          key={monthKey}
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
      )}

      {view === 'weekly' && (
        <div className="max-w-[1400px] mx-auto">
          <WeeklyPlanner
            habits={habits}
            onToggleHabit={handleToggleHabitFromWeekly}
          />
        </div>
      )}

      {view === 'review' && (
        <div className="max-w-[1400px] mx-auto">
          <WeeklyReview />
        </div>
      )}
    </div>
  );
}