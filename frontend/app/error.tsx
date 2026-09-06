'use client';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="container">
      <p className="empty-state">Something went wrong: {error.message}</p>
      <div className="error-actions">
        <button onClick={reset}>Try again</button>
      </div>
    </main>
  );
}
