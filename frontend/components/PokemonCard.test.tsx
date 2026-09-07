import { render, screen } from '@testing-library/react';
import { PokemonCard } from './PokemonCard';
import { Pokemon } from '@/lib/types';

const pokemon: Pokemon = {
  id: 25,
  name: 'pikachu',
  imageUrl: 'https://example.com/pikachu.png',
  types: ['electric'],
  abilities: ['static'],
  height: 4,
  weight: 60,
};

describe('PokemonCard', () => {
  it('renders the name, types, and a link to the detail page', () => {
    render(<PokemonCard pokemon={pokemon} />);

    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('electric')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/pokemon/pikachu');
  });
});
