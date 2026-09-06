import Image from 'next/image';
import Link from 'next/link';
import { Pokemon } from '@/lib/types';

export function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  return (
    <Link href={`/pokemon/${pokemon.name}`} className="card">
      {pokemon.imageUrl && (
        <Image src={pokemon.imageUrl} alt={pokemon.name} width={96} height={96} unoptimized />
      )}
      <div className="name">{pokemon.name}</div>
      <div>
        {pokemon.types.map((type) => (
          <span key={type} className="badge">
            {type}
          </span>
        ))}
      </div>
    </Link>
  );
}
