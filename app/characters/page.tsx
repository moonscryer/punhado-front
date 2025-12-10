"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Pagination from "@/components/Pagination";
import type { Character } from "@/types/character";
import type { Game } from "@/types/game";
import slugify from "slugify";

const CHARACTERS_PER_PAGE = 9;

const toSlug = (text: string) =>
  slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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

        setCharacters(charactersData);
        setGames(gamesData);
        setFilteredCharacters(charactersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = characters.filter((character) => {
      const game = games.find((g) => g.id === character.game_id);
      const gameName = game?.name || "";

      return (
        character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        character.player.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gameName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    setFilteredCharacters(filtered);
    setCurrentPage(1);
  }, [searchQuery, characters, games]);

  const getGameName = (gameId: number) => {
    const game = games.find((g) => g.id === gameId);
    return game?.name || "Unknown Game";
  };

  const totalPages = Math.ceil(filteredCharacters.length / CHARACTERS_PER_PAGE);
  const paginatedCharacters = filteredCharacters.slice(
    (currentPage - 1) * CHARACTERS_PER_PAGE,
    currentPage * CHARACTERS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Carregando personagens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Personagens</h1>
        <p className="text-muted-foreground mb-6">
          Conheça os protagonistas das aventuras do Punhado de Dados!
        </p>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Pesquisar por nome, jogador ou jogo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredCharacters.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhum personagem encontrado correspondente à sua pesquisa.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedCharacters.map((character) => (
              <Link
                key={character.id}
                href={`/characters/${toSlug(character.name)}`} // <-- UPDATED
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
                      <Badge variant="secondary" className="mt-1">
                        {getGameName(character.game_id)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3 mt-2 flex-1">
                      {character.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
