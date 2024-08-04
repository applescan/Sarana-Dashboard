import { currentUser } from '@clerk/nextjs/server';

export default async function Page({
  children,
}: {
  params: { slug: string };
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) return <div>Not signed in</div>;

  return (
    <section>
      <h1 className="text-3xl font-bold pb-8">Order List</h1>
      {children}
    </section>
  );
}
