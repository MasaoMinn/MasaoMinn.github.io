'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="theme-page container mx-auto px-4 py-16 text-center">
      <h1 className="mb-8 text-4xl font-bold">404 Not Found</h1>
      <Image src="/mainpage/404.png" alt="404 Not Found" width={404} height={404} />
      <p className="theme-muted-text mx-auto mb-8 max-w-md">
        Sorry, the page you are looking for doesn`t exist or has been moved.
      </p>
      <Link
        href="/"
      >
        Return to Home
      </Link>
    </div>
  );
}
