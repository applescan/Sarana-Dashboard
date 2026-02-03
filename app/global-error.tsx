'use client';
import React, { FC } from 'react';
import Button from '../components/ui/Button';

const GlobalError: FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-8 bg-surface px-6 py-10 text-secondary-foreground">
      <div className="relative h-48 w-48">
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <div className="absolute inset-4 rounded-full border border-white/20" />
        <div className="absolute inset-8 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/40 to-accent/40 text-4xl font-semibold text-white">
          404
        </div>
      </div>
      <div className="max-w-lg text-center">
        <h1 className="text-4xl font-bold text-primary-foreground">
          Something went sideways
        </h1>
        <p className="mt-4 text-secondary-foreground/80">
          Sorry for the turbulence—please try refreshing the page or navigating
          back home while we recalibrate the dashboard.
        </p>
      </div>
      <a href="/">
        <Button variant="brand">Go back home</Button>
      </a>
    </div>
  );
};

export default GlobalError;
