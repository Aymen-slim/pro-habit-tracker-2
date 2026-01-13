export interface Habit {
  id: string;
  name: string;
  icon: string; // Key for the icon component
  completedDays: Record<number, boolean>; // Key is day number (1-30)
  color?: string;
  goal: number; // Target number of times to complete in the month
}

export interface MentalState {
  day: number;
  mood: number; // 1-10
  motivation: number; // 1-10
}

export interface DayConfig {
  day: number;
  label: string; // e.g., "Mo", "Tu"
  isWeekend: boolean;
}

export interface WeeklyGroup {
  name: string;
  days: DayConfig[];
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: string; // ISO Date string YYYY-MM-DD
  order?: number; // Position within the day (optional for backwards compatibility)
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface ReviewData {
  wins: string;
  challenges: string;
  focus: string;
  rating: number;
}

export interface UserProfile {
  id: string;
  tier: 'basic' | 'premium';
}

// Global Data Structure for Local Persistence
export interface GlobalData {
  monthlyData: Record<string, { habits: Habit[], mentalState: MentalState[] }>; // Key is "YYYY-M"
  tasks: Task[];
  notes: Note[];
  reviews: Record<string, ReviewData>; // Key is "YYYY-MM-DD" (Start of week)
  habitConfig: Habit[]; // Template for new months
  userProfile: UserProfile | null;
}

export type ViewType = 'planner' | 'tracker' | 'review' | 'notes' | 'settings' | 'pricing';