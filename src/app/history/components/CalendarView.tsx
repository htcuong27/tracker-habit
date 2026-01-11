"use client";
import { ChevronLeft, ChevronRight, Plus, Camera } from "lucide-react";
import { Photo, Habit } from "@/lib/types";

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
    const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
    const todayStr = new Date().toISOString().split("T")[0];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Nav */}
            <div className="flex justify-between items-center mb-10 text-white px-2">
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <span className="text-xl font-bold capitalize tracking-wide">
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-y-8 gap-x-2 px-1">
                {weekDays.map(d => (
                    <div key={d} className="text-center text-sm font-medium text-gray-500 mb-2">{d}</div>
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
                            className="flex flex-col items-center gap-3 group relative"
                        >
                            <div
                                onClick={() => {
                                    if (!isFuture) setSelectedDate(dateStr);
                                }}
                                className={`
                                    w-full aspect-square rounded-[20px] flex items-center justify-center relative transition-all duration-300
                                    ${hasPhoto
                                        ? 'border-[3px] border-white shadow-lg z-10'
                                        : 'border border-dashed border-gray-700 bg-[#111]'
                                    }
                                    ${isFuture ? 'opacity-30 cursor-default' : 'cursor-pointer'}
                                    ${!hasPhoto && !isFuture ? 'hover:border-gray-500' : ''}
                                `}
                            >
                                {hasPhoto ? (
                                    <>
                                        <img
                                            src={photo!.dataUrl}
                                            className="w-full h-full object-cover rounded-[16px]"
                                            alt="Day thumbnail"
                                        />
                                        <div className="absolute -bottom-2 -right-2 z-20">
                                            <div className="w-7 h-7 bg-[#00d09c] rounded-full flex items-center justify-center shadow-lg border-[3px] border-black">
                                                <Plus size={14} className="text-black stroke-[4]" />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    !isFuture && (
                                        <div className="flex flex-col items-center justify-center text-gray-600 gap-1 opacity-60">
                                            <Camera size={18} strokeWidth={1.5} />
                                            <span className="text-[10px] font-bold mt-[-2px]">+</span>
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="flex flex-col items-center min-h-[32px]">
                                <span className={`text-base font-bold leading-none ${isToday ? 'text-[#00d09c]' : 'text-white'}`}>
                                    {date.getDate()}
                                </span>
                                {isToday && (
                                    <div className="w-1.5 h-1.5 bg-[#00d09c] rounded-full mt-1.5" />
                                )}

                                {hasPhoto && habitName && (
                                    <span className="text-[10px] text-gray-500 font-medium mt-1 text-center whitespace-nowrap overflow-hidden text-ellipsis w-[120%]">
                                        {habitName}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
