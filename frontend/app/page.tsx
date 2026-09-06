import { Suspense } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { PokemonCard } from '@/components/PokemonCard';
import { Pagination } from '@/components/Pagination';
import { listPokemon, PAGE_SIZE, searchPokemon } from '@/lib/queries';

function parsePage(page?: string): number {
  return Math.max(0, Number.parseInt(page ?? '0', 10) || 0);
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const query = searchParams.q?.trim();
  const page = parsePage(searchParams.page);
  const offset = page * PAGE_SIZE;

  const result = query
    ? await searchPokemon(query, { offset })
    : await listPokemon({ offset });

  return (
    <main className="container">
      <div className="page-header">
        <h1>Pokemon Explorer</h1>
        <p>Browse and search Pokemon</p>
      </div>

      <Suspense>
        <SearchBar />
      </Suspense>

      {result.items.length === 0 ? (
        <p className="empty-state">No Pokemon found{query ? ` for "${query}"` : ''}.</p>
      ) : (
        <>
          <div className="grid">
            {result.items.map((p) => (
              <PokemonCard key={p.id} pokemon={p} />
            ))}
          </div>
          <Pagination query={query} page={page} limit={result.limit} totalCount={result.totalCount} />
        </>
      )}
    </main>
  );
}
