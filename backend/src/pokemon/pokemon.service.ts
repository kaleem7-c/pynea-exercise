import { Inject, Injectable } from '@nestjs/common';
import { Pagination, POKEMON_DATA_SOURCE, PokemonDataSource } from './pokemon-data-source';
import { PaginatedPokemon } from './domain/paginated-pokemon.model';
import { Pokemon } from './domain/pokemon.model';
import { MAX_PAGE_LIMIT } from './dto/pagination.args';

@Injectable()
export class PokemonService {
  constructor(
    @Inject(POKEMON_DATA_SOURCE) private readonly dataSource: PokemonDataSource,
  ) {}

  findAll(pagination: Pagination): Promise<PaginatedPokemon> {
    return this.dataSource.findAll(this.normalize(pagination));
  }

  findByName(name: string): Promise<Pokemon | null> {
    return this.dataSource.findByName(name);
  }

  search(query: string, pagination: Pagination): Promise<PaginatedPokemon> {
    return this.dataSource.search(query, this.normalize(pagination));
  }

  private normalize({ limit, offset }: Pagination): Pagination {
    return {
      limit: Math.min(Math.max(limit, 1), MAX_PAGE_LIMIT),
      offset: Math.max(offset, 0),
    };
  }
}
