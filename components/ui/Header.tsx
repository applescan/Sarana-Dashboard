'use client';
import {
  SignInButton,
  SignedOut,
  SignedIn,
  UserButton,
  useOrganization,
} from '@clerk/nextjs';
import React, { useState } from 'react';

export default function Header() {
  const { organization } = useOrganization();
  const slug = organization?.slug;

  const disabledLinkClass = 'text-gray-400 pointer-events-none';
  const activeLinkClass = 'text-gray-700 hover:text-primary-700';
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-gray-200 shadow-lg fixed w-full z-10">
      <nav className="px-4 py-3 mx-auto">
        <div className="flex justify-between items-center">
          <a
            href={slug ? `/${slug}/dashboard` : '#'}
            className={`flex items-center ${slug ? activeLinkClass : disabledLinkClass}`}
          >
            <img src="/sarana.png" alt="Sarana Logo" className="h-12" />
          </a>
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${menuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${menuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            <SignedIn>
              <a
                href={slug ? `/${slug}/dashboard` : '#'}
                className={`text-sm font-normal ${slug ? activeLinkClass : disabledLinkClass}`}
              >
                Dashboard
              </a>
              <a
                href={slug ? `/${slug}/pos` : '#'}
                className={`text-sm font-normal ${slug ? activeLinkClass : disabledLinkClass}`}
              >
                Sales
              </a>
              <a
                href={slug ? `/${slug}/product` : '#'}
                className={`text-sm font-normal ${slug ? activeLinkClass : disabledLinkClass}`}
              >
                Product
              </a>
              <a
                href={slug ? `/${slug}/order` : '#'}
                className={`text-sm font-normal ${slug ? activeLinkClass : disabledLinkClass}`}
              >
                Orders
              </a>
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
        <div
          className={`${menuOpen ? 'block' : 'hidden'} lg:hidden absolute top-14 left-0 right-0 bg-white shadow-lg z-20`}
          id="mobile-menu"
        >
          <div className="pt-2 space-y-1">
            <SignedIn>
              <a
                href={slug ? `/${slug}/dashboard` : '#'}
                className={`block px-3 py-2 rounded-md text-base font-medium ${slug ? activeLinkClass : disabledLinkClass}`}
              >
                Dashboard
              </a>
              <a
                href={slug ? `/${slug}/pos` : '#'}
                className={`block px-3 py-2 rounded-md text-base font-medium ${slug ? activeLinkClass : disabledLinkClass}`}
              >
                Sales
              </a>
              <a
                href={slug ? `/${slug}/product` : '#'}
                className={`block px-3 py-2 rounded-md text-base font-medium ${slug ? activeLinkClass : disabledLinkClass}`}
              >
                Product
              </a>
              <a
                href={slug ? `/${slug}/order` : '#'}
                className={`block px-3 py-2 rounded-md text-base font-medium ${slug ? activeLinkClass : disabledLinkClass}`}
              >
                Orders
              </a>
              <div className="border-t border-gray-200 py-3">
                <div className="pl-4">
                  <UserButton />
                </div>
              </div>
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </div>
        </div>
      </nav>
    </header>
  );
}
