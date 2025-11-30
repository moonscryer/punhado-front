"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FaYoutube, FaDiscord, FaInstagram } from "react-icons/fa";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", next.toString());
  };

  const navLinks = (
    <Link
      href="/personagens"
      className="text-foreground font-bold transition-colors hover:text-purple-500"
      onClick={() => setIsOpen(false)}
    >
      Personagens
    </Link>
  );

  const socialLinks = (
    <div className="flex items-center gap-4">
      <a
        href="https://www.youtube.com/@PorumPunhadodeDados-Streams/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground hover:text-purple-500 transition-colors"
        aria-label="YouTube"
      >
        <FaYoutube className="w-5 h-5" />
      </a>
      <a
        href="https://discord.gg/EHnaVZC"
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground hover:text-purple-500 transition-colors"
        aria-label="Discord"
      >
        <FaDiscord className="w-5 h-5" />
      </a>
      <a
        href="https://www.instagram.com/punhadodedados"
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground hover:text-purple-500 transition-colors"
        aria-label="Instagram"
      >
        <FaInstagram className="w-5 h-5" />
      </a>
    </div>
  );

  return (
    <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50 supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo + Image */}
          <Link
            href="/"
            className="flex items-center gap-3 text-2xl font-bold text-foreground hover:text-purple-500 transition-colors"
          >
            <Image
              src="/logo.png"
              alt="Por um Punhado de Dados logo"
              width={36}
              height={36}
              className="object-contain"
            />
            <span>Por um Punhado de Dados</span>
          </Link>

          {/* Centered nav link */}
          <div className="hidden md:flex flex-1 justify-center mx-8">
            {navLinks}
          </div>

          {/* Socials + login + dark mode (desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {socialLinks}
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://www.punhadodedados.com/login"
                target="_blank"
                rel="noopener noreferrer"
              >
                Login
              </a>
            </Button>
            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <HiOutlineSun className="w-5 h-5 text-gray-200" />
              ) : (
                <HiOutlineMoon className="w-5 h-5 text-gray-900" />
              )}
            </Button>
          </div>

          {/* Mobile menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <VisuallyHidden>
                <h2>Mobile Menu</h2>
              </VisuallyHidden>
              <div className="flex flex-col items-center gap-6 mt-8">
                <nav className="flex flex-col gap-4">{navLinks}</nav>
                <div className="border-t pt-4">{socialLinks}</div>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="https://www.punhadodedados.com/login"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Login
                  </a>
                </Button>
                {/* Mobile dark mode toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDarkMode}
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <HiOutlineSun className="w-5 h-5 text-gray-200" />
                  ) : (
                    <HiOutlineMoon className="w-5 h-5 text-gray-900" />
                  )}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
