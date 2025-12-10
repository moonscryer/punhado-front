import type { Character } from "@/types/character";
import type { Game } from "@/types/game";
import CharactersClient from "./CharactersClient";

const CHARACTERS_API_URL = "https://punhadodedados.com/api/characters";
const GAMES_API_URL = "https://punhadodedados.com/api/games";

// Revalidate this page every hour
export const revalidate = 3600;

export default async function CharactersPage() {
  const [charactersRes, gamesRes] = await Promise.all([
    fetch(CHARACTERS_API_URL),
    fetch(GAMES_API_URL),
  ]);

  if (!charactersRes.ok || !gamesRes.ok) {
    throw new Error("Failed to fetch characters or games");
  }

  const [characters, games]: [Character[], Game[]] = await Promise.all([
    charactersRes.json(),
    gamesRes.json(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <CharactersClient initialCharacters={characters} games={games} />
    </div>
  );
}
