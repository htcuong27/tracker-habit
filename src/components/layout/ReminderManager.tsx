"use client";

import { useEffect, useRef } from "react";
import { useHabits } from "@/lib/hooks/useHabits";
import { useApp } from "@/lib/context/AppContext";
import { useLanguage } from "@/lib/hooks/useLanguage";

export default function ReminderManager() {
    const { habits } = useHabits();
    const { notificationSettings } = useApp();
    const { t } = useLanguage();
    const lastNotifiedRef = useRef<Record<string, number>>({}); // habitId-timeSlot: timestamp

    useEffect(() => {
        if (!notificationSettings.enabled) return;

        // Request permission if not already granted
        if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }

        const checkReminders = () => {
            if (Notification.permission !== "granted") return;

            const now = new Date();
            const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
            const currentDayKey = String(dayOfWeek + 1); // "1" (Sun) to "7" (Sat)
            const currentTimeStr = now.toTimeString().substring(0, 5); // "HH:MM"

            habits.forEach(habit => {
                if (!habit.reminderTime) return;

                // Check frequency
                const isToday = !habit.frequency || habit.frequency.length === 0 || habit.frequency.includes("daily") || habit.frequency.includes(currentDayKey);
                if (!isToday) return;

                // Parse reminder time
                const [remH, remM] = habit.reminderTime.split(":").map(Number);
                const reminderDate = new Date(now);
                reminderDate.setHours(remH, remM, 0, 0);

                // Advance notification logic
                const advanceMs = notificationSettings.advanceMinutes * 60 * 1000;
                const notificationTime = new Date(reminderDate.getTime() - advanceMs);

                // If current time is past notification time but not more than 1 minute past
                const diff = now.getTime() - notificationTime.getTime();
                const oneMinute = 60 * 1000;

                if (diff >= 0 && diff < oneMinute) {
                    const timeSlot = `${habit.id}-${habit.reminderTime}-${notificationSettings.advanceMinutes}`;
                    const lastNotified = lastNotifiedRef.current[timeSlot];

                    // Only notify once per minute/slot
                    if (!lastNotified || (now.getTime() - lastNotified) > oneMinute) {
                        fireNotification(habit);
                        lastNotifiedRef.current[timeSlot] = now.getTime();
                    }
                }
            });
        };

        const fireNotification = (habit: any) => {
            let title = t("notificationTitle") || "Habit Reminder";
            let body = "";

            if (notificationSettings.advanceMinutes > 0) {
                body = t("notificationAdvanceBody", {
                    name: habit.name,
                    time: habit.reminderTime,
                    minutes: notificationSettings.advanceMinutes
                });
            } else {
                body = t("notificationBody", { name: habit.name });
            }

            // Apply UI Style
            if (notificationSettings.uiStyle === 'vibrant') {
                title = `✨ ${title} ✨`;
                body = `🚀 ${body} 💪`;
            } else if (notificationSettings.uiStyle === 'minimal') {
                title = habit.name;
                body = habit.reminderTime;
            }

            const options: any = {
                body,
                icon: "/icons/icon-192x192.png",
                badge: "/icons/icon-192x192.png",
                tag: `habit-${habit.id}`,
                renotify: true,
                silent: false,
                data: { habitId: habit.id }
            };

            // Vibrate on mobile if supported
            if ('vibrate' in navigator) {
                navigator.vibrate([200, 100, 200]);
            }

            try {
                // Try service worker notification first (better background support)
                if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                    navigator.serviceWorker.ready.then(registration => {
                        registration.showNotification(title, options);
                    });
                } else {
                    new Notification(title, options);
                }
            } catch (e) {
                // Fallback for some browsers
                new Notification(title, options);
            }
        };

        const interval = setInterval(checkReminders, 30000); // Check every 30 seconds
        checkReminders(); // Initial check

        return () => clearInterval(interval);
    }, [habits, notificationSettings, t]);

    return null; // Headless component
}
