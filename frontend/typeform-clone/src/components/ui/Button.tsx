'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react'; /* ASSUMED_ICON: Replace with custom SVG later */

// ─── Variants ────────────────────────────────────────────────────────────────

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'green';
type Size = 'xs' | 'sm' | 'md' | 'lg';

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[#1a1a1a] text-white hover:bg-[#2d2d2d] active:bg-[#1a1a1a] border border-[#1a1a1a]',
  secondary:
    'bg-white text-[#3C323E] border border-[#e4e4e7] hover:bg-[#f7f5f8] active:bg-[#f0eef1]',
  ghost:
    'bg-transparent text-[#655D67] border border-transparent hover:bg-[#f7f5f8] active:bg-[#f0eef1]',
  danger:
    'bg-white text-red-600 border border-[#e4e4e7] hover:bg-red-50 active:bg-red-100',
  green:
    'bg-[#196042] text-white hover:bg-[#145236] active:bg-[#0f3e29] border border-[#196042]',
};

const sizeClasses: Record<Size, string> = {
  xs: 'px-2.5 py-1 text-xs gap-1',
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-sm gap-2',
};

// ─── Props ───────────────────────────────────────────────────────────────────

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Icon rendered before the label */
  iconLeft?: ReactNode;
  /** Icon rendered after the label */
  iconRight?: ReactNode;
  /** Shows a spinner and disables the button */
  loading?: boolean;
  /** When true, button is full-width */
  fullWidth?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'secondary',
      size = 'md',
      iconLeft,
      iconRight,
      loading = false,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Base
          'inline-flex items-center justify-center rounded-lg font-medium',
          'transition-colors duration-100 cursor-pointer',
          'select-none whitespace-nowrap',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          // Variant + size
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
        ) : (
          iconLeft && <span className="shrink-0">{iconLeft}</span>
        )}
        {children && <span>{children}</span>}
        {iconRight && !loading && (
          <span className="shrink-0">{iconRight}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
