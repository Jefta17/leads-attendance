// src/app/layout.js
import localFont from "next/font/local";
import "./globals.css"; 

// Pastikan menggunakan jalur relatif dari layout.js ke fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",  // Jalur relatif dari layout.js ke fonts
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff", // Jalur relatif dari layout.js ke fonts
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "LEADS UPN Veteran Jakarta",
  description: "Sistem pembelajaran digital",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
