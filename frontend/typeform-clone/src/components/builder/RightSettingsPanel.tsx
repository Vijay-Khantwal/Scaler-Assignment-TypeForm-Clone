'use client';

import { useState, useRef, useEffect } from 'react';
import { useFormStore } from '@/store/useFormStore';
import { SwitchRow } from '@/components/ui/Switch';
import type { Form, Question, QuestionType } from '@/types';
import { QUESTION_TYPE_META } from '@/lib/utils';
import { cn } from '@/lib/utils';

function QuestionTypeSelect({ q, patch }: { q: Question; patch: (p: any) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const meta = QUESTION_TYPE_META[q.type];
  const types = Object.keys(QUESTION_TYPE_META) as QuestionType[];
  const filtered = types.filter(t => QUESTION_TYPE_META[t].label.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative mb-5" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-white border border-[#e4e4e7] rounded-lg pl-3 pr-3 py-2 text-[13px] font-medium text-[#3C323E] hover:border-[#c8c4c9] transition-colors shadow-sm cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <div className={cn("w-6 h-6 rounded-md flex items-center justify-center shrink-0", meta.badgeBg)}>
            <img src={meta.iconPath} alt="" width={14} height={14} />
          </div>
          {meta.label}
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#655D67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-xl shadow-lg z-50 overflow-hidden py-1">
          <div className="px-2 pb-1 border-b border-[#f0eeef] flex items-center gap-2 text-[#847E85]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1 shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full py-1.5 text-[13px] outline-none text-[#3C323E] placeholder:text-[#c4c1c5]"
              autoFocus
            />
          </div>
          <div className="max-h-[400px] overflow-y-auto mt-1 custom-scrollbar">
            {filtered.map(t => {
              const m = QUESTION_TYPE_META[t];
              const isSelected = q.type === t;
              return (
                <button
                  key={t}
                  onClick={() => {
                    if (q.type !== t) {
                      patch({
                        title: q.title,
                        settings: q.settings,
                        typeSettings: {},
                        options:
                          t === 'multiple_choice' || t === 'dropdown'
                            ? [
                                { id: crypto.randomUUID().slice(0, 10), label: '' },
                                { id: crypto.randomUUID().slice(0, 10), label: '' },
                              ]
                            : undefined,
                      });
                    }
                    setOpen(false);
                    setSearch('');
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-[13px] transition-colors border-l-2",
                    isSelected ? "bg-[#f7f5f8] text-[#3C323E] font-medium border-[#3C323E]" : "text-[#655D67] hover:bg-[#f7f5f8] hover:text-[#3C323E] border-transparent"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className={cn("w-6 h-6 rounded-md flex items-center justify-center shrink-0", m.badgeBg)}>
                      <img src={m.iconPath} alt="" width={14} height={14} />
                    </div>
                    {m.label}
                  </div>
                  {isSelected && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  )}
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-center text-[13px] text-[#847E85]">No matches</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Max Length Settings ──────────────────────────────────────────────────────

function MaxLengthSettings({ q, patch }: { q: Question; patch: (p: any) => void }) {
  const [enabled, setEnabled] = useState(q.typeSettings.maxLength !== undefined);

  useEffect(() => {
    setEnabled(q.typeSettings.maxLength !== undefined);
  }, [q.id]);

  const handleToggle = (v: boolean) => {
    setEnabled(v);
    patch({ typeSettings: { ...q.typeSettings, maxLength: v ? 50 : undefined } });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    patch({ typeSettings: { ...q.typeSettings, maxLength: isNaN(val) ? undefined : val } });
  };

  return (
    <>
      <SwitchRow
        label="Max characters"
        checked={enabled}
        onChange={handleToggle}
        className="text-[13px]"
      />
      {enabled && (
        <input
          type="text"
          value={q.typeSettings.maxLength ?? ''}
          onChange={handleChange}
          className="w-full bg-white border border-[#e4e4e7] rounded-lg px-3 py-2 text-[13px] text-[#3C323E] outline-none focus:border-[#c8c4c9] transition-colors mb-4"
        />
      )}
      <SwitchRow
        label={
          <div className="flex items-center gap-1 text-[#655D67]">
            Answer validation
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#847E85" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          </div>
        }
        checked={false}
        onChange={() => import('react-hot-toast').then(m => m.default('Coming soon', { icon: '🚧' }))}
        className="text-[13px]"
      />
      <SwitchRow
        label={
          <div className="flex items-center gap-1 text-[#655D67]">
            Custom placeholder text
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#847E85" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          </div>
        }
        checked={false}
        onChange={() => import('react-hot-toast').then(m => m.default('Coming soon', { icon: '🚧' }))}
        className="text-[13px]"
      />
    </>
  );
}

// ─── Right Settings Panel ─────────────────────────────────────────────────────

interface RightSettingsPanelProps {
  form: Form;
  selectedQuestion: Question | null;
}

export function RightSettingsPanel({ form, selectedQuestion }: RightSettingsPanelProps) {
  const { updateQuestion } = useFormStore();

  if (!selectedQuestion) {
    return (
      <div className="w-[280px] shrink-0 bg-transparent flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-3 border border-[#e4e4e7]">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <path fill="#847E85" d="M14.499 3.75a.25.25 0 0 0-.25-.25h-2.25v9h2.25a.25.25 0 0 0 .25-.25zM6.249 8.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1 0-1.5zm2-2.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5zm-6.75 6.25c0 .138.113.25.25.25h8.75v-9h-8.75a.25.25 0 0 0-.25.25zm14.5 0a1.75 1.75 0 0 1-1.75 1.75h-12.5A1.75 1.75 0 0 1 0 12.25v-8.5c0-.966.783-1.75 1.75-1.75h12.5c.966 0 1.75.784 1.75 1.75z" />
          </svg>
        </div>
        <p className="text-sm text-[#847E85]">
          Select a question to see its settings
        </p>
      </div>
    );
  }

  const q = selectedQuestion;
  const patch = (p: Parameters<typeof updateQuestion>[2]) =>
    updateQuestion(form.id, q.id, p);

  // A question is a "page parent" if any other question has parentId === q.id
  const isPageParent = form.questions.some(fq => fq.parentId === q.id);

  return (
    <aside className="w-[300px] shrink-0 bg-white flex flex-col h-full overflow-hidden text-[#655D67] px-4 pb-4 pt-0 mt-3">
      <div className="flex-1 space-y-4">
        
        {/* Question Block — only shown for page-parent questions */}
        {isPageParent && (
          <div className="bg-[#F7F7F8] rounded-2xl border-none p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-[13px] font-semibold text-[#3C323E]">Question</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#847E85" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            </div>
            <div className="flex items-center bg-[#e4e4e7] rounded-lg p-0.5">
              <button className="flex-1 flex items-center justify-center gap-2 bg-white rounded-md py-1.5 shadow-sm text-[13px] font-medium text-[#3C323E]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 9h16M4 15h16"/></svg>
                Text
              </button>
              <button 
                onClick={() => import('react-hot-toast').then(m => m.default('Coming soon', { icon: '🚧' }))}
                className="flex-1 flex items-center justify-center gap-2 text-[13px] font-medium text-[#847E85] hover:text-[#3C323E] transition-colors py-1.5"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
                Video
              </button>
            </div>
          </div>
        )}

        {/* Answer Block — simplified for page title, full for regular questions */}
        {isPageParent ? (
          <div className="bg-[#F7F7F8] rounded-2xl border-none p-4">
            <label className="block text-[13px] font-semibold text-[#3C323E] mb-4">Answer</label>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-[#3C323E]">Image or video</span>
              <button onClick={() => import('react-hot-toast').then(m => m.default('Coming soon', { icon: '🚧' }))} className="w-8 h-8 rounded-lg border border-[#e4e4e7] flex items-center justify-center bg-white hover:border-[#c8c4c9] hover:bg-[#faf9fa] transition-colors cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#655D67" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#F7F7F8] rounded-2xl border-none p-4">
            {(q.type === 'short_text' || q.type === 'long_text') && (
              <label className="block text-[13px] font-semibold text-[#3C323E] mb-3">Answer</label>
            )}
            <QuestionTypeSelect q={q} patch={patch} />

          <div className="space-y-4">
            <SwitchRow
              label="Required"
              checked={q.settings.required}
              onChange={(v) => patch({ settings: { ...q.settings, required: v } })}
              className="text-[13px]"
            />

            {/* Text fields */}
            {(q.type === 'short_text' || q.type === 'long_text') && (
              <MaxLengthSettings q={q} patch={patch} />
            )}

            {/* Multiple choice */}
            {q.type === 'multiple_choice' && (
              <>
                <SwitchRow
                  label="Multiple selection"
                  checked={q.typeSettings.allowMultipleSelection ?? false}
                  onChange={(v) => patch({ typeSettings: { ...q.typeSettings, allowMultipleSelection: v } })}
                  className="text-[13px]"
                />
                <SwitchRow
                  label="Randomize"
                  checked={q.typeSettings.randomizeOptions ?? false}
                  onChange={(v) => patch({ typeSettings: { ...q.typeSettings, randomizeOptions: v } })}
                  className="text-[13px]"
                />
                <SwitchRow
                  label='"Other" option'
                  checked={q.typeSettings.hasOtherOption ?? false}
                  onChange={(v) => patch({ typeSettings: { ...q.typeSettings, hasOtherOption: v } })}
                  className="text-[13px]"
                />
                <SwitchRow
                  label='"None" option'
                  checked={q.typeSettings.hasNoneOption ?? false}
                  onChange={(v) => patch({ typeSettings: { ...q.typeSettings, hasNoneOption: v } })}
                  className="text-[13px]"
                />
                <SwitchRow
                  label="Vertical alignment"
                  checked={q.typeSettings.verticalAlignment ?? true}
                  onChange={(v) => patch({ typeSettings: { ...q.typeSettings, verticalAlignment: v } })}
                  className="text-[13px]"
                />
              </>
            )}

            {/* Dropdown settings */}
            {q.type === 'dropdown' && (
              <>
                <SwitchRow
                  label="Alphabetical order"
                  checked={false}
                  onChange={() => import('react-hot-toast').then(m => m.default('Coming soon', { icon: '🚧' }))}
                  className="text-[13px]"
                />
                <SwitchRow
                  label="Randomize"
                  checked={q.typeSettings.randomizeOptions ?? false}
                  onChange={(v) => patch({ typeSettings: { ...q.typeSettings, randomizeOptions: v } })}
                  className="text-[13px]"
                />
              </>
            )}

            {/* Rating */}
            {q.type === 'rating' && (
              <div className="pt-1 flex gap-2">
                <div className="relative flex-1">
                  <select
                    value={q.typeSettings.ratingSteps ?? 5}
                    onChange={e => patch({ typeSettings: { ...q.typeSettings, ratingSteps: parseInt(e.target.value) } })}
                    className="w-full appearance-none bg-white border border-[#3C323E] rounded-lg px-3 py-2 text-[13px] font-medium text-[#3C323E] outline-none transition-colors cursor-pointer"
                  >
                    {[3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path fill="#3C323E" fillRule="evenodd" clipRule="evenodd" d="M7.116 10.847a1.25 1.25 0 0 0 1.768 0L12.78 6.95a.75.75 0 0 0-1.06-1.06L8 9.61 4.28 5.89a.75.75 0 0 0-1.06 1.06z" /></svg>
                  </span>
                </div>
                <div className="relative flex-1">
                  <select
                    value={q.typeSettings.ratingShape ?? 'star'}
                    onChange={e => patch({ typeSettings: { ...q.typeSettings, ratingShape: e.target.value as any } })}
                    className="w-full appearance-none bg-white border border-[#e4e4e7] rounded-lg px-3 py-1.5 text-lg font-medium text-[#655D67] outline-none focus:border-[#c8c4c9] transition-colors cursor-pointer"
                  >
                    <option value="star">☆</option>
                    <option value="heart">♡</option>
                    <option value="user">👤</option>
                    <option value="crown">♔</option>
                    <option value="cat">🐱</option>
                    <option value="dog">🐶</option>
                    <option value="circle">○</option>
                    <option value="flag">⚑</option>
                  </select>
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path fill="#847E85" fillRule="evenodd" clipRule="evenodd" d="M7.116 10.847a1.25 1.25 0 0 0 1.768 0L12.78 6.95a.75.75 0 0 0-1.06-1.06L8 9.61 4.28 5.89a.75.75 0 0 0-1.06 1.06z" /></svg>
                  </span>
                </div>
              </div>
            )}

            <div className="border-t border-[#e4e4e7] my-4" />

            <SwitchRow
              label={
                <div className="flex items-center gap-1 font-medium text-[#3C323E]">
                  Map to contacts
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#847E85" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                </div>
              }
              checked={false}
              onChange={() => import('react-hot-toast').then(m => m.default('Coming soon', { icon: '🚧' }))}
              className="text-[13px]"
            />
            
            <div className="border-t border-[#e4e4e7] my-4" />

            <div className="flex items-center justify-between pb-2">
              <span className="text-[13px] font-medium text-[#3C323E]">Image or video</span>
              <button onClick={() => import('react-hot-toast').then(m => m.default('Coming soon', { icon: '🚧' }))} className="w-8 h-8 rounded-lg border border-[#e4e4e7] flex items-center justify-center bg-white hover:border-[#c8c4c9] hover:bg-[#faf9fa] transition-colors cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#655D67" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              </button>
            </div>
          </div>
          </div>
        )}

        {/* Branching Block */}
        <div className="bg-[#F7F7F8] rounded-2xl border-none p-4 flex items-center justify-between">
          <span className="text-[13px] font-semibold text-[#3C323E]">Branching</span>
          <button onClick={() => import('react-hot-toast').then(m => m.default('Coming soon', { icon: '🚧' }))} className="w-8 h-8 rounded-lg border border-[#e4e4e7] flex items-center justify-center bg-white hover:border-[#c8c4c9] transition-colors cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#655D67" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>

        {/* Comments Block */}
        <div className="bg-[#F7F7F8] rounded-2xl border-none p-4 flex items-center justify-between cursor-pointer" onClick={() => import('react-hot-toast').then(m => m.default('Coming soon', { icon: '🚧' }))}>
          <span className="text-[13px] font-semibold text-[#3C323E]">Comments</span>
          <div className="w-8 h-8 rounded-lg border border-[#e4e4e7] flex items-center justify-center bg-white text-[#196042]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/></svg>
          </div>
        </div>
      </div>
    </aside>
  );
}
