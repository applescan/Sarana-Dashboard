import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
  variant?:
    | 'primary'
    | 'brand'
    | 'danger'
    | 'success'
    | 'warning'
    | 'outline-primary'
    | 'secondary'
    | 'ghost';
  square?: boolean;
  paddingLess?: boolean;
}

const variantMap: Record<NonNullable<ButtonProps['variant']>, string> = {
  brand:
    'bg-gradient-to-r from-primary via-accent to-primary text-white shadow-glow hover:shadow-[0_15px_60px_rgba(129,140,248,0.35)]',
  primary:
    'bg-gradient-to-r from-primary via-accent to-primary text-white shadow-glow hover:shadow-[0_15px_60px_rgba(129,140,248,0.35)]',
  'outline-primary':
    'border border-white/30 text-secondary-foreground bg-transparent hover:border-white/60 hover:bg-white/10',
  danger:
    'bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:opacity-90',
  success:
    'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:opacity-90',
  warning:
    'bg-gradient-to-r from-amber-400 to-amber-500 text-secondary hover:opacity-90',
  secondary:
    'bg-white/10 text-secondary-foreground hover:bg-white/20 border border-white/10',
  ghost: 'bg-transparent text-secondary-foreground hover:bg-white/10',
};

const Button = ({
  className,
  children,
  variant = 'brand',
  square,
  paddingLess,
  type = 'button',
  disabled,
  ...props
}: ButtonProps) => {
  const resolvedVariant = disabled
    ? 'opacity-60 cursor-not-allowed'
    : variantMap[variant];

  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition duration-300 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
        square ? 'rounded-xl' : 'rounded-2xl',
        paddingLess ? 'px-2 py-1.5' : 'px-4 py-2.5',
        resolvedVariant,
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
