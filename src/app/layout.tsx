import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { WishlistProvider } from "@/context/WishlistContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { LocationProvider } from "@/context/LocationContext";
import WishlistDrawer from "@/components/WishlistDrawer";
import GoogleTranslator from "@/components/GoogleTranslator";
import PWARegister from "@/components/PWARegister";
import AiTravelModal from "@/components/AiTravelModal";

export const viewport: Viewport = {
  themeColor: "#07111e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "UncoverCeylon — Discover the Hidden Beauty of Sri Lanka",
  description:
    "Explore breathtaking places, hidden gems, ancient wonders, and untouched shores across all 9 provinces of Sri Lanka. Curated guides, live distance calculations, multi-currency fees, and 100% offline PWA support by Serandib Co.",
  keywords: [
    "Sri Lanka",
    "Ceylon",
    "Sri Lanka travel guide",
    "hidden gems Sri Lanka",
    "Sigiriya",
    "Ella",
    "Sri Lanka beaches",
    "Sri Lanka waterfalls",
    "Ceylon travel",
  ],
  authors: [{ name: "UncoverCeylon" }],
  creator: "UncoverCeylon",
  publisher: "UncoverCeylon",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://uncoverceylon.com"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "UncoverCeylon — Discover the Hidden Beauty of Sri Lanka",
    description:
      "Explore breathtaking places, hidden gems, ancient wonders, and untouched shores across Sri Lanka. Your premier island travel guide by Serandib Co.",
    url: "/",
    siteName: "UncoverCeylon",
    images: [
      {
        url: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=1200&h=630&fit=crop&q=85",
        width: 1200,
        height: 630,
        alt: "UncoverCeylon - Discover Sri Lanka",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UncoverCeylon — Discover the Hidden Beauty of Sri Lanka",
    description:
      "Explore breathtaking places, hidden gems, ancient wonders, and untouched shores across Sri Lanka.",
    images: [
      "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=1200&h=630&fit=crop&q=85",
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-white text-slate-900 antialiased selection:bg-[#00aa6c] selection:text-white">
        <LanguageProvider>
          <CurrencyProvider>
            <LocationProvider>
              <WishlistProvider>
                <Navbar />
                <main>{children}</main>
                <WishlistDrawer />
                <GoogleTranslator />
                <PWARegister />
                <AiTravelModal />
                <Footer />
                <Toaster
                  position="bottom-right"
                  toastOptions={{
                    style: {
                      background: "#0a192f",
                      color: "#f8fafc",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      boxShadow: "0 20px 35px -5px rgba(0,0,0,0.5)",
                      borderRadius: "14px",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "13.5px",
                      padding: "12px 18px",
                    },
                  }}
                />
              </WishlistProvider>
            </LocationProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
