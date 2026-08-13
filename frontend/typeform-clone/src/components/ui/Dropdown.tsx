'use client';

import {
  useState,
  useRef,
  useEffect,
  type ReactNode,
  createContext,
  useContext,
} from 'react';
import { cn } from '@/lib/utils';

// ─── Context ─────────────────────────────────────────────────────────────────

interface DropdownContextValue {
  close: () => void;
}
const DropdownContext = createContext<DropdownContextValue>({ close: () => {} });

// ─── Root ─────────────────────────────────────────────────────────────────────

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export function Dropdown({
  trigger,
  children,
  align = 'right',
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <DropdownContext.Provider value={{ close: () => setOpen(false) }}>
      <div ref={containerRef} className={cn('relative inline-block', className)}>
        {/* Trigger */}
        <div onClick={() => setOpen((prev) => !prev)}>{trigger}</div>

        {/* Menu */}
        {open && (
          <div
            className={cn(
              'absolute top-full mt-1 z-50 min-w-[160px]',
              'bg-white border border-[#e4e4e7] rounded-xl shadow-lg',
              'py-1 overflow-hidden',
              align === 'right' ? 'right-0' : 'left-0'
            )}
            role="menu"
          >
            {children}
          </div>
        )}
      </div>
    </DropdownContext.Provider>
  );
}

// ─── Item ─────────────────────────────────────────────────────────────────────

interface DropdownItemProps {
  onClick?: () => void;
  icon?: ReactNode;
  children: ReactNode;
  danger?: boolean;
  className?: string;
}

export function DropdownItem({
  onClick,
  icon,
  children,
  danger = false,
  className,
}: DropdownItemProps) {
  const { close } = useContext(DropdownContext);

  const handleClick = () => {
    onClick?.();
    close();
  };

  return (
    <button
      type="button"
      role="menuitem"
      onClick={handleClick}
      className={cn(
        'w-full flex items-center gap-2.5 px-3.5 py-2 text-sm',
        'text-left transition-colors duration-75 cursor-pointer',
        danger
          ? 'text-red-600 hover:bg-red-50'
          : 'text-[#3C323E] hover:bg-[#f7f5f8]',
        className
      )}
    >
      {icon && (
        <span className="shrink-0 text-[#847E85]">{icon}</span>
      )}
      {children}
    </button>
  );
}

// ─── Separator ────────────────────────────────────────────────────────────────

export function DropdownSeparator() {
  return <div className="my-1 h-px bg-[#f0eeef]" role="separator" />;
}
