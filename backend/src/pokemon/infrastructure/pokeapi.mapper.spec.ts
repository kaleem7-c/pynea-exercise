import { PokeApiMapper } from './pokeapi.mapper';
import { PokeApiPokemonDto } from './pokeapi.types';

describe('PokeApiMapper', () => {
  const mapper = new PokeApiMapper();

  it('maps a full PokeAPI DTO into the domain model', () => {
    const dto: PokeApiPokemonDto = {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      sprites: {
        front_default: 'https://example.com/front.png',
        other: { 'official-artwork': { front_default: 'https://example.com/artwork.png' } },
      },
      types: [{ type: { name: 'electric' } }],
      abilities: [{ ability: { name: 'static' } }, { ability: { name: 'lightning-rod' } }],
    };

    expect(mapper.toDomain(dto)).toEqual({
      id: 25,
      name: 'pikachu',
      imageUrl: 'https://example.com/artwork.png',
      types: ['electric'],
      abilities: ['static', 'lightning-rod'],
      height: 4,
      weight: 60,
    });
  });

  it('falls back to the default sprite when official artwork is missing', () => {
    const dto: PokeApiPokemonDto = {
      id: 1,
      name: 'bulbasaur',
      sprites: { front_default: 'https://example.com/front.png' },
      types: [],
      abilities: [],
    };

    expect(mapper.toDomain(dto).imageUrl).toBe('https://example.com/front.png');
  });

  it('leaves imageUrl undefined when no sprites are present', () => {
    const dto: PokeApiPokemonDto = {
      id: 1,
      name: 'bulbasaur',
      types: [],
      abilities: [],
    };

    expect(mapper.toDomain(dto).imageUrl).toBeUndefined();
  });
});
