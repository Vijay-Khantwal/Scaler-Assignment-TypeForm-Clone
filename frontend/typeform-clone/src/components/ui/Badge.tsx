'use client';

import { cn } from '@/lib/utils';
import type { FormStatus } from '@/types';

// ─── Status Badge ─────────────────────────────────────────────────────────────

interface StatusBadgeProps {
  status: FormStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
        status === 'published'
          ? 'bg-[#e7f5ee] text-[#196042]'
          : 'bg-[#f0f0f0] text-[#847E85]',
        className
      )}
    >
      {status === 'published' && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#196042] inline-block" />
      )}
      {status === 'published' ? 'Published' : 'Draft'}
    </span>
  );
}

// ─── Demo / Pro badge (used in nav tabs) ─────────────────────────────────────

interface PillBadgeProps {
  label: string;
  className?: string;
}

export function PillBadge({ label, className }: PillBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5',
        'rounded-full bg-[#f0eef1] text-[#655D67] border border-[#e4e4e7]',
        className
      )}
    >
      {label}
    </span>
  );
}
