export interface Pokemon {
  id: number;
  name: string;
  imageUrl?: string | null;
  types: string[];
  abilities: string[];
  height?: number | null;
  weight?: number | null;
}

export interface PaginatedPokemon {
  items: Pokemon[];
  totalCount: number;
  limit: number;
  offset: number;
}
