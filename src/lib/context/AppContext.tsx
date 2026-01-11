"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface AppContextType {
    userName: string;
    setUserName: (name: string) => void;
    theme: 'dark' | 'light';
    toggleTheme: () => void;
    isMobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
    // Global Actions
    triggerAddHabit: () => void;
    isAddHabitOpen: boolean;
    setAddHabitOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [userName, setUserName] = useState("Cuong");
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [mounted, setMounted] = useState(false);

    // Global Modal States
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAddHabitOpen, setAddHabitOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load saved settings
        const savedName = localStorage.getItem("userName");
        const savedTheme = localStorage.getItem("theme") as 'dark' | 'light';

        if (savedName) setUserName(savedName);
        if (savedTheme) setTheme(savedTheme);
        else setTheme('dark'); // Default to dark/black
    }, []);

    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem("userName", userName);
    }, [userName, mounted]);

    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem("theme", theme);
        // Apply theme to body
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.style.setProperty('--background', '#000000');
            document.documentElement.style.setProperty('--text', '#ffffff');
            document.documentElement.style.setProperty('--card-bg', 'rgba(20, 20, 20, 0.8)');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.setProperty('--background', '#f3f4f6');
            document.documentElement.style.setProperty('--text', '#111827');
            document.documentElement.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.9)');
        }
    }, [theme, mounted]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const triggerAddHabit = () => {
        setAddHabitOpen(true);
    };

    return (
        <AppContext.Provider value={{
            userName,
            setUserName,
            theme,
            toggleTheme,
            isMobileMenuOpen,
            setMobileMenuOpen,
            triggerAddHabit,
            isAddHabitOpen,
            setAddHabitOpen
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useApp must be used within a AppProvider");
    }
    return context;
}
