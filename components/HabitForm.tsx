import React, { useState, useEffect, useRef } from 'react';
import { HabitIcon } from './HabitIcon';
import { ICON_KEYS, LUCIDE_ICON_KEYS, DEFAULT_EMOJIS } from '../constants';
import { Habit } from '../types';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { Smile } from 'lucide-react';

interface HabitFormProps {
  initialHabit?: Habit | null;
  daysInMonth: number;
  onSave: (name: string, icon: string, goal: number) => void;
  onCancel: () => void;
}

export const HabitForm: React.FC<HabitFormProps> = ({ initialHabit, daysInMonth, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(ICON_KEYS[0]);
  const [goal, setGoal] = useState(daysInMonth);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialHabit) {
      setName(initialHabit.name);
      setSelectedIcon(initialHabit.icon);
      setGoal(initialHabit.goal || daysInMonth);
    } else {
      setName('');
      setSelectedIcon(ICON_KEYS[0]);
      setGoal(daysInMonth);
    }
  }, [initialHabit, daysInMonth]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setSelectedIcon(emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const validGoal = Math.max(1, Math.min(goal, daysInMonth));
    onSave(name, selectedIcon, validGoal);
  };

  const isCustomEmoji = !ICON_KEYS.includes(selectedIcon);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-black dark:text-slate-200 mb-1">Habit Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Drink Water"
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 focus:border-transparent bg-white dark:bg-slate-800 text-black dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black dark:text-slate-200 mb-1">
          Monthly Goal <span className="text-slate-400 dark:text-slate-500 font-normal text-xs">(Target completions)</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max={daysInMonth}
            value={goal}
            onChange={(e) => setGoal(parseInt(e.target.value) || 0)}
            className="w-24 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 focus:border-transparent bg-white dark:bg-slate-800 text-black dark:text-white"
          />
          <span className="text-sm text-slate-500 dark:text-slate-400"> / {daysInMonth} days</span>
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-black dark:text-slate-200">Choose Icon</label>
          <div className="relative" ref={emojiPickerRef}>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-full transition-all border ${isCustomEmoji
                ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400'
                : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 hover:border-blue-400'
                }`}
            >
              {isCustomEmoji ? <span>Current: {selectedIcon}</span> : <><Smile size={14} /> <span>Custom Emoji</span></>}
            </button>

            {showEmojiPicker && (
              <div className="absolute right-0 bottom-full mb-2 z-[60]">
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  autoFocusSearch={false}
                  theme={Theme.AUTO}
                  width={300}
                  height={400}
                />
              </div>
            )}
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto p-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">Icons</span>
            <div className="grid grid-cols-8 gap-1">
              {LUCIDE_ICON_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedIcon(key)}
                  className={`aspect-square rounded-md flex items-center justify-center transition-all ${selectedIcon === key
                    ? 'bg-blue-50 dark:bg-slate-700 shadow-sm ring-2 ring-blue-500 scale-110 z-10'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700 opacity-60 hover:opacity-100'
                    }`}
                >
                  <HabitIcon iconKey={key} size={22} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">Emojis</span>
            <div className="grid grid-cols-6 gap-2">
              {DEFAULT_EMOJIS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedIcon(key)}
                  className={`aspect-square rounded-md flex items-center justify-center text-2xl transition-all ${selectedIcon === key
                    ? 'bg-blue-50 dark:bg-slate-700 shadow-sm ring-2 ring-blue-500 scale-110 z-10'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700 opacity-60 hover:opacity-100'
                    }`}
                >
                  <HabitIcon iconKey={key} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end pt-2 border-t border-slate-100 dark:border-slate-700 mt-6 gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-black dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!name.trim() || goal < 1}
          className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {initialHabit ? 'Save Changes' : 'Create Habit'}
        </button>
      </div>
    </form>
  );
};