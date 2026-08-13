'use client';

import { PillBadge } from '@/components/ui/Badge';
import {
  IconForms,
  IconContacts,
  IconHelp,
  IconIntegrations,
} from '@/components/icons';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  badge?: string;
  icon?: React.ReactNode;
}

const TABS: Tab[] = [
  { id: 'forms', label: 'Forms', icon: <IconForms size={14} /> },
  { id: 'contacts', label: 'Contacts', icon: <IconContacts size={14} /> },
  {
    id: 'automations',
    label: 'Automations',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.378 1.5a.09.09 0 0 0-.069.033L3.17 2.959a.25.25 0 0 0-.055.156V6.5h2.528V3.115a.25.25 0 0 0-.055-.157l-1.14-1.425a.09.09 0 0 0-.069-.033m0-1.5c.483 0 .939.22 1.24.596l1.14 1.425c.249.31.384.696.384 1.094V6.5h.914V1.75c0-.966.783-1.75 1.75-1.75h2.833c.966 0 1.75.784 1.75 1.75V6.5h.861a.75.75 0 0 1 .75.75v6A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25v-6a.75.75 0 0 1 .75-.75h.864V3.115c0-.398.135-.783.384-1.094L3.138.596A1.59 1.59 0 0 1 4.378 0M1.5 8v5.25c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V8zm8.056-1.5h3.333V1.75a.25.25 0 0 0-.25-.25H9.806a.25.25 0 0 0-.25.25V3h.944a.75.75 0 0 1 0 1.5h-.944z"
        />
      </svg>
    ),
  },
  {
    id: 'research',
    label: 'Research Flow',
    badge: 'Demo',
  },
];

interface DashboardHeaderProps {
  activeTab?: string;
}

export function DashboardHeader({ activeTab = 'forms' }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col bg-white border-b border-[#e4e4e7] shrink-0 z-20">
      {/* Top row */}
      <div className="flex flex-wrap items-center justify-between px-4 min-h-[48px] py-2 md:py-0 border-b border-[#f0eeef] gap-2">
        {/* Left: workspace name */}
        <div className="flex items-center gap-2">
          {/* Logo avatar — brown square matching the reference */}
          <div className="w-7 h-7 rounded-md bg-[#C68642] flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold leading-none">V</span>
          </div>
          <button className="flex items-center gap-1 text-sm font-medium text-[#3C323E] hover:text-[#1a1a1a] transition-colors cursor-pointer">
            <span className="truncate max-w-[100px] sm:max-w-none">vkhantwal999</span>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0">
              <path
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.116 10.847a1.25 1.25 0 0 0 1.768 0L12.78 6.95a.75.75 0 0 0-1.06-1.06L8 9.61 4.28 5.89a.75.75 0 0 0-1.06 1.06z"
              />
            </svg>
          </button>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1">
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#655D67] hover:bg-[#f7f5f8] rounded-lg transition-colors cursor-pointer">
            <IconIntegrations size={14} />
            <span className="hidden sm:inline">Integrations</span>
          </button>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#655D67] hover:bg-[#f7f5f8] rounded-lg transition-colors cursor-pointer">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path fill="currentColor" d="M2.55 4.041c-.363-1.45 1.143-2.658 2.48-1.99l8.766 4.384c1.29.645 1.29 2.485 0 3.13L5.03 13.95c-1.337.668-2.843-.54-2.48-1.99L3.54 8zM4.898 8.75l-.893 3.573a.25.25 0 0 0 .354.284l8.767-4.383a.25.25 0 0 0 0-.448L4.359 3.393a.25.25 0 0 0-.354.284l.893 3.573h1.758a.75.75 0 0 1 0 1.5z" fillRule="evenodd" clipRule="evenodd"/>
            </svg>
            <span className="hidden sm:inline">Brand kit</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-[#196042] hover:bg-[#145236] rounded-lg transition-colors cursor-pointer">
            <span className="hidden sm:inline">View plans</span>
            <span className="sm:hidden">Plans</span>
          </button>
          <button className="p-1.5 text-[#847E85] hover:text-[#655D67] hover:bg-[#f7f5f8] rounded-lg transition-colors ml-0.5 cursor-pointer shrink-0">
            <IconHelp size={15} />
          </button>
          {/* User avatar */}
          <div className="w-7 h-7 rounded-full bg-[#C68642] flex items-center justify-center ml-1 cursor-pointer shrink-0">
            <span className="text-white text-xs font-bold leading-none">VK</span>
          </div>
        </div>
      </div>

      {/* Tab row */}
      <div className="flex items-center px-4 h-[52px] gap-2">
        {TABS.map((tab, i) => (
          <div key={tab.id} className="relative h-full flex items-center">
            {tab.id === 'research' && <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-px h-5 bg-[#e4e4e7]" />}
            <button
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 text-sm transition-colors rounded-lg cursor-pointer',
                tab.id === 'research' ? 'ml-2' : '',
                activeTab === tab.id
                  ? 'text-[#3C323E] bg-[#f0eeef] font-medium'
                  : 'text-[#655D67] hover:bg-[#f7f5f8] hover:text-[#3C323E]'
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              {tab.label}
              {tab.badge && (
                <PillBadge label={tab.badge} className="ml-1" />
              )}
            </button>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full px-2">
                <div className="w-full h-[3px] bg-[#3C323E] rounded-t-sm" />
              </div>
            )}
          </div>
        ))}
      </div>
    </header>
  );
}
