import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

interface WeeklyProgressProps {
    data: {
        day: string;
        completed: number;
        total: number;
    }[];
}

export const WeeklyProgress: React.FC<WeeklyProgressProps> = ({ data }) => {
    const chartData = data.map(d => ({
        name: d.day,
        tasks: d.total,
        completed: d.completed,
        // Calculate percentage for color intensity or just use raw values
        percentage: d.total > 0 ? (d.completed / d.total) * 100 : 0
    }));

    const totalTasks = data.reduce((acc, curr) => acc + curr.total, 0);
    const totalCompleted = data.reduce((acc, curr) => acc + curr.completed, 0);
    const overallPercentage = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-slate-700 dark:text-slate-200">Overall Progress</h3>
                <div className="flex flex-col items-end">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-slate-200 dark:text-slate-700"
                            />
                            <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 28}
                                strokeDashoffset={2 * Math.PI * 28 * (1 - overallPercentage / 100)}
                                className="text-green-500 transition-all duration-500 ease-out"
                            />
                        </svg>
                        <span className="absolute text-sm font-bold text-slate-700 dark:text-slate-200">
                            {overallPercentage}%
                        </span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {totalCompleted} / {totalTasks} Completed
                    </span>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barGap={4}>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#94a3b8' }}
                            dy={10}
                        />
                        <YAxis hide />
                        <Bar dataKey="completed" stackId="a" fill="#4ade80" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="tasks" stackId="a" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
