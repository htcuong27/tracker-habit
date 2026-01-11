"use client";

import { Habit } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface HeatmapProps {
    habits: Habit[];
}

export default function Heatmap({ habits }: HeatmapProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const daysInMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
    ).getDate();

    const firstDayOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
    ).getDay();

    const getActivityLevel = (day: number): number => {

        const y = currentMonth.getFullYear();
        const m = String(currentMonth.getMonth() + 1).padStart(2, "0");
        const d = String(day).padStart(2, "0");
        const dateStr = `${y}-${m}-${d}`;
        let count = 0;

        habits.forEach((habit) => {
            if (habit.completedDays[dateStr]) {
                count++;
            }
        });

        if (count === 0) return 0;
        if (count === 1) return 1;
        if (count === 2) return 2;
        return 3;
    };

    const getColor = (level: number): string => {
        switch (level) {
            case 0:
                return "bg-white/5";
            case 1:
                return "bg-green-500/30";
            case 2:
                return "bg-green-500/60";
            case 3:
                return "bg-green-500";
            default:
                return "bg-white/5";
        }
    };

    const previousMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
        );
    };

    const nextMonth = () => {
        const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
        const today = new Date();
        if (next <= today) {
            setCurrentMonth(next);
        }
    };

    const isCurrentMonth = () => {
        const today = new Date();
        return (
            currentMonth.getMonth() === today.getMonth() &&
            currentMonth.getFullYear() === today.getFullYear()
        );
    };

    const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

    // Adjust for Monday start (0=Monday, ... 6=Sunday)
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    return (
        <div className="glass rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold">Hoạt động</h3>
                <div className="flex items-center gap-1">
                    <button
                        onClick={previousMonth}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-xs font-semibold min-w-[100px] text-center">
                        {currentMonth.toLocaleString("vi-VN", { month: "short", year: "numeric" })}
                    </span>
                    <button
                        onClick={nextMonth}
                        disabled={isCurrentMonth()}
                        className={`p-1.5 rounded-lg transition-colors ${isCurrentMonth()
                            ? "opacity-30 cursor-not-allowed"
                            : "hover:bg-white/10"
                            }`}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-500 mb-2">
                {weekDays.map((d) => (
                    <div key={d}>{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: adjustedFirstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const date = new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth(),
                        day
                    );
                    const level = getActivityLevel(day);
                    const isToday =
                        day === new Date().getDate() &&
                        currentMonth.getMonth() === new Date().getMonth() &&
                        currentMonth.getFullYear() === new Date().getFullYear();

                    return (
                        <div
                            key={day}
                            className={`aspect-square rounded ${getColor(level)} ${isToday ? "ring-1 ring-indigo-500" : ""
                                } transition-all hover:scale-110 flex items-center justify-center relative group`}
                            title={`${date.toLocaleDateString("vi-VN")}: ${level} thói quen`}
                        >
                            <span className="text-[8px] font-medium text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                {day}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Legend - Compact */}
            <div className="flex items-center justify-end gap-1 mt-3 text-[10px] text-gray-400">
                <span>Ít</span>
                <div className="flex gap-0.5">
                    {[0, 1, 2, 3].map((level) => (
                        <div
                            key={level}
                            className={`w-2.5 h-2.5 rounded-sm ${getColor(level)}`}
                        />
                    ))}
                </div>
                <span>Nhiều</span>
            </div>
        </div>
    );
}
