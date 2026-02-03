import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-surface/90 backdrop-blur-2xl">
      <div className="relative h-20 w-20">
        <span className="absolute inset-0 rounded-full border-2 border-white/10" />
        <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin" />
      </div>
      <p className="text-lg font-semibold text-secondary-foreground">
        Preparing your dashboard...
      </p>
    </div>
  );
}
