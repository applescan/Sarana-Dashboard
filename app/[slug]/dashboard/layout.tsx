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
    <section className="pb-12">
      <div className="mb-8 rounded-3xl border border-white/10 bg-card/60 p-6 shadow-glow">
        <p className="text-xs uppercase tracking-[0.4em] text-muted">
          Overview
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-primary-foreground sm:text-4xl">
          {orgName} Dashboard
        </h1>
      </div>
      {children}
    </section>
  );
}
