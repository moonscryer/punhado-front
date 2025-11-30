import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ReactNode } from "react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Por um Punhado de Dados",
  description: "Portal da comunidade de RPG Por um Punhado de Dados",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground`}
      >
        <Navbar /> {/* client component handles dark mode toggle */}
        <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
