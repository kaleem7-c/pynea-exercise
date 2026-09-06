'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('q') ?? '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    router.push(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : '/');
  }

  return (
    <form className="search-bar" role="search" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search Pokemon by name..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Search Pokemon"
      />
      <button type="submit">Search</button>
    </form>
  );
}
