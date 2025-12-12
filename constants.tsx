import { Habit, MentalState, WeeklyGroup, DayConfig } from './types';
import { 
  AlarmClock, 
  Dumbbell, 
  BookOpen, 
  CalendarDays, 
  DollarSign, 
  Target, 
  WineOff, 
  PhoneOff, 
  BookHeart, 
  Snowflake,
  Briefcase,
  Coffee,
  Music,
  Sun,
  Moon,
  Zap,
  Droplets,
  Bed,
  Utensils,
  Footprints,
  Brain,
  Smile,
  Heart,
  Gamepad2,
  Code,
  PenTool,
  Shirt,
  Bath,
  Car,
  ShoppingCart,
  Leaf
} from 'lucide-react';
import React from 'react';

export const ICON_MAP: Record<string, React.ReactNode> = {
  AlarmClock: <AlarmClock size={16} className="text-red-500" />,
  Dumbbell: <Dumbbell size={16} className="text-yellow-500" />,
  BookOpen: <BookOpen size={16} className="text-blue-500" />,
  CalendarDays: <CalendarDays size={16} className="text-purple-500" />,
  DollarSign: <DollarSign size={16} className="text-green-600" />,
  Target: <Target size={16} className="text-red-600" />,
  WineOff: <WineOff size={16} className="text-rose-400" />,
  PhoneOff: <PhoneOff size={16} className="text-green-500" />,
  BookHeart: <BookHeart size={16} className="text-yellow-600" />,
  Snowflake: <Snowflake size={16} className="text-cyan-400" />,
  Briefcase: <Briefcase size={16} className="text-slate-600" />,
  Coffee: <Coffee size={16} className="text-amber-700" />,
  Music: <Music size={16} className="text-violet-500" />,
  Sun: <Sun size={16} className="text-orange-400" />,
  Moon: <Moon size={16} className="text-indigo-400" />,
  Zap: <Zap size={16} className="text-yellow-400" />,
  Droplets: <Droplets size={16} className="text-blue-400" />,
  Bed: <Bed size={16} className="text-indigo-500" />,
  Utensils: <Utensils size={16} className="text-orange-500" />,
  Footprints: <Footprints size={16} className="text-stone-500" />,
  Brain: <Brain size={16} className="text-pink-500" />,
  Smile: <Smile size={16} className="text-yellow-400" />,
  Heart: <Heart size={16} className="text-red-500" />,
  Gamepad2: <Gamepad2 size={16} className="text-purple-600" />,
  Code: <Code size={16} className="text-slate-700" />,
  PenTool: <PenTool size={16} className="text-pink-600" />,
  Shirt: <Shirt size={16} className="text-blue-300" />,
  Bath: <Bath size={16} className="text-cyan-500" />,
  Car: <Car size={16} className="text-red-600" />,
  ShoppingCart: <ShoppingCart size={16} className="text-emerald-600" />,
  Leaf: <Leaf size={16} className="text-green-500" />,
};

export const ICON_KEYS = Object.keys(ICON_MAP);

// Initial state is now empty as requested
export const INITIAL_HABITS: Habit[] = [];

// Helper to generate month structure for any given date
export const generateMonthData = (baseDate: Date = new Date()) => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth(); // 0-indexed
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const weeks: WeeklyGroup[] = [];
  let currentWeekDays: DayConfig[] = [];
  let weekIndex = 1;
  
  const dayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const dayOfWeek = date.getDay(); // 0 = Sun, 6 = Sat
    
    currentWeekDays.push({
      day: i,
      label: dayLabels[dayOfWeek],
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6
    });

    // End week on Sunday or if it's the last day of the month
    if (dayOfWeek === 0 || i === daysInMonth) {
      weeks.push({
        name: `Week ${weekIndex}`,
        days: currentWeekDays
      });
      currentWeekDays = [];
      weekIndex++;
    }
  }

  return { weeks, daysInMonth, currentDate: baseDate };
};