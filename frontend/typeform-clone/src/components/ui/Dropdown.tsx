'use client';

import {
  useState,
  useRef,
  useEffect,
  type ReactNode,
  createContext,
  useContext,
} from 'react';
import { createPortal } from 'react-dom';
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
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  // Update coords
  useEffect(() => {
    if (open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const isInsideContainer = containerRef.current?.contains(e.target as Node);
      const isInsideMenu = menuRef.current?.contains(e.target as Node);
      if (!isInsideContainer && !isInsideMenu) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler, true);
    return () => document.removeEventListener('mousedown', handler, true);
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

  // Handle scroll to update position or close
  useEffect(() => {
    if (!open) return;
    const handler = () => {
      setOpen(false);
    };
    window.addEventListener('scroll', handler, true);
    return () => window.removeEventListener('scroll', handler, true);
  }, [open]);

  const menu = open ? (
    <div
      ref={menuRef}
      className={cn(
        'fixed z-[9999] min-w-[160px]',
        'bg-white border border-[#e4e4e7] rounded-xl shadow-lg',
        'py-1 overflow-hidden'
      )}
      style={{
        top: coords.top,
        ...(align === 'right' ? { left: coords.left + coords.width - 160 } : { left: coords.left }),
      }}
      role="menu"
    >
      {children}
    </div>
  ) : null;

  // Render portal only on client
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <DropdownContext.Provider value={{ close: () => setOpen(false) }}>
      <div ref={containerRef} className={cn('relative inline-block', className)}>
        {/* Trigger */}
        <div onClick={() => setOpen((prev) => !prev)}>{trigger}</div>

        {/* Menu */}
        {mounted && menu && createPortal(menu, document.body)}
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
