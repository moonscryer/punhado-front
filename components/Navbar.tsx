import Link from "next/link";
import { FaYoutube, FaInstagram, FaDiscord } from "react-icons/fa";
import { Button } from "../components/ui/button";

export default function Navbar() {
  return (
    <header className="w-full border-b bg-card backdrop-blur supports-backdrop-filter:bg-background/60">
      <nav className="container mx-auto flex items-center justify-between py-4 px-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          Por um Punhado de Dados
        </Link>

        {/* Centered link */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/characters" className="text-lg hover:underline">
            Characters
          </Link>
        </div>

        {/* Social icons + login */}
        <div className="flex items-center gap-4">
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube className="h-5 w-5" />
          </a>
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaDiscord className="h-5 w-5" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="h-5 w-5" />
          </a>

          <Button asChild>
            <a href="https://www.punhadodedados.com/login">Login</a>
          </Button>
        </div>
      </nav>
    </header>
  );
}
