import { VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full cursor-pointer border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-0',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-gradient-to-r from-primary to-accent text-white shadow-glow hover:opacity-90',
        secondary:
          'border-white/10 bg-white/5 text-secondary-foreground hover:bg-white/10',
        destructive:
          'border-transparent bg-rose-500/80 text-white hover:bg-rose-500',
        outline: 'border-white/20 text-secondary-foreground hover:bg-white/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
