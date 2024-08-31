import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="flex justify-center items-center my-auto h-[80vh]">
      <SignIn path="/sign-in" afterSignOutUrl="/" />
    </div>
  );
}
