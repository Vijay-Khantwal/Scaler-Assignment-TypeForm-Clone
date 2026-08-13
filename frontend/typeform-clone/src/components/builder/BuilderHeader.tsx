'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStore } from '@/store/useFormStore';
import type { Form } from '@/types';
import {
  IconChevronRight,
  IconForms,
  IconLink,
  IconSend,
  IconPreview,
  IconMobile,
  IconSettings,
  IconAI,
  IconLogic,
  IconHelp,
  IconCheck,
} from '@/components/icons';
import { cn } from '@/lib/utils';

interface BuilderHeaderProps {
  form: Form;
  activeTab?: string;
  onTabChange: (tabId: string) => void;
  onPublish: () => void;
}

const BUILDER_TABS_DRAFT = [
  { id: 'content', label: 'Content' },
  { id: 'workflow', label: 'Workflow' },
  { id: 'connect', label: 'Connect' },
];

const BUILDER_TABS_PUBLISHED = [
  { id: 'content', label: 'Content' },
  { id: 'workflow', label: 'Workflow' },
  { id: 'connect', label: 'Connect' },
  { id: 'share', label: 'Share' },
  { id: 'results', label: 'Results' },
];

import { RenameFormModal } from './RenameFormModal';

export function BuilderHeader({ form, activeTab = 'content', onTabChange, onPublish }: BuilderHeaderProps) {
  const router = useRouter();
  const { setAddContentModalOpen, setPreviewMode, renameForm } = useFormStore();
  const [copied, setCopied] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const isPublished = form.status === 'published';
  const tabs = isPublished ? BUILDER_TABS_PUBLISHED : BUILDER_TABS_DRAFT;

  return (
    <header className="flex flex-col bg-white shrink-0 z-20 relative">
      {/* Top row */}
      <div className="flex items-center justify-between px-8 h-12 pt-1.5">
        {/* Left: breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-[#655D67]">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 hover:text-[#3C323E] transition-colors cursor-pointer"
          >
            <IconForms size={14} />
            Forms
          </button>
          <IconChevronRight size={8} className="text-[#c4c1c5]" />
          <button
            onClick={() => setIsRenameModalOpen(true)}
            className="text-[#3C323E] font-medium max-w-[200px] truncate cursor-pointer hover:bg-[#f7f5f8] px-1.5 py-0.5 rounded-md transition-colors"
          >
            {form.title || 'New form'}
          </button>
        </div>
        
        <RenameFormModal 
          isOpen={isRenameModalOpen}
          onClose={() => setIsRenameModalOpen(false)}
          currentTitle={form.title || 'New form'}
          onSave={(newTitle) => renameForm(form.id, newTitle)}
        />

        {/* Center: tabs */}
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center h-full p-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'workflow' || tab.id === 'connect') {
                  import('react-hot-toast').then(m => m.default('Coming soon', { icon: '🚧' }));
                } else {
                  onTabChange(tab.id);
                }
              }}
              className={cn(
                'relative flex items-center h-full px-1 text-sm transition-colors cursor-pointer',
                tab.id === activeTab
                  ? 'text-[#3C323E] font-semibold before:absolute before:top-0 before:left-2 before:right-2 before:h-[3px] before:bg-[#3C323E] before:rounded-b-sm'
                  : 'text-[#655D67] font-medium hover:text-[#3C323E] bg-transparent'
              )}
            >
              <div className={cn("px-2 py-1.5 rounded-xl transition-colors", tab.id === activeTab ? "bg-[#f4f2f4]" : "hover:bg-[#f7f5f8]")}>
                {tab.label}
              </div>
            </button>
          ))}
        </nav>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          {!isPublished ? (
            <button
              onClick={() => {
                onPublish();
                onTabChange('share');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white font-medium bg-[#1a1a1a] hover:bg-[#2d2d2d] transition-colors cursor-pointer"
            >
              <IconSend size={14} />
              Publish
            </button>
          ) : (
            <>
              {(!form.publishedAt || form.updatedAt > form.publishedAt) && (
                <button
                  onClick={onPublish}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors bg-transparent text-[#3C323E] border border-[#d4d1d5] hover:bg-[#f0eeef] cursor-pointer"
                >
                  <IconSend size={13} />
                  Publish edits
                </button>
              )}
              <button
                onClick={() => {
                  const url = `${window.location.origin}/to/${form.shareId || form.id}`;
                  navigator.clipboard.writeText(url);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className={cn(
                  "relative p-1.5 border rounded-lg transition-colors group cursor-pointer",
                  copied 
                    ? "text-[#3C323E] border-[#3C323E] bg-[#f7f5f8]" 
                    : "text-[#847E85] border-[#e4e4e7] hover:text-[#3C323E] hover:bg-[#f7f5f8]"
                )}
              >
                {copied ? <IconCheck size={15} /> : <IconLink size={15} />}
                <div className={cn(
                  "absolute top-full left-1/2 -translate-x-1/2 mt-2 pointer-events-none transition-opacity z-50",
                  copied ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}>
                  <div className="bg-[#443B45] text-white text-[13px] py-1.5 px-3 rounded-lg whitespace-nowrap shadow-xl font-medium tracking-wide">
                    {copied ? 'Copied!' : 'Copy link'}
                  </div>
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-[5px] border-transparent border-b-[#443B45]" />
                </div>
              </button>
            </>
          )}

          <div className="h-4 w-px bg-[#e4e4e7] mx-1" />

          <button 
            onClick={() => import('react-hot-toast').then(m => m.default('Coming soon', { icon: '🚧' }))}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-[#387567] hover:bg-[#2c5e52] rounded-lg transition-colors cursor-pointer"
          >
            View plans
          </button>
          <button 
            onClick={() => import('react-hot-toast').then(m => m.default('Coming soon', { icon: '🚧' }))}
            className="p-1.5 text-[#847E85] hover:text-[#655D67] hover:bg-[#f7f5f8] rounded-lg transition-colors cursor-pointer"
          >
            <IconHelp size={15} />
          </button>
          
          <div className="relative group ml-1">
            <div className="w-8 h-8 rounded-full bg-[#F3E5CC] flex items-center justify-center cursor-pointer">
              <span className="text-[#3C323E] text-xs font-semibold">VK</span>
            </div>
            <div className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
              <div className="bg-[#443B45] text-white py-2 px-3.5 rounded-xl shadow-xl flex flex-col min-w-[200px]">
                <span className="text-[14px] font-semibold">Vijay Khantwal</span>
                <span className="text-[13px] text-[#C4C1C5]">vkhantwal999@gmail.com</span>
              </div>
              <div className="absolute -top-1.5 right-3 border-[6px] border-transparent border-b-[#443B45]" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
