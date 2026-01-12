"use client";

import { useState } from "react";
import { Habit } from "@/lib/types";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Camera, Check, Flame, Repeat } from "lucide-react";

interface SwipeableHabitCardProps {
    habit: Habit;
    onComplete: (id: string) => void;
    onTogglePhoto: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (habit: Habit) => void;
    photos?: string[];
}

export default function SwipeableHabitCard({
    habit,
    onComplete,
    onTogglePhoto,
    onDelete,
    onEdit,
    photos = []
}: SwipeableHabitCardProps) {
    const [isRevealed, setIsRevealed] = useState(false);
    const x = useMotionValue(0);

    // Dynamic opacity/blur for actions based on drag distance
    const actionOpacity = useTransform(x, [-50, 0], [1, 0]);
    const actionBlur = useTransform(x, [-50, 0], ["blur(0px)", "blur(10px)"]);

    const isCompletedToday = !!habit.completedDays[new Date().toLocaleDateString('en-CA')];
    // Note: using en-CA for YYYY-MM-DD format consistency with local time

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x < -60) {
            setIsRevealed(true);
            x.set(-160); // Width of the two buttons (80px each)
        } else {
            setIsRevealed(false);
            x.set(0);
        }
    };

    const formatFrequency = (freq?: string[]) => {
        if (!freq || freq.length === 0 || freq.includes("daily")) return "Mỗi ngày";
        const map: { [key: string]: string } = {
            "Mon": "T2", "Tue": "T3", "Wed": "T4", "Thu": "T5", "Fri": "T6", "Sat": "T7", "Sun": "CN"
        };
        return freq.map(d => map[d] || d).join(", ");
    };

    const freqText = formatFrequency(habit.frequency);

    return (
        <div className="relative mb-3 h-[88px]">
            {/* Background Actions */}
            <motion.div
                style={{ opacity: actionOpacity, filter: actionBlur }}
                className="absolute inset-y-0 right-0 flex w-[160px] rounded-r-3xl overflow-hidden"
            >
                <button
                    onClick={() => {
                        onEdit(habit);
                        x.set(0);
                    }}
                    className="flex-1 bg-amber-500 text-white font-bold text-sm flex items-center justify-center hover:bg-amber-600 transition-colors"
                >
                    Sửa
                </button>
                <button
                    onClick={() => onDelete(habit.id)}
                    className="flex-1 bg-red-500 text-white font-bold text-sm flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                    Xoá
                </button>
            </motion.div>

            {/* Main Card */}
            <motion.div
                drag="x"
                dragConstraints={{ left: -160, right: 0 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
                style={{ x }}
                className={`absolute inset-0 glass rounded-3xl p-4 flex items-center justify-between z-10 cursor-grab active:cursor-grabbing border ${isCompletedToday ? "border-emerald-500/30 bg-emerald-900/10" : "border-white/5"
                    } transition-colors`}
            >
                <div className="flex items-center gap-4">
                    <div
                        style={isCompletedToday ? { backgroundColor: habit.color } : undefined}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner transition-colors duration-300 ${isCompletedToday ? "text-white" : "bg-white/5 text-gray-400"}`}
                    >
                        {habit.icon}
                    </div>
                    <div>
                        <h3 className={`text-base font-bold transition-colors ${isCompletedToday ? "text-emerald-400" : "text-white"}`}>
                            {habit.name}
                        </h3>
                        <div className="flex items-center gap-3 text-xs font-semibold mt-0.5 text-gray-500">
                            <div className="flex items-center gap-1">
                                <Flame size={12} className={habit.streak > 0 ? "text-orange-500 fill-orange-500" : "text-gray-600"} />
                                <span className={habit.streak > 0 ? "text-orange-400" : ""}>{habit.streak} ngày</span>
                            </div>

                            {/* Frequency Badge */}
                            <div className="flex items-center gap-1 text-gray-600 bg-white/5 px-2 py-0.5 rounded-md">
                                <Repeat size={10} />
                                <span>{freqText}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Photo Thumbnails */}
                    {photos.length > 0 && (
                        <div className="flex -space-x-2">
                            {photos.slice(0, 2).map((url, i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-black overflow-hidden bg-gray-800">
                                    <img src={url} alt="checkin" className="w-full h-full object-cover" />
                                </div>
                            ))}
                            {photos.length > 2 && (
                                <div className="w-8 h-8 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center text-[8px] text-white">
                                    +{photos.length - 2}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Camera Button (Dashed) */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onTogglePhoto(habit.id);
                        }}
                        className="w-10 h-10 rounded-full border-2 border-dashed border-gray-600 hover:border-emerald-400 text-gray-500 hover:text-emerald-400 flex items-center justify-center transition-all"
                    >
                        <Camera size={16} />
                    </button>

                    {/* Check Box Area */}
                    <button
                        onClick={() => onComplete(habit.id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompletedToday
                            ? "bg-emerald-500 border-emerald-500 text-white scale-110 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                            : "border-gray-600 text-transparent hover:border-gray-400"
                            }`}
                    >
                        <Check size={18} strokeWidth={4} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
