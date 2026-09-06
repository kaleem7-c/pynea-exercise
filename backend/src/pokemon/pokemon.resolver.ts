import { Args, Query, Resolver } from '@nestjs/graphql';
import { PokemonService } from './pokemon.service';
import { PaginatedPokemon } from './domain/paginated-pokemon.model';
import { Pokemon } from './domain/pokemon.model';
import { PaginationArgs } from './dto/pagination.args';
import { SearchPokemonArgs } from './dto/search-pokemon.args';

@Resolver(() => Pokemon)
export class PokemonResolver {
  constructor(private readonly pokemonService: PokemonService) {}

  @Query(() => PaginatedPokemon, { description: 'List Pokemon, paginated' })
  pokemonList(@Args() { limit, offset }: PaginationArgs): Promise<PaginatedPokemon> {
    return this.pokemonService.findAll({ limit, offset });
  }

  @Query(() => Pokemon, { nullable: true, description: 'Fetch a single Pokemon by name' })
  pokemon(@Args('name') name: string): Promise<Pokemon | null> {
    return this.pokemonService.findByName(name);
  }

  @Query(() => PaginatedPokemon, { description: 'Search Pokemon by (partial) name, paginated' })
  searchPokemon(@Args() { query, limit, offset }: SearchPokemonArgs): Promise<PaginatedPokemon> {
    return this.pokemonService.search(query, { limit, offset });
  }
}
