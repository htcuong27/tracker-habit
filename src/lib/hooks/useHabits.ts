import { useState, useEffect } from "react";
import { Habit } from "../types";
import { getAllHabits, addHabit, updateHabit, deleteHabit, initDB } from "../db";

export const useHabits = () => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHabits();
    }, []);

    const loadHabits = async () => {
        try {
            await initDB();
            const data = await getAllHabits();

            // If no habits, add default ones
            if (data.length === 0) {
                const defaultHabits: Habit[] = [
                    {
                        id: `habit-${Date.now()}-1`,
                        name: "Sáng sớm tập Gym",
                        icon: "💪",
                        color: "#f43f5e",
                        streak: 0,
                        completedDays: {},
                        reminderTime: "08:00",
                        frequency: ["daily"]
                    },
                    {
                        id: `habit-${Date.now()}-2`,
                        name: "Đọc 10 trang sách",
                        icon: "📚",
                        color: "#8b5cf6",
                        streak: 0,
                        completedDays: {},
                        reminderTime: "09:00",
                        frequency: ["daily"]
                    },
                    {
                        id: `habit-${Date.now()}-2`,
                        name: "Học tiếng Anh",
                        icon: "📚",
                        color: "#8b5cf6",
                        streak: 0,
                        completedDays: {},
                        reminderTime: "10:00",
                        frequency: ["daily"]
                    },
                    {
                        id: `habit-${Date.now()}-2`,
                        name: "Học tiếng Trung",
                        icon: "📚",
                        color: "#8b5cf6",
                        streak: 0,
                        completedDays: {},
                        reminderTime: "11:00",
                        frequency: ["daily"]
                    },
                    {
                        id: `habit-${Date.now()}-2`,
                        name: "Coding",
                        icon: "📚",
                        color: "#8b5cf6",
                        streak: 0,
                        completedDays: {},
                        reminderTime: "14:00",
                        frequency: ["daily"]
                    },
                    {
                        id: `habit-${Date.now()}-3`,
                        name: "Uống 2L nước",
                        icon: "💧",
                        color: "#0ea5e9",
                        streak: 0,
                        completedDays: {},
                        reminderTime: "20:00",
                        frequency: ["daily"]
                    },
                ];

                for (const habit of defaultHabits) {
                    try {
                        await addHabit(habit);
                    } catch (err) {
                        console.warn("Habit already exists, skipping");
                    }
                }
                const refreshedData = await getAllHabits();
                setHabits(refreshedData);
            } else {
                setHabits(data);
            }
        } catch (error) {
            console.error("Error loading habits:", error);
        } finally {
            setLoading(false);
        }
    };

    const createHabit = async (habit: Habit) => {
        try {
            await addHabit(habit);
            setHabits((prev) => [...prev, habit]);
        } catch (error) {
            console.error("Error creating habit:", error);
            throw error;
        }
    };

    const modifyHabit = async (habit: Habit) => {
        try {
            await updateHabit(habit);
            setHabits((prev) => prev.map((h) => (h.id === habit.id ? habit : h)));
        } catch (error) {
            console.error("Error updating habit:", error);
            throw error;
        }
    };

    const removeHabit = async (id: string) => {
        try {
            await deleteHabit(id);
            setHabits((prev) => prev.filter((h) => h.id !== id));
        } catch (error) {
            console.error("Error deleting habit:", error);
            throw error;
        }
    };

    return {
        habits,
        loading,
        createHabit,
        modifyHabit,
        removeHabit,
        refreshHabits: loadHabits,
    };
};
