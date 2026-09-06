import Link from 'next/link';

const PREV_LABEL = '← Previous';
const NEXT_LABEL = 'Next →';

function buildHref(query: string | undefined, page: number): string {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (page > 0) params.set('page', String(page));
  const qs = params.toString();
  return qs ? `/?${qs}` : '/';
}

export function Pagination({
  query,
  page,
  limit,
  totalCount,
}: {
  query?: string;
  page: number;
  limit: number;
  totalCount: number;
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const hasPrev = page > 0;
  const hasNext = page + 1 < totalPages;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      {hasPrev ? (
        <Link href={buildHref(query, page - 1)}>{PREV_LABEL}</Link>
      ) : (
        <span className="disabled" aria-disabled="true">{PREV_LABEL}</span>
      )}
      <span className="page-indicator">
        Page {page + 1} of {totalPages}
      </span>
      {hasNext ? (
        <Link href={buildHref(query, page + 1)}>{NEXT_LABEL}</Link>
      ) : (
        <span className="disabled" aria-disabled="true">{NEXT_LABEL}</span>
      )}
    </nav>
  );
}
