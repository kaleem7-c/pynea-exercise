import { graphqlRequest } from './graphql-client';
import { PaginatedPokemon, Pokemon } from './types';

export const PAGE_SIZE = 24;

const POKEMON_SUMMARY_FIELDS = `
  id
  name
  imageUrl
  types
`;

const POKEMON_DETAIL_FIELDS = `
  id
  name
  imageUrl
  types
  abilities
  height
  weight
`;

const PAGINATED_FIELDS = `
  items { ${POKEMON_SUMMARY_FIELDS} }
  totalCount
  limit
  offset
`;

export interface PageParams {
  limit?: number;
  offset?: number;
}

export async function listPokemon({ limit = PAGE_SIZE, offset = 0 }: PageParams = {}): Promise<PaginatedPokemon> {
  const data = await graphqlRequest<{ pokemonList: PaginatedPokemon }>(
    `query ListPokemon($limit: Int, $offset: Int) { pokemonList(limit: $limit, offset: $offset) { ${PAGINATED_FIELDS} } }`,
    { limit, offset },
  );
  return data.pokemonList;
}

export async function searchPokemon(
  term: string,
  { limit = PAGE_SIZE, offset = 0 }: PageParams = {},
): Promise<PaginatedPokemon> {
  const data = await graphqlRequest<{ searchPokemon: PaginatedPokemon }>(
    `query SearchPokemon($query: String!, $limit: Int, $offset: Int) {
      searchPokemon(query: $query, limit: $limit, offset: $offset) { ${PAGINATED_FIELDS} }
    }`,
    { query: term, limit, offset },
  );
  return data.searchPokemon;
}

export async function getPokemon(name: string): Promise<Pokemon | null> {
  const data = await graphqlRequest<{ pokemon: Pokemon | null }>(
    `query GetPokemon($name: String!) { pokemon(name: $name) { ${POKEMON_DETAIL_FIELDS} } }`,
    { name },
  );
  return data.pokemon;
}
