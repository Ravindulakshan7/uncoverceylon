import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { LocationProvider } from "@/context/LocationContext";
import WishlistDrawer from "@/components/WishlistDrawer";
import AuthModal from "@/components/AuthModal";

export const viewport: Viewport = {
  themeColor: "#0f1b2d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://uncoverceylon.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Uncover Ceylon — Sri Lanka Premier Travel Guide, Hidden Gems & Itineraries",
    template: "%s | Uncover Ceylon",
  },
  description:
    "Discover the ultimate travel guide to Sri Lanka. Curated hidden gems, pristine turquoise beaches, misty tea mountain trails, ancient UNESCO kingdoms, wildlife safaris, and verified local tips across all 9 provinces by Serandib Co.",
  keywords: [
    "Sri Lanka travel guide",
    "Sri Lanka tourism",
    "visit Sri Lanka",
    "Ceylon travel",
    "Sigiriya rock fortress",
    "Ella scenic train",
    "Mirissa whale watching",
    "Yala safari leopards",
    "Nuwara Eliya tea plantations",
    "Sri Lanka hidden gems",
    "Sri Lanka itinerary",
    "Ceylon food and curries",
    "Sri Lanka culture and temples",
    "best beaches in Sri Lanka",
    "Sri Lanka waterfalls",
    "Serandib Co travel",
  ],
  authors: [{ name: "Serandib Co. & Uncover Ceylon Team" }],
  creator: "Uncover Ceylon",
  publisher: "Serandib Co.",
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
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Uncover Ceylon — Sri Lanka Premier Travel Guide & Hidden Gems",
    description:
      "Explore hand-picked destinations, misty hill country trails, ancient citadels, and secluded coastal bays across Sri Lanka with verified local insights and interactive route planning.",
    url: SITE_URL,
    siteName: "Uncover Ceylon",
    images: [
      {
        url: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=1200&h=630&fit=crop&q=85",
        width: 1200,
        height: 630,
        alt: "Sigiriya Rock Fortress — Uncover Ceylon",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Uncover Ceylon — Sri Lanka Premier Travel Guide",
    description:
      "Explore hand-picked destinations, misty hill country trails, ancient citadels, and secluded coastal bays across Sri Lanka.",
    images: [
      "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=1200&h=630&fit=crop&q=85",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Uncover Ceylon",
    alternateName: ["UncoverCeylon", "Serandib Travel Guide"],
    url: SITE_URL,
    description:
      "The premier digital travel guide for the tropical island of Sri Lanka, featuring curated destinations, offline maps, food, and culture.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/destinations?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const jsonLdOrganization = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Uncover Ceylon",
    url: SITE_URL,
    logo: `${SITE_URL}/icons/icon-512.png`,
    image: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=1200&h=630&fit=crop&q=85",
    description:
      "Authoritative travel discovery platform curated by Serandib Co. dedicated to promoting ethical, culturally immersive, and breathtaking tourism across Sri Lanka.",
    areaServed: {
      "@type": "Country",
      name: "Sri Lanka",
    },
    knowsAbout: [
      "Sri Lanka Travel",
      "Ceylon Culture",
      "Sri Lankan Cuisine",
      "Wildlife Safaris",
      "Heritage Sites",
      "Tropical Beaches",
    ],
  };

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(regs) {
                  for (var i = 0; i < regs.length; i++) {
                    regs[i].unregister();
                  }
                });
              }
              if (typeof window !== 'undefined' && 'caches' in window) {
                caches.keys().then(function(names) {
                  for (var i = 0; i < names.length; i++) {
                    caches.delete(names[i]);
                  }
                });
              }
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
      </head>
      <body className="min-h-screen bg-white text-slate-900 antialiased selection:bg-[#00aa6c] selection:text-white">
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-5FZLF5MSDE"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5FZLF5MSDE');
          `}
        </Script>
        <LanguageProvider>
          <CurrencyProvider>
            <LocationProvider>
              <AuthProvider>
                <WishlistProvider>
                  <Navbar />
                  <main>{children}</main>
                  <WishlistDrawer />
                  <AuthModal />
                  <Footer />
                  <Toaster
                    position="bottom-right"
                    toastOptions={{
                      style: {
                        background: "#0f1b2d",
                        color: "#f8fafc",
                        border: "1px solid rgba(0, 170, 108, 0.25)",
                        boxShadow: "0 20px 35px -5px rgba(0,0,0,0.5)",
                        borderRadius: "16px",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        fontSize: "13.5px",
                        padding: "12px 18px",
                      },
                    }}
                  />
                </WishlistProvider>
              </AuthProvider>
            </LocationProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
