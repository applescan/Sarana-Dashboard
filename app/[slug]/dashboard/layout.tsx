import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';

export default async function Page({
  params,
  children,
}: {
  params: { slug: string };
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    return auth().redirectToSignIn();
  }

  const slug = params.slug;
  const response = await clerkClient.organizations.getOrganization({ slug });
  const orgName = response.name;

  return (
    <section className="pb-10">
      <h1 className="text-3xl font-bold pb-8">{orgName} Dashboard</h1>
      {children}
    </section>
  );
}
