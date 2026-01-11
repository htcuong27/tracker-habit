"use client";

import { Home, Calendar, Plus, Timer, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/hooks/useLanguage";

import { useApp } from "@/lib/context/AppContext";

interface BottomNavProps {
    onAddClick?: () => void;
}

export default function BottomNav({ onAddClick }: BottomNavProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { t } = useLanguage();
    const { triggerAddHabit } = useApp();

    const handleAddClick = () => {
        if (pathname === '/') {
            triggerAddHabit();
        } else {
            router.push('/?openAdd=true');
        }
    };

    const navItems = [
        { icon: Home, label: t("home"), path: "/" },
        { icon: Calendar, label: t("history"), path: "/history" },
        { icon: Plus, label: "", path: "#", isSpecial: true },
        { icon: Timer, label: "Pomodoro", path: "/pomodoro" }, // Label fixed to Pomodoro as requested
        { icon: User, label: t("profile"), path: "/profile" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#000] border-t border-white/10 px-6 py-3 z-50 mb-[var(--safe-bottom)]">
            <div className="flex justify-between items-center max-w-lg mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;

                    if (item.isSpecial) {
                        return (
                            <button
                                key="add-btn"
                                onClick={handleAddClick}
                                className="bg-emerald-500 p-4 rounded-2xl shadow-lg -mt-10 transform active:scale-95 transition-all shadow-emerald-500/40 border-4 border-[var(--background)]"
                            >
                                <Icon size={28} className="text-white" />
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex flex-col items-center gap-1 transition-all ${isActive ? "text-emerald-400 scale-110" : "text-gray-500 hover:text-gray-300"
                                }`}
                        >
                            <Icon size={22} className={isActive ? "fill-emerald-500/20" : ""} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
