'use client';
import { SignInButton, SignedOut, SignedIn, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { FaBarsStaggered } from 'react-icons/fa6';
import { MdClose } from 'react-icons/md';
import Button from './Button';

const navItems = [
  { label: 'Dashboard', path: 'dashboard' },
  { label: 'Sales', path: 'pos' },
  { label: 'Product', path: 'product' },
  { label: 'Orders', path: 'order' },
];

export default function Header() {
  const slug = 'sarana';
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const hideAuthCta =
    pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up');

  const NavLink = ({ path, label }: { path: string; label: string }) => (
    <Link
      href={slug ? `/${slug}/${path}` : '#'}
      className="text-sm font-medium text-secondary-foreground/80 transition hover:text-primary-foreground"
    >
      {label}
    </Link>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-30 px-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mt-4 rounded-3xl border border-glass-border bg-surface/60 px-4 py-4 shadow-glow backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-4">
            <Link
              href={slug ? `/${slug}/dashboard` : '#'}
              className="flex items-center gap-3"
            >
              <Image
                src="/icon.png"
                alt="Sarana logo"
                width={48}
                height={48}
                className="h-12 w-12 rounded-2xl border border-white/15 bg-white/10 p-2 shadow-glow"
                priority
              />
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-muted">
                  Sarana
                </p>
                <h1 className="text-lg font-semibold text-primary-foreground">
                  Point Of Sales System
                </h1>
              </div>
            </Link>

            <div className="hidden items-center gap-8 lg:flex">
              <SignedIn>
                <nav className="flex items-center gap-6">
                  {navItems.map((item) => (
                    <NavLink key={item.path} {...item} />
                  ))}
                </nav>
              </SignedIn>
              <div className="flex items-center gap-3">
                {!hideAuthCta && (
                  <SignedOut>
                    <SignInButton>
                      <Button variant="secondary" paddingLess>
                        Sign in
                      </Button>
                    </SignInButton>
                  </SignedOut>
                )}
                <SignedIn>
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox:
                          'ring-2 ring-primary/60 rounded-full',
                      },
                    }}
                  />
                </SignedIn>
              </div>
            </div>
            <div className="flex items-center gap-3 lg:hidden">
              <SignedIn>
                <UserButton />
              </SignedIn>
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-white"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                {menuOpen ? (
                  <MdClose className="h-5 w-5" />
                ) : (
                  <FaBarsStaggered className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <SignedIn>
            <div
              className={`lg:hidden ${menuOpen ? 'mt-6 opacity-100' : 'pointer-events-none h-0 opacity-0'} transition-all`}
            >
              <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                {navItems.map((item) => (
                  <NavLink key={item.path} {...item} />
                ))}
              </div>
            </div>
          </SignedIn>
          {!hideAuthCta && (
            <SignedOut>
              <div className="mt-4 flex items-center justify-end lg:hidden">
                <SignInButton>
                  <Button variant="secondary" className="w-full justify-center">
                    Sign in
                  </Button>
                </SignInButton>
              </div>
            </SignedOut>
          )}
        </div>
      </div>
    </header>
  );
}
