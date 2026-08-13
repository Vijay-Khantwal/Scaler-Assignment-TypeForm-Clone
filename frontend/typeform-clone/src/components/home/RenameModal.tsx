'use client';

import { useState, useEffect, useRef } from 'react';
import { useFormStore } from '@/store/useFormStore';
import type { Form } from '@/types';
import { IconClose } from '@/components/icons';
import { cn } from '@/lib/utils';

interface RenameModalProps {
  form: Form | null;
  onClose: () => void;
}

export function RenameModal({ form, onClose }: RenameModalProps) {
  const { renameForm } = useFormStore();
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (form) {
      setValue(form.title);
      setTimeout(() => {
        inputRef.current?.select();
      }, 50);
    }
  }, [form]);

  useEffect(() => {
    if (!form) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter') handleSave();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, value]);

  const handleSave = () => {
    if (!form) return;
    const trimmed = value.trim();
    if (trimmed) {
      renameForm(form.id, trimmed);
    }
    onClose();
  };

  if (!form) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[#3C323E]">Rename form</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-[#847E85] hover:bg-[#f7f5f8] hover:text-[#3C323E] transition-colors"
            >
              <IconClose size={15} strokeWidth={1.5} />
            </button>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={cn(
              'w-full border border-[#e4e4e7] rounded-lg px-3 py-2.5 text-sm',
              'text-[#3C323E] placeholder:text-[#c4c1c5]',
              'hover:border-[#c8c4c9] focus:border-[#3C323E] outline-none',
              'transition-colors duration-100'
            )}
            placeholder="Form name"
            id="rename-input"
          />

          <div className="flex gap-2 mt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-[#655D67] border border-[#e4e4e7] rounded-lg hover:bg-[#f7f5f8] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!value.trim()}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] rounded-lg hover:bg-[#2d2d2d] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
