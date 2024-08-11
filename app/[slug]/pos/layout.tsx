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

  return <section>{children}</section>;
}
