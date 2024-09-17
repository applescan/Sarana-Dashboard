'use client';
import { SignUp, useOrganization } from '@clerk/nextjs';

export default function Page() {
  const { organization } = useOrganization();
  const slug = organization?.slug || 'sarana';

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url("/sign-up.png")` }}
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full">
          <SignUp
            path="/sign-up"
            afterSignOutUrl="/sign-in"
            fallbackRedirectUrl={`/${slug}/pos`}
          />
        </div>
      </div>
    </div>
  );
}
