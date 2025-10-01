import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import PWAInstaller from "@/components/PWAInstaller";
import "@/utils/migration";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Tribly Admin Dashboard",
  description: "Modern admin dashboard for managing Tribly business platform",
  manifest: "/manifest.json",
  themeColor: "#f6f6f6",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tribly Admin",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Tribly Admin Dashboard",
    title: "Tribly Admin Dashboard",
    description: "Modern admin dashboard for managing Tribly business platform",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    shortcut: "/icons/icon-96x96.png",
    apple: "/icons/icon-152x152.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <AuthProvider>
            <NotificationProvider>
              {children}
              <PWAInstaller />
            </NotificationProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
