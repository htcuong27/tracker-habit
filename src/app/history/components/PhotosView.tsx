"use client";
import { Photo } from "@/lib/types";

interface PhotosViewProps {
    groupedPhotos: Record<string, Photo[]>;
    photos: Photo[];
    openLightbox: (list: Photo[], index: number) => void;
}

export default function PhotosView({ groupedPhotos, photos, openLightbox }: PhotosViewProps) {
    return (
        <div className="space-y-4 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {Object.keys(groupedPhotos).length === 0 && (
                <div className="text-center text-gray-500 mt-20">Chưa có ảnh nào</div>
            )}
            {Object.entries(groupedPhotos).map(([date, dayPhotos]) => (
                <div key={date}>
                    <h3 className="text-sm font-bold text-gray-400 mb-3 ml-2 sticky top-[72px] bg-black/80 backdrop-blur-md py-2 z-10">
                        {new Date(date).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h3>
                    <div className="grid grid-cols-3 gap-1">
                        {dayPhotos.map((photo, index) => {
                            const globalIndex = photos.indexOf(photo);
                            return (
                                <div
                                    key={photo.id}
                                    onClick={() => openLightbox(photos, globalIndex)}
                                    className="aspect-square relative group overflow-hidden cursor-pointer bg-white/5"
                                >
                                    <img
                                        src={photo.dataUrl}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                        alt=""
                                        loading="lazy"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
