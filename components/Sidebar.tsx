import React from 'react';
import { Calendar, CheckSquare, ClipboardList, StickyNote, Settings } from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems = [
    { id: 'planner', label: 'Weekly Planner', icon: <Calendar size={20} />, description: 'Distribute workload' },
    { id: 'tracker', label: 'Habit Tracker', icon: <CheckSquare size={20} />, description: 'Manage habits' },
    { id: 'review', label: 'Weekly Review', icon: <ClipboardList size={20} />, description: 'Assess progress' },
    { id: 'notes', label: 'Notes', icon: <StickyNote size={20} />, description: 'On-the-go entries' },
    { id: 'settings', label: 'Data & Settings', icon: <Settings size={20} />, description: 'Backup and Restore' },
  ] as const;

  return (
    <div className="w-full md:w-64 flex-shrink-0 bg-slate-900 text-white flex flex-col h-full min-h-[calc(100vh-2rem)] rounded-l-lg overflow-hidden">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold tracking-wider">PRO TRACKER</h1>
        <p className="text-xs text-slate-400 mt-1">Workspace</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id as ViewType)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 group ${
              currentView === item.id 
                ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className={`${currentView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-green-400'}`}>
              {item.icon}
            </div>
            <div className="text-left">
              <div className="font-medium text-sm">{item.label}</div>
              <div className="text-[10px] opacity-70 font-light">{item.description}</div>
            </div>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        v2.2.0 &bull; Local Mode
      </div>
    </div>
  );
};