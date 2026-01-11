"use client";
import { ChevronLeft, ChevronRight, CheckCircle2, Clock } from "lucide-react";
import { Photo, Habit } from "@/lib/types";

interface StatsViewProps {
    statsDate: Date;
    setStatsDate: (date: Date) => void;
    habits: Habit[];
    groupedPhotos: Record<string, Photo[]>;
    openLightbox: (list: Photo[], index: number) => void;
}

export default function StatsView({
    statsDate,
    setStatsDate,
    habits,
    groupedPhotos,
    openLightbox
}: StatsViewProps) {

    // Helper to get date string
    const getDateStr = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const dateStr = getDateStr(statsDate);
    const dayPhotos = groupedPhotos[dateStr] || [];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
            {/* Date Nav */}
            <div className="flex justify-between items-center mb-6 glass p-2 rounded-2xl mx-2">
                <button
                    onClick={() => {
                        const prev = new Date(statsDate);
                        prev.setDate(statsDate.getDate() - 1);
                        setStatsDate(prev);
                    }}
                    className="p-3 hover:bg-white/10 rounded-xl transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="text-center">
                    <div className="text-xs text-gray-400 font-bold uppercase">{statsDate.getFullYear()}</div>
                    <div className="text-lg font-bold">
                        {statsDate.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long' })}
                    </div>
                </div>
                <button
                    onClick={() => {
                        const next = new Date(statsDate);
                        next.setDate(statsDate.getDate() + 1);
                        if (next <= new Date()) setStatsDate(next);
                    }}
                    className={`p-3 rounded-xl transition-colors ${statsDate >= new Date() ? "opacity-30 cursor-not-allowed" : "hover:bg-white/10"}`}
                    disabled={statsDate >= new Date()}
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            <div className="space-y-3 px-2">
                {habits.map(habit => {
                    const isCompleted = habit.completedDays[dateStr];
                    const habitPhotos = dayPhotos.filter(p => p.habitId === habit.id);

                    return (
                        <div key={habit.id} className="glass p-4 rounded-3xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl">
                                    {habit.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold">{habit.name}</h4>
                                    <div className={`text-xs font-bold mt-1 inline-flex items-center gap-1 ${isCompleted ? "text-emerald-400" : "text-gray-500"}`}>
                                        {isCompleted ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                        {isCompleted ? "Đã hoàn thành" : "Chưa hoàn thành"}
                                    </div>
                                </div>
                            </div>

                            {/* Photos Thumbnails */}
                            {habitPhotos.length > 0 && (
                                <div className="flex items-center gap-1" onClick={() => openLightbox(habitPhotos, 0)}>
                                    {habitPhotos.slice(0, 2).map((p, i) => (
                                        <div key={i} className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 relative cursor-pointer hover:scale-105 transition-transform">
                                            <img src={p.dataUrl} className="w-full h-full object-cover" />
                                            {i === 1 && habitPhotos.length > 2 && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] font-bold">
                                                    +{habitPhotos.length - 2}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
