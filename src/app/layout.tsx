import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Habit Snap | Track Your Life",
    description: "Track your habits with visual evidence. A premium habit tracker for a better you.",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Habit Snap",
    },
};

export const viewport: Viewport = {
    themeColor: "#000000",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

import { LanguageProvider } from "@/lib/context/LanguageContext";
import { AppProvider } from "@/lib/context/AppContext";

import BottomNav from "@/components/layout/BottomNav";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
            </head>
            <body>
                <LanguageProvider>
                    <AppProvider>
                        {children}
                        <BottomNav />
                    </AppProvider>
                </LanguageProvider>
            </body>
        </html>
    );
}
