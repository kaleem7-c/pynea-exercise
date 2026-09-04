import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pagination, PokemonDataSource } from '../pokemon-data-source';
import { PaginatedPokemon } from '../domain/paginated-pokemon.model';
import { Pokemon } from '../domain/pokemon.model';
import { PokeApiMapper } from './pokeapi.mapper';
import { PokeApiListResponse, PokeApiPokemonDto } from './pokeapi.types';

/**
 *  As PokeAPI has no search by name support, we fetch all names/urls and filter down
 *  This covers the full pokeAPI catalog (~1300 entries)
 *  (cheaper than multiple sequential round trips using page.next)
 */
const SEARCH_CATALOG_SIZE = 1500;

@Injectable()
export class PokeApiDataSource implements PokemonDataSource {
  private readonly logger = new Logger(PokeApiDataSource.name);
  private readonly baseUrl: string;
  
  private readonly detailCache = new Map<string, PokeApiPokemonDto>();

  constructor(
    private readonly config: ConfigService,
    private readonly mapper: PokeApiMapper,
  ) {
    const baseUrl = this.config.get<string>('POKEAPI_BASE_URL');
    if (!baseUrl) {
      throw new Error('POKEAPI_BASE_URL must be set (see .env.example)');
    }
    this.baseUrl = baseUrl;
  }

  async findAll({ limit, offset }: Pagination): Promise<PaginatedPokemon> {
    const list = await this.fetchJson<PokeApiListResponse>(
      `${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`,
    );
    const items = await this.fetchDetailsFor(list.results.map((entry) => entry.name));
    return { items, totalCount: list.count, limit, offset };
  }

  async findByName(name: string): Promise<Pokemon | null> {
    const normalized = name.toLowerCase();
    const cached = this.detailCache.get(normalized);
    if (cached) {
      return this.mapper.toDomain(cached);
    }

    const response = await fetch(`${this.baseUrl}/pokemon/${encodeURIComponent(normalized)}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      this.handleFailure(response.status, `pokemon/${name}`);
    }
    const dto = (await response.json()) as PokeApiPokemonDto;
    this.detailCache.set(normalized, dto);
    return this.mapper.toDomain(dto);
  }

  async search(query: string, { limit, offset }: Pagination): Promise<PaginatedPokemon> {
    const catalog = await this.fetchJson<PokeApiListResponse>(`${this.baseUrl}/pokemon?limit=${SEARCH_CATALOG_SIZE}`);
    const normalizedQuery = query.toLowerCase();
    const allMatches = catalog.results.filter((entry) => entry.name.includes(normalizedQuery));
    const page = allMatches.slice(offset, offset + limit).map((entry) => entry.name);
    const items = await this.fetchDetailsFor(page);
    return { items, totalCount: allMatches.length, limit, offset };
  }

  private async fetchDetailsFor(names: string[]): Promise<Pokemon[]> {
    const dtos = await Promise.all(names.map((name) => this.fetchDetail(name)));
    return dtos.map((dto) => this.mapper.toDomain(dto));
  }

  private async fetchDetail(name: string): Promise<PokeApiPokemonDto> {
    const cached = this.detailCache.get(name);
    if (cached) {
      return cached;
    }

    const dto = await this.fetchJson<PokeApiPokemonDto>(`${this.baseUrl}/pokemon/${name}`);
    this.detailCache.set(name, dto);
    return dto;
  }

  private async fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      this.handleFailure(response.status, url);
    }
    return (await response.json()) as T;
  }

  private handleFailure(status: number, context: string): never {
    this.logger.error(`PokeAPI request failed (${status}): ${context}`);
    throw new InternalServerErrorException('Failed to fetch data from the Pokemon provider');
  }
}
