import "../globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin", "vietnamese"],
    variable: "--font-plus-jakarta",
});

export const metadata = {
    title: "Live Telemetry Widget",
    description: "OBS Overlay for Steam & Spotify",
};

export default function WidgetLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            {/* background-transparent is required for OBS overlay */}
            <body className={`${plusJakartaSans.variable} font-sans antialiased bg-transparent text-white overflow-hidden`}>
                {children}
            </body>
        </html>
    );
}
