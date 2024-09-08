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

  return <section className="pb-10">{children}</section>;
}
