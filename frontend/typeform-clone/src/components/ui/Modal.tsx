'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react'; /* ASSUMED_ICON: Replace with custom SVG later */
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  /** Width class override, e.g. "max-w-lg" */
  maxWidth?: string;
  /** Whether to show the X close button in the top-right */
  showClose?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
  maxWidth = 'max-w-2xl',
  showClose = true,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={cn(
          'relative z-10 w-full bg-white rounded-2xl shadow-2xl',
          'max-h-[90vh] flex flex-col',
          'animate-in fade-in zoom-in-95 duration-150',
          maxWidth,
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showClose) && (
          <div className="flex items-center justify-between px-6 pt-5 pb-0 shrink-0">
            {title && (
              <h2 className="text-base font-semibold text-[#3C323E]">{title}</h2>
            )}
            {showClose && (
              <button
                onClick={onClose}
                className="ml-auto p-1 rounded-md text-[#847E85] hover:bg-[#f7f5f8] hover:text-[#3C323E] transition-colors"
                aria-label="Close dialog"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            )}
          </div>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
