'use client';
import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url("/sign-up.png")` }}
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full bg-white/80 p-6 rounded-xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              🚀 To access the dashboard
              <br />
              <span className="font-bold text-indigo-800">
                Login with your Google account
              </span>
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              One click and you're in. No forms, no fuss — just fast access.
            </p>
          </div>
          <SignIn
            path="/sign-in"
            afterSignOutUrl="/sign-in"
            fallbackRedirectUrl="/"
          />
        </div>
      </div>
    </div>
  );
}
