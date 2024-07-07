import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center">
      <SignUp
        path="/sign-up"
        afterSignOutUrl="/"
        signInFallbackRedirectUrl="/:slug/pos"
      />
    </div>
  );
}
