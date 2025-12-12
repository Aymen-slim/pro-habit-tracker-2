export interface Habit {
  id: string;
  name: string;
  icon: string; // Key for the icon component
  completedDays: Record<number, boolean>; // Key is day number (1-30)
  color?: string;
  goal: number; // Target number of times to complete in the month
  order?: number; // Display order for priority-based sorting
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
  date: string; // ISO date string YYYY-MM-DD
  order: number;
}