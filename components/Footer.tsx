import { FaYoutube, FaInstagram, FaDiscord } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full border-t py-3 text-center text-sm flex flex-col items-center gap-2 bg-card/50">
      <div>
        &copy; {new Date().getFullYear()} Por um Punhado de Dados - Todos os
        direitos reservados.
      </div>

      <div className="flex items-center gap-3 opacity-70">
        <a
          href="https://www.youtube.com/@PorumPunhadodeDados-Streams/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaYoutube className="h-4 w-4" />
        </a>
        <a
          href="https://discord.gg/EHnaVZC"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaDiscord className="h-4 w-4" />
        </a>
        <a
          href="https://instagram.com/punhadodedados"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram className="h-4 w-4" />
        </a>
      </div>
    </footer>
  );
}
