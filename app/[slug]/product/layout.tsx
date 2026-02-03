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
    <section className="pb-12">
      <div className="mb-8 rounded-3xl border border-white/10 bg-card/60 p-6 shadow-glow">
        <p className="text-xs uppercase tracking-[0.35em] text-muted">
          Catalog
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-primary-foreground">
          Product Intelligence
        </h1>
        <p className="text-sm text-secondary-foreground/70">
          Manage stock levels, pricing, and categories from one polished view.
        </p>
      </div>
      {children}
    </section>
  );
}
