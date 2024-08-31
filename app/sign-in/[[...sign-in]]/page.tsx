import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div
      style={{
        backgroundImage: `url("/sign-up.png")`,
        height: '100%',
        backgroundRepeat: 'repeat',
        backgroundSize: 'cover',
      }}
    >
      <div className="flex justify-center items-center my-auto h-[80vh]">
        <SignIn path="/sign-in" afterSignOutUrl="/" />
      </div>
    </div>
  );
}
