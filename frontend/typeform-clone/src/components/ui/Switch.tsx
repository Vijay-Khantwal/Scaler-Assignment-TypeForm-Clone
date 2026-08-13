'use client';

import { cn } from '@/lib/utils';

// ─── Switch — iOS-style toggle matching Typeform's settings panel ─────────────

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  label?: string | React.ReactNode;
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  className,
  id,
  label,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        'relative inline-flex h-5 w-[34px] shrink-0 cursor-pointer rounded-full border',
        'transition-colors duration-150 ease-in-out',
        'focus-visible:outline-none',
        checked ? 'border-[#3C323E] bg-white' : 'border-[#d1d1d1] bg-white',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      aria-label={typeof label === 'string' ? label : undefined}
    >
      <span
        className={cn(
          'pointer-events-none absolute top-[1px] inline-block h-[16px] w-[16px] rounded-full',
          'transition-transform duration-150 ease-in-out',
          checked ? 'translate-x-[14px] bg-[#3C323E]' : 'translate-x-[2px] bg-[#847E85]'
        )}
      />
    </button>
  );
}

// ─── SwitchRow — Label + Switch in a single row (used in settings panel) ─────

interface SwitchRowProps {
  label: string | React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function SwitchRow({
  label,
  checked,
  onChange,
  disabled,
  className,
}: SwitchRowProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between py-1.5 px-0',
        className
      )}
    >
      <span className="text-[13px] text-[#655D67] select-none">{label}</span>
      <Switch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        label={label}
      />
    </div>
  );
}
