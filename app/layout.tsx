// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import Footer from "@/components/Footer";
import CTA from "@/components/CTA";
import HeaderShell from "@/components/HeaderShell";
import CallCTA from "@/components/CallCTA";

export const metadata: Metadata = {
  title: "MCBROTHER",
  description: "MCBROTHER JSC – Giải pháp máy móc chế biến & đóng gói thực phẩm.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-surface text-gray-900 antialiased selection:bg-primary/10 selection:text-primary"
      >
        <HeaderShell />

        {children}

        <Footer />
        <CallCTA></CallCTA>
        <CTA side="right" zalo="0834551888" defaultOpen />
        {/* <MessengerBtn /> */}
      </body>
    </html>
  );
}
