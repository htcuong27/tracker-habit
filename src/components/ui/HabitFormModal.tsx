"use client";

import { useState, useEffect } from "react";
import { Habit } from "@/lib/types";
import { X, Clock, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HabitFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (habit: Habit) => void;
    habit?: Habit;
}

const EMOJI_OPTIONS = ["💪", "📚", "💧", "🏃", "🧘", "🎯", "✍️", "🎨", "🎵", "🍎", "😴", "🧠"];
const COLOR_OPTIONS = [
    "#f43f5e",
    "#8b5cf6",
    "#0ea5e9",
    "#10b981",
    "#f59e0b",
    "#ec4899",
    "#6366f1",
    "#14b8a6",
];

const DAYS_OF_WEEK = [
    { key: "Mon", label: "T2" },
    { key: "Tue", label: "T3" },
    { key: "Wed", label: "T4" },
    { key: "Thu", label: "T5" },
    { key: "Fri", label: "T6" },
    { key: "Sat", label: "T7" },
    { key: "Sun", label: "CN" },
];

export default function HabitFormModal({ isOpen, onClose, onSave, habit }: HabitFormModalProps) {
    const [name, setName] = useState(habit?.name || "");
    const [icon, setIcon] = useState(habit?.icon || "💪");
    const [color, setColor] = useState(habit?.color || "#f43f5e");

    // New fields
    const [reminderTime, setReminderTime] = useState(habit?.reminderTime || "");
    const [isDaily, setIsDaily] = useState(!habit?.frequency || habit.frequency.length === 0 || habit.frequency.includes("daily"));
    const [selectedDays, setSelectedDays] = useState<string[]>(
        habit?.frequency && !habit.frequency.includes("daily") ? habit.frequency : []
    );

    const [startDate, setStartDate] = useState(habit?.startDate);

    const getMMSS = () => {
        const date = new Date();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
    };

    useEffect(() => {
        if (isOpen) {
            setName(habit?.name || "");
            setIcon(habit?.icon || "💪");
            setColor(habit?.color || "#f43f5e");
            const time = getMMSS();
            setReminderTime(habit?.reminderTime || time);
            const hasFrequency = habit?.frequency && habit.frequency.length > 0 && !habit.frequency.includes("daily");
            setIsDaily(!hasFrequency);
            setSelectedDays(hasFrequency ? habit!.frequency! : []);
            setStartDate(habit?.startDate);
        }
    }, [isOpen, habit]);



    const toggleDay = (dayKey: string) => {
        if (selectedDays.includes(dayKey)) {
            setSelectedDays(selectedDays.filter(d => d !== dayKey));
        } else {
            setSelectedDays([...selectedDays, dayKey]);
        }
    };

    const handleSave = () => {
        if (!name.trim()) return;

        const finalFrequency = isDaily ? ["daily"] : selectedDays;

        const newHabit: Habit = {
            id: habit?.id || `habit-${Date.now()}`,
            name: name.trim(),
            icon,
            color,
            streak: habit?.streak || 0,
            completedDays: habit?.completedDays || {},
            frequency: finalFrequency,
            reminderTime: reminderTime || undefined,
            startDate,
        };

        onSave(newHabit);
        onClose();

        // Reset only if creating new (managed by useEffect mostly, but hygiene)
        // if (!habit) {
        //     setName("");
        //     setIcon("💪");
        //     setColor("#f43f5e");
        //     setReminderTime("");
        //     setIsDaily(true);
        //     setSelectedDays([]);
        //     setStartDate(new Date().toISOString().split("T")[0]);
        // }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/80 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
                        className="glass rounded-t-[32px] sm:rounded-[32px] p-6 w-full max-w-md border border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                {habit ? "Chỉnh sửa thói quen" : "Tạo thói quen mới"}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Name Input */}
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">Tên thói quen</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ví dụ: Tập gym buổi sáng"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Reminder Time */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2 flex items-center gap-2">
                                        <Clock size={16} /> Giờ nhắc nhở
                                    </label>
                                    <input
                                        type="time"
                                        value={reminderTime}
                                        onChange={(e) => { setReminderTime(e.target.value) }}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                                    />
                                </div>

                                {/* Start Date */}
                                <div>
                                    <label className="text-sm font-bold text-gray-400 mb-2 flex items-center gap-2">
                                        <Calendar size={16} /> Ngày bắt đầu
                                    </label>
                                    <input
                                        type="date"
                                        defaultValue={new Date().toISOString().split("T")[0]}
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Frequency */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                                        <Calendar size={16} /> Lặp lại
                                    </label>
                                    <button
                                        onClick={() => setIsDaily(!isDaily)}
                                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                                    >
                                        {isDaily ? "Tùy chỉnh ngày" : "Chuyển về Hàng ngày"}
                                    </button>
                                </div>

                                {isDaily ? (
                                    <div className="p-3 bg-white/5 rounded-2xl text-center text-sm font-medium text-gray-300 border border-white/10">
                                        Mỗi ngày
                                    </div>
                                ) : (
                                    <div className="flex justify-between gap-1">
                                        {DAYS_OF_WEEK.map((day) => {
                                            const isSelected = selectedDays.includes(day.key);
                                            return (
                                                <button
                                                    key={day.key}
                                                    onClick={() => toggleDay(day.key)}
                                                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${isSelected
                                                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 scale-105"
                                                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                                                        }`}
                                                >
                                                    {day.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Icon Selector */}
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">Biểu tượng</label>
                                <div className="grid grid-cols-6 gap-2">
                                    {EMOJI_OPTIONS.map((emoji) => (
                                        <button
                                            key={emoji}
                                            onClick={() => setIcon(emoji)}
                                            className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-all ${icon === emoji
                                                ? "bg-indigo-500 scale-110 shadow-lg shadow-indigo-500/30"
                                                : "bg-white/5 hover:bg-white/10"
                                                }`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Selector */}
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">Màu sắc</label>
                                <div className="grid grid-cols-8 gap-2">
                                    {COLOR_OPTIONS.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => setColor(c)}
                                            className={`aspect-square rounded-xl transition-all ${color === c ? "ring-2 ring-white ring-offset-2 ring-offset-[#0f172a] scale-110" : ""
                                                }`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 rounded-2xl font-bold text-gray-400 bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={!name.trim()}
                                    className="flex-1 py-3 rounded-2xl font-bold text-white bg-gradient-to-br from-indigo-500 to-pink-500 hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {habit ? "Lưu" : "Tạo"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
