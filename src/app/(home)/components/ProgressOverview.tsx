"use client";
import { Trophy, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/hooks/useLanguage";
import { Habit } from "@/lib/types";

interface ProgressOverviewProps {
    todaysHabits: Habit[];
    completionRate: number;
    completedToday: number;
}

export default function ProgressOverview({ todaysHabits, completionRate, completedToday }: ProgressOverviewProps) {
    const { t } = useLanguage();
    return (
        <section className="glass rounded-[32px] p-6 mb-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Trophy size={80} color="#10b981" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 text-emerald-400 font-bold text-sm uppercase tracking-wider">
                    <Sparkles size={16} />
                    <span>{t("progressToday")}</span>
                </div>
                <p className="text-4xl font-black mb-1">{completionRate}%</p>
                <p className="text-gray-400 text-sm mb-6">
                    {t("habitsCompleted", { completed: completedToday, total: todaysHabits.length })}
                </p>

                <div className="flex gap-2">
                    {todaysHabits.map((habit, i) => {
                        const today = new Date().toISOString().split("T")[0];
                        const done = !!habit.completedDays[today];
                        return (
                            <div
                                key={i}
                                className={`flex-1 h-2 rounded-full transition-all ${done ? "bg-emerald-500" : "bg-white/10"
                                    }`}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
