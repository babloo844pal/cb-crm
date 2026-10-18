import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Peaceful Paws CRM — Pet Memorial & Name Plate Subscription Platform",
  description:
    "Multi-branch Pet Crematorium & Burial CRM with Cinema Hall plot mapping, automated ₹5,000/yr Name Plate subscription renewals, and QR ground verification.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className={`${plusJakarta.className} min-h-full flex flex-col bg-[#F8FAFC] text-[#1E293B]`}>
        {children}
      </body>
    </html>
  );
}
