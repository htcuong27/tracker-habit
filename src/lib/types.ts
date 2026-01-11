export interface Habit {
    id: string;
    name: string;
    icon: string;
    color: string;
    streak: number;
    completedDays: Record<string, string>; // date (YYYY-MM-DD): photoUrl or "completed"
    frequency?: string[]; // ["Mon", "Tue", ...] or "daily"
    reminderTime?: string; // "08:00"
    startDate?: string; // "YYYY-MM-DD"
}

export interface HabitEntry {
    date: string;
    photoUrl?: string;
    note?: string;
}

export interface Photo {
    id?: number;
    habitId: string;
    date: string;
    dataUrl: string;
    note?: string;
}
