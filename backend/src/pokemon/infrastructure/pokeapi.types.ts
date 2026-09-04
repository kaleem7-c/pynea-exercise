/**
 * Shapes of the objects returned by https://pokeapi.co/api/v2/*
 * Only the fields we actually consume are declared
 */
export interface PokeApiListResponse {
  count: number;
  results: { name: string; url: string }[];
}

export interface PokeApiPokemonDto {
  id: number;
  name: string;
  height?: number;
  weight?: number;
  sprites?: {
    front_default?: string | null;
    other?: {
      ['official-artwork']?: { front_default?: string | null };
    };
  };
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
}
