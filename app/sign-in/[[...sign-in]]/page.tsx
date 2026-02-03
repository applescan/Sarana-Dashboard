'use client';
import { SignIn } from '@clerk/nextjs';
import { FaBolt, FaChartLine, FaShieldHalved } from 'react-icons/fa6';

const authCardAppearance = {
  elements: {
    rootBox: 'w-full',
    card: 'bg-transparent shadow-none border-0 p-0',
    main: 'space-y-5',
    headerTitle: 'text-primary-foreground text-xl font-semibold',
    headerSubtitle: 'text-muted text-sm',
    socialButtons: 'flex flex-col gap-3',
    socialButtonsBlockButton:
      'w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/30',
    formField: 'space-y-2',
    formFieldLabel: 'text-sm font-medium text-secondary-foreground',
    formFieldInput:
      'rounded-2xl border-2 border-white/50 bg-white/10 px-4 py-3 text-primary-foreground placeholder:text-muted focus:border-primary/70 focus:ring-0 backdrop-blur',
    formButtonPrimary:
      'w-full rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary/90',
    footer: 'justify-center',
    footerAction__signIn:
      'text-primary hover:text-primary-foreground font-semibold',
    footerAction__signUp:
      'text-primary hover:text-primary-foreground font-semibold',
    identityPreview:
      'rounded-2xl border border-white/10 bg-surface/80 text-secondary-foreground',
  },
  variables: {
    colorPrimary: '#818CF8',
    colorText: '#E2E8F0',
    colorTextSecondary: '#94A3B8',
    fontFamily: 'var(--font-jakarta)',
    colorBackground: 'transparent',
  },
};

const benefits = [
  {
    icon: <FaChartLine className="h-5 w-5 text-primary" aria-hidden="true" />,
    label: 'Real-time analytics, anywhere you log in.',
  },
  {
    icon: <FaBolt className="h-5 w-5 text-primary" aria-hidden="true" />,
    label: 'Lightning fast sales recording.',
  },
  {
    icon: (
      <FaShieldHalved className="h-5 w-5 text-primary" aria-hidden="true" />
    ),
    label: 'Enterprise-grade protection via Clerk.',
  },
];

export default function Page() {
  return (
    <section className="rounded-3xl border border-white/10 bg-card/80 p-6 shadow-glow lg:p-10">
      <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6 text-secondary-foreground">
          <p className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-muted">
            Sarana POS
          </p>
          <div>
            <h1 className="text-3xl font-semibold text-primary-foreground sm:text-4xl">
              Let's get you started
            </h1>
            <p className="mt-3 text-base text-muted">
              Monitor sales, manage stock, and keep cash flow sharp inside a
              single command center designed for Sarana.
            </p>
          </div>
          <div className="space-y-4 rounded-2xl border border-white/5 bg-white/5 p-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.label}
                className="flex items-start gap-3 text-sm text-secondary-foreground"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-surface/70 shadow-inner">
                  {benefit.icon}
                </span>
                <p>{benefit.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-surface/70 p-6 shadow-glow">
          <SignIn
            path="/sign-in"
            afterSignOutUrl="/sign-in"
            fallbackRedirectUrl="/"
            appearance={authCardAppearance}
          />
        </div>
      </div>
    </section>
  );
}
