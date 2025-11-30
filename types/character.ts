export interface Character {
  id: number;
  name: string;
  player: string;
  image: string | null;
  description: string;
  game_id: number;
  created_at: string;
  updated_at: string;
  published: boolean;
}
