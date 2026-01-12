"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import { Habit } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

interface HeatmapProps {
    habits: Habit[];
}

export default function Heatmap({ habits }: HeatmapProps) {
    const { t, language } = useLanguage();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isChangingMonth, setIsChangingMonth] = useState(false);
    const today = new Date();

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
        const count = activityMap[`${y}-${m}-${d}`] || 0;

        return Math.min(count, 3);
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
        setIsChangingMonth(true);
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
        );
        requestAnimationFrame(() => setIsChangingMonth(false));
    };

    const nextMonth = () => {
        const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
        if (next <= today) {
            setCurrentMonth(next);
        }
    };

    const isCurrentMonth = () => {
        return (
            currentMonth.getMonth() === today.getMonth() &&
            currentMonth.getFullYear() === today.getFullYear()
        );
    };

    const activityMap = useMemo(() => {
        const map: Record<string, number> = {};

        habits.forEach(habit => {
            Object.keys(habit.completedDays).forEach(date => {
                if (habit.completedDays[date]) {
                    map[date] = (map[date] || 0) + 1;
                }
            });
        });

        return map;
    }, [habits]);

    const weekDays = t("weekDaysShort").split(",");

    const days = useMemo(() => {
        return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    }, [daysInMonth]);

    // Adjust for Monday start (0=Monday, ... 6=Sunday)
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    return (
        <div className="glass rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold">{t("activity")}</h3>
                <div className="flex items-center gap-1">
                    <button
                        onClick={previousMonth}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-xs font-semibold min-w-[100px] text-center">
                        {currentMonth.toLocaleString(language, { month: "short", year: "numeric" })}
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

            <div className="grid grid-cols-7 gap-1 text-center text-[12px] font-bold text-gray-500 mb-2">
                {weekDays.map((d) => (
                    <div key={d}>{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: adjustedFirstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {days.map((day) => {
                    const date = new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth(),
                        day
                    );
                    const level = getActivityLevel(day);
                    const isToday = day === today.getDate() && isCurrentMonth();

                    return (
                        <div
                            key={day}
                            className={`aspect-square rounded 
                                ${getColor(level)} 
                                ${isToday ? "ring-2 ring-red-500" : ""} 
                                ${isChangingMonth ? "" : "transition-all hover:scale-105"} 
                                hover:z-10 flex items-center justify-center relative group`}
                            title={`${date.toLocaleDateString(language)}: ${level} ${t("habits")}`}
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
                <span>{t("less")}</span>
                <div className="flex gap-0.5">
                    {[0, 1, 2, 3].map((level) => (
                        <div
                            key={level}
                            className={`w-2.5 h-2.5 rounded-sm ${getColor(level)}`}
                        />
                    ))}
                </div>
                <span>{t("more")}</span>
            </div>
        </div>
    );
}
