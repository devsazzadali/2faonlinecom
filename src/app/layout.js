import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "2FA Online – Free Online 2FA Code Generator & Secure Authenticator",
  description: "2faonline is a free online 2FA code generator that lets you create secure TOTP and OTP codes instantly in your browser. No app required, fast and safe.",
  icons: {
    icon: "/Image/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning এখানে যোগ করা হয়েছে
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}