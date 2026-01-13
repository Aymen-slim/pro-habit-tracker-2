import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GlobalData, Habit, MentalState, Task, Note, ReviewData } from '../types';
import { INITIAL_HABITS } from '../constants';
import { supabase, globalRateLimiter } from '../supabase';
import { useToast } from '../components/Toast';
import { TaskSchema, HabitSchema, NoteSchema, ReviewDataSchema, MentalStateSchema } from '../utils/validation';

interface StorageContextType {
  data: GlobalData;
  isLoading: boolean;
  updateHabits: (monthKey: string, habits: Habit[]) => void;
  persistHabits: (monthKey: string, habits: Habit[]) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  updateMentalState: (monthKey: string, state: MentalState[]) => void;
  persistMentalState: (monthKey: string, state: MentalState[]) => Promise<void>;
  saveTask: (task: Task) => Promise<void>;
  saveTasks: (tasks: Task[]) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  updateNotes: (notes: Note[]) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  updateReview: (weekKey: string, review: ReviewData) => Promise<void>;
  wipeAllData: () => Promise<void>;
  upgradeUserTier: () => Promise<void>;
}

const defaultData: GlobalData = {
  monthlyData: {},
  tasks: [],
  notes: [],
  reviews: {},
  habitConfig: INITIAL_HABITS,
  userProfile: null
};

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (!context) throw new Error('useStorage must be used within a StorageProvider');
  return context;
};

const checkRateLimit = (showToast: (msg: string, type: 'error') => void) => {
  if (!globalRateLimiter.tryAcquire()) {
    showToast("You're doing that too fast! Please wait a moment.", "error");
    return false;
  }
  return true;
};

const handleSupabaseError = (error: any, showToast: (msg: string, type: 'error') => void) => {
  if (error.code === '429' || error.status === 429 || error.message?.includes('Too many requests')) {
    showToast("Server is busy (Rate Limit). Please pause for a moment.", "error");
  } else {
    // Optionally show other errors or just log them
    console.error("Supabase Operation Error:", error.message);
  }
};

const isValidUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<GlobalData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const fetchUserData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const fetchTable = async (table: string, column: string = 'user_id') => {
        const { data, error } = await supabase.from(table).select('*').eq(column, user.id);
        if (error) {
          console.warn(`Error fetching ${table}:`, error.message);
          return [];
        }
        return data || [];
      };

      const [habits, mental, tasks, notes, reviews, profiles] = await Promise.all([
        fetchTable('habits'),
        fetchTable('mental_state'),
        fetchTable('tasks'),
        fetchTable('notes'),
        fetchTable('reviews'),
        fetchTable('profiles', 'id')
      ]);

      const monthlyData: GlobalData['monthlyData'] = {};
      habits.forEach((h: any) => {
        if (!monthlyData[h.month_key]) monthlyData[h.month_key] = { habits: [], mentalState: [] };
        monthlyData[h.month_key].habits.push({
          id: h.id,
          name: h.name,
          icon: h.icon,
          goal: h.goal,
          completedDays: h.completed_days
        });
      });

      mental.forEach((m: any) => {
        if (!monthlyData[m.month_key]) monthlyData[m.month_key] = { habits: [], mentalState: [] };
        monthlyData[m.month_key].mentalState.push({
          day: m.day,
          mood: m.mood,
          motivation: m.motivation
        });
      });

      const reviewMap: Record<string, ReviewData> = {};
      reviews.forEach((r: any) => {
        reviewMap[r.week_key] = {
          wins: r.wins,
          challenges: r.challenges,
          focus: r.focus,
          rating: r.rating
        };
      });

      setData({
        monthlyData,
        tasks: tasks.map((t: any) => ({ id: t.id, text: t.text, completed: t.completed, date: t.date })),
        notes: notes.map((n: any) => ({ id: n.id, title: n.title, content: n.content, createdAt: n.created_at })),
        reviews: reviewMap,
        habitConfig: INITIAL_HABITS,
        userProfile: profiles[0] ? { id: profiles[0].id, tier: profiles[0].tier } : { id: user.id, tier: 'basic' }
      });
    } catch (error) {
      console.error('Fatal data synchronization error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const updateHabits = (monthKey: string, habits: Habit[]) => {
    setData(prev => ({
      ...prev,
      monthlyData: {
        ...prev.monthlyData,
        [monthKey]: {
          ...(prev.monthlyData[monthKey] || { mentalState: [] }),
          habits
        }
      }
    }));
  };

  const persistHabits = async (monthKey: string, habits: Habit[]) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    for (const habit of habits) {
      const result = HabitSchema.safeParse(habit);
      if (!result.success) {
        showToast(result.error.issues[0].message, 'error');
        return;
      }
    }

    if (!checkRateLimit(showToast)) return;

    // Separate new habits from existing ones
    const existingHabits = habits.filter(h => isValidUUID(h.id));
    const newHabits = habits.filter(h => !isValidUUID(h.id));

    const updatedHabits = [...habits];

    // Update existing habits
    if (existingHabits.length > 0) {
      const upsertData = existingHabits.map(habit => ({
        id: habit.id,
        user_id: user.id,
        month_key: monthKey,
        name: habit.name,
        icon: habit.icon,
        goal: habit.goal,
        completed_days: habit.completedDays
      }));

      const { error } = await supabase
        .from('habits')
        .upsert(upsertData, { onConflict: 'id' });

      if (error) {
        handleSupabaseError(error, showToast);
        return;
      }
    }

    // Insert new habits (let Supabase generate IDs)
    if (newHabits.length > 0) {
      const insertData = newHabits.map(habit => ({
        user_id: user.id,
        month_key: monthKey,
        name: habit.name,
        icon: habit.icon,
        goal: habit.goal,
        completed_days: habit.completedDays
      }));

      const { data: savedHabits, error } = await supabase
        .from('habits')
        .insert(insertData)
        .select();

      if (error) {
        handleSupabaseError(error, showToast);
        return;
      }

      // Map saved habits back by matching name
      if (savedHabits) {
        for (const saved of savedHabits) {
          const idx = updatedHabits.findIndex(h => !isValidUUID(h.id) && h.name === saved.name);
          if (idx !== -1) {
            updatedHabits[idx] = { ...updatedHabits[idx], id: saved.id };
          }
        }
      }
    }

    // Update state with new IDs
    setData(prev => ({
      ...prev,
      monthlyData: {
        ...prev.monthlyData,
        [monthKey]: {
          ...(prev.monthlyData[monthKey] || { mentalState: [] }),
          habits: updatedHabits
        }
      }
    }));
  };

  const deleteHabit = async (habitId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !isValidUUID(habitId)) return;
    const { error } = await supabase.from('habits').delete().eq('id', habitId).eq('user_id', user.id);
    if (error) console.error("Error deleting habit:", error.message);
  };

  const updateMentalState = (monthKey: string, state: MentalState[]) => {
    setData(prev => ({
      ...prev,
      monthlyData: {
        ...prev.monthlyData,
        [monthKey]: {
          ...(prev.monthlyData[monthKey] || { habits: [] }),
          mentalState: state
        }
      }
    }));
  };

  const persistMentalState = async (monthKey: string, state: MentalState[]) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Only persist entries where at least one value has been set (mood or motivation > 0)
    // Values of 0 mean the user hasn't entered anything yet
    const entriesToPersist = state.filter(s => s.mood > 0 || s.motivation > 0);

    // If nothing to persist, return early
    if (entriesToPersist.length === 0) return;

    // For entries where only one value is set, default the other to 1 (minimum valid value)
    const normalizedEntries = entriesToPersist.map(s => ({
      ...s,
      mood: s.mood > 0 ? s.mood : 1,
      motivation: s.motivation > 0 ? s.motivation : 1
    }));

    for (const s of normalizedEntries) {
      const result = MentalStateSchema.safeParse(s);
      if (!result.success) {
        showToast(`Invalid mental state: ${result.error.issues[0].message}`, 'error');
        return;
      }
    }

    const upsertData = normalizedEntries.map(s => ({
      user_id: user.id,
      month_key: monthKey,
      day: s.day,
      mood: s.mood,
      motivation: s.motivation
    }));

    const { error } = await supabase
      .from('mental_state')
      .upsert(upsertData, { onConflict: 'user_id,month_key,day' });

    if (error) {
      console.error("Mental state batch sync error:", error.message);
    }
  };

  const saveTask = async (task: Task) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const validation = TaskSchema.safeParse(task);
    if (!validation.success) {
      showToast(validation.error.issues[0].message, 'error');
      return;
    }

    // Optimistic update
    setData(prev => {
      const existingIndex = prev.tasks.findIndex(t => t.id === task.id);
      let newTasks;
      if (existingIndex >= 0) {
        newTasks = [...prev.tasks];
        newTasks[existingIndex] = task;
      } else {
        newTasks = [...prev.tasks, task];
      }
      return { ...prev, tasks: newTasks };
    });

    if (!checkRateLimit(showToast)) return;

    const { data: savedTask, error } = await supabase.from('tasks').upsert({
      id: isValidUUID(task.id) ? task.id : undefined,
      user_id: user.id,
      text: task.text,
      completed: task.completed,
      date: task.date,
      "order": task.order ?? 0
    }).select().single();

    if (error) {
      handleSupabaseError(error, showToast);
    } else if (savedTask && !isValidUUID(task.id)) {
      // Update the temp ID with real ID
      setData(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.id === task.id ? { ...t, id: savedTask.id } : t)
      }));
    }
  };

  // Batch save multiple tasks with a single API call (used for reordering)
  const saveTasks = async (tasks: Task[]) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || tasks.length === 0) return;

    // Validate all tasks
    for (const task of tasks) {
      const validation = TaskSchema.safeParse(task);
      if (!validation.success) {
        showToast(validation.error.issues[0].message, 'error');
        return;
      }
    }

    // Optimistic update for all tasks
    setData(prev => {
      const newTasks = [...prev.tasks];
      for (const task of tasks) {
        const existingIndex = newTasks.findIndex(t => t.id === task.id);
        if (existingIndex >= 0) {
          newTasks[existingIndex] = task;
        } else {
          newTasks.push(task);
        }
      }
      return { ...prev, tasks: newTasks };
    });

    if (!checkRateLimit(showToast)) return;

    // Build upsert data for all tasks
    const upsertData = tasks.map(task => ({
      id: isValidUUID(task.id) ? task.id : undefined,
      user_id: user.id,
      text: task.text,
      completed: task.completed,
      date: task.date,
      "order": task.order ?? 0
    }));

    const { error } = await supabase.from('tasks').upsert(upsertData);

    if (error) {
      handleSupabaseError(error, showToast);
    }
  };


  const deleteTask = async (taskId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Optimistic update
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId)
    }));

    if (isValidUUID(taskId)) {
      if (!checkRateLimit(showToast)) return;
      const { error } = await supabase.from('tasks').delete().eq('id', taskId).eq('user_id', user.id);
      if (error) handleSupabaseError(error, showToast);
    }
  };

  const updateNotes = async (notes: Note[]) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Validate all notes first
    for (const n of notes) {
      const result = NoteSchema.safeParse(n);
      if (!result.success) {
        showToast(result.error.issues[0].message, 'error');
        return;
      }
    }

    setData(p => ({ ...p, notes }));
    const updatedNotes = [...notes];
    for (let i = 0; i < updatedNotes.length; i++) {
      const n = updatedNotes[i];
      const { data: savedNote, error } = await supabase.from('notes').upsert({
        id: isValidUUID(n.id) ? n.id : undefined,
        user_id: user.id,
        title: n.title,
        content: n.content
      }).select().single();

      if (error) {
        console.error("Note sync error:", error.message);
      } else if (savedNote && !isValidUUID(n.id)) {
        updatedNotes[i] = { ...n, id: savedNote.id };
      }
    }
    setData(p => ({ ...p, notes: updatedNotes }));
  };

  const deleteNote = async (noteId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !isValidUUID(noteId)) return;
    const { error } = await supabase.from('notes').delete().eq('id', noteId).eq('user_id', user.id);
    if (error) console.error("Error deleting note:", error.message);
  };

  const updateReview = async (weekKey: string, review: ReviewData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const validation = ReviewDataSchema.safeParse(review);
    if (!validation.success) {
      showToast(validation.error.issues[0].message, 'error');
      return;
    }

    setData(prev => ({ ...prev, reviews: { ...prev.reviews, [weekKey]: review } }));
    await supabase.from('reviews').upsert({
      user_id: user.id,
      week_key: weekKey,
      wins: review.wins,
      challenges: review.challenges,
      focus: review.focus,
      rating: review.rating
    }, { onConflict: 'user_id,week_key' });
  };

  const wipeAllData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Wipe all data rows in app tables
    const tables = ['habits', 'mental_state', 'tasks', 'notes', 'reviews'];
    for (const table of tables) {
      const { error } = await supabase.from(table).delete().eq('user_id', user.id);
      if (error) console.error(`Error wiping ${table}:`, error.message);
    }

    // 2. Attempt to delete the user account from Auth table via RPC
    const { error: rpcError } = await supabase.rpc('delete_user_account');

    if (rpcError) {
      console.error("Full account deletion failed via RPC:", rpcError.message);
      throw new Error("ACCOUNT_DELETE_RPC_FAILED");
    }

    // 3. Clear all local cache and state
    localStorage.removeItem('pro-tracker-last-backup');
    localStorage.removeItem('theme');
    setData(defaultData);
  };

  const upgradeUserTier = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const newProfile = { id: user.id, tier: 'premium' };

    // Optimistic update
    setData(prev => ({
      ...prev,
      userProfile: { ...prev.userProfile!, tier: 'premium' }
    }));

    const { error } = await supabase.from('profiles').upsert(newProfile);

    if (error) {
      console.error("Error upgrading user tier:", error.message);
      // Revert on error
      setData(prev => ({
        ...prev,
        userProfile: { ...prev.userProfile!, tier: 'basic' }
      }));
    }
  };

  return (
    <StorageContext.Provider value={{
      data,
      isLoading,
      updateHabits,
      persistHabits,
      deleteHabit,
      updateMentalState,
      persistMentalState,
      saveTask,
      saveTasks,
      deleteTask,
      updateNotes,
      deleteNote,
      updateReview,
      wipeAllData,
      upgradeUserTier
    }}>
      {children}
    </StorageContext.Provider>
  );
};