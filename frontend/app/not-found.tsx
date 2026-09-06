import { BackToListLink } from '@/components/BackToListLink';

export default function NotFound() {
  return (
    <main className="container">
      <p className="empty-state">Pokemon not found.</p>
      <div className="error-actions">
        <BackToListLink />
      </div>
    </main>
  );
}
