"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { translations, Language, TranslationKey } from "@/lib/i18n";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    changeLanguage: (lang: Language) => void;
    t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>("vi");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedLang = localStorage.getItem("language") as Language;
        if (savedLang && (savedLang === "vi" || savedLang === "en")) {
            setLanguageState(savedLang);
        } else {
            // Auto detect
            const browserLang = navigator.language.startsWith("vi") ? "vi" : "en";
            setLanguageState(browserLang);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("language", lang);
    };

    const t = (key: TranslationKey, params?: Record<string, string | number>) => {
        let text = translations[language][key] || key;
        if (params) {
            Object.entries(params).forEach(([param, value]) => {
                text = text.replace(`{${param}}`, String(value));
            });
        }
        return text;
    };

    if (!mounted) {
        // Return children with default language to avoid hydration mismatch, 
        // or a loader if preferred. Here we render with default 'vi' but it might flip on client.
        // To be safe for hydration, we can return null or just render.
        // Rendering is better for UX, will update after mount.
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, changeLanguage: setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
