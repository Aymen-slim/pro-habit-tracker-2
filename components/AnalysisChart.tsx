import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface AnalysisChartProps {
  data: any[];
  dataKeys: { key: string; color: string; fill: string }[];
  height?: number;
  isDarkMode?: boolean;
}

export const AnalysisChart: React.FC<AnalysisChartProps> = ({
  data,
  dataKeys,
  height = 220,
  isDarkMode = false
}) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className={`w-full ${isDarkMode ? 'bg-[#0f172a]' : 'bg-white'} rounded-xl overflow-hidden p-4 relative`} style={{ height, minHeight: height }}>
      {isMounted && (
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff4b91" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ff4b91" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMotivation" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={isDarkMode ? '#1e293b' : '#e2e8f0'} strokeDasharray="0" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: isDarkMode ? '#64748b' : '#94a3b8', fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tick={{ fontSize: 10, fill: isDarkMode ? '#64748b' : '#94a3b8', fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 12]}
              ticks={[3, 6, 9, 12]}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                fontSize: '12px',
                border: isDarkMode ? 'none' : '1px solid #e2e8f0',
                boxShadow: isDarkMode ? '0 20px 25px -5px rgba(0,0,0,0.3)' : '0 10px 15px -3px rgba(0,0,0,0.1)',
                backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                color: isDarkMode ? '#f8fafc' : '#1e293b',
                padding: '10px'
              }}
              itemStyle={{ padding: '2px 0' }}
              cursor={{ stroke: isDarkMode ? '#334155' : '#e2e8f0', strokeWidth: 1 }}
            />
            {dataKeys.map((dk) => (
              <Area
                key={dk.key}
                type="monotone"
                dataKey={dk.key}
                stroke={dk.key === 'mood' ? '#ff4b91' : '#a855f7'}
                fill={dk.key === 'mood' ? 'url(#colorMood)' : 'url(#colorMotivation)'}
                fillOpacity={1}
                strokeWidth={3}
                animationDuration={1500}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};