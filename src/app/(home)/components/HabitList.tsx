"use client";
import { Habit } from "@/lib/types";
import SwipeableHabitCard from "@/components/ui/SwipeableHabitCard";
import { AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useLanguage } from "@/lib/hooks/useLanguage";

interface HabitListProps {
    displayedHabits: Habit[];
    todayPhotos: { habitId: string, dataUrl: string }[];
    viewMode: "today" | "all";
    setViewMode: (mode: "today" | "all") => void;
    onAddNew: () => void;
    onComplete: (id: string) => void;
    onTogglePhoto: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (habit: Habit) => void;
}

export default function HabitList({
    displayedHabits,
    todayPhotos = [],
    viewMode,
    setViewMode,
    onAddNew,
    onComplete,
    onTogglePhoto,
    onDelete,
    onEdit
}: HabitListProps) {
    const { t } = useLanguage();

    return (
        <section className="my-10 pb-20">
            <div className="flex justify-between items-center mb-6 px-2">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold">Thói quen</h2>
                    <div className="flex bg-white/10 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode("today")}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${viewMode === "today" ? "bg-emerald-500 text-white shadow" : "text-gray-400 hover:text-white"}`}
                        >
                            Hôm nay
                        </button>
                        <button
                            onClick={() => setViewMode("all")}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${viewMode === "all" ? "bg-emerald-500 text-white shadow" : "text-gray-400 hover:text-white"}`}
                        >
                            Tất cả
                        </button>
                    </div>
                </div>

                <button
                    onClick={onAddNew}
                    className="text-emerald-400 text-sm font-bold flex items-center gap-1 hover:text-emerald-300 transition-colors active:scale-95"
                >
                    <Plus size={16} /> {t("addNew")}
                </button>
            </div>

            <div>
                <AnimatePresence mode="popLayout">
                    {displayedHabits.length === 0 ? (
                        <div className="text-center text-gray-400 py-10">
                            <p>{viewMode === "today" ? "Hôm nay không có thói quen nào." : "Bạn chưa có thói quen nào."}</p>
                            <button onClick={onAddNew} className="text-emerald-500 font-bold mt-2">Thêm mới ngay!</button>
                        </div>
                    ) : (
                        displayedHabits.map((habit) => {
                            const habitPhotos = todayPhotos
                                .filter(p => p.habitId === habit.id)
                                .map(p => p.dataUrl);

                            return (
                                <SwipeableHabitCard
                                    key={habit.id}
                                    habit={habit}
                                    onComplete={onComplete}
                                    onTogglePhoto={onTogglePhoto}
                                    onDelete={onDelete}
                                    onEdit={onEdit}
                                    photos={habitPhotos}
                                />
                            );
                        })
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
