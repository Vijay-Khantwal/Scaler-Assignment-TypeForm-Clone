'use client';

import { useState } from 'react';
import { useFormStore } from '@/store/useFormStore';
import { useRouter } from 'next/navigation';
import {
  IconSearch,
  IconWorkspaces,
  IconSpark,
  IconPlus,
  IconChevronDown,
  IconMic,
  IconSend,
} from '@/components/icons';
import { cn } from '@/lib/utils';

interface LeftSidebarProps {
  activeWorkspace?: string;
}

export function LeftSidebar({ activeWorkspace = 'my-workspace' }: LeftSidebarProps) {
  const router = useRouter();
  const { createForm, forms } = useFormStore();
  const [privateOpen, setPrivateOpen] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  const handleCreateForm = () => {
    const newForm = createForm();
    router.push(`/forms/${newForm.id}`);
  };

  const totalResponses = forms.reduce((sum, f) => sum + f.responseCount, 0);
  const responseLimit = 10;

  return (
    <aside className="w-[272px] shrink-0 bg-white border-r border-[#e4e4e7] flex flex-col h-full">
      {/* Create form button */}
      <div className="px-4 pt-4 pb-3 shrink-0">
        <button
          onClick={handleCreateForm}
          className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#2d2d2d] text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
          id="create-form-btn"
        >
          <IconPlus size={14} />
          Create form
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pb-3 shrink-0">
        <div className="flex items-center gap-2 bg-[#f7f5f8] rounded-lg px-3 py-2 border border-transparent hover:border-[#e4e4e7] transition-colors">
          <IconSearch size={14} className="text-[#847E85] shrink-0" />
          <input
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[#3C323E] placeholder:text-[#847E85] outline-none"
            id="sidebar-search"
          />
        </div>
      </div>

      {/* Workspace nav */}
      <div className="flex-1 overflow-y-auto px-3">
        {/* Workspaces label */}
        <div className="flex items-center justify-between py-2 px-1">
          <div className="flex items-center gap-2 text-sm text-[#655D67] font-medium">
            <IconWorkspaces size={14} />
            Workspaces
          </div>
          <button className="p-0.5 text-[#847E85] hover:text-[#3C323E] hover:bg-[#f7f5f8] rounded transition-colors">
            <IconPlus size={14} />
          </button>
        </div>

        {/* Private section */}
        <div className="mt-1">
          <button
            onClick={() => setPrivateOpen((p) => !p)}
            className="flex items-center justify-between w-full px-1 py-1.5 text-sm text-[#3C323E] hover:bg-[#f7f5f8] rounded-lg transition-colors group"
          >
            <span className="font-medium">Private</span>
            <span
              className={cn(
                'transition-transform duration-150',
                privateOpen ? 'rotate-0' : '-rotate-90'
              )}
            >
              <IconChevronDown size={14} className="text-[#847E85]" />
            </span>
          </button>

          {privateOpen && (
            <div className="mt-0.5 ml-1">
              <button
                className={cn(
                  'flex items-center justify-between w-full px-2 py-2 rounded-lg text-sm transition-colors',
                  activeWorkspace === 'my-workspace'
                    ? 'bg-[#f0eef1] text-[#3C323E] font-medium'
                    : 'text-[#655D67] hover:bg-[#f7f5f8]'
                )}
                id="my-workspace-nav"
              >
                My workspace
                <span className="text-xs text-[#847E85] font-medium min-w-[16px] text-center">
                  {forms.length}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom section */}
      <div className="shrink-0 border-t border-[#f0eeef] px-4 py-3 space-y-3">
        {/* Responses collected */}
        <div>
          <p className="text-xs text-[#655D67] font-medium mb-1.5">
            Responses collected
          </p>
          <div className="w-full h-1.5 bg-[#f0eeef] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1a1a1a] rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (totalResponses / responseLimit) * 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-[#847E85] mt-1">
            {totalResponses} / {responseLimit}
          </p>
          <button className="mt-1.5 text-xs text-[#655D67] border border-[#e4e4e7] rounded-full px-2.5 py-1 hover:bg-[#f7f5f8] transition-colors">
            Increase response limit
          </button>
        </div>

        {/* AI chat input */}
        <div className="flex items-center gap-2 border border-[#e4e4e7] rounded-xl px-3 py-2.5 bg-white focus-within:border-[#c8c4c9] transition-colors">
          <button className="text-[#847E85] hover:text-[#3C323E] transition-colors shrink-0">
            <IconMic size={15} />
          </button>
          <input
            type="text"
            placeholder="Ask Typeform AI"
            className="flex-1 text-xs text-[#3C323E] placeholder:text-[#847E85] outline-none bg-transparent"
            id="ai-chat-input"
          />
          <button className="text-[#c4c1c5] hover:text-[#655D67] transition-colors shrink-0">
            <IconSend size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
