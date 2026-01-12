"use client";
import { ChevronLeft, ChevronRight, Plus, Camera } from "lucide-react";
import { Photo, Habit } from "@/lib/types";
import { useLanguage } from "@/lib/context/LanguageContext";

interface CalendarViewProps {
    currentMonth: Date;
    setCurrentMonth: (date: Date) => void;
    groupedPhotos: Record<string, Photo[]>;
    habits: Habit[];
    setSelectedDate: (date: string) => void;
}

export default function CalendarView({
    currentMonth,
    setCurrentMonth,
    groupedPhotos,
    habits,
    setSelectedDate
}: CalendarViewProps) {
    const { t, language } = useLanguage();

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];

        // Padding
        let startPadding = firstDay.getDay() - 1;
        if (startPadding === -1) startPadding = 6;

        for (let i = 0; i < startPadding; i++) {
            days.push(null);
        }

        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const days = getDaysInMonth(currentMonth);
    const weekDays = [t("mon"), t("tue"), t("wed"), t("thu"), t("fri"), t("sat"), t("sun")];
    const todayStr = new Date().toISOString().split("T")[0];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Nav */}
            <div className="flex justify-between items-center mb-12 text-white px-2">
                <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all active:scale-95"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-xl font-bold tracking-tight">
                        {currentMonth.toLocaleString(language, { month: 'long' })}
                    </span>
                    <span className="text-xs text-gray-500 font-medium tracking-widest uppercase mt-0.5">
                        {currentMonth.getFullYear()}
                    </span>
                </div>
                <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all active:scale-95"
                >
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-y-10 gap-x-4 px-2">
                {weekDays.map(d => (
                    <div key={d} className="text-center text-[10px] uppercase font-heavy tracking-widest text-gray-600 mb-1">{d}</div>
                ))}

                {days.map((date, idx) => {
                    if (!date) return <div key={`empty-${idx}`} />;

                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const dateStr = `${year}-${month}-${day}`;

                    const dayPhotos = groupedPhotos[dateStr] || [];
                    const hasPhoto = dayPhotos.length > 0;
                    const photo = hasPhoto ? dayPhotos[0] : null;
                    const isToday = dateStr === todayStr;

                    const now = new Date();
                    now.setHours(0, 0, 0, 0);
                    const isFuture = date > now;

                    let habitName = "";
                    if (photo && photo.habitId !== "unknown") {
                        const habit = habits.find(h => h.id === photo.habitId);
                        habitName = habit ? habit.name : "";
                    }
                    if (habitName.length > 8) habitName = habitName.substring(0, 8) + "...";

                    return (
                        <div
                            key={idx}
                            className="flex flex-col items-center gap-3 relative"
                        >
                            <div
                                onClick={() => {
                                    if (!isFuture) setSelectedDate(dateStr);
                                }}
                                className={`w-full aspect-square relative transition-all duration-300 active:scale-95 ${hasPhoto ? 'z-10 cursor-pointer' : 'cursor-pointer'} ${isFuture ? 'opacity-20 cursor-default pointer-events-none' : ''}`}
                            >
                                {hasPhoto ? (
                                    <div className="relative w-full h-full">
                                        {/* Background cards for stack effect */}
                                        {dayPhotos.length > 1 && (
                                            <div className="absolute inset-0 translate-x-1 -translate-y-1 bg-white/40 rounded-xl -z-10" />
                                        )}
                                        {dayPhotos.length > 2 && (
                                            <div className="absolute inset-0 translate-x-2 -translate-y-2 bg-white/20 rounded-xl -z-20" />
                                        )}

                                        <div className="w-full h-full rounded-[14px] overflow-hidden border-2 border-white shadow-xl bg-neutral-800">
                                            <img
                                                src={photo!.dataUrl}
                                                className="w-full h-full object-cover max-w-[33px] max-h-[33px]"
                                                alt="Day thumbnail"
                                            />
                                        </div>

                                        {/* Multi-photo badge */}
                                        {dayPhotos.length > 2 && (
                                            <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-black z-20 shadow-lg">
                                                +{dayPhotos.length - 2}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-full h-full rounded-[14px] border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center text-gray-500 hover:border-white/20 transition-colors">
                                        <Plus size={20} strokeWidth={2.5} />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-center">
                                <span className={`text-sm font-bold tracking-tight ${isToday ? 'text-emerald-400' : 'text-gray-400'}`}>
                                    {date.getDate()}
                                </span>
                                {isToday && (
                                    <div className="absolute -bottom-1 w-1 h-1 bg-emerald-400 rounded-full" />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
