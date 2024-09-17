import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url("/sign-up.png")` }}
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full">
          <SignIn
            path="/sign-in"
            afterSignOutUrl="/sign-in"
            fallbackRedirectUrl="/sign-in"
          />
        </div>
      </div>
    </div>
  );
}
