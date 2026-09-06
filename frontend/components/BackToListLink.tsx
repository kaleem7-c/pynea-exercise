import Link from 'next/link';

export function BackToListLink() {
  return (
    <Link href="/" className="back-link">
      Back to list
    </Link>
  );
}
