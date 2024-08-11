'use client';
import { useAuth, useOrganization } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from '@/components/ui/Loading';

export default function Home() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { organization } = useOrganization();
  const slug = organization?.slug;

  useEffect(() => {
    if (isSignedIn) {
      if (slug) {
        router.push(`/${slug}/pos`);
      }
    } else {
      router.push('/sign-in');
    }
  }, [isSignedIn, slug, router]);

  return <Loading />;
}
