import { Injectable } from '@nestjs/common';
import { Pokemon } from '../domain/pokemon.model';
import { PokeApiPokemonDto } from './pokeapi.types';

/**
 * Translate PokeAPI's external shape into our
 * internal domain model
 */
@Injectable()
export class PokeApiMapper {
  toDomain(dto: PokeApiPokemonDto): Pokemon {
    return {
      id: dto.id,
      name: dto.name,
      imageUrl: dto.sprites?.other?.['official-artwork']?.front_default ?? dto.sprites?.front_default ?? undefined,
      types: dto.types.map((t) => t.type.name),
      abilities: dto.abilities.map((a) => a.ability.name),
      height: dto.height,
      weight: dto.weight,
    };
  }
}
