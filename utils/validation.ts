import { z } from 'zod';

export const TaskSchema = z.object({
    id: z.string().uuid().or(z.string().min(1)), // UUID or temp ID
    text: z.string().min(1, "Task cannot be empty").max(200, "Task is too long (max 200 chars)"),
    completed: z.boolean(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
});

export const HabitSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Name cannot be empty").max(50, "Name is too long (max 50 chars)"),
    icon: z.string(),
    goal: z.number().min(1).max(31),
    completedDays: z.record(z.coerce.number(), z.boolean())
});

export const MentalStateSchema = z.object({
    day: z.number().min(1).max(31),
    mood: z.number().min(1).max(10),
    motivation: z.number().min(1).max(10)
});

export const NoteSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "Title cannot be empty").max(100, "Title is too long (max 100 chars)"),
    content: z.string().max(5000, "Note content is too long"),
    createdAt: z.string() // ISO date check could be stricter
});

export const ReviewDataSchema = z.object({
    wins: z.string().max(1000, "Wins text too long"),
    challenges: z.string().max(1000, "Challenges text too long"),
    focus: z.string().max(1000, "Focus text too long"),
    rating: z.number().min(1).max(10)
});
