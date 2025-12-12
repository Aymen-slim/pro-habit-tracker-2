import React, { useState, useEffect, useMemo } from 'react';
import { Habit, Task } from '../types';
import { WeeklyProgress } from './WeeklyProgress';
import { WeeklyHabitTracker } from './WeeklyHabitTracker';
import { DayColumn } from './DayColumn';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeeklyPlannerProps {
    habits: Habit[];
    onToggleHabit: (habitId: string, day: number) => void;
}

const STORAGE_KEY = 'pro-habit-tracker-tasks';

export const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({ habits, onToggleHabit }) => {
    // State for current week view - default to current week's Sunday (or Monday based on pref, using Sunday for now as per image)
    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        const d = new Date();
        const day = d.getDay();
        const diff = d.getDate() - day; // Adjust when day is Sunday
        return new Date(d.setDate(diff));
    });

    // State for tasks
    const [tasks, setTasks] = useState<Task[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to load tasks", e);
            return [];
        }
    });

    // Persist tasks
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks]);

    // Generate the 7 days of the current week
    const weekDates = useMemo(() => {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(currentWeekStart);
            d.setDate(d.getDate() + i);
            dates.push(d);
        }
        return dates;
    }, [currentWeekStart]);

    // Navigation
    const handlePrevWeek = () => {
        setCurrentWeekStart(prev => {
            const d = new Date(prev);
            d.setDate(d.getDate() - 7);
            return d;
        });
    };

    const handleNextWeek = () => {
        setCurrentWeekStart(prev => {
            const d = new Date(prev);
            d.setDate(d.getDate() + 7);
            return d;
        });
    };

    // Task Handlers
    const handleAddTask = (text: string, date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        const dayTasks = tasks.filter(t => t.date === dateStr);
        // Find max order to append to end
        const maxOrder = dayTasks.length > 0 ? Math.max(...dayTasks.map(t => t.order || 0)) : -1;

        const newTask: Task = {
            id: Date.now().toString(),
            text,
            completed: false,
            date: dateStr,
            order: maxOrder + 1
        };
        setTasks(prev => [...prev, newTask]);
    };

    const handleToggleTask = (taskId: string) => {
        setTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
        ));
    };

    const handleDeleteTask = (taskId: string) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
    };

    const handleEditTask = (taskId: string, newText: string) => {
        setTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, text: newText } : t
        ));
    };

    const handleMoveTask = (taskId: string, direction: 'up' | 'down') => {
        setTasks(prev => {
            const task = prev.find(t => t.id === taskId);
            if (!task) return prev;

            const dateStr = task.date;
            // Get all tasks for this day, sorted by order
            const dayTasks = prev
                .filter(t => t.date === dateStr)
                .sort((a, b) => (a.order || 0) - (b.order || 0));

            const currentIndex = dayTasks.findIndex(t => t.id === taskId);
            if (currentIndex === -1) return prev;

            let swapTask: Task | undefined;

            if (direction === 'up' && currentIndex > 0) {
                swapTask = dayTasks[currentIndex - 1];
            } else if (direction === 'down' && currentIndex < dayTasks.length - 1) {
                swapTask = dayTasks[currentIndex + 1];
            }

            if (swapTask) {
                const taskOrder = task.order || 0;
                const swapOrder = swapTask.order || 0;

                // If orders are same (e.g. both 0 from legacy), force re-index
                if (taskOrder === swapOrder) {
                    return prev.map(t => {
                        if (t.date !== dateStr) return t;
                        // Re-assign all orders for this day based on current array index, but swapping the target two
                        const idx = dayTasks.findIndex(dt => dt.id === t.id);
                        let newOrder = idx;
                        if (t.id === task.id) newOrder = direction === 'up' ? idx - 1 : idx + 1;
                        if (t.id === swapTask!.id) newOrder = direction === 'up' ? idx + 1 : idx - 1;
                        return { ...t, order: newOrder };
                    });
                }

                return prev.map(t => {
                    if (t.id === taskId) return { ...t, order: swapOrder };
                    if (t.id === swapTask!.id) return { ...t, order: taskOrder };
                    return t;
                });
            }

            return prev;
        });
    };

    // Derived Data for Charts
    const progressData = weekDates.map(date => {
        const dateStr = date.toISOString().split('T')[0];
        const dayTasks = tasks.filter(t => t.date === dateStr);
        return {
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            completed: dayTasks.filter(t => t.completed).length,
            total: dayTasks.length
        };
    });

    // Habit Toggle Wrapper
    const handleHabitToggleWrapper = (habitId: string, date: Date) => {
        onToggleHabit(habitId, date.getDate());
    };

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Top Section: Header + Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Header / Quote Box */}
                <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white leading-tight">
                            Inspiration comes only during work.
                        </h1>
                    </div>

                    <div className="mt-8">
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                            Start of the week
                        </div>
                        <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-700 rounded-lg p-2">
                            <button onClick={handlePrevWeek} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded">
                                <ChevronLeft size={20} className="text-slate-600 dark:text-slate-300" />
                            </button>
                            <span className="font-bold text-slate-700 dark:text-slate-200">
                                {currentWeekStart.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </span>
                            <button onClick={handleNextWeek} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded">
                                <ChevronRight size={20} className="text-slate-600 dark:text-slate-300" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Overall Progress Chart */}
                <div className="lg:col-span-4 h-64 lg:h-auto">
                    <WeeklyProgress data={progressData} />
                </div>

                {/* Weekly Habit Tracker */}
                <div className="lg:col-span-5 h-64 lg:h-auto">
                    <WeeklyHabitTracker
                        habits={habits}
                        weekDates={weekDates}
                        onToggle={handleHabitToggleWrapper}
                    />
                </div>
            </div>

            {/* Main Grid: Days */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 h-auto lg:h-[600px]">
                {weekDates.map((date, i) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const dayTasks = tasks
                        .filter(t => t.date === dateStr)
                        .sort((a, b) => (a.order || 0) - (b.order || 0));

                    return (
                        <div key={i} className="h-full">
                            <DayColumn
                                date={date}
                                tasks={dayTasks}
                                onAddTask={handleAddTask}
                                onToggleTask={handleToggleTask}
                                onDeleteTask={handleDeleteTask}
                                onEditTask={handleEditTask}
                                onMoveTask={handleMoveTask}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
