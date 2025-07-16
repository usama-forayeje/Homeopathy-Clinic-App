
import { Inter } from "next/font/google";
import '../styles/globals.css';
import { Providers } from "@/providers/Providers";
import { Toaster } from "sonner";
import React from 'react';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "হোমিওপ্যাথিক ক্লিনিক ম্যানেজমেন্ট সিস্টেম",
  description: "আধুনিক হোমিওপ্যাথিক ক্লিনিক ব্যবস্থাপনার জন্য একটি সম্পূর্ণ সমাধান",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}