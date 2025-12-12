import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalysisChartProps {
  data: any[];
  dataKeys: { key: string; color: string; fill: string }[];
  height?: number;
}

export const AnalysisChart: React.FC<AnalysisChartProps> = ({ data, dataKeys, height = 160 }) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-2" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
          <XAxis dataKey="day" hide />
          <YAxis tick={{fontSize: 10}} axisLine={false} tickLine={false} stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ 
                borderRadius: '4px', 
                fontSize: '12px', 
                border: 'none', 
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                backgroundColor: '#fff',
                color: '#000'
            }}
          />
          {dataKeys.map((dk) => (
            <Area 
              key={dk.key}
              type="monotone" 
              dataKey={dk.key} 
              stroke={dk.color} 
              fill={dk.fill} 
              fillOpacity={0.4} 
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};