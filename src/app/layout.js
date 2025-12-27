import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- SEO Metadata Optimization ---
export const metadata = {
  metadataBase: new URL('https://2faonline.com'),
  title: {
    default: "2FA Online - Best Secure 2FA Authenticator & Code Generator",
    template: "%s | 2FA Online"
  },
  description: "Generate 2FA codes securely for Facebook, Instagram, Google, and Discord. Fast, private, and local 2FA generator. No data storage, 100% secure.",
  keywords: ["2FA generator", "2FA online", "Authenticator online", "Facebook 2FA code", "2FA secret key generator", "Two factor authentication"],
  authors: [{ name: "2FA Online Team" }],
  creator: "2FA Online",
  publisher: "2FA Online",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "2FA Online - Secure 2FA Authenticator",
    description: "Generate secure 2FA codes locally in your browser. Private and easy to use.",
    url: "https://2faonline.com",
    siteName: "2FA Online",
    images: [
      {
        url: "/og-image.png", // public ফোল্ডারে ১২০০x৬৩০ সাইজের একটি ছবি রাখুন
        width: 1200,
        height: 630,
        alt: "2FA Online Authenticator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "2FA Online | Secure 2FA Generator",
    description: "Generate 2FA codes securely online without any server storage.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// --- JSON-LD Structured Data (Google Rich Results) ---
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "2FA Online Authenticator",
  "url": "https://2faonline.com",
  "applicationCategory": "SecurityApplication",
  "operatingSystem": "Web, Android, iOS, Windows, macOS",
  "description": "A secure, local-first 2FA code generator that works directly in your browser.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Offline 2FA generation",
    "Local history management",
    "Secure notes storage",
    "No server-side data tracking"
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-zinc-950 transition-colors duration-500`}
      >
        {children}
      </body>
    </html>
  );
}