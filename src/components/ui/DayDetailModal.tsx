"use client";
import { X, Plus, Camera } from "lucide-react";
import { Photo } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useLanguage } from "@/lib/context/LanguageContext";

interface DayDetailModalProps {
    date: string;
    photos: Photo[];
    onClose: () => void;
    onAddPhoto: () => void;
    onPhotoClick: (photo: Photo) => void;
}

export default function DayDetailModal({ date, photos, onClose, onAddPhoto, onPhotoClick }: DayDetailModalProps) {
    const { t, language } = useLanguage();
    const formattedDate = new Date(date).toLocaleDateString(language, { weekday: 'long', day: 'numeric', month: 'long' });

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-[#111] border border-white/10 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6 max-h-[calc(100vh-4rem)] relative">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white capitalize">{formattedDate}</h3>
                            <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                            {photos.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-gray-500 gap-4">
                                    <p>{t("noPhotos")}</p>
                                    <button
                                        onClick={onAddPhoto}
                                        className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                                    >
                                        <Camera size={20} />
                                        {t("addPhoto")}
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 pb-2">
                                    {photos.map((photo) => (
                                        <div
                                            key={photo.id}
                                            onClick={() => onPhotoClick(photo)}
                                            className="aspect-square rounded-2xl overflow-hidden relative cursor-pointer group"
                                        >
                                            <img src={photo.dataUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="" />
                                        </div>
                                    ))}
                                    <button
                                        onClick={onAddPhoto}
                                        className="aspect-square rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-gray-400 hover:text-emerald-400 hover:border-emerald-400 transition-colors gap-2"
                                    >
                                        <Plus size={24} />
                                        <span className="text-xs font-bold">{t("addPhoto")}</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={onAddPhoto}
                            className="absolute bottom-4 right-4 z-50 p-2 bg-emerald-500 rounded-full active:scale-95 transition-colors"
                        >
                            <Plus size={40} />
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
