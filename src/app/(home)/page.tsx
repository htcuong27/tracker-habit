"use client";

import { useState, useEffect } from "react";
import { useHabits } from "@/lib/hooks/useHabits";
import { useLanguage } from "@/lib/hooks/useLanguage";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/lib/context/AppContext";
import { Loader2 } from "lucide-react";

import CaptureModal from "@/components/ui/CaptureModal";
import HabitFormModal from "@/components/ui/HabitFormModal";
import Heatmap from "@/components/ui/Heatmap";

import { getAllPhotos, addPhoto } from "@/lib/db";
import { Photo, Habit } from "@/lib/types";

// Import new components
import HomeHeader from "./components/HomeHeader";
import ProgressOverview from "./components/ProgressOverview";
import HabitList from "./components/HabitList";

export default function Home() {
    const { habits, loading, modifyHabit, createHabit, removeHabit } = useHabits();
    const { t } = useLanguage();
    const [activeHabitForPhoto, setActiveHabitForPhoto] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);
    const [todayPhotos, setTodayPhotos] = useState<Photo[]>([]);
    const { isAddHabitOpen, setAddHabitOpen } = useApp();

    // Handle Global Add Trigger
    useEffect(() => {
        if (isAddHabitOpen) {
            setEditingHabit(undefined);
            setIsFormOpen(true);
            setAddHabitOpen(false);
        }
    }, [isAddHabitOpen, setAddHabitOpen]);

    useEffect(() => {
        loadTodayPhotos();

        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/sw.js")
                .catch((error) => console.log("SW registration failed:", error));
        }

        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, [habits]);

    const loadTodayPhotos = async () => {
        try {
            const all = await getAllPhotos();
            const today = new Date().toISOString().split("T")[0];
            setTodayPhotos(all.filter(p => p.date === today));
        } catch (e) {
            console.error(e);
        }
    };

    const toggleComplete = async (id: string) => {
        const today = new Date().toISOString().split("T")[0];
        const habit = habits.find((h) => h.id === id);
        if (!habit) return;

        const isCompleted = !!habit.completedDays[today];
        const newCompletedDays = { ...habit.completedDays };

        if (isCompleted) {
            delete newCompletedDays[today];
            await modifyHabit({
                ...habit,
                completedDays: newCompletedDays,
                streak: Math.max(0, habit.streak - 1),
            });
        } else {
            newCompletedDays[today] = "completed";
            await modifyHabit({
                ...habit,
                completedDays: newCompletedDays,
                streak: habit.streak + 1,
            });
        }
    };

    const handleTogglePhoto = (id: string) => {
        setActiveHabitForPhoto(id);
    };

    const handleCapture = async (photoUrl: string, habitId?: string) => {
        const targetHabitId = habitId || activeHabitForPhoto;
        if (!targetHabitId) return;

        const today = new Date().toISOString().split("T")[0];
        const habit = habits.find((h) => h.id === targetHabitId);

        await addPhoto({
            habitId: targetHabitId,
            date: today,
            dataUrl: photoUrl,
        });

        if (habit && !habit.completedDays[today]) {
            await modifyHabit({
                ...habit,
                completedDays: { ...habit.completedDays, [today]: "completed" },
                streak: habit.streak + 1,
            });
        }

        await loadTodayPhotos();
        setActiveHabitForPhoto(null);
    };

    const handleSaveHabit = async (habit: Habit) => {
        if (editingHabit) {
            await modifyHabit(habit);
        } else {
            await createHabit(habit);
        }
        setEditingHabit(undefined);
    };

    const handleEdit = (habit: Habit) => {
        setEditingHabit(habit);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm(t("deleteConfirm"))) {
            await removeHabit(id);
        }
    };

    const handleAddNew = () => {
        setEditingHabit(undefined);
        setIsFormOpen(true);
    };

    // State for View Mode
    const [viewMode, setViewMode] = useState<"today" | "all">("today");

    // Filter Habits for Today
    const todayKey = new Date().toISOString().split("T")[0];
    const todayDayName = new Date().toLocaleString("en-US", { weekday: "short" });

    // Logic Lọc cho danh sách "Hôm nay"
    const todaysHabits = habits.filter(h => {
        if (h.startDate && todayKey < h.startDate) return false;

        if (!h.frequency || h.frequency.length === 0) return true;
        if (h.frequency.includes("daily")) return true;
        return h.frequency.includes(todayDayName);
    });

    // Danh sách hiển thị dựa trên View Mode
    const displayedHabits = viewMode === "today" ? todaysHabits : habits;

    // Tính toán lại Stats cho Progress Overview (luôn dựa trên TodaysHabits)
    const completedToday = todaysHabits.filter((h) => {
        return !!h.completedDays[todayKey];
    }).length;

    const completionRate = todaysHabits.length > 0 ? Math.round((completedToday / todaysHabits.length) * 100) : 0;

    if (loading) {
        return (
            <main className="page-container min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-emerald-500" size={48} />
            </main>
        );
    }

    return (
        <main className="page-container min-h-screen">
            <div className="sticky top-0 z-50 bg-black">
                <HomeHeader habitsCount={todaysHabits.length} />

                <ProgressOverview
                    todaysHabits={todaysHabits}
                    completionRate={completionRate}
                    completedToday={completedToday}
                />

            </div>

            {/* Heatmap */}
            <Heatmap habits={habits} />

            <HabitList
                displayedHabits={displayedHabits}
                todayPhotos={todayPhotos}
                viewMode={viewMode}
                setViewMode={setViewMode}
                onAddNew={handleAddNew}
                onComplete={toggleComplete}
                onTogglePhoto={handleTogglePhoto}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />

            {/* Modals */}
            {(activeHabitForPhoto || activeHabitForPhoto === "") && (
                <CaptureModal
                    isOpen={activeHabitForPhoto !== null}
                    onCapture={handleCapture}
                    onClose={() => setActiveHabitForPhoto(null)}
                    habits={todaysHabits} // Pass habits for selection
                    preSelectedHabitId={activeHabitForPhoto || undefined}
                />
            )}

            {isFormOpen && (
                <HabitFormModal
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleSaveHabit}
                    habit={editingHabit}
                />
            )}
        </main>
    );
}
