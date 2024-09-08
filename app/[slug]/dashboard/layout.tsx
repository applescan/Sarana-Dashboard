import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { ReactNode } from 'react';

export default async function Page({
  params,
  children,
}: {
  params: { slug: string };
  children: ReactNode;
}) {
  const slug = params.slug;
  const user = await currentUser();

  if (!user) {
    return auth().redirectToSignIn();
  }

  const response = await clerkClient.organizations.getOrganization({ slug });
  const orgName = response.name;

  return (
    <section className="pb-10">
      <h1 className="text-2xl sm:text-3xl font-bold pb-8 text-left">
        {orgName} Dashboard
      </h1>
      {children}
    </section>
  );
}
