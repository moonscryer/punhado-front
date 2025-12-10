"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Pagination from "@/components/Pagination";
import slugify from "slugify";
import type { Game } from "@/types/game";

const GAMES_PER_PAGE = 9;

const toSlug = (text: string) =>
  slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });

interface GamesClientProps {
  initialGames: Game[];
}

export default function GamesClient({ initialGames }: GamesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredGames = initialGames.filter(
    (game) =>
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.system.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredGames.length / GAMES_PER_PAGE);

  const paginatedGames = filteredGames.slice(
    (currentPage - 1) * GAMES_PER_PAGE,
    currentPage * GAMES_PER_PAGE
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // reset page
  };

  return (
    <>
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
            onChange={(e) => handleSearchChange(e.target.value)}
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
              <Link key={game.id} href={`/games/${toSlug(game.name)}`}>
                <div className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden flex flex-col rounded-lg border bg-background">
                  {game.image_url && (
                    <div className="w-full h-48">
                      <img
                        src={game.image_url}
                        alt={game.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

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
    </>
  );
}
