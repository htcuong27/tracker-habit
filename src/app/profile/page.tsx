"use client";


import { useLanguage } from "@/lib/hooks/useLanguage";
import { useApp } from "@/lib/context/AppContext";
import { useHabits } from "@/lib/hooks/useHabits";
import { User, Award, Bell, Moon, Globe, Info, Trash2, Edit2, Check } from "lucide-react";
import { useState, useEffect } from "react";

export default function ProfilePage() {
    const { language, changeLanguage, t } = useLanguage();
    const { userName, setUserName, theme, toggleTheme, notificationSettings, updateNotificationSettings } = useApp();
    const { habits } = useHabits();

    const [mounted, setMounted] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState(userName);

    // Calculate Real Stats
    const totalCompletions = habits.reduce((total, habit) => {
        return total + Object.keys(habit.completedDays).length;
    }, 0);

    const points = totalCompletions * 10;

    // Calculate max current streak across all habits
    const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;

    // Calculate badges based on points
    const badgesCount = Math.floor(points / 500) + 1; // 1 badge every 500 points + starter badge

    useEffect(() => {
        setMounted(true);
        if (typeof window !== "undefined" && "Notification" in window) {
            if (Notification.permission !== "granted" && notificationSettings.enabled) {
                updateNotificationSettings({ enabled: false });
            }
        }
        setTempName(userName);
    }, [userName]);

    const handleNotificationToggle = async () => {
        if (!mounted) return;
        if (!notificationSettings.enabled && typeof window !== "undefined" && "Notification" in window) {
            const permission = await Notification.requestPermission();
            updateNotificationSettings({ enabled: permission === "granted" });
            if (permission === "granted") {
                sendTestNotification();
            }
        } else {
            updateNotificationSettings({ enabled: false });
        }
    };

    const sendTestNotification = () => {
        if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            let title = t("notificationTitle");
            let body = t("testNotificationBody");

            if (notificationSettings.uiStyle === 'vibrant') {
                title = `✨ ${title} ✨`;
                body = `🚀 ${body} 💪`;
            } else if (notificationSettings.uiStyle === 'minimal') {
                title = "Habit Snap";
                body = "Test";
            }

            const options: any = {
                body,
                icon: "/icons/icon-192x192.png",
                badge: "/icons/icon-192x192.png",
                tag: "test-notification",
                renotify: true,
                silent: false
            };

            if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);

            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.ready.then(reg => reg.showNotification(title, options));
            } else {
                new Notification(title, options);
            }
        }
    };

    const handleSaveName = () => {
        setUserName(tempName);
        setIsEditingName(false);
    };

    const handleClearData = async () => {
        if (!mounted) return;
        if (confirm("Bạn có chắc muốn xóa tất cả dữ liệu?")) {
            try {
                if (typeof window !== "undefined") {
                    const dbs = await indexedDB.databases();
                    for (const db of dbs) {
                        if (db.name) indexedDB.deleteDatabase(db.name);
                    }
                    localStorage.clear();
                    window.location.reload();
                }
            } catch (error) {
                console.error("Error clearing data:", error);
            }
        }
    };

    if (!mounted) return null;

    return (
        <main className="page-container min-h-screen">
            <header className="flex flex-col items-center mb-10 mt-10">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 p-1 mb-4 shadow-xl shadow-indigo-500/20">
                    <div className="w-full h-full rounded-full border-4 border-[var(--background)] overflow-hidden bg-[var(--background)] flex items-center justify-center">
                        <span className="text-4xl font-black gradient-text">{userName.substring(0, 2).toUpperCase()}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isEditingName ? (
                        <div className="flex gap-2">
                            <input
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-lg font-bold w-40 text-center focus:outline-none focus:border-indigo-500"
                                autoFocus
                            />
                            <button onClick={handleSaveName} className="p-2 bg-indigo-500 rounded-lg text-white">
                                <Check size={16} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold">{userName}</h1>
                            <button onClick={() => setIsEditingName(true)} className="text-gray-500 hover:text-white">
                                <Edit2 size={16} />
                            </button>
                        </>
                    )}
                </div>
            </header>

            {/* Real Stats */}
            <section className="grid grid-cols-3 gap-3 mb-8">
                <div className="glass p-4 rounded-3xl text-center">
                    <p className="text-2xl font-black text-indigo-400">{badgesCount}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">
                        {t("badges")}
                    </p>
                </div>
                <div className="glass p-4 rounded-3xl text-center">
                    <p className="text-2xl font-black text-pink-400">{points}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">
                        {t("points")}
                    </p>
                </div>
                <div className="glass p-4 rounded-3xl text-center">
                    <p className="text-2xl font-black text-green-400">{maxStreak}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">
                        Streak (Day)
                    </p>
                </div>
            </section>

            {/* Settings Section */}
            <section className="mb-6 space-y-3">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">
                    {t("settings")}
                </h2>

                <div className="glass p-5 rounded-3xl space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                                <Bell size={20} />
                            </div>
                            <span className="font-bold">{t("notifications")}</span>
                        </div>
                        <button
                            onClick={handleNotificationToggle}
                            className={`w-12 h-6 rounded-full flex items-center px-1 transition-all ${notificationSettings.enabled ? "bg-indigo-500" : "bg-gray-600"}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${notificationSettings.enabled ? "translate-x-6" : ""}`} />
                        </button>
                    </div>

                    {notificationSettings.enabled && (
                        <div className="space-y-4 pt-2 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="space-y-3">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">
                                    {t("notificationAdvanceTime")}
                                </p>
                                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                    {[0, 5, 10, 15, 30].map((mins) => (
                                        <button
                                            key={mins}
                                            onClick={() => updateNotificationSettings({ advanceMinutes: mins })}
                                            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${notificationSettings.advanceMinutes === mins
                                                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                                                : "bg-white/5 text-gray-400 hover:bg-white/10"
                                                }`}
                                        >
                                            {mins === 0 ? t("atTime") : t("minutesBefore", { count: mins })}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">
                                    {t("notificationStyle")}
                                </p>
                                <div className="flex gap-2">
                                    {['default', 'vibrant', 'minimal'].map((style) => (
                                        <button
                                            key={style}
                                            onClick={() => updateNotificationSettings({ uiStyle: style as any })}
                                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${notificationSettings.uiStyle === style
                                                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                                                : "bg-white/5 text-gray-400 hover:bg-white/10"
                                                }`}
                                        >
                                            {t(`notificationStyle${style.charAt(0).toUpperCase() + style.slice(1)}` as any)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={sendTestNotification}
                                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-bold text-indigo-400 transition-all active:scale-95"
                            >
                                {t("testNotification")}
                            </button>
                        </div>
                    )}
                </div>

                <div className="glass p-5 rounded-3xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                            <Moon size={20} />
                        </div>
                        <span className="font-bold">{t("darkMode")}</span>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-all ${theme === 'dark' ? "bg-indigo-500" : "bg-gray-400"}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${theme === 'dark' ? "translate-x-6" : ""}`} />
                    </button>
                </div>

                <div className="glass p-5 rounded-3xl">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center">
                            <Globe size={20} />
                        </div>
                        <span className="font-bold">{t("language")}</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => changeLanguage("vi")}
                            className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all ${language === "vi" ? "bg-indigo-500 text-white" : "bg-white/5 text-gray-400"}`}
                        >
                            Tiếng Việt
                        </button>
                        <button
                            onClick={() => changeLanguage("en")}
                            className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all ${language === "en" ? "bg-indigo-500 text-white" : "bg-white/5 text-gray-400"}`}
                        >
                            English
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleClearData}
                    className="w-full glass p-5 rounded-3xl flex items-center justify-between text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <Trash2 size={20} />
                        </div>
                        <span className="font-bold">{t("clearData")}</span>
                    </div>
                </button>

                <div className="glass p-5 rounded-3xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-500/10 text-gray-400 flex items-center justify-center">
                        <Info size={20} />
                    </div>
                    <div>
                        <p className="font-bold">{t("about")}</p>
                        <p className="text-xs text-gray-400">{t("version", { version: "2.7.12" })}</p>
                    </div>
                </div>
            </section>


        </main>
    );
}
