'use client';

import { useState } from 'react';
import { RespondentApp } from '@/components/respondent/RespondentApp';
import type { Form } from '@/types';

interface PreviewOverlayProps {
  form: Form;
  onClose: () => void;
}

export function PreviewOverlay({ form, onClose }: PreviewOverlayProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="fixed inset-0 z-[200] bg-[#f0eeef] flex flex-col overflow-hidden">
      {/* Top nav pill — 3 buttons */}
      <div className="flex justify-center pt-4 pb-3 shrink-0">
        <div className="flex items-center gap-1 bg-white border border-[#e4e4e7] rounded-full px-2 py-1.5 shadow-sm">
          {/* Close */}
          <button
            onClick={onClose}
            title="Close preview"
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#655D67] hover:text-[#3C323E] hover:bg-[#f7f5f8] transition-colors cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>

          <div className="w-px h-4 bg-[#e4e4e7] mx-0.5" />

          {/* Device toggle (mobile / desktop) */}
          <button
            onClick={() => setIsMobile(!isMobile)}
            title={isMobile ? "Switch to desktop" : "Switch to mobile"}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#655D67] hover:text-[#3C323E] hover:bg-[#f7f5f8] transition-colors cursor-pointer"
          >
            {isMobile ? (
              // desktop icon
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="3" rx="2"/>
                <line x1="8" x2="16" y1="21" y2="21"/>
                <line x1="12" x2="12" y1="17" y2="21"/>
              </svg>
            ) : (
              // mobile icon
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
                <path d="M12 18h.01"/>
              </svg>
            )}
          </button>

          {/* Restart / refresh */}
          <button
            onClick={() => setResetKey(k => k + 1)}
            title="Restart preview"
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#655D67] hover:text-[#3C323E] hover:bg-[#f7f5f8] transition-colors cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Device frame area */}
      <div className="flex-1 flex items-start justify-center overflow-hidden px-6 pb-6">
        <div
          className="relative bg-white overflow-hidden flex flex-col"
          style={
            isMobile
              ? {
                  width: 390,
                  height: '100%',
                  maxHeight: 844,
                  borderRadius: 40,
                  boxShadow: '0 0 0 8px #c8c4c9, 0 20px 60px rgba(0,0,0,0.25)',
                  border: '2px solid #e4e4e7',
                }
              : {
                  width: '100%',
                  maxWidth: 1024,
                  height: '100%',
                  maxHeight: 640,
                  borderRadius: 8,
                  boxShadow: '0 0 0 1px #d4d0d5, 0 12px 40px rgba(0,0,0,0.15)',
                }
          }
        >
          {/* Scrollable respondent content inside the frame */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <RespondentApp
              key={resetKey}
              form={form}
              isPreview={true}
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
