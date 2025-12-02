"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Character } from "@/types/character";
import type { Game } from "@/types/game";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default function CharacterDetailPage() {
  const params = useParams();
  const characterId = params.id as string;
  const [character, setCharacter] = useState<Character | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [charactersResponse, gamesResponse] = await Promise.all([
          fetch("https://punhadodedados.com/api/characters"),
          fetch("https://punhadodedados.com/api/games"),
        ]);

        const charactersData = await charactersResponse.json();
        const gamesData = await gamesResponse.json();

        const foundCharacter = charactersData.find(
          (c: Character) => c.id === parseInt(characterId)
        );
        setCharacter(foundCharacter || null);

        if (foundCharacter) {
          const foundGame = gamesData.find(
            (g: Game) => g.id === foundCharacter.game_id
          );
          setGame(foundGame || null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [characterId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">
            Carregando detalhes do personagem...
          </p>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-muted-foreground">Personagem não encontrado</p>
          <Button asChild>
            <Link href="/characters">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
        </div>
      </div>
    );
  }

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
                    href={`/games/${game.id}`}
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
