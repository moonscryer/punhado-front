"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaYoutube, FaDiscord, FaInstagram } from "react-icons/fa";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    const saved = localStorage.getItem("darkMode");
    if (saved === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", (!darkMode).toString());
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur ${
        scrolled
          ? "bg-white/80 shadow-sm dark:bg-gray-900/80"
          : "bg-white/95 dark:bg-gray-900/95"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Logo + Image */}
        <div className="flex-1 flex items-center">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="Logo"
              width={48}
              height={48}
              className="rounded-md"
            />
            <span className="text-black dark:text-white text-2xl font-bold">
              Por um Punhado de Dados
            </span>
          </Link>
        </div>

        {/* Centered Characters link */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex">
          <Link
            href="/personagens"
            className="font-bold text-black dark:text-white text-xl hover:text-purple-500 transition-colors"
          >
            Personagens
          </Link>
        </div>

        {/* Desktop Socials + Login + Dark Mode Button */}
        <div className="flex-1 hidden md:flex items-center justify-end space-x-4 text-lg">
          <a
            href="https://www.youtube.com/@PorumPunhadodeDados-Streams/"
            target="_blank"
            className="text-black dark:text-white hover:text-purple-500 transition-colors"
          >
            <FaYoutube className="h-7 w-7" />
          </a>
          <a
            href="https://discord.gg/EHnaVZC"
            target="_blank"
            className="text-black dark:text-white hover:text-purple-500 transition-colors"
          >
            <FaDiscord className="h-7 w-7" />
          </a>
          <a
            href="https://instagram.com/punhadodedados"
            target="_blank"
            className="text-black dark:text-white hover:text-purple-500 transition-colors"
          >
            <FaInstagram className="h-7 w-7" />
          </a>
          <a
            href="https://www.punhadodedados.com/login"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Login
          </a>

          {/* Dark Mode Button */}
          <button
            onClick={toggleDarkMode}
            className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {darkMode ? (
              <HiOutlineMoon className="w-4 h-4 text-gray-200" />
            ) : (
              <HiOutlineSun className="w-4 h-4 text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Menu Button with animated hamburger */}
        <button
          className="md:hidden text-black dark:text-white text-3xl relative w-10 h-10 flex items-center justify-center"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span
            className={`absolute w-7 h-0.5 bg-black dark:bg-white transition-all duration-300 ${
              menuOpen ? "rotate-45" : "-translate-y-2"
            }`}
          ></span>
          <span
            className={`absolute w-7 h-0.5 bg-black dark:bg-white transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`absolute w-7 h-0.5 bg-black dark:bg-white transition-all duration-300 ${
              menuOpen ? "-rotate-45" : "translate-y-2"
            }`}
          ></span>
        </button>
      </nav>

      {/* Mobile Dropdown with slide animation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          menuOpen ? "max-h-screen opacity-100 py-6" : "max-h-0 opacity-0 py-0"
        }`}
      >
        <div className="flex flex-col items-center space-y-6 text-lg">
          <Link
            href="/personagens"
            onClick={() => setMenuOpen(false)}
            className="block font-bold text-black dark:text-white hover:text-purple-500 transition-colors"
          >
            Personagens
          </Link>

          <div className="flex justify-center items-center space-x-6 text-2xl">
            <a
              href="https://www.youtube.com/@PorumPunhadodeDados-Streams/"
              target="_blank"
              className="text-black dark:text-white hover:text-purple-500"
            >
              <FaYoutube />
            </a>
            <a
              href="https://discord.gg/EHnaVZC"
              target="_blank"
              className="text-black dark:text-white hover:text-purple-500"
            >
              <FaDiscord />
            </a>
            <a
              href="https://instagram.com/punhadodedados"
              target="_blank"
              className="text-black dark:text-white hover:text-purple-500"
            >
              <FaInstagram />
            </a>
          </div>

          <a
            href="https://www.punhadodedados.com/login"
            className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Login
          </a>

          {/* Mobile Dark Mode Button */}
          <button
            onClick={toggleDarkMode}
            className="mt-2 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {darkMode ? (
              <HiOutlineMoon className="w-4 h-4 text-gray-200" />
            ) : (
              <HiOutlineSun className="w-4 h-4 text-gray-900" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
