import { PaginatedPokemon } from './domain/paginated-pokemon.model';
import { Pokemon } from './domain/pokemon.model';

export interface Pagination {
  limit: number;
  offset: number;
}

export interface PokemonDataSource {
  findAll(pagination: Pagination): Promise<PaginatedPokemon>;
  findByName(name: string): Promise<Pokemon | null>;
  search(query: string, pagination: Pagination): Promise<PaginatedPokemon>;
}

export const POKEMON_DATA_SOURCE = Symbol('POKEMON_DATA_SOURCE');
