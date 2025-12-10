"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Game } from "@/types/game";
import Pagination from "@/components/Pagination";
import slugify from "slugify"; // <-- NEW

const GAMES_PER_PAGE = 9;

// Standard slug helper for consistency everywhere
const toSlug = (text: string) =>
  slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch("https://punhadodedados.com/api/games");
        const data = await response.json();
        setGames(data);
        setFilteredGames(data);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGames();
  }, []);

  useEffect(() => {
    const filtered = games.filter(
      (game) =>
        game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.system.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredGames(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchQuery, games]);

  const totalPages = Math.ceil(filteredGames.length / GAMES_PER_PAGE);
  const paginatedGames = filteredGames.slice(
    (currentPage - 1) * GAMES_PER_PAGE,
    currentPage * GAMES_PER_PAGE
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Carregando jogos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header + Search */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Jogos</h1>
        <p className="text-muted-foreground mb-6">
          Confira as campanhas passadas e atuais do Punhado de Dados!
        </p>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Procure por nome ou sistema"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* No results */}
      {filteredGames.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhum jogo encontrado correspondente à sua busca.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedGames.map((game) => (
              <Link
                key={game.id}
                href={`/games/${toSlug(game.name)}`} // <-- UPDATED
              >
                <div className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden flex flex-col rounded-lg border bg-background">
                  {/* Image flush to top */}
                  {game.image_url && (
                    <div className="w-full h-48">
                      <img
                        src={game.image_url}
                        alt={game.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Card content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div>
                      <h3 className="text-lg font-bold">{game.name}</h3>
                      <Badge variant="secondary" className="mt-1">
                        {game.system}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3 mt-2 flex-1">
                      {game.description}
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
