import React, { useMemo, useState } from 'react';
import { Task } from '../types';
import { Check, X, ChevronLeft, ChevronRight, Pencil, Calendar, ArrowRight, GripVertical } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, YAxis, CartesianGrid } from 'recharts';
import { useStorage } from '../context/StorageContext';
import { HabitIcon } from './HabitIcon';
import { DndContext, DragOverlay, closestCenter, useSensor, useSensors, PointerSensor, useDroppable, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface WeeklyPlannerProps {
    currentDate: Date;
    onPrevWeek: () => void;
    onNextWeek: () => void;
    onNavigateToPricing: () => void;
}

const CircleProgress = React.memo(({
    percent,
    size = 60,
    strokeWidth = 6,
    color = '#22c55e',
    trackColorClass = 'text-slate-100 dark:text-slate-700',
    textColorClass = 'text-slate-700 dark:text-slate-200'
}: {
    percent: number,
    size?: number,
    strokeWidth?: number,
    color?: string,
    trackColorClass?: string,
    textColorClass?: string
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    className={trackColorClass}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
                />
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center font-bold ${textColorClass}`} style={{ fontSize: size * 0.22 }}>
                {Math.round(percent)}%
            </div>
        </div>
    );
});

// Helper to avoid timezone issues with toISOString()
const getLocalISODate = (d: Date) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Draggable Task Component
const DraggableTask: React.FC<{
    task: Task;
    isEditing: boolean;
    editText: string;
    onEditTextChange: (text: string) => void;
    onSaveEdit: () => void;
    onCancelEdit: () => void;
    onToggle: () => void;
    onStartEdit: () => void;
    onDelete: () => void;
}> = ({ task, isEditing, editText, onEditTextChange, onSaveEdit, onCancelEdit, onToggle, onStartEdit, onDelete }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: task.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group/task">
            <div className={`flex items-start gap-2 text-sm py-1 px-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors`}>
                {isEditing ? (
                    <div className="flex-1">
                        <input
                            autoFocus
                            type="text"
                            value={editText}
                            onChange={(e) => onEditTextChange(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') onSaveEdit();
                                if (e.key === 'Escape') onCancelEdit();
                            }}
                            onBlur={onSaveEdit}
                            className="w-full text-xs p-1 border border-blue-400 rounded focus:outline-none dark:bg-slate-900 dark:text-slate-100"
                        />
                    </div>
                ) : (
                    <>
                        <div
                            {...attributes}
                            {...listeners}
                            className="mt-0.5 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex-shrink-0"
                        >
                            <GripVertical size={14} />
                        </div>
                        <button
                            onClick={onToggle}
                            className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 dark:border-slate-500 hover:border-green-400'}`}
                        >
                            {task.completed && <Check size={10} strokeWidth={3} />}
                        </button>
                        <span
                            className={`flex-1 break-words cursor-pointer leading-tight text-xs ${task.completed ? 'text-slate-400 line-through decoration-slate-400 decoration-2' : 'text-slate-700 dark:text-slate-200'}`}
                            onDoubleClick={onStartEdit}
                        >
                            {task.text}
                        </span>
                        <div className="flex opacity-0 group-hover/task:opacity-100 transition-opacity gap-1 absolute right-1 top-0.5 bg-white dark:bg-slate-800 shadow-sm rounded px-1 z-10">
                            <button
                                onClick={onStartEdit}
                                className="text-slate-400 hover:text-blue-500 transition-colors p-0.5"
                            >
                                <Pencil size={10} />
                            </button>
                            <button
                                onClick={onDelete}
                                className="text-slate-400 hover:text-red-500 transition-colors p-0.5"
                            >
                                <X size={10} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// Droppable Day Column Component
const DroppableDay: React.FC<{
    dateIso: string;
    children: React.ReactNode;
}> = ({ dateIso, children }) => {
    const { setNodeRef } = useDroppable({
        id: dateIso,
    });

    return (
        <div
            ref={setNodeRef}
            className="flex-1 p-2 overflow-y-auto space-y-1 custom-scrollbar"
        >
            {children}
        </div>
    );
};

// Week Navigation Drop Zone
const WeekDropZone: React.FC<{
    direction: 'prev' | 'next';
    isOver: boolean;
    isDragging: boolean;
}> = ({ direction, isOver, isDragging }) => {
    const { setNodeRef } = useDroppable({
        id: direction === 'prev' ? 'prev-week' : 'next-week',
    });

    if (!isDragging) return null;

    return (
        <div
            ref={setNodeRef}
            className={`absolute ${direction === 'prev' ? 'left-0' : 'right-0'} top-0 bottom-0 w-16 flex items-center justify-center z-30 transition-all
                ${isOver
                    ? 'bg-purple-500/30 backdrop-blur-sm'
                    : 'bg-slate-200/20 dark:bg-slate-700/20 backdrop-blur-[1px]'}
            `}
        >
            <div className={`flex flex-col items-center gap-1 ${isOver ? 'scale-110' : ''} transition-transform`}>
                {direction === 'prev' ? <ChevronLeft size={24} className="text-purple-600 dark:text-purple-400" /> : <ChevronRight size={24} className="text-purple-600 dark:text-purple-400" />}
                <span className="text-[9px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                    {direction === 'prev' ? 'Prev' : 'Next'}
                </span>
                <span className="text-[8px] text-purple-500 dark:text-purple-300">Week</span>
            </div>
        </div>
    );
};

export const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({ currentDate, onPrevWeek, onNextWeek, onNavigateToPricing }) => {
    const { data, saveTask, saveTasks, deleteTask: removeTaskFromDB, updateHabits } = useStorage();
    const isPremium = data.userProfile?.tier === 'premium';
    const tasks = data.tasks;

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState('');
    const [movingTaskId, setMovingTaskId] = useState<string | null>(null);
    const [activeDragId, setActiveDragId] = useState<string | null>(null);
    const [activeOverId, setActiveOverId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveDragId(event.active.id as string);
    };

    const handleDragOver = (event: any) => {
        setActiveOverId(event.over?.id as string || null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragId(null);
        setActiveOverId(null);

        if (!over) return;

        const taskId = active.id as string;
        const targetId = over.id as string;

        // Handle week navigation drops
        if (targetId === 'prev-week' || targetId === 'next-week') {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                const currentDate = new Date(task.date);
                const offset = targetId === 'prev-week' ? -7 : 7;
                currentDate.setDate(currentDate.getDate() + offset);
                const newDateIso = getLocalISODate(currentDate);
                saveTask({ ...task, date: newDateIso });
            }
            return;
        }

        const draggedTask = tasks.find(t => t.id === taskId);
        if (!draggedTask) return;

        // Check if we're dropping on a day column
        const isDropOnDay = weekDays.some(d => d.isoDate === targetId);
        if (isDropOnDay) {
            // Moving to a different day
            if (draggedTask.date !== targetId) {
                const dayTasks = tasks.filter(t => t.date === targetId);
                if (dayTasks.length >= 15) {
                    alert("Cannot move task: Destination day has reached the 15-task limit.");
                    return;
                }
                saveTask({ ...draggedTask, date: targetId });
            }
            return;
        }

        // Check if we're dropping on another task (reordering within same day)
        const targetTask = tasks.find(t => t.id === targetId);
        if (targetTask && draggedTask.date === targetTask.date && taskId !== targetId) {
            // Reorder tasks within the same day
            const dayTasks = tasks.filter(t => t.date === draggedTask.date).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            const oldIndex = dayTasks.findIndex(t => t.id === taskId);
            const newIndex = dayTasks.findIndex(t => t.id === targetId);

            if (oldIndex !== -1 && newIndex !== -1) {
                const reorderedDayTasks: Task[] = arrayMove(dayTasks, oldIndex, newIndex);
                // Save all tasks with updated order in a single batch request
                const tasksWithOrder = reorderedDayTasks.map((task, i) => ({ ...task, order: i }));
                saveTasks(tasksWithOrder);
            }
        }
    };

    const activeDragTask = activeDragId ? tasks.find(t => t.id === activeDragId) : null;

    const startOfWeek = useMemo(() => {
        const date = new Date(currentDate);
        const day = date.getDay(); // 0 is Sunday
        // Adjust to start on Monday
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const d = new Date(date);
        d.setDate(diff);
        d.setHours(0, 0, 0, 0); // Normalize time
        return d;
    }, [currentDate]);

    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(startOfWeek);
            d.setDate(d.getDate() + i);

            return {
                date: d,
                isoDate: getLocalISODate(d),
                dayName: d.toLocaleDateString('en-US', { weekday: 'long' }),
                shortDay: d.toLocaleDateString('en-US', { weekday: 'short' }),
                formattedDate: d.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                displayDate: d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }),
                headerDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            };
        });
    }, [startOfWeek]);

    const weekMonthKey = `${startOfWeek.getFullYear()}-${startOfWeek.getMonth()}`;
    const displayHabits = data.monthlyData[weekMonthKey]?.habits || data.habitConfig;

    const isHabitDone = (habitId: string, date: Date) => {
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        const monthData = data.monthlyData[key];
        if (!monthData) return false;
        const habit = monthData.habits.find(h => h.id === habitId);
        return !!habit?.completedDays[date.getDate()];
    };

    const toggleHabitStatus = (habitId: string, date: Date) => {
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        const currentMonthData = data.monthlyData[key];

        let habitsToUpdate = currentMonthData
            ? [...currentMonthData.habits]
            : [...data.habitConfig.map(h => ({ ...h, completedDays: {} }))];

        if (habitsToUpdate.length === 0) {
            habitsToUpdate = displayHabits.map(h => ({ ...h, completedDays: {} }));
        }

        const updatedHabits = habitsToUpdate.map(h => {
            if (h.id !== habitId) return h;
            const day = date.getDate();
            const newCompleted = { ...h.completedDays };
            if (newCompleted[day]) delete newCompleted[day];
            else newCompleted[day] = true;
            return { ...h, completedDays: newCompleted };
        });

        updateHabits(key, updatedHabits);
    };

    const addTask = (dateIso: string, text: string) => {
        if (!text.trim()) return;

        const dayTasks = tasks.filter(t => t.date === dateIso);
        if (dayTasks.length >= 15) {
            alert("Maximum 15 tasks allowed per day.");
            return;
        }

        const newTask: Task = {
            id: Date.now().toString(),
            text,
            completed: false,
            date: dateIso
        };
        saveTask(newTask);
    };

    const toggleTask = (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            saveTask({ ...task, completed: !task.completed });
        }
    };

    const deleteTask = async (id: string) => {
        await removeTaskFromDB(id);
    };

    const startEditing = (task: Task) => {
        setEditingId(task.id);
        setEditText(task.text);
        setMovingTaskId(null);
    };

    const saveEdit = () => {
        if (editingId && editText.trim()) {
            const task = tasks.find(t => t.id === editingId);
            if (task) {
                saveTask({ ...task, text: editText });
            }
            setEditingId(null);
            setEditText('');
        } else {
            cancelEdit();
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    const moveTask = (taskId: string, newDateIso: string) => {
        const dayTasks = tasks.filter(t => t.date === newDateIso);
        if (dayTasks.length >= 15) {
            alert("Cannot move task: Destination day has reached the 15-task limit.");
            setMovingTaskId(null);
            return;
        }

        const task = tasks.find(t => t.id === taskId);
        if (task) {
            saveTask({ ...task, date: newDateIso });
        }
        setMovingTaskId(null);
    };

    const weeklyTasksData = useMemo(() => {
        return weekDays.map(day => {
            const dayTasks = tasks.filter(t => t.date === day.isoDate);
            const completed = dayTasks.filter(t => t.completed).length;
            return {
                day: day.shortDay,
                completed,
                remaining: dayTasks.length - completed,
                total: dayTasks.length,
                percent: dayTasks.length > 0 ? Math.round((completed / dayTasks.length) * 100) : 0
            };
        });
    }, [tasks, weekDays]);

    const totalTasks = weeklyTasksData.reduce((acc, curr) => acc + curr.total, 0);
    const totalCompleted = weeklyTasksData.reduce((acc, curr) => acc + curr.completed, 0);
    const overallPercent = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

    return (
        <div className="relative">
            <div className={`space-y-6 animate-in fade-in duration-300 pb-12 ${!isPremium ? 'blur-md pointer-events-none select-none' : ''}`}>

                {/* Header and Navigation */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Weekly Planner</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Focus & Result</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <button onClick={onPrevWeek} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-400">
                            <ChevronLeft size={18} />
                        </button>
                        <div className="text-sm font-black text-slate-900 dark:text-white min-w-[150px] text-center">
                            {weekDays[0].headerDate} - {weekDays[6].headerDate}, {startOfWeek.getFullYear()}
                        </div>
                        <button onClick={onNextWeek} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-400">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 items-stretch">
                    {/* Quote Section */}
                    <div className="flex-[0.8] bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
                        <div className="flex-grow flex items-center justify-center p-8 text-center">
                            <h2 className="text-2xl font-black text-slate-600 dark:text-slate-300 leading-tight italic">
                                "Inspiration comes only during work"
                            </h2>
                        </div>
                        <div className="flex border-t border-slate-200 dark:border-slate-700">
                            <div className="bg-green-600 text-white px-3 py-2 text-[10px] font-black uppercase tracking-widest">Start of the week</div>
                            <div className="flex-grow px-3 py-2 text-[11px] font-bold text-slate-600 dark:text-slate-400 text-center">{weekDays[0].formattedDate}</div>
                        </div>
                    </div>

                    {/* Overall Progress */}
                    <div className="flex-[1.2] bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
                        <div className="bg-green-600 py-1.5 text-center font-black text-white text-xs uppercase tracking-[0.2em]">Overall Progress</div>
                        <div className="flex flex-row p-3 gap-2 flex-grow min-h-[260px]">
                            <div className="flex-grow">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={weeklyTasksData} margin={{ top: 10, right: 5, left: 0, bottom: 10 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis
                                            dataKey="day"
                                            tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }}
                                            axisLine={{ stroke: '#64748b' }}
                                            tickLine={false}
                                            interval={0}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }}
                                            axisLine={{ stroke: '#64748b' }}
                                            tickLine={false}
                                            ticks={[0, 2, 4, 6, 8]}
                                            domain={[0, 8]}
                                            label={{ value: 'Tasks', angle: -90, position: 'insideLeft', style: { fontSize: 12, fontWeight: 700, fill: '#64748b' } }}
                                        />
                                        <RechartsTooltip
                                            cursor={{ fill: 'rgba(34, 197, 94, 0.1)' }}
                                            contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '11px' }}
                                        />
                                        <Bar dataKey="completed" stackId="a" fill="#22c55e" barSize={50} />
                                        <Bar dataKey="remaining" stackId="a" fill="#22c55e" opacity={0.2} barSize={50} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex flex-col items-center justify-center min-w-[160px]">
                                <CircleProgress
                                    percent={overallPercent}
                                    size={130}
                                    strokeWidth={14}
                                    color="#22c55e"
                                    trackColorClass="text-slate-100 dark:text-slate-700"
                                    textColorClass="text-slate-800 dark:text-slate-100"
                                />
                                <span className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 mt-3">{totalCompleted} / {totalTasks} Completed</span>
                            </div>
                        </div>
                    </div>

                    {/* Habit Tracker */}
                    <div className="flex-[2] bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
                        <div className="bg-green-600 py-1.5 text-center font-black text-white text-xs uppercase tracking-[0.2em]">Habit Tracker</div>
                        <div className="overflow-x-auto p-0">
                            <table className="w-full text-[10px] border-collapse">
                                <thead>
                                    <tr className="text-green-600 bg-green-50/30 dark:bg-green-900/10 border-b border-slate-100 dark:border-slate-700">
                                        <th className="py-2 px-3 font-black text-left uppercase tracking-tighter w-1/4 italic">Habit</th>
                                        {weekDays.map(d => (
                                            <th key={d.isoDate} className="py-2 text-center font-black border-l border-slate-100 dark:border-slate-700">
                                                {d.shortDay}
                                            </th>
                                        ))}
                                        <th className="py-2 px-3 font-black text-center border-l border-slate-100 dark:border-slate-700 uppercase tracking-tighter italic">Progress</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {displayHabits.length === 0 ? (
                                        <tr><td colSpan={9} className="py-12 text-center text-slate-400 italic font-medium">No habits configured</td></tr>
                                    ) : (
                                        displayHabits.map((habit) => {
                                            let weeklyDoneCount = 0;
                                            weekDays.forEach(d => {
                                                if (isHabitDone(habit.id, d.date)) weeklyDoneCount++;
                                            });
                                            const weeklyProgress = Math.round((weeklyDoneCount / 7) * 100);
                                            return (
                                                <tr key={habit.id} className="group hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors h-9">
                                                    <td className="px-3 font-bold text-slate-700 dark:text-slate-300">
                                                        <div className="flex items-center gap-2">
                                                            <div><HabitIcon iconKey={habit.icon} /></div>
                                                            <span className="truncate w-full max-w-[120px]">{habit.name}</span>
                                                        </div>
                                                    </td>
                                                    {weekDays.map(d => {
                                                        const done = isHabitDone(habit.id, d.date);
                                                        return (
                                                            <td key={d.isoDate} className="text-center align-middle border-l border-slate-100 dark:border-slate-700">
                                                                <div className="flex items-center justify-center">
                                                                    <div
                                                                        onClick={() => toggleHabitStatus(habit.id, d.date)}
                                                                        className={`w-3.5 h-3.5 rounded-sm cursor-pointer border-2 transition-all flex items-center justify-center ${done ? 'bg-green-500 border-green-500 shadow-sm' : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-green-400'}`}
                                                                    >
                                                                        {done && <Check size={10} className="text-white" strokeWidth={4} />}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        );
                                                    })}
                                                    <td className="px-2 border-l border-slate-100 dark:border-slate-700 min-w-[120px]">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-grow h-3 bg-slate-100 dark:bg-slate-900 rounded-sm overflow-hidden border border-slate-200 dark:border-white/5">
                                                                <div className="h-full bg-green-500/80 rounded-sm transition-all" style={{ width: `${weeklyProgress}%` }}></div>
                                                            </div>
                                                            <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 w-6 text-right">{weeklyProgress}%</span>
                                                            {weeklyProgress === 100 && <span className="text-xs">🏆</span>}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="relative">
                        {/* Week navigation drop zones */}
                        <WeekDropZone
                            direction="prev"
                            isOver={activeOverId === 'prev-week'}
                            isDragging={!!activeDragId}
                        />
                        <WeekDropZone
                            direction="next"
                            isOver={activeOverId === 'next-week'}
                            isDragging={!!activeDragId}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                            {weekDays.map((day) => {
                                const dayTasks = tasks.filter(t => t.date === day.isoDate).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
                                const completedCount = dayTasks.filter(t => t.completed).length;
                                const notCompletedCount = dayTasks.length - completedCount;
                                const percent = dayTasks.length > 0 ? Math.round((completedCount / dayTasks.length) * 100) : 0;
                                const isToday = getLocalISODate(new Date()) === day.isoDate;
                                const isAtTaskLimit = dayTasks.length >= 15;

                                return (
                                    <div key={day.isoDate} className={`flex flex-col bg-white dark:bg-slate-800 border rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md ${isToday ? 'ring-2 ring-green-500 border-transparent' : 'border-slate-200 dark:border-slate-700'}`}>
                                        {/* Day Header */}
                                        <div className={`p-3 text-center border-b ${isToday ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30' : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600'}`}>
                                            <div className={`font-bold text-base ${isToday ? 'text-green-700 dark:text-green-400' : 'text-slate-800 dark:text-slate-100'}`}>{day.dayName}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{day.formattedDate}</div>
                                        </div>

                                        {/* Circular Progress */}
                                        <div className="flex justify-center py-5 bg-white dark:bg-slate-800">
                                            <CircleProgress
                                                percent={percent}
                                                size={100}
                                                strokeWidth={10}
                                                color={isToday ? '#22c55e' : '#3b82f6'}
                                                trackColorClass="text-slate-200 dark:text-slate-700"
                                                textColorClass="text-slate-800 dark:text-slate-100"
                                            />
                                        </div>

                                        {/* Tasks Header */}
                                        <div className={`px-3 py-2 border-y ${isToday ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30' : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600'}`}>
                                            <span className={`text-xs font-bold uppercase tracking-wide ${isToday ? 'text-green-700 dark:text-green-400' : 'text-slate-600 dark:text-slate-300'}`}>Tasks</span>
                                        </div>

                                        {/* Task List */}
                                        <div className="flex-1 min-h-[180px] max-h-[280px] overflow-hidden flex flex-col">
                                            <DroppableDay dateIso={day.isoDate}>
                                                <SortableContext items={dayTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                                                    {dayTasks.map(task => (
                                                        <DraggableTask
                                                            key={task.id}
                                                            task={task}
                                                            isEditing={editingId === task.id}
                                                            editText={editText}
                                                            onEditTextChange={setEditText}
                                                            onSaveEdit={saveEdit}
                                                            onCancelEdit={cancelEdit}
                                                            onToggle={() => toggleTask(task.id)}
                                                            onStartEdit={() => startEditing(task)}
                                                            onDelete={() => deleteTask(task.id)}
                                                        />
                                                    ))}
                                                </SortableContext>

                                                <div className="mt-1 pt-1 border-t border-slate-100 dark:border-slate-700/50">
                                                    <input
                                                        type="text"
                                                        disabled={isAtTaskLimit}
                                                        placeholder={isAtTaskLimit ? "Limit reached (15)" : "+ Add task"}
                                                        className={`w-full text-xs bg-transparent border-none focus:ring-0 p-1 transition-colors ${isAtTaskLimit ? 'text-slate-400 italic cursor-not-allowed' : 'text-slate-600 dark:text-slate-400 placeholder-slate-400 focus:placeholder-slate-300'}`}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                addTask(day.isoDate, e.currentTarget.value);
                                                                e.currentTarget.value = '';
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </DroppableDay>
                                        </div>

                                        {/* Footer with Completed/Not Completed counts */}
                                        <div className={`border-t ${isToday ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'} p-2 text-[11px]`}>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-1">
                                                    <span className={`font-semibold ${isToday ? 'text-green-700 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'}`}>Completed</span>
                                                    <span className={`font-bold ${isToday ? 'text-green-600 dark:text-green-300' : 'text-slate-700 dark:text-slate-300'}`}>{completedCount}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className={`font-semibold ${isToday ? 'text-green-700 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'}`}>Not Completed</span>
                                                    <span className={`font-bold ${isToday ? 'text-green-600 dark:text-green-300' : 'text-slate-700 dark:text-slate-300'}`}>{notCompletedCount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <DragOverlay>
                        {activeDragTask ? (
                            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-blue-400 p-2 max-w-[200px]">
                                <div className="flex items-center gap-2 text-sm">
                                    <GripVertical size={14} className="text-blue-500" />
                                    <span className={`text-xs ${activeDragTask.completed ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                                        {activeDragTask.text}
                                    </span>
                                </div>
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>

            {!isPremium && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-slate-50/10 dark:bg-slate-950/10 backdrop-blur-[2px]">
                    <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6 animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/20">
                            <Calendar size={40} fill="currentColor" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Weekly Planner Pro</h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                Organize your week with precision. Get unlimited tasks, habit tracking, and progress analytics.
                            </p>
                        </div>
                        <div className="space-y-4 pt-2">
                            <button
                                onClick={onNavigateToPricing}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 group"
                            >
                                Upgrade to Pro
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <p className="text-xs text-slate-400 font-medium">Plan smarter, achieve more</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};