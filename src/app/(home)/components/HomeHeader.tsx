"use client";
import { useApp } from "@/lib/context/AppContext";
import { useLanguage } from "@/lib/hooks/useLanguage";

interface HomeHeaderProps {
    habitsCount: number;
}

export default function HomeHeader({ habitsCount }: HomeHeaderProps) {
    const { t } = useLanguage();
    const { userName } = useApp();
    return (
        <header className="flex justify-between items-center pb-10 pt-6 px-2">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight mb-1">
                    {t("greeting", { name: userName }).split("Keep")[0]}
                    <p className="gradient-text">Keep it up!</p>
                </h1>
                <p className="text-gray-400 font-medium">
                    {t("habitsToday", { count: habitsCount })}
                </p>
            </div>
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500/20 glass flex items-center justify-center p-1">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {userName.substring(0, 2).toUpperCase()}
                </div>
            </div>
        </header>
    );
}
