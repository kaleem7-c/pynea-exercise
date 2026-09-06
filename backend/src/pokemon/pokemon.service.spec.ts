import { PokemonService } from './pokemon.service';
import { PokemonDataSource } from './pokemon-data-source';
import { Pokemon } from './domain/pokemon.model';

function makePokemon(overrides: Partial<Pokemon> = {}): Pokemon {
  return {
    id: 1,
    name: 'bulbasaur',
    imageUrl: 'https://example.com/bulbasaur.png',
    types: ['grass', 'poison'],
    abilities: ['overgrow'],
    height: 7,
    weight: 69,
    ...overrides,
  };
}

describe('PokemonService', () => {
  let dataSource: jest.Mocked<PokemonDataSource>;
  let service: PokemonService;

  beforeEach(() => {
    dataSource = {
      findAll: jest.fn(),
      findByName: jest.fn(),
      search: jest.fn(),
    };
    service = new PokemonService(dataSource);
  });

  it('delegates findByName to the data source unchanged', async () => {
    dataSource.findByName.mockResolvedValue(makePokemon());

    const result = await service.findByName('bulbasaur');

    expect(dataSource.findByName).toHaveBeenCalledWith('bulbasaur');
    expect(result?.name).toBe('bulbasaur');
  });

  it('returns null when the data source finds nothing', async () => {
    dataSource.findByName.mockResolvedValue(null);

    const result = await service.findByName('missingno');

    expect(result).toBeNull();
  });

  it('clamps a negative offset to zero before calling the data source', async () => {
    dataSource.findAll.mockResolvedValue({ items: [], totalCount: 0, limit: 24, offset: 0 });

    await service.findAll({ limit: 24, offset: -10 });

    expect(dataSource.findAll).toHaveBeenCalledWith({ limit: 24, offset: 0 });
  });

  it('clamps a limit above the maximum page size', async () => {
    dataSource.findAll.mockResolvedValue({ items: [], totalCount: 0, limit: 100, offset: 0 });

    await service.findAll({ limit: 5000, offset: 0 });

    expect(dataSource.findAll).toHaveBeenCalledWith({ limit: 100, offset: 0 });
  });

  it('clamps a non-positive limit up to at least 1', async () => {
    dataSource.findAll.mockResolvedValue({ items: [], totalCount: 0, limit: 1, offset: 0 });

    await service.findAll({ limit: 0, offset: 0 });

    expect(dataSource.findAll).toHaveBeenCalledWith({ limit: 1, offset: 0 });
  });

  it('normalizes pagination for search the same way as findAll', async () => {
    dataSource.search.mockResolvedValue({ items: [makePokemon({ name: 'charmander' })], totalCount: 1, limit: 24, offset: 0 });

    const result = await service.search('char', { limit: 24, offset: -5 });

    expect(dataSource.search).toHaveBeenCalledWith('char', { limit: 24, offset: 0 });
    expect(result.items).toHaveLength(1);
  });
});
