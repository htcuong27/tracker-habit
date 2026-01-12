"use client";

import { X, Camera, RefreshCcw, Check, ChevronDown, Image as ImageIcon } from "lucide-react";
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
    const fileInputRef = useRef<HTMLInputElement>(null);

    // States for capture flow
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [selectedHabitId, setSelectedHabitId] = useState<string>(preSelectedHabitId || (habits[0]?.id) || "unknown");
    const [focusPoint, setFocusPoint] = useState<{ x: number, y: number } | null>(null);
    const [mode, setMode] = useState<'photo' | 'square'>('square');
    const [facingMode, setFacingMode] = useState<VideoFacingModeEnum>('environment');

    useEffect(() => {
        if (isOpen) {
            startCamera();
            setCapturedImage(null);
            if (preSelectedHabitId) setSelectedHabitId(preSelectedHabitId);
        } else {
            stopCamera();
        }
    }, [isOpen, preSelectedHabitId, facingMode]);

    const startCamera = async () => {
        stopCamera(); // Clean up existing stream if any
        try {
            const s = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: facingMode },
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
            const video = videoRef.current;
            const canvas = document.createElement("canvas");

            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;
            const videoAspect = videoWidth / videoHeight;

            let targetWidth, targetHeight, sx, sy, sWidth, sHeight;

            if (mode === 'square') {
                // Square 1:1
                const size = Math.min(videoWidth, videoHeight);
                targetWidth = 1080;
                targetHeight = 1080;
                sx = (videoWidth - size) / 2;
                sy = (videoHeight - size) / 2;
                sWidth = size;
                sHeight = size;
            } else {
                // Photo 3:4 (using video aspect if close, otherwise cropping to 3:4)
                const targetAspect = 3 / 4;
                if (videoAspect > targetAspect) {
                    // Video is wider than 3:4, crop sides
                    sHeight = videoHeight;
                    sWidth = videoHeight * targetAspect;
                    sx = (videoWidth - sWidth) / 2;
                    sy = 0;
                } else {
                    // Video is taller than 3:4, crop top/bottom
                    sWidth = videoWidth;
                    sHeight = videoWidth / targetAspect;
                    sx = 0;
                    sy = (videoHeight - sHeight) / 2;
                }
                targetWidth = 1080;
                targetHeight = 1440;
            }

            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);
            }

            const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
            setCapturedImage(dataUrl);
            stopCamera();
        }
    };

    const handleRetake = () => {
        setCapturedImage(null);
        startCamera();
    };

    const handleGalleryClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const targetAspect = mode === 'square' ? 1 : 3 / 4;

                    let targetWidth, targetHeight, sx, sy, sWidth, sHeight;
                    const imgAspect = img.width / img.height;

                    if (imgAspect > targetAspect) {
                        // Image is wider than target
                        sHeight = img.height;
                        sWidth = img.height * targetAspect;
                        sx = (img.width - sWidth) / 2;
                        sy = 0;
                    } else {
                        // Image is taller than target
                        sWidth = img.width;
                        sHeight = img.width / targetAspect;
                        sx = 0;
                        sy = (img.height - sHeight) / 2;
                    }

                    targetWidth = mode === 'square' ? 1080 : 1080;
                    targetHeight = mode === 'square' ? 1080 : 1440;

                    canvas.width = targetWidth;
                    canvas.height = targetHeight;
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);
                    }

                    setCapturedImage(canvas.toDataURL("image/jpeg", 0.9));
                    stopCamera();
                };
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTapToFocus = (e: React.MouseEvent | React.TouchEvent) => {
        if (capturedImage) return;

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        setFocusPoint({ x, y });

        // Auto hide focus box
        setTimeout(() => setFocusPoint(null), 1000);
    };

    const handleConfirm = () => {
        if (capturedImage) {
            onCapture(capturedImage, selectedHabitId);
            onClose();
        }
    };

    const toggleCamera = () => {
        setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
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
                    <div className="flex justify-between items-center p-6 bg-black z-10 shrink-0">
                        <div className="w-10" /> {/* Spacer */}
                        <h3 className="text-white font-bold text-sm tracking-wider uppercase">
                            {capturedImage ? t("captureModalConfirm") : t("captureModalTitle")}
                        </h3>
                        <button onClick={onClose} className="p-2 bg-white/10 rounded-full text-white backdrop-blur-md">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Viewport Area */}
                    <div className="flex-1 flex items-center justify-center bg-black overflow-hidden py-10 px-4">
                        <div
                            className={`relative w-full max-h-full bg-neutral-900 shadow-2xl overflow-hidden transition-all duration-300 ease-in-out ${mode === 'square' ? 'aspect-square max-w-[400px]' : 'aspect-[3/4]'
                                }`}
                            onClick={handleTapToFocus}
                        >
                            {capturedImage ? (
                                <img src={capturedImage} alt="Captured" className="w-full h-full object-cover max-w-[33px] max-h-[33px]" />
                            ) : (
                                <>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        className={`w-full h-full object-cover ${facingMode === 'user' ? '-scale-x-100' : ''}`}
                                    />

                                    {/* Camera Grid */}
                                    <div className="absolute inset-0 pointer-events-none">
                                        <div className={`h-full w-full grid grid-cols-3 grid-rows-3 opacity-30 ${mode === 'square' ? 'border' : ''} border-white/20`}>
                                            {[...Array(9)].map((_, i) => (
                                                <div key={i} className="border-[0.5px] border-white/30" />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Focus UI */}
                                    <AnimatePresence>
                                        {focusPoint && (
                                            <motion.div
                                                initial={{ scale: 1.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute w-16 h-16 border border-yellow-400 z-20 pointer-events-none"
                                                style={{
                                                    left: focusPoint.x - 32,
                                                    top: focusPoint.y - 32,
                                                }}
                                            >
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-yellow-400" />
                                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-yellow-400" />
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0.5 bg-yellow-400" />
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-0.5 bg-yellow-400" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}

                            {/* Habit Selector Overlay (Only when captured) */}
                            {capturedImage && (
                                <div className="absolute bottom-6 left-0 right-0 px-6 z-30">
                                    <div className="relative">
                                        <select
                                            value={selectedHabitId}
                                            onChange={(e) => setSelectedHabitId(e.target.value)}
                                            className="w-full appearance-none bg-black/60 backdrop-blur-md text-white border border-white/20 rounded-xl py-3 px-4 pr-10 font-bold outline-none text-sm"
                                        >
                                            <option value="unknown">{t("captureModalUnknown")}</option>
                                            {habits.map(h => (
                                                <option key={h.id} value={h.id}>{h.icon} {h.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none" size={16} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="bg-black shrink-0 flex flex-col items-center pb-12 pt-6">
                        {/* Mode selector style */}
                        {!capturedImage && (
                            <div className="flex gap-8 mb-8">
                                <button
                                    onClick={() => setMode('photo')}
                                    className={`text-[11px] font-bold uppercase tracking-[0.15em] transition-colors ${mode === 'photo' ? 'text-yellow-400' : 'text-white/40'
                                        }`}
                                >
                                    {t("captureModalPhoto")}
                                </button>
                                <button
                                    onClick={() => setMode('square')}
                                    className={`text-[11px] font-bold uppercase tracking-[0.15em] transition-colors ${mode === 'square' ? 'text-yellow-400' : 'text-white/40'
                                        }`}
                                >
                                    {t("captureModalSquare")}
                                </button>
                            </div>
                        )}

                        <div className="flex justify-center items-center gap-12 w-full px-10">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />

                            {capturedImage ? (
                                <>
                                    <button onClick={handleRetake} className="flex flex-col items-center gap-1 text-white hover:opacity-100 transition-opacity">
                                        <div className="p-4 bg-white/10 rounded-full backdrop-blur-md">
                                            <RefreshCcw size={24} />
                                        </div>
                                        <span className="text-[10px] uppercase font-bold tracking-tight mt-1">{t("captureModalRetake")}</span>
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                                    >
                                        <Check size={32} strokeWidth={3} />
                                    </button>
                                    <div className="w-[60px]" /> {/* Spacer */}
                                </>
                            ) : (
                                <>
                                    <button onClick={handleGalleryClick} className="flex flex-col items-center gap-1 text-white hover:opacity-100 transition-opacity">
                                        <div className="p-4 bg-white/10 rounded-full backdrop-blur-md">
                                            <ImageIcon size={24} />
                                        </div>
                                        <span className="text-[10px] uppercase font-bold tracking-tight mt-1">{t("captureModalGallery")}</span>
                                    </button>
                                    <button
                                        onClick={handleTakePhoto}
                                        className="w-[72px] h-[72px] rounded-full border-[3px] border-white flex items-center justify-center relative p-1"
                                    >
                                        <div className="w-full h-full bg-white rounded-full active:scale-90 transition-transform" />
                                    </button>
                                    <button
                                        onClick={toggleCamera}
                                        className="flex flex-col items-center gap-1 text-white hover:opacity-100 transition-opacity"
                                    >
                                        <div className="p-4 bg-white/10 rounded-full backdrop-blur-md active:scale-95 transition-transform">
                                            <RefreshCcw size={24} />
                                        </div>
                                        <span className="text-[10px] uppercase font-bold tracking-tight mt-1">{t("captureModalFlip")}</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
