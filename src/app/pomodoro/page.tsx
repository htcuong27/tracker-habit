"use client";

import { useState, useEffect, useRef } from "react";

import { Play, Pause, RotateCcw, Coffee, Zap, Lock, Unlock, Edit2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_WORK = 25;
const DEFAULT_SHORT = 5;
const DEFAULT_LONG = 15;

type TimerMode = "work" | "shortBreak" | "longBreak";

export default function PomodoroPage() {
    const [mode, setMode] = useState<TimerMode>("work");
    // Time left strictly in seconds
    const [timeLeft, setTimeLeft] = useState(DEFAULT_WORK * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [completedPomodoros, setCompletedPomodoros] = useState(0);
    const [focusMode, setFocusMode] = useState(false);

    // Editing state
    const [isEditing, setIsEditing] = useState(false);
    const [editMinutes, setEditMinutes] = useState(DEFAULT_WORK);
    const [editSeconds, setEditSeconds] = useState(0);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const wakeLockRef = useRef<WakeLockSentinel | null>(null);

    // Initial load defaults
    const getTimerDuration = (timerMode: TimerMode) => {
        switch (timerMode) {
            case "work": return DEFAULT_WORK * 60;
            case "shortBreak": return DEFAULT_SHORT * 60;
            case "longBreak": return DEFAULT_LONG * 60;
        }
    };

    // Auto exit editing when switching mode
    useEffect(() => {
        setIsEditing(false);
    }, [mode]);

    // Handle Wake Lock
    const requestWakeLock = async () => {
        try {
            if ('wakeLock' in navigator) {
                wakeLockRef.current = await navigator.wakeLock.request('screen');
            }
        } catch (err) { console.error(err); }
    };

    const releaseWakeLock = () => {
        if (wakeLockRef.current) {
            wakeLockRef.current.release();
            wakeLockRef.current = null;
        }
    };

    useEffect(() => {
        if (isRunning) {
            requestWakeLock();
            setFocusMode(true);
        } else {
            releaseWakeLock();
            setFocusMode(false);
        }
        return () => releaseWakeLock();
    }, [isRunning]);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleTimerComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, timeLeft]);

    const handleTimerComplete = () => {
        setIsRunning(false);
        setFocusMode(false);

        if (typeof window !== "undefined" && "Notification" in window) {
            if (Notification.permission === "granted") {
                new Notification("Pomodoro hoàn thành!", {
                    body: mode === "work" ? "Hãy nghỉ ngơi!" : "Tiếp tục làm việc!",
                });
            }
        }

        if (mode === "work") {
            setCompletedPomodoros((prev) => prev + 1);
            const nextMode = completedPomodoros % 4 === 3 ? "longBreak" : "shortBreak";
            setMode(nextMode);
            setTimeLeft(getTimerDuration(nextMode));
        } else {
            setMode("work");
            setTimeLeft(getTimerDuration("work"));
        }
    };

    const toggleTimer = () => setIsRunning(!isRunning);

    const stopTimer = () => {
        setIsRunning(false);
        setFocusMode(false);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(getTimerDuration(mode));
    };

    const switchMode = (newMode: TimerMode) => {
        setMode(newMode);
        setTimeLeft(getTimerDuration(newMode));
        setIsRunning(false);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Calculate total duration for progress
    // If editing, use currenttimeLeft as MAX? No, keep it specific.
    // For progress ring, we need a "Total" to compare against. 
    // Simplify: Assume starting time was correct. 
    // OR: Just use timeLeft / initialTime. 
    // Let's use max(timeLeft, default) to avoid weird rings? 
    // Or just static duration based on Mode?
    // If custom time, this is tricky. Let's just use current timeLeft + elapsed? We don't track elapsed.
    // Let's just use "Standard" duration for Ring unless custom.
    const duration = getTimerDuration(mode);
    const progress = (Math.max(0, duration - timeLeft) / duration) * 100; // Inverted logic: Start 0 -> 100? No previous was: (Total - Left) / Total.

    const handleStartEdit = () => {
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        setEditMinutes(m);
        setEditSeconds(s);
        setIsEditing(true);
    };

    const handleSaveTime = () => {
        const newTotal = (editMinutes * 60) + editSeconds;
        setTimeLeft(newTotal);
        setIsEditing(false);
    };

    return (
        <main className="page-container min-h-screen flex flex-col items-center justify-center">
            {/* Focus Mode Overlay */}
            <AnimatePresence>
                {focusMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-8"
                    >
                        <div className="w-full max-w-sm text-center">
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="text-[120px] font-black leading-none text-emerald-400 mb-8 font-mono tracking-tighter"
                            >
                                {formatTime(timeLeft)}
                            </motion.div>
                            <p className="text-gray-400 text-xl font-medium mb-12 animate-pulse">
                                {mode === "work" ? "Đang tập trung..." : "Đang nghỉ ngơi..."}
                            </p>

                            <button onClick={stopTimer} className="w-full bg-red-500/20 text-red-500 border border-red-500/50 py-4 rounded-2xl font-bold text-lg">
                                Dừng lại
                            </button>
                            <p className="text-gray-600 text-sm mt-6">Màn hình sẽ luôn sáng</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="w-full max-w-md">
                <h1 className="text-3xl font-extrabold tracking-tight mb-8 text-center text-emerald-400">
                    Pomodoro
                </h1>

                {/* Mode Selector */}
                <div className="glass rounded-3xl p-2 mb-8 flex gap-2">
                    <button onClick={() => switchMode("work")} className={`flex-1 py-3 rounded-2xl font-bold transition-all ${mode === "work" ? "bg-emerald-500 text-white" : "text-gray-400"}`}>
                        <Zap size={18} className="inline mr-2" />
                        Làm việc
                    </button>
                    <button onClick={() => switchMode("shortBreak")} className={`flex-1 py-3 rounded-2xl font-bold transition-all ${mode === "shortBreak" ? "bg-cyan-500 text-white" : "text-gray-400"}`}>
                        <Coffee size={18} className="inline mr-2" />
                        Nghỉ ngắn
                    </button>
                </div>

                {/* Timer Display */}
                <div className="glass rounded-[48px] p-12 mb-8 relative overflow-hidden">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="50%" cy="50%" r="45%" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                        {/* Simple ring, might look weird if time > default, but good enough for now */}
                        <circle cx="50%" cy="50%" r="45%" fill="none" stroke={mode === 'work' ? "#10b981" : "#06b6d4"} strokeWidth="8" strokeDasharray={`${((timeLeft / duration) * 100) * 2.83} 283`} strokeLinecap="round" className="transition-all duration-1000" />
                    </svg>

                    <div className="relative z-10 text-center flex justify-center">
                        {isEditing ? (
                            <div className="flex flex-col items-center gap-4 py-8">
                                <div className="flex items-center gap-2 text-5xl font-bold text-white">
                                    <input
                                        type="number"
                                        value={editMinutes}
                                        onChange={(e) => setEditMinutes(Number(e.target.value))}
                                        className="bg-transparent border-b-2 border-emerald-500 text-center w-20 focus:outline-none"
                                        autoFocus
                                    />
                                    <span>:</span>
                                    <input
                                        type="number"
                                        value={editSeconds}
                                        onChange={(e) => setEditSeconds(Number(e.target.value))}
                                        className="bg-transparent border-b-2 border-emerald-500 text-center w-20 focus:outline-none"
                                    />
                                </div>
                                <button onClick={handleSaveTime} className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold mt-2">
                                    Lưu
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={handleStartEdit}
                                className={`cursor-pointer hover:scale-105 transition-transform`}
                            >
                                <div className="text-7xl font-black mb-4 text-white hover:text-emerald-400 transition-colors">
                                    {formatTime(timeLeft)}
                                </div>
                                <div className="flex items-center justify-center gap-2 text-gray-400 font-semibold">
                                    Chạm để sửa <Edit2 size={14} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Controls */}
                <div className="flex gap-4 mb-8">
                    <button onClick={toggleTimer} className="flex-1 bg-emerald-500 text-white py-5 rounded-3xl font-bold text-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
                        {isRunning ? <Pause size={24} /> : <Play size={24} />}
                        {isRunning ? "Tạm dừng" : "Bắt đầu"}
                    </button>
                    <button onClick={resetTimer} className="glass p-5 rounded-3xl text-gray-400 hover:text-white transition-all active:scale-95">
                        <RotateCcw size={24} />
                    </button>
                </div>

                <div className="glass rounded-3xl p-6 text-center">
                    <p className="text-gray-400 text-sm mb-2">Pomodoro hôm nay</p>
                    <p className="text-4xl font-black text-emerald-400">{completedPomodoros}</p>
                </div>
            </div>

            {/* Focus Mode Overlay covers everything, no need to manually hide nav if z-index is correct */}
        </main>
    );
}
