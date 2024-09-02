import { auth, currentUser } from '@clerk/nextjs/server';

export default async function Page({
  children,
}: {
  params: { slug: string };
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    return auth().redirectToSignIn();
  }

  return (
    <section className="pb-10">
      <h1 className="text-3xl font-bold pb-8">Product List</h1>
      {children}
    </section>
  );
}
