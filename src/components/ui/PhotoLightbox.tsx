"use client";

import { X, ChevronLeft, ChevronRight, Trash2, Edit2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Photo, Habit } from "@/lib/types";
import { useLanguage } from "@/lib/context/LanguageContext";

interface PhotoLightboxProps {
    photos: Photo[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onDelete?: (photo: Photo) => void;
    onUpdate?: (photo: Photo) => void;
    habits?: Habit[];
}

export default function PhotoLightbox({ photos, initialIndex, isOpen, onClose, onDelete, onUpdate, habits = [] }: PhotoLightboxProps) {
    const { t, language } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            setIsEditing(false);
        }
    }, [isOpen, initialIndex]);

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentIndex < photos.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsEditing(false);
        }
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsEditing(false);
        }
    };

    const handleDeleteCurrent = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete && confirm("Xóa ảnh này?")) {
            onDelete(photos[currentIndex]);
            if (photos.length === 1) {
                onClose();
            } else if (currentIndex === photos.length - 1) {
                setCurrentIndex(currentIndex - 1);
            }
        }
    };

    const handleHabitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newHabitId = e.target.value;
        if (onUpdate && currentPhoto) {
            onUpdate({ ...currentPhoto, habitId: newHabitId });
        }
    };

    if (!isOpen) return null;

    const currentPhoto = photos[currentIndex];
    const formattedDate = currentPhoto ? new Date(currentPhoto.date).toLocaleDateString(language, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : "";
    const currentHabit = habits.find(h => h.id === currentPhoto?.habitId);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-4"
                    onClick={onClose}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white z-50 hover:bg-white/20"
                    >
                        <X size={24} />
                    </button>

                    <div className="absolute top-4 left-4 flex flex-col gap-1 z-50">
                        <div className="text-white/60 text-xs font-medium uppercase tracking-widest">
                            {currentIndex + 1} / {photos.length}
                        </div>
                        <div className="text-white font-bold text-sm">
                            {formattedDate}
                        </div>
                    </div>

                    <div className="relative w-full h-full flex items-center justify-center pt-16 pb-24">
                        <img
                            src={currentPhoto?.dataUrl}
                            alt="Full View"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Navigation Buttons */}
                        {currentIndex > 0 && (
                            <button
                                onClick={handlePrev}
                                className="absolute left-2 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 backdrop-blur-sm transition-all"
                            >
                                <ChevronLeft size={32} />
                            </button>
                        )}
                        {currentIndex < photos.length - 1 && (
                            <button
                                onClick={handleNext}
                                className="absolute right-2 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 backdrop-blur-sm transition-all"
                            >
                                <ChevronRight size={32} />
                            </button>
                        )}
                    </div>

                    {/* Actions Footer */}
                    <div
                        className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-6 z-50 px-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Habit Tag / Editor */}
                        <div className="flex flex-col items-center gap-2 w-full max-w-xs">
                            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{t("captureModalTag")}</span>

                            {!isEditing ? (
                                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 w-full justify-between">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <span className="text-xl shrink-0">{currentHabit?.icon || "❓"}</span>
                                        <span className="text-white font-bold truncate">
                                            {currentHabit?.name || t("captureModalUnknown")}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors shrink-0"
                                    >
                                        <Edit2 size={16} className="text-white/70" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 w-full">
                                    <div className="relative flex-1">
                                        <select
                                            autoFocus
                                            value={currentPhoto?.habitId || "unknown"}
                                            onChange={(e) => {
                                                handleHabitChange(e);
                                                setIsEditing(false);
                                            }}
                                            onBlur={() => setIsEditing(false)}
                                            className="w-full appearance-none bg-emerald-500/20 backdrop-blur-md text-white border border-emerald-500/40 rounded-xl py-3 px-4 pr-10 font-bold outline-none text-sm"
                                        >
                                            <option value="unknown">{t("captureModalUnknown")}</option>
                                            {habits.map(h => (
                                                <option key={h.id} value={h.id}>{h.icon} {h.name}</option>
                                            ))}
                                        </select>
                                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 rotate-90 pointer-events-none" size={16} />
                                    </div>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="p-3 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-500/30"
                                    >
                                        <Check size={20} strokeWidth={3} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4">
                            {!isEditing && onDelete && (
                                <button
                                    onClick={handleDeleteCurrent}
                                    className="p-4 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors backdrop-blur-md border border-red-500/30"
                                >
                                    <Trash2 size={24} />
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
