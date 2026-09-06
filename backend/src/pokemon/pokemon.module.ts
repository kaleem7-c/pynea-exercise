import { Module } from '@nestjs/common';
import { POKEMON_DATA_SOURCE } from './pokemon-data-source';
import { PokemonResolver } from './pokemon.resolver';
import { PokemonService } from './pokemon.service';
import { PokeApiDataSource } from './infrastructure/pokeapi-data-source';
import { PokeApiMapper } from './infrastructure/pokeapi.mapper';

@Module({
  providers: [
    PokemonResolver,
    PokemonService,
    PokeApiMapper,
    { provide: POKEMON_DATA_SOURCE, useClass: PokeApiDataSource },
  ],
})
export class PokemonModule {}
