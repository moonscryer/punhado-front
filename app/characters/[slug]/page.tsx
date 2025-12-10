import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Character } from "@/types/character";
import type { Game } from "@/types/game";
import slugify from "slugify";

export const dynamicParams = true;

const CHARACTERS_API = "https://punhadodedados.com/api/characters";
const GAMES_API = "https://punhadodedados.com/api/games";

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
  const res = await fetch(CHARACTERS_API, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch characters for static params");
  }

  const characters: Character[] = await res.json();

  return characters.map((c) => ({
    slug: toSlug(c.name),
  }));
}

// Revalidate every hour for ISR
export const revalidate = 3600;

// ============================================================
// 2️⃣ Server-rendered detail page
// ============================================================
export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: slugParam } = await params; // <-- FIX: unwrap params

  // Fetch both datasets on server
  const [charactersRes, gamesRes] = await Promise.all([
    fetch(CHARACTERS_API, { cache: "force-cache" }),
    fetch(GAMES_API, { cache: "force-cache" }),
  ]);

  if (!charactersRes.ok || !gamesRes.ok) {
    throw new Error("Failed to fetch character or game data");
  }

  const [characters, games]: [Character[], Game[]] = await Promise.all([
    charactersRes.json(),
    gamesRes.json(),
  ]);

  // Find character
  const character = characters.find((c) => toSlug(c.name) === slugParam);

  if (!character) {
    return notFound();
  }

  // Find associated game
  const game = games.find((g) => g.id === character.game_id) || null;

  // ============================================================
  // UI
  // ============================================================
  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/characters">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Link>
      </Button>

      <div className="max-w-4xl mx-auto">
        {character.image && (
          <div className="relative w-full h-64 md:h-96 mb-6 rounded-lg overflow-hidden bg-muted">
            <img
              src={character.image}
              alt={character.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-4">{character.name}</h1>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <div>
                <span className="font-semibold">Jogador:</span>{" "}
                {character.player}
              </div>
              {game && (
                <div>
                  <span className="font-semibold">Jogo:</span>{" "}
                  <Link
                    href={`/games/${toSlug(game.name)}`}
                    className="hover:underline text-foreground"
                  >
                    {game.name}
                  </Link>
                </div>
              )}
              {game && (
                <div>
                  <Badge variant="secondary">{game.system}</Badge>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">Descrição</h2>
            <p className="text-lg text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {character.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
