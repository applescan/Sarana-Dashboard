import { auth, currentUser } from '@clerk/nextjs/server';
import { ReactNode } from 'react';

export default async function Page({
  children,
}: {
  params: { slug: string };
  children: ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    return auth().redirectToSignIn();
  }

  return (
    <section className="pb-10">
      <h1 className="text-2xl sm:text-3xl font-bold pb-8 text-left">
        Product List
      </h1>
      {children}
    </section>
  );
}
