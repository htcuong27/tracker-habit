"use client";
import { useLanguage } from "@/lib/hooks/useLanguage";

interface HomeHeaderProps {
    habitsCount: number;
}

export default function HomeHeader({ habitsCount }: HomeHeaderProps) {
    const { t } = useLanguage();
    return (
        <header className="flex justify-between items-center mb-10 mt-6 px-2">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight mb-1">
                    {t("greeting", { name: "Cuong" }).split("Keep")[0]}
                    <span className="gradient-text">Keep it up!</span>
                </h1>
                <p className="text-gray-400 font-medium">
                    {t("habitsToday", { count: habitsCount })}
                </p>
            </div>
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500/20 glass flex items-center justify-center p-1">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    TC
                </div>
            </div>
        </header>
    );
}
