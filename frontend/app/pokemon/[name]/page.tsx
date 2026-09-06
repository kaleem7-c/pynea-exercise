import Image from 'next/image';
import { notFound } from 'next/navigation';
import { BackToListLink } from '@/components/BackToListLink';
import { getPokemon } from '@/lib/queries';

export default async function PokemonDetailPage({ params }: { params: { name: string } }) {
  const pokemon = await getPokemon(params.name);

  if (!pokemon) {
    notFound();
  }

  return (
    <main className="container">
      <BackToListLink />

      <div className="detail-card">
        {pokemon.imageUrl && (
          <Image src={pokemon.imageUrl} alt={pokemon.name} width={180} height={180} unoptimized />
        )}
        <div className="detail-info">
          <h2>
            {pokemon.name} <span className="id">#{pokemon.id}</span>
          </h2>
          <div>
            {pokemon.types.map((type) => (
              <span key={type} className="badge">
                {type}
              </span>
            ))}
          </div>
          <div className="stat-row">
            {pokemon.height != null && <span>Height: {pokemon.height / 10} m</span>}
            {pokemon.weight != null && <span>Weight: {pokemon.weight / 10} kg</span>}
          </div>
          {pokemon.abilities.length > 0 && (
            <p className="abilities">
              <strong>Abilities:</strong> {pokemon.abilities.join(', ')}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
