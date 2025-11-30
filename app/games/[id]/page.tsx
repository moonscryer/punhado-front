"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Game } from "@/types/game";
import type { Character } from "@/types/character";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default function GameDetailPage() {
  const params = useParams();
  const gameId = params.id as string;
  const [game, setGame] = useState<Game | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [gamesResponse, charactersResponse] = await Promise.all([
          fetch("https://punhadodedados.com/api/games"),
          fetch("https://punhadodedados.com/api/characters"),
        ]);

        const gamesData = await gamesResponse.json();
        const charactersData = await charactersResponse.json();

        const foundGame = gamesData.find(
          (g: Game) => g.id === parseInt(gameId)
        );
        setGame(foundGame || null);

        const gameCharacters = charactersData.filter(
          (c: Character) => c.game_id === parseInt(gameId)
        );
        setCharacters(gameCharacters);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [gameId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">
            Carregando detalhes do jogo...
          </p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-muted-foreground">Jogo não encontrado</p>
          <Button asChild>
            <Link href="/">
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
        <Link href="/">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Link>
      </Button>

      {/* Game Card */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image flush to top */}
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
          {characters.length === 0 ? (
            <p className="text-muted-foreground">
              Nenhum personagem encontrado neste jogo.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {characters.map((character) => (
                <Link key={character.id} href={`/characters/${character.id}`}>
                  <div className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden flex flex-col rounded-lg border bg-background">
                    {/* Character image flush to top */}
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
