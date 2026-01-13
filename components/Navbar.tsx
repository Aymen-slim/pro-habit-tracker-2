import React from 'react';
import { LayoutGrid, Calendar, ClipboardList, StickyNote, User, Sparkles } from 'lucide-react';
import { ViewType } from '../types';
import { useStorage } from '../context/StorageContext';

interface NavbarProps {
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onChangeView }) => {
  const { data } = useStorage();
  const isPremium = data.userProfile?.tier === 'premium';

  const allTabs = [
    { id: 'tracker', label: 'Monthly', icon: <LayoutGrid size={18} /> },
    { id: 'planner', label: 'Weekly', icon: <Calendar size={18} /> },
    { id: 'review', label: 'Review', icon: <ClipboardList size={18} /> },
    { id: 'notes', label: 'Notes', icon: <StickyNote size={18} /> },
    { id: 'pricing', label: 'Pricing', icon: <Sparkles size={18} /> },
    { id: 'settings', label: 'Account', icon: <User size={18} /> },
  ] as const;

  const tabs = isPremium ? allTabs.filter(tab => tab.id !== 'pricing') : allTabs;

  return (
    <div className="flex justify-center w-full my-6 sticky top-4 z-40 px-4">
      <div className="bg-slate-900/95 backdrop-blur-sm p-1.5 rounded-2xl flex items-center shadow-2xl border border-slate-800/50 overflow-x-auto max-w-full scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChangeView(tab.id as ViewType)}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ease-out whitespace-nowrap
              ${currentView === tab.id
                ? 'bg-slate-800 text-white shadow-lg shadow-slate-950/20 ring-1 ring-white/10 translate-y-0'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'}
            `}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};