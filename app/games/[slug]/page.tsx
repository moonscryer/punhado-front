import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Game } from "@/types/game";
import type { Character } from "@/types/character";
import slugify from "slugify";

export const dynamicParams = true;

const GAMES_API = "https://punhadodedados.com/api/games";
const CHARACTERS_API = "https://punhadodedados.com/api/characters";

const toSlug = (text: string) =>
  slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });

// ============================================================
// 1️⃣ Generate static slug params at build time
// ============================================================
export async function generateStaticParams() {
  const res = await fetch(GAMES_API, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch games for static params");
  }

  const games: Game[] = await res.json();

  return games.map((g) => ({
    slug: toSlug(g.name),
  }));
}

// Revalidate this page periodically for ISR
export const revalidate = 3600;

// ============================================================
// 2️⃣ Server-rendered detail page
// ============================================================
export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: slugParam } = await params; // <-- IMPORTANT FIX

  const [gamesRes, charactersRes] = await Promise.all([
    fetch(GAMES_API, { cache: "no-store" }),
    fetch(CHARACTERS_API, { cache: "no-store" }),
  ]);

  if (!gamesRes.ok || !charactersRes.ok) {
    throw new Error("Failed to fetch game or character data");
  }

  const [games, characters]: [Game[], Character[]] = await Promise.all([
    gamesRes.json(),
    charactersRes.json(),
  ]);

  // Find game by slug
  const game = games.find((g) => toSlug(g.name) === slugParam);

  if (!game) {
    return notFound();
  }

  // Characters that belong to this game
  const gameCharacters = characters.filter((c) => c.game_id === game.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Link>
      </Button>

      {/* Game Card */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-6">
          {game.image_url && (
            <div className="w-full md:w-1/2 rounded-lg overflow-hidden">
              <img
                src={game.image_url}
                alt={game.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-4xl font-bold">{game.name}</h1>
            <Badge variant="secondary" className="text-sm">
              {game.system}
            </Badge>
            <p className="text-lg text-muted-foreground whitespace-pre-wrap">
              {game.description}
            </p>
          </div>
        </div>

        {/* Characters */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Personagens</h2>
          {gameCharacters.length === 0 ? (
            <p className="text-muted-foreground">
              Nenhum personagem encontrado neste jogo.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gameCharacters.map((character) => (
                <Link
                  key={character.id}
                  href={`/characters/${toSlug(character.name)}`}
                >
                  <div className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden flex flex-col rounded-lg border bg-background">
                    {character.image && (
                      <div className="w-full h-48">
                        <img
                          src={character.image}
                          alt={character.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="p-4 flex-1 flex flex-col">
                      <div>
                        <h3 className="text-lg font-bold">{character.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Jogador: {character.player}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3 mt-2 flex-1">
                        {character.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
