'use client';

import { useState, useEffect } from 'react';
import { useFormStore } from '@/store/useFormStore';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/home/DashboardHeader';
import { LeftSidebar } from '@/components/home/LeftSidebar';
import { FormListItem, FormListHeader } from '@/components/home/FormListItem';
import { RenameModal } from '@/components/home/RenameModal';
import { IconList, IconGrid, IconFilter, IconSpark, IconClose, IconPlus } from '@/components/icons';
import type { Form } from '@/types';
import { cn } from '@/lib/utils';

// ─── View toggle ──────────────────────────────────────────────────────────────

type ViewMode = 'list' | 'grid';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { forms, createForm } = useFormStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<ViewMode>('list');
  const [renameTarget, setRenameTarget] = useState<Form | null>(null);
  const [bannerVisible, setBannerVisible] = useState(true);

  // Avoid hydration mismatch with persisted Zustand state and load from API
  useEffect(() => {
    setMounted(true);
    useFormStore.getState().loadForms();
  }, []);

  const handleCreateForm = () => {
    const newForm = createForm();
    router.push(`/forms/${newForm.id}`);
  };

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f7f7f7]">
        <div className="w-5 h-5 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f7f7f7]">
      <DashboardHeader activeTab="forms" />

      <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-y-auto md:overflow-hidden">
        <LeftSidebar />

        {/* Main content */}
        <main className="flex-1 overflow-y-visible md:overflow-y-auto bg-[#f7f7f7]">
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-6">

            {/* Workspace header */}
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <h1 className="text-xl font-semibold text-[#3C323E]">
                  My workspace
                </h1>
                <button className="p-1 text-[#847E85] hover:text-[#655D67] hover:bg-[#f0eef1] rounded-md transition-colors cursor-pointer">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M6.5 3a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0m0 5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0m0 5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0" />
                  </svg>
                </button>
                <button className="flex items-center gap-1.5 text-sm text-[#655D67] hover:text-[#3C323E] transition-colors cursor-pointer">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M8 1a.75.75 0 0 1 .75.75v5.5h5.5a.75.75 0 0 1 0 1.5h-5.5v5.5a.75.75 0 0 1-1.5 0v-5.5h-5.5a.75.75 0 0 1 0-1.5h5.5v-5.5A.75.75 0 0 1 8 1z" />
                  </svg>
                  Invite
                </button>
                <button className="p-1 text-[#c4c1c5] hover:text-[#655D67] transition-colors cursor-pointer">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path fill="currentColor" d="M8 1.5A6.5 6.5 0 1 0 14.5 8 6.508 6.508 0 0 0 8 1.5zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z" fillRule="evenodd" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Sort + View controls */}
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 text-sm text-[#655D67] border border-[#e4e4e7] rounded-lg px-3 py-1.5 hover:bg-white transition-colors bg-white cursor-pointer">
                  <IconFilter size={13} strokeWidth={1.5} />
                  Date created
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M7.116 10.847a1.25 1.25 0 0 0 1.768 0L12.78 6.95a.75.75 0 0 0-1.06-1.06L8 9.61 4.28 5.89a.75.75 0 0 0-1.06 1.06z" />
                  </svg>
                </button>

                {/* List / Grid toggle */}
                <div className="flex items-center border border-[#e4e4e7] rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setView('list')}
                    className={cn(
                      'p-2 transition-colors cursor-pointer',
                      view === 'list' ? 'bg-[#f0eef1] text-[#3C323E]' : 'text-[#847E85] hover:bg-[#f7f5f8]'
                    )}
                    title="List view"
                  >
                    <IconList size={14} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => setView('grid')}
                    className={cn(
                      'p-2 transition-colors border-l border-[#e4e4e7] cursor-pointer',
                      view === 'grid' ? 'bg-[#f0eef1] text-[#3C323E]' : 'text-[#847E85] hover:bg-[#f7f5f8]'
                    )}
                    title="Grid view"
                  >
                    <IconGrid size={14} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>

            {/* Banner tip */}
            {bannerVisible && (
              <div className="flex items-start gap-3 bg-white border border-[#e4e4e7] rounded-xl p-4 mb-5">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                  <IconSpark size={15} className="text-violet-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#3C323E]">
                    Create a form to collect responses, run surveys, or build a conversational flow.
                  </p>
                  <button
                    onClick={handleCreateForm}
                    className="mt-2 text-xs font-medium text-[#3C323E] border border-[#e4e4e7] rounded-full px-3 py-1 hover:bg-[#f7f5f8] transition-colors cursor-pointer"
                  >
                    Create a form
                  </button>
                </div>
                <button
                  onClick={() => setBannerVisible(false)}
                  className="p-1 text-[#c4c1c5] hover:text-[#655D67] hover:bg-[#f7f5f8] rounded-md transition-colors shrink-0 cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path fill="currentColor" d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06z" fillRule="evenodd" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}

            {/* Forms list */}
            {forms.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#f0eef1] flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
                    <path fill="#847E85" d="M14.499 3.75a.25.25 0 0 0-.25-.25h-2.25v9h2.25a.25.25 0 0 0 .25-.25zM6.249 8.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1 0-1.5zm2-2.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5zm-6.75 6.25c0 .138.113.25.25.25h8.75v-9h-8.75a.25.25 0 0 0-.25.25zm14.5 0a1.75 1.75 0 0 1-1.75 1.75h-12.5A1.75 1.75 0 0 1 0 12.25v-8.5c0-.966.783-1.75 1.75-1.75h12.5c.966 0 1.75.784 1.75 1.75z" />
                  </svg>
                </div>
                <p className="text-base font-medium text-[#3C323E] mb-1">No forms yet</p>
                <p className="text-sm text-[#847E85] mb-5">Create your first form to get started</p>
                <button
                  onClick={handleCreateForm}
                  className="flex items-center gap-2 bg-[#1a1a1a] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#2d2d2d] transition-colors"
                >
                  <IconPlus size={14} />
                  Create form
                </button>
              </div>
            ) : (
              /* Form list table */
              <div className="bg-white rounded-xl border border-[#e4e4e7] shadow-sm">
                <FormListHeader />
                {forms.map((form) => (
                  <FormListItem
                    key={form.id}
                    form={form}
                    onRename={(f) => setRenameTarget(f)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Rename modal */}
      <RenameModal
        form={renameTarget}
        onClose={() => setRenameTarget(null)}
      />
    </div>
  );
}
