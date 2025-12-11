import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import InstallPrompt from "../components/InstallPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ward-16 Voters — Voter Search",
  description: "Voter search tool for Ward 16 (B)",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
     <head>
  {/* Manifest (version bump forces refresh) */}
  <link rel="manifest" href="/manifest.json?v=3" />

  {/* Standard Favicons */}
  <link rel="icon" href="/icons/favicon.ico" />
  <link rel="icon" type="image/svg+xml" href="/icons/favicon.svg" />
  <link rel="icon" type="image/png" sizes="96x96" href="/icons/favicon-96x96.png" />

  {/* PWA Icons (Android WebAPK uses ONLY these two) */}
  <link rel="icon" type="image/png" sizes="192x192" href="/icons/app-icon-192.png" />
  <link rel="icon" type="image/png" sizes="512x512" href="/icons/app-icon-512.png" />

  {/* Apple iOS Icon */}
  <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />

  {/* iOS PWA Behaviour */}
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-title" content="Ward-16 Voters" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

  {/* Theme Color */}
  <meta name="theme-color" content="#2563eb" />
</head>


      <body>
        {children}
        {/* install prompt + SW register */}
        <InstallPrompt />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js')
                  .catch(err => console.log('SW registration failed:', err));
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

