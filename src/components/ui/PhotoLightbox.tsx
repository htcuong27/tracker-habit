"use client";

import { X, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Photo } from "@/lib/types";

interface PhotoLightboxProps {
    photos: Photo[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onDelete?: (photo: Photo) => void;
}

export default function PhotoLightbox({ photos, initialIndex, isOpen, onClose, onDelete }: PhotoLightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        if (isOpen) setCurrentIndex(initialIndex);
    }, [isOpen, initialIndex]);

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentIndex < photos.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
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

    if (!isOpen) return null;

    const currentPhoto = photos[currentIndex];

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

                    <div className="absolute top-4 left-4 text-white font-medium z-50">
                        {currentIndex + 1} / {photos.length}
                    </div>

                    <div className="relative w-full h-full flex items-center justify-center">
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
                        className="absolute bottom-10 flex gap-4 z-50"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {onDelete && (
                            <button
                                onClick={handleDeleteCurrent}
                                className="p-4 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors backdrop-blur-md border border-red-500/30"
                            >
                                <Trash2 size={24} />
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
