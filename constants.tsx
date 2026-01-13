import { Habit, WeeklyGroup, DayConfig } from './types';
import {
  AlarmClock,
  Dumbbell,
  BookOpen,
  DollarSign,
  Target,
  WineOff,
  PhoneOff,
  Coffee,
  Music,
  Sun,
  Moon,
  Zap,
  BedDouble,
  Brain,
  CigaretteOff,
  Footprints,
  Bike,
  Palette,
  Gamepad2,
  Leaf,
  Apple,
  Book,
  Camera,
  Coins,
  Compass,
  Laptop,
  Library,
  Mic,
  Package,
  PencilLine,
  Plane,
  Scale,
  Settings2,
  Shield,
  Sprout,
  Stethoscope,
  Tablets,
  Tent,
  Train,
  Trees,
  Trophy,
  Waves,
  Wrench,
  Youtube,
  Cloud,
  Flame,
  Globe,
  Ghost,
  Lightbulb,
  Mail,
  Map,
  MessageCircle,
  Mountain,
  Paintbrush,
  PawPrint,
  Pill,
  Rocket,
  Search,
  Sword,
  Ticket,
  Video,
  Wallet,
  Weight,
  BeerOff,
  GlassWater,
  Ban,
  Clock5,
  Sunrise,
  Sunset,
  CloudSun,
  HeartPulse,
  Wind,
  Flower2,
  SmilePlus,
  PiggyBank,
  CheckCheck,
  Dna,
  Pizza,
  Wine,
  Car,
  CloudMoon,
  Headphones,
  Medal,
  Flag,
  PenTool,
  Anchor,
  MoonStar,
  BrainCircuit,
  Trash2,
  Smartphone,
  Phone,
  ShieldAlert,
  Gem,
  Grape,
  School,
  Soup,
  Sofa,
  Candy,
  Egg,
  Sparkles as SparklesIcon
} from 'lucide-react';
import React from 'react';

// Curated set of default emojis for habits
export const DEFAULT_EMOJIS = [
  '💧', '🏃‍♂️', '🧘‍♂️', '📚', '🍎', '💪', '💊', '🛌', '🧠', '✍️',
  '☕️', '🚭', '📉', '💰', '🎯', '🌅', '🌙', '🚲', '🎨', '💻',
  '🥦', '🚶‍♂️', '🛁', '🎧', '🎸', '🌱', '🧹', '🏸', '🏊‍♂️', '🏀',
  '📵', '⏰', '🔋', '🚿', '🙏', '🤝', '📞', '🧺', '🍳', '🥛'
];

export const ICON_MAP: Record<string, React.ReactNode> = {
  // --- Sobriety & Health ---
  WineOff: <WineOff size={16} className="text-rose-500" />,
  BeerOff: <BeerOff size={16} className="text-orange-600" />,
  GlassWater: <GlassWater size={16} className="text-blue-400" />,
  Ban: <Ban size={16} className="text-red-500" />,
  PhoneOff: <PhoneOff size={16} className="text-red-500" />,
  CigaretteOff: <CigaretteOff size={16} className="text-gray-500" />,
  Wine: <Wine size={16} className="text-purple-700" />,
  Pill: <Pill size={16} className="text-emerald-500" />,
  Tablets: <Tablets size={16} className="text-blue-500" />,
  HeartPulse: <HeartPulse size={16} className="text-rose-400" />,

  // --- Waking Up & Time ---
  Clock5: <Clock5 size={16} className="text-amber-500" />,
  Sunrise: <Sunrise size={16} className="text-orange-400" />,
  Sunset: <Sunset size={16} className="text-indigo-400" />,
  AlarmClock: <AlarmClock size={16} className="text-red-500" />,
  Sun: <Sun size={16} className="text-yellow-500" />,
  Moon: <Moon size={16} className="text-slate-400" />,
  CloudSun: <CloudSun size={16} className="text-sky-400" />,
  CloudMoon: <CloudMoon size={16} className="text-indigo-900" />,
  MoonStar: <MoonStar size={16} className="text-blue-300" />,

  // --- Fitness & Energy ---
  Dumbbell: <Dumbbell size={16} className="text-slate-600" />,
  Weight: <Weight size={16} className="text-slate-500" />,
  Zap: <Zap size={16} className="text-yellow-400" />,
  Flame: <Flame size={16} className="text-orange-600" />,
  Footprints: <Footprints size={16} className="text-stone-500" />,
  Bike: <Bike size={16} className="text-red-500" />,
  Medal: <Medal size={16} className="text-yellow-600" />,
  Trophy: <Trophy size={16} className="text-amber-500" />,
  Flag: <Flag size={16} className="text-emerald-600" />,

  // --- Mindfulness & Mental ---
  Brain: <Brain size={16} className="text-pink-400" />,
  Wind: <Wind size={16} className="text-sky-400" />,
  Flower2: <Flower2 size={16} className="text-rose-300" />,
  SmilePlus: <SmilePlus size={16} className="text-yellow-400" />,
  Leaf: <Leaf size={16} className="text-green-500" />,
  Sprout: <Sprout size={16} className="text-emerald-400" />,
  Trees: <Trees size={16} className="text-green-700" />,

  // --- Work & Productivity ---
  Laptop: <Laptop size={16} className="text-slate-700" />,
  Target: <Target size={16} className="text-red-600" />,
  Rocket: <Rocket size={16} className="text-indigo-600" />,
  Lightbulb: <Lightbulb size={16} className="text-yellow-500" />,
  PenTool: <PenTool size={16} className="text-blue-500" />,
  CheckCheck: <CheckCheck size={16} className="text-green-600" />,
  PencilLine: <PencilLine size={16} className="text-stone-600" />,

  // --- Financial ---
  DollarSign: <DollarSign size={16} className="text-emerald-600" />,
  Wallet: <Wallet size={16} className="text-stone-700" />,
  PiggyBank: <PiggyBank size={16} className="text-pink-500" />,
  Coins: <Coins size={16} className="text-yellow-600" />,

  // --- Leisure & Lifestyle ---
  BookOpen: <BookOpen size={16} className="text-blue-600" />,
  Coffee: <Coffee size={16} className="text-amber-700" />,
  Music: <Music size={16} className="text-violet-500" />,
  Headphones: <Headphones size={16} className="text-slate-600" />,
  Gamepad2: <Gamepad2 size={16} className="text-indigo-500" />,
  Palette: <Palette size={16} className="text-purple-600" />,
  Camera: <Camera size={16} className="text-zinc-600" />,
  Pizza: <Pizza size={16} className="text-yellow-600" />,
  Apple: <Apple size={16} className="text-red-500" />,
  BedDouble: <BedDouble size={16} className="text-blue-500" />,

  // --- Travel & Outdoors ---
  Plane: <Plane size={16} className="text-slate-500" />,
  Mountain: <Mountain size={16} className="text-stone-600" />,
  Globe: <Globe size={16} className="text-blue-400" />,
  Anchor: <Anchor size={16} className="text-blue-800" />,
  Tent: <Tent size={16} className="text-emerald-600" />,
  Car: <Car size={16} className="text-slate-600" />,
  Waves: <Waves size={16} className="text-blue-500" />,

  // --- Others ---
  BrainCircuit: <BrainCircuit size={16} className="text-indigo-400" />,
  Dna: <Dna size={16} className="text-indigo-600" />,
  Trash2: <Trash2 size={16} className="text-slate-400" />,
  Smartphone: <Smartphone size={16} className="text-slate-600" />,
  Phone: <Phone size={16} className="text-indigo-500" />,
  ShieldAlert: <ShieldAlert size={16} className="text-red-600" />,
  Gem: <Gem size={16} className="text-cyan-400" />,
  Grape: <Grape size={16} className="text-purple-500" />,
  School: <School size={16} className="text-indigo-700" />,
  Soup: <Soup size={16} className="text-orange-500" />,
  Sofa: <Sofa size={16} className="text-amber-800" />,
  Candy: <Candy size={16} className="text-pink-400" />,
  Egg: <Egg size={16} className="text-yellow-101" />,
  Library: <Library size={16} className="text-amber-900" />,
  SparklesIcon: <SparklesIcon size={16} className="text-yellow-400" />,
  Ghost: <Ghost size={16} className="text-slate-300" />,
  Cloud: <Cloud size={16} className="text-sky-300" />,
  Package: <Package size={16} className="text-amber-700" />
};

export const LUCIDE_ICON_KEYS = Object.keys(ICON_MAP);
export const ICON_KEYS = [...LUCIDE_ICON_KEYS, ...DEFAULT_EMOJIS];

// Initial state is now empty
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