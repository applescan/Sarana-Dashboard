import { SignUp } from '@clerk/nextjs';

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
      <div className="flex justify-center items-center">
        <SignUp path="/sign-up" afterSignOutUrl="/" />
      </div>
    </div>
  );
}
