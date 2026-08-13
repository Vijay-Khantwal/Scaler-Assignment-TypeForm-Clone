'use client';

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// ─── Text Input ──────────────────────────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  /** Renders a subtle bottom-border-only style (used in canvas question fields) */
  underline?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, underline = false, className, ...props }, ref) {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium text-[#655D67] mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full bg-transparent text-[#3C323E] placeholder:text-[#c4c1c5]',
            'text-sm transition-colors duration-100',
            'focus:outline-none',
            underline
              ? [
                  'border-0 border-b border-[#e4e4e7] focus:border-[#3C323E]',
                  'py-1 px-0',
                ]
              : [
                  'border border-[#e4e4e7] rounded-lg px-3 py-2',
                  'hover:border-[#c8c4c9] focus:border-[#3C323E]',
                ],
            error && 'border-red-400 focus:border-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ─── Textarea ────────────────────────────────────────────────────────────────

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, className, ...props }, ref) {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium text-[#655D67] mb-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={3}
          className={cn(
            'w-full bg-transparent text-[#3C323E] placeholder:text-[#c4c1c5]',
            'border border-[#e4e4e7] rounded-lg px-3 py-2 text-sm',
            'hover:border-[#c8c4c9] focus:border-[#3C323E]',
            'focus:outline-none transition-colors duration-100 resize-none',
            error && 'border-red-400 focus:border-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
