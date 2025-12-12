import React, { useState, useRef, useEffect } from 'react';
import { Task } from '../types';
import { Plus, Trash2, Check, Pencil, X, ChevronUp, ChevronDown } from 'lucide-react';

interface DayColumnProps {
    date: Date;
    tasks: Task[];
    onAddTask: (text: string, date: Date) => void;
    onToggleTask: (taskId: string) => void;
    onDeleteTask: (taskId: string) => void;
    onEditTask: (taskId: string, newText: string) => void;
    onMoveTask: (taskId: string, direction: 'up' | 'down') => void;
}

export const DayColumn: React.FC<DayColumnProps> = ({ date, tasks, onAddTask, onToggleTask, onDeleteTask, onEditTask, onMoveTask }) => {
    const [newTaskText, setNewTaskText] = useState('');
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editTaskText, setEditTaskText] = useState('');
    const editInputRef = useRef<HTMLInputElement>(null);

    const completedCount = tasks.filter(t => t.completed).length;
    const totalCount = tasks.length;
    const notCompletedCount = totalCount - completedCount;
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    useEffect(() => {
        if (editingTaskId && editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [editingTaskId]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newTaskText.trim()) {
            onAddTask(newTaskText.trim(), date);
            setNewTaskText('');
        }
    };

    const startEditing = (task: Task) => {
        setEditingTaskId(task.id);
        setEditTaskText(task.text);
    };

    const saveEdit = () => {
        if (editingTaskId && editTaskText.trim()) {
            onEditTask(editingTaskId, editTaskText.trim());
            setEditingTaskId(null);
            setEditTaskText('');
        }
    };

    const cancelEdit = () => {
        setEditingTaskId(null);
        setEditTaskText('');
    };

    const handleEditKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            saveEdit();
        } else if (e.key === 'Escape') {
            cancelEdit();
        }
    };

    const isToday = new Date().toDateString() === date.toDateString();

    return (
        <div className={`flex flex-col h-full bg-white dark:bg-slate-800 rounded-lg border ${isToday ? 'border-green-500 ring-1 ring-green-500' : 'border-slate-200 dark:border-slate-700'} overflow-hidden`}>
            {/* Header */}
            <div className="bg-green-500/10 dark:bg-green-500/20 p-3 text-center border-b border-green-100 dark:border-slate-700">
                <h3 className="font-bold text-green-700 dark:text-green-400 uppercase text-sm">
                    {date.toLocaleDateString('en-US', { weekday: 'long' })}
                </h3>
                <p className="text-xs text-green-600 dark:text-green-500 font-medium mt-1">
                    {date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </p>
            </div>

            {/* Progress Circle */}
            <div className="p-4 flex justify-center border-b border-slate-100 dark:border-slate-700">
                <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="transparent"
                            className="text-slate-100 dark:text-slate-700"
                        />
                        <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 36}
                            strokeDashoffset={2 * Math.PI * 36 * (1 - percentage / 100)}
                            className="text-green-400 transition-all duration-500 ease-out"
                        />
                    </svg>
                    <span className="absolute text-lg font-bold text-slate-700 dark:text-slate-200">
                        {percentage}%
                    </span>
                </div>
            </div>

            {/* Tasks Header */}
            <div className="bg-green-500/10 dark:bg-green-500/20 py-1 px-3 text-center border-b border-green-100 dark:border-slate-700">
                <span className="text-xs font-bold text-green-700 dark:text-green-400 uppercase">Tasks</span>
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[200px]">
                {tasks.map((task, index) => (
                    <div key={task.id} className="group flex items-start gap-2 text-sm p-1 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded transition-colors">

                        {editingTaskId === task.id ? (
                            <div className="flex-1 flex items-center gap-1">
                                <input
                                    ref={editInputRef}
                                    type="text"
                                    value={editTaskText}
                                    onChange={(e) => setEditTaskText(e.target.value)}
                                    onKeyDown={handleEditKeyDown}
                                    onBlur={saveEdit}
                                    className="flex-1 bg-white dark:bg-slate-900 border border-green-500 rounded px-1 py-0.5 text-sm outline-none"
                                />
                                <button onClick={saveEdit} className="text-green-500 hover:text-green-600"><Check size={14} /></button>
                                <button onClick={cancelEdit} className="text-red-500 hover:text-red-600"><X size={14} /></button>
                            </div>
                        ) : (
                            <>
                                <div className="flex-1 min-w-0 cursor-pointer" onDoubleClick={() => startEditing(task)}>
                                    <span className={`break-words ${task.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                                        {task.text}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex flex-col gap-0.5 mr-1">
                                        <button
                                            onClick={() => onMoveTask(task.id, 'up')}
                                            disabled={index === 0}
                                            className={`text-slate-300 hover:text-slate-600 ${index === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                                        >
                                            <ChevronUp size={10} />
                                        </button>
                                        <button
                                            onClick={() => onMoveTask(task.id, 'down')}
                                            disabled={index === tasks.length - 1}
                                            className={`text-slate-300 hover:text-slate-600 ${index === tasks.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                                        >
                                            <ChevronDown size={10} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => startEditing(task)}
                                        className="text-slate-400 hover:text-blue-500 transition-colors"
                                    >
                                        <Pencil size={12} />
                                    </button>
                                    <button
                                        onClick={() => onDeleteTask(task.id)}
                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => onToggleTask(task.id)}
                                    className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${task.completed
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : 'border-slate-300 dark:border-slate-600 hover:border-green-500'
                                        }`}
                                >
                                    {task.completed && <Check size={12} strokeWidth={3} />}
                                </button>
                            </>
                        )}
                    </div>
                ))}

                {/* Add Task Input */}
                <div className="mt-2 flex items-center gap-2 px-1">
                    <Plus size={16} className="text-slate-400" />
                    <input
                        type="text"
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Add task..."
                        className="flex-1 bg-transparent border-b border-slate-200 dark:border-slate-700 focus:border-green-500 outline-none text-sm py-1 text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                    />
                </div>

                {/* Empty lines for visual consistency (optional, mimicking the image) */}
                {Array.from({ length: Math.max(0, 8 - tasks.length) }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-6 border-b border-slate-100 dark:border-slate-800/50 mx-1"></div>
                ))}
            </div>

            {/* Footer Stats */}
            <div className="grid grid-cols-2 text-[10px] font-medium text-white">
                <div className="bg-green-500 p-1 text-center">
                    Completed {completedCount}
                </div>
                <div className="bg-green-400 p-1 text-center">
                    Not Completed {notCompletedCount}
                </div>
            </div>
        </div>
    );
};
