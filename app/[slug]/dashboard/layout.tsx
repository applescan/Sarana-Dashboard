import { clerkClient, currentUser } from "@clerk/nextjs/server";

export default async function Page({
  params,
  children,
}: {
  params: { slug: string };
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) return <div>Not signed in</div>;
  const slug = params.slug;

  const response = await clerkClient.organizations.getOrganization({ slug });

  const orgName = response.name;
  return (
    <section>
      <h1 className="text-3xl font-bold pb-8">{orgName} Dashboard</h1>
      {children}
    </section>
  );
}
