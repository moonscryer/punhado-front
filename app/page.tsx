import type { Game } from "@/types/game";
import GamesClient from "./GamesClient";

// Revalidate this page every hour
export const revalidate = 3600;

export default async function HomePage() {
  const res = await fetch("https://punhadodedados.com/api/games");

  if (!res.ok) {
    throw new Error("Failed to fetch games");
  }

  const games: Game[] = await res.json();

  return (
    <div className="container mx-auto px-4 py-8">
      <GamesClient initialGames={games} />
    </div>
  );
}
