"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ReactFurryErrorDefaultPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/react-furry-error/introduction');
  }, [router]);

  return null;
}