"use client";

import { addPhoto, deletePhoto, getAllPhotos, updatePhoto } from "@/lib/db";
import { useHabits } from "@/lib/hooks/useHabits";
import { useLanguage } from "@/lib/hooks/useLanguage";
import { Photo } from "@/lib/types";
import { BarChart2, Calendar as CalendarIcon, Camera, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";

// Components
import CaptureModal from "@/components/ui/CaptureModal";
import DayDetailModal from "@/components/ui/DayDetailModal";
import PhotoLightbox from "@/components/ui/PhotoLightbox";

// Calendar Components
import CalendarView from "./components/CalendarView";
import PhotosView from "./components/PhotosView";
import StatsView from "./components/StatsView";

export default function CalendarPage() {
    const { t } = useLanguage();
    const { habits, modifyHabit } = useHabits();

    // UI States
    const [activeTab, setActiveTab] = useState<"calendar" | "photos" | "stats">("calendar");
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null); // For Details Modal
    const [statsDate, setStatsDate] = useState(new Date()); // For Stats Tab

    // Data States
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [showCaptureModal, setShowCaptureModal] = useState(false);

    // Lightbox State
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [lightboxPhotos, setLightboxPhotos] = useState<Photo[]>([]);

    useEffect(() => {
        loadPhotos();
    }, []);

    const loadPhotos = async () => {
        try {
            const all = await getAllPhotos();
            // Sort new to old
            setPhotos(all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    // --- Actions ---

    // Chụp ảnh (cho ngày hiện tại từ Floating Button)
    const handleCaptureClick = () => {
        if (!selectedDate) {
            // Use local date from utils
            setSelectedDate(new Date().toISOString().split("T")[0]);
        }
        setShowCaptureModal(true);
    };

    const handleCapture = async (photoUrl: string, habitId?: string) => {
        const targetDate = selectedDate || new Date().toISOString().split("T")[0];
        // Default to unknown if not selected
        const targetHabitId = habitId || "unknown";

        await addPhoto({
            habitId: targetHabitId,
            date: targetDate,
            dataUrl: photoUrl,
        });

        // Auto-complete habit logic (Only if valid habit selected)
        if (targetHabitId !== "unknown") {
            const habit = habits.find(h => h.id === targetHabitId);
            if (habit && !habit.completedDays[targetDate]) {
                await modifyHabit({
                    ...habit,
                    completedDays: { ...habit.completedDays, [targetDate]: "completed" },
                    streak: habit.streak + 1, // Simple streak update
                });
            }
        }

        await loadPhotos();
        setShowCaptureModal(false);
    };

    const handleDeletePhoto = async (photo: Photo) => {
        if (!photo.id) return;
        try {
            await deletePhoto(photo.id);
            await loadPhotos();
            // Lightbox logic handled inside lightbox component or by re-render
            // Update local state if needed
            setLightboxPhotos(prev => prev.filter(p => p.id !== photo.id));
        } catch (e) { console.error(e) }
    };

    const handleUpdatePhoto = async (photo: Photo) => {
        if (!photo.id) return;
        try {
            await updatePhoto(photo);
            await loadPhotos();
            // Update current photos being viewed too
            setLightboxPhotos(prev => prev.map(p => p.id === photo.id ? photo : p));
        } catch (e) {
            console.error(e);
        }
    };

    const openLightbox = (list: Photo[], index: number) => {
        setLightboxPhotos(list);
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    // --- Helpers ---
    const groupedPhotos = photos.reduce((acc, photo) => {
        if (!acc[photo.date]) acc[photo.date] = [];
        acc[photo.date].push(photo);
        return acc;
    }, {} as Record<string, Photo[]>);


    // --- Render ---
    return (
        <main className="page-container min-h-screen pt-6">
            <header className="flex justify-between items-center mb-6 px-2">
                <h1 className="text-3xl font-extrabold tracking-tight">{t("calendar")}</h1>

                {/* Mode Toggle */}
                <div className="flex bg-white/10 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab("calendar")}
                        className={`p-2 rounded-lg transition-all ${activeTab === "calendar" ? "bg-emerald-500 text-white shadow-lg scale-105" : "text-gray-400 hover:text-white"}`}
                    >
                        <CalendarIcon size={20} />
                    </button>
                    <button
                        onClick={() => setActiveTab("photos")}
                        className={`p-2 rounded-lg transition-all ${activeTab === "photos" ? "bg-emerald-500 text-white shadow-lg scale-105" : "text-gray-400 hover:text-white"}`}
                    >
                        <ImageIcon size={20} />
                    </button>
                    <button
                        onClick={() => setActiveTab("stats")}
                        className={`p-2 rounded-lg transition-all ${activeTab === "stats" ? "bg-emerald-500 text-white shadow-lg scale-105" : "text-gray-400 hover:text-white"}`}
                    >
                        <BarChart2 size={20} />
                    </button>
                </div>
            </header>

            {/* Content */}
            {activeTab === "calendar" && (
                <CalendarView
                    currentMonth={currentMonth}
                    setCurrentMonth={setCurrentMonth}
                    groupedPhotos={groupedPhotos}
                    habits={habits}
                    setSelectedDate={setSelectedDate}
                />
            )}

            {activeTab === "photos" && (
                <PhotosView
                    groupedPhotos={groupedPhotos}
                    photos={photos}
                    openLightbox={openLightbox}
                />
            )}

            {activeTab === "stats" && (
                <StatsView
                    statsDate={statsDate}
                    setStatsDate={setStatsDate}
                    habits={habits}
                    groupedPhotos={groupedPhotos}
                    openLightbox={openLightbox}
                />
            )}

            {/* Floating Camera Button (only for Calendar tab usually, but user might want it everywhere) */}
            <button
                onClick={handleCaptureClick}
                className="fixed bottom-24 right-6 w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-110 active:scale-95 transition-all z-40"
            >
                <Camera size={24} />
            </button>

            {/* Modals */}
            {selectedDate && (
                <DayDetailModal
                    date={selectedDate}
                    photos={groupedPhotos[selectedDate] || []}
                    onClose={() => setSelectedDate(null)}
                    onAddPhoto={() => setShowCaptureModal(true)}
                    onPhotoClick={(photo: Photo) => {
                        // Find index in global photos or local day photos? 
                        // Usually lightbox wants context. Let's pass day photos.
                        // But if user swipes, do they want to go to next day? Usually yes.
                        // For simplicity, let's pass global photos list and find index.
                        const list = photos; // global list sorted
                        const idx = list.findIndex(p => p.id === photo.id);
                        openLightbox(list, idx !== -1 ? idx : 0);
                    }}
                />
            )}

            {showCaptureModal && (
                <CaptureModal
                    isOpen={showCaptureModal}
                    onCapture={handleCapture}
                    onClose={() => setShowCaptureModal(false)}
                    habits={habits}
                />
            )}

            {/* Lightbox */}
            {lightboxOpen && (
                <PhotoLightbox
                    isOpen={lightboxOpen}
                    photos={lightboxPhotos}
                    initialIndex={lightboxIndex}
                    onClose={() => setLightboxOpen(false)}
                    onDelete={handleDeletePhoto}
                    onUpdate={handleUpdatePhoto}
                    habits={habits}
                />
            )}
        </main>
    );
}
