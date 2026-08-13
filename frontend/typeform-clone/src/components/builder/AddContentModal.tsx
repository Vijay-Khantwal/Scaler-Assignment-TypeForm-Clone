'use client';

import { useState } from 'react';
import type { QuestionType } from '@/types';
import { QUESTION_TYPE_META } from '@/lib/utils';
import { IconClose, IconPro } from '@/components/icons';
import { cn } from '@/lib/utils';

// ─── Category definitions matching AddContentUI.png ──────────────────────────

interface QuestionItem {
  type: QuestionType;
  label: string;
  iconPath: string;
  badgeBgHex: string;
}

interface ProItem {
  label: string;
  iconPath?: string;
  pro?: boolean;
}

const SUPPORTED_TYPES: QuestionType[] = [
  'short_text',
  'long_text',
  'multiple_choice',
  'dropdown',
  'email',
  'number',
  'yes_no',
  'rating',
];

const supportedItems: QuestionItem[] = SUPPORTED_TYPES.map((t) => ({
  type: t,
  label: QUESTION_TYPE_META[t].label,
  iconPath: QUESTION_TYPE_META[t].iconPath,
  badgeBgHex: QUESTION_TYPE_META[t].badgeBgHex,
}));

// Pro/placeholder items from the reference — not implemented yet
const PRO_ITEMS: ProItem[] = [
  { label: 'Contact Info', pro: false },
  { label: 'Phone Number', pro: false },
  { label: 'Address', pro: false },
  { label: 'Website', pro: false },
  { label: 'Picture Choice', pro: false },
  { label: 'Legal', pro: false },
  { label: 'Checkbox', pro: false },
  { label: 'Date', pro: false },
  { label: 'Signature', pro: true },
  { label: 'Payment', pro: true },
  { label: 'File Upload', pro: true },
];

// ─── Props ───────────────────────────────────────────────────────────────────

interface AddContentModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: QuestionType) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function AddContentModal({ open, onClose, onSelect }: AddContentModalProps) {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'elements' | 'import' | 'ai'>('elements');

  if (!open) return null;

  const filtered = supportedItems.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden pointer-events-auto">

          {/* Header tabs */}
          <div className="flex items-center gap-1 px-6 pt-5 pb-0 border-b border-[#f0eeef] shrink-0">
            {[
              { id: 'elements', label: 'Add form elements' },
              { id: 'import', label: 'Import questions' },
              { id: 'ai', label: 'Create with AI' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as typeof tab)}
                className={cn(
                  'relative px-4 py-3 text-sm font-medium transition-colors border-none',
                  tab === t.id
                    ? 'text-[#3C323E] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-[#3C323E] bg-white'
                    : 'text-[#655D67] hover:text-[#3C323E] cursor-pointer'
                )}
              >
                {t.label}
              </button>
            ))}
            <button
              onClick={onClose}
              className="ml-auto p-1.5 text-[#847E85] hover:text-[#3C323E] hover:bg-[#f7f5f8] rounded-lg transition-colors"
            >
              <IconClose size={16} strokeWidth={1.5} />
            </button>
          </div>

          {/* Body */}
          {tab === 'elements' && (
            <div className="flex flex-1 min-h-0 overflow-hidden">
              {/* Left: Search + Recommended */}
              <div className="w-64 shrink-0 border-r border-[#f0eeef] flex flex-col p-4 gap-4">
                {/* Search */}
                <div className="flex items-center gap-2 border border-[#e4e4e7] rounded-lg px-3 py-2">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path fill="#847E85" fillRule="evenodd" clipRule="evenodd" d="M7.219 2.5a4.719 4.719 0 1 0 0 9.438 4.719 4.719 0 0 0 0-9.438M1 7.219a6.219 6.219 0 1 1 11.115 3.835l2.665 2.666a.75.75 0 1 1-1.06 1.06l-2.666-2.665A6.219 6.219 0 0 1 1 7.219" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search form elements"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 text-sm text-[#3C323E] placeholder:text-[#847E85] outline-none bg-transparent"
                    autoFocus
                    id="add-content-search"
                  />
                </div>

                {/* Recommended */}
                <div>
                  <p className="text-xs font-semibold text-[#847E85] uppercase tracking-wider mb-2">
                    Recommended
                  </p>
                  <div className="space-y-1">
                    {supportedItems.slice(0, 3).map((item) => (
                      <QuestionTypeButton
                        key={item.type}
                        item={item}
                        onClick={() => onSelect(item.type)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: category grid */}
              <div className="flex-1 overflow-y-auto p-5 grid grid-cols-2 gap-x-8 gap-y-5 content-start">
                {/* Text & Questions section — our supported types */}
                <div>
                  <p className="text-xs font-semibold text-[#655D67] mb-2">
                    Text & Questions
                  </p>
                  <div className="space-y-0.5">
                    {(search ? filtered : supportedItems).map((item) => (
                      <QuestionTypeButton
                        key={item.type}
                        item={item}
                        onClick={() => onSelect(item.type)}
                      />
                    ))}
                  </div>
                </div>

                {/* Choice section */}
                <div>
                  <p className="text-xs font-semibold text-[#655D67] mb-2">
                    Choice
                  </p>
                  <div className="space-y-0.5">
                    {supportedItems
                      .filter((i) =>
                        ['multiple_choice', 'dropdown', 'yes_no'].includes(i.type)
                      )
                      .map((item) => (
                        <QuestionTypeButton
                          key={item.type}
                          item={item}
                          onClick={() => onSelect(item.type)}
                        />
                      ))}
                  </div>
                </div>

                {/* Other (pro/coming soon) */}
                <div>
                  <p className="text-xs font-semibold text-[#655D67] mb-2">
                    Other
                  </p>
                  <div className="space-y-0.5">
                    {PRO_ITEMS.slice(0, 5).map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg opacity-50 cursor-not-allowed"
                      >
                        <div className="w-6 h-6 rounded-md bg-[#f0eeef] flex items-center justify-center">
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                            <rect x="2" y="2" width="12" height="12" rx="2" stroke="#847E85" strokeWidth="1.5"/>
                          </svg>
                        </div>
                        <span className="text-sm text-[#655D67]">{item.label}</span>
                        {item.pro && (
                          <span className="ml-auto">
                            <IconPro size={12} strokeWidth={1.5} className="text-[#c4c1c5]" />
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating & Ranking */}
                <div>
                  <p className="text-xs font-semibold text-[#655D67] mb-2">
                    Rating & Ranking
                  </p>
                  <div className="space-y-0.5">
                    {supportedItems
                      .filter((i) => i.type === 'rating')
                      .map((item) => (
                        <QuestionTypeButton
                          key={item.type}
                          item={item}
                          onClick={() => onSelect(item.type)}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'import' && (
            <div className="flex-1 flex items-center justify-center text-[#847E85] text-sm p-8">
              Import questions — Coming soon
            </div>
          )}

          {tab === 'ai' && (
            <div className="flex-1 flex items-center justify-center text-[#847E85] text-sm p-8">
              Create with AI — Coming soon
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Single question type button ──────────────────────────────────────────────

function QuestionTypeButton({
  item,
  onClick,
}: {
  item: QuestionItem;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#f7f5f8] transition-colors text-left group"
    >
      {/* Badge icon container — matching reference AddContentUI.png */}
      <div
        className="flex items-center justify-center w-6 h-6 rounded-md shrink-0"
        style={{ backgroundColor: item.badgeBgHex }}
        /* ASSUMED_COLOR — from reference AddContentUI.png */
      >
        <img src={item.iconPath} alt={item.label} width={13} height={13} />
      </div>
      <span className="text-sm text-[#3C323E] group-hover:text-[#1a1a1a]">
        {item.label}
      </span>
    </button>
  );
}
