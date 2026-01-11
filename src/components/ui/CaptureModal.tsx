"use client";

import { X, Camera, RefreshCcw, Check, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/hooks/useLanguage";

interface SimpleHabit {
    id: string;
    name: string;
    icon: string;
}

interface CaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (image: string, habitId?: string) => void;
    habits?: SimpleHabit[];
    preSelectedHabitId?: string | null;
}

export default function CaptureModal({ isOpen, onClose, onCapture, habits = [], preSelectedHabitId }: CaptureModalProps) {
    const { t } = useLanguage();
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // States for capture flow
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [selectedHabitId, setSelectedHabitId] = useState<string>(preSelectedHabitId || (habits[0]?.id) || "unknown");

    useEffect(() => {
        if (isOpen) {
            startCamera();
            setCapturedImage(null);
            if (preSelectedHabitId) setSelectedHabitId(preSelectedHabitId);
        } else {
            stopCamera();
        }
    }, [isOpen, preSelectedHabitId]);

    const startCamera = async () => {
        try {
            const s = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false
            });
            setStream(s);
            if (videoRef.current) {
                videoRef.current.srcObject = s;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const handleTakePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(videoRef.current, 0, 0);
            const dataUrl = canvas.toDataURL("image/jpeg");
            setCapturedImage(dataUrl);
            stopCamera();
        }
    };

    const handleRetake = () => {
        setCapturedImage(null);
        startCamera();
    };

    const handleConfirm = () => {
        if (capturedImage) {
            onCapture(capturedImage, selectedHabitId);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black flex flex-col"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
                        <h3 className="text-white font-bold text-shadow">
                            {capturedImage ? "Xác nhận" : "Chụp ảnh"}
                        </h3>
                        <button onClick={onClose} className="p-2 bg-white/10 rounded-full text-white backdrop-blur-md">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Viewport */}
                    <div className="flex-1 relative bg-black flex items-center justify-center">
                        {capturedImage ? (
                            <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                        ) : (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        )}

                        {/* Habit Selector Overlay (Only when captured) */}
                        {capturedImage && (
                            <div className="absolute bottom-32 left-0 right-0 px-6">
                                <label className="block text-white text-xs font-bold uppercase mb-2 text-shadow">Gắn thẻ thói quen</label>
                                <div className="relative">
                                    <select
                                        value={selectedHabitId}
                                        onChange={(e) => setSelectedHabitId(e.target.value)}
                                        className="w-full appearance-none bg-black/50 backdrop-blur-lg text-white border border-white/20 rounded-2xl py-4 px-5 pr-10 font-bold outline-none"
                                    >
                                        <option value="unknown">Chưa xác định</option>
                                        {habits.map(h => (
                                            <option key={h.id} value={h.id}>{h.icon} {h.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white pointer-events-none" size={20} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="p-10 bg-gradient-to-t from-black/90 to-transparent absolute bottom-0 left-0 right-0 flex justify-center items-center gap-10">
                        {capturedImage ? (
                            <>
                                <button onClick={handleRetake} className="flex flex-col items-center gap-1 text-white opacity-80 hover:opacity-100">
                                    <div className="p-4 bg-white/10 rounded-full backdrop-blur-md">
                                        <RefreshCcw size={24} />
                                    </div>
                                    <span className="text-xs font-medium">Chụp lại</span>
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 active:scale-95 transition-transform"
                                >
                                    <Check size={40} strokeWidth={3} />
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={startCamera} className="p-4 bg-white/10 rounded-full text-white opacity-0 pointer-events-none">
                                    <RefreshCcw size={24} />
                                </button>
                                <button
                                    onClick={handleTakePhoto}
                                    className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center relative"
                                >
                                    <div className="w-16 h-16 bg-white rounded-full active:scale-90 transition-transform" />
                                </button>
                                <div className="w-[56px]" /> {/* Spacer to balance layout */}
                            </>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
