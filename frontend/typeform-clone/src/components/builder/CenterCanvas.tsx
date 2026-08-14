'use client';

import { useRef, useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  useFormStore,
  addOptionToQuestion,
  removeOptionFromQuestion,
  updateOptionLabel,
  reorderOptionInQuestion,
} from '@/store/useFormStore';
import type { Form, Question, QuestionType, QuestionOption } from '@/types';
import { getLetterIndex, QUESTION_TYPE_META } from '@/lib/utils';
import { IconPlus, IconTrash, IconDragHandle } from '@/components/icons';
import { cn } from '@/lib/utils';

// ─── Main canvas ──────────────────────────────────────────────────────────────

interface CenterCanvasProps {
  form: Form;
}

export function CenterCanvas({ form }: CenterCanvasProps) {
  const {
    activeFormId,
    forms,
    selectedQuestionId,
    setSelectedQuestionId,
    updateQuestion,
  } = useFormStore();
  const selectedRef = useRef<HTMLDivElement>(null);

  // Auto-scroll selected question into view
  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedQuestionId]);

  const [isMobileView, setIsMobileView] = useState(false);
  const [activeCanvasSection, setActiveCanvasSection] = useState<'header' | 'question'>('question');

  useEffect(() => {
    // We only want to default to 'question' if the active canvas section isn't already 'header'
    // for this specific question. This is handled gracefully by onClick events below.
  }, [selectedQuestionId]);

  return (
    <div className="flex-1 flex flex-col bg-transparent overflow-hidden pb-16 md:pb-0">
      {/* Sub-toolbar */}
      <div className="flex items-center px-4 h-12 gap-1 shrink-0 bg-[#F7F7F8] rounded-xl mx-6 mt-3 z-10">
        <button
          onClick={() => useFormStore.getState().setAddContentModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3A323D] text-white rounded-lg text-sm font-medium hover:bg-[#2A232D] transition-colors cursor-pointer"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2" />
          </svg>
          Add content
        </button>

        <div className="h-4 w-px bg-[#e4e4e7] mx-2" />

        <button
          onClick={() => import('react-hot-toast').then(m => m.default('Coming soon', { icon: '🚧' }))}
          className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-[#655D67] hover:text-[#3C323E] hover:bg-[#e4e4e7] rounded-lg transition-colors cursor-pointer">
          {/* Palette / Design icon */}
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
          </svg>
          Design
        </button>
        
        <div className="h-4 w-px bg-[#e4e4e7] mx-2" />

        <div className="flex items-center gap-0.5">
          <Tooltip text={isMobileView ? "Desktop view" : "Mobile view"}>
            <button 
              onClick={() => setIsMobileView(!isMobileView)}
              className="p-1.5 text-[#655D67] hover:text-[#3C323E] hover:bg-[#e4e4e7] rounded-lg transition-colors cursor-pointer" 
            >
              {isMobileView ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
              )}
            </button>
          </Tooltip>
          <Tooltip text="Preview">
            <button 
              onClick={() => useFormStore.getState().setPreviewMode(true)}
              className="p-1.5 text-[#655D67] hover:text-[#3C323E] hover:bg-[#e4e4e7] rounded-lg transition-colors cursor-pointer"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </button>
          </Tooltip>
        </div>

        <div className="h-4 w-px bg-[#e4e4e7] mx-2" />

        <div className="flex items-center gap-0.5">
          <Tooltip text="Check accessibility">
            <button onClick={() => import('react-hot-toast').then(m => m.default('Coming soon', { icon: '🚧' }))} className="p-1.5 text-[#655D67] hover:text-[#3C323E] hover:bg-[#e4e4e7] rounded-lg transition-colors cursor-pointer">
              <svg width="17" height="17" fill="none" viewBox="0 0 16 16" cursor="unset">
                <g fill="currentColor" clipPath="url(#accessibility-clip)">
                  <path d="M9.176 4.825a1.176 1.176 0 1 1-2.352 0 1.176 1.176 0 0 1 2.352 0M5.527 6.32a.588.588 0 1 0-.148 1.166h.005c.666.084 1.337.149 2.008.183-.097 1.312-.553 2.318-1.569 3.322a.588.588 0 1 0 .827.837c.61-.604 1.058-1.222 1.367-1.884.314.656.753 1.266 1.318 1.868a.588.588 0 0 0 .857-.805C9.219 9.972 8.72 8.965 8.61 7.669c.67-.034 1.34-.1 2.005-.183h.005a.588.588 0 1 0-.149-1.166h-.002c-.818.102-1.646.19-2.47.19s-1.652-.088-2.47-.19z" fill="currentColor"></path>
                  <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0" fillRule="evenodd" clipRule="evenodd" fill="currentColor"></path>
                </g>
                <defs>
                  <clipPath id="accessibility-clip"><path fill="currentColor" d="M0 0h16v16H0z"></path></clipPath>
                </defs>
              </svg>
            </button>
          </Tooltip>
          <Tooltip text="Version history">
            <button onClick={() => import('react-hot-toast').then(m => m.default('Coming soon', { icon: '🚧' }))} className="p-1.5 text-[#655D67] hover:text-[#3C323E] hover:bg-[#e4e4e7] rounded-lg transition-colors cursor-pointer">
              <svg width="17" height="17" fill="none" viewBox="0 0 16 16" cursor="unset">
                <g fill="currentColor" clipPath="url(#history-clip)">
                  <path d="M8 1.499a6.501 6.501 0 0 0-3 12.27v-3.05a.75.75 0 0 1 1.5 0v3.953C6.5 15.405 5.905 16 5.171 16H.75a.75.75 0 1 1 0-1.5h2.584A8.001 8.001 0 0 1 11.001.58a.75.75 0 0 1-.563 1.391A6.5 6.5 0 0 0 8 1.5" fillRule="evenodd" clipRule="evenodd"></path>
                  <path d="M8.834 16a.896.896 0 1 0 0-1.792.896.896 0 0 0 0 1.792M16 7.042a.896.896 0 1 0-1.792 0 .896.896 0 0 0 1.792 0M15.041 9.97a.896.896 0 1 1-.896 1.551.896.896 0 0 1 .896-1.552M12.746 14.472a.896.896 0 1 0-.896-1.552.896.896 0 0 0 .896 1.552M14.143 4.354a.896.896 0 1 1-.896-1.551.896.896 0 0 1 .896 1.551"></path>
                </g>
                <defs><clipPath id="history-clip"><path fill="currentColor" d="M0 0h16v16H0z"></path></clipPath></defs>
              </svg>
            </button>
          </Tooltip>
          <Tooltip text="Translations">
            <button onClick={() => import('react-hot-toast').then(m => m.default('Coming soon', { icon: '🚧' }))} className="p-1.5 text-[#655D67] hover:text-[#3C323E] hover:bg-[#e4e4e7] rounded-lg transition-colors cursor-pointer">
              <svg width="17" height="17" fill="none" viewBox="0 0 16 16" cursor="unset">
                <path fill="currentColor" d="M6 .732a.75.75 0 0 1 .75.75v1.029h3.5a.75.75 0 0 1 0 1.5H8.758A7.8 7.8 0 0 1 7.005 7.65a11.2 11.2 0 0 0 2.434 1.395l.771-2.017a1.113 1.113 0 0 1 2.08 0l2.66 6.954a.75.75 0 1 1-1.4.536L12.969 13H9.53l-.58 1.518a.75.75 0 1 1-1.402-.536l1.353-3.535c-.993-.42-2.035-.987-2.971-1.734-.903.76-1.916 1.335-2.895 1.759a.75.75 0 1 1-.596-1.377 10.3 10.3 0 0 0 2.386-1.414C3.933 6.7 3.24 5.49 2.946 4.011H1.749a.75.75 0 1 1 0-1.5h3.5V1.482A.75.75 0 0 1 6 .732M4.482 4.011c.257 1.018.761 1.886 1.417 2.621a6.3 6.3 0 0 0 1.325-2.621zm5.622 7.489h2.29L11.25 8.508z" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </button>
          </Tooltip>
          <Tooltip text="Settings">
            <button onClick={() => import('react-hot-toast').then(m => m.default('Coming soon', { icon: '🚧' }))} className="p-1.5 text-[#655D67] hover:text-[#3C323E] hover:bg-[#e4e4e7] rounded-lg transition-colors cursor-pointer">
              <svg width="17" height="17" fill="none" viewBox="0 0 16 16" cursor="unset">
                <g clipPath="url(#settings-clip)" fill="none">
                  <path fill="currentColor" d="M7.81 1.5a.25.25 0 0 0-.208.111l-.77 1.155a1.75 1.75 0 0 1-1.85.734L3.84 3.237a.25.25 0 0 0-.233.066l-.304.304a.25.25 0 0 0-.066.233L3.5 4.983a1.75 1.75 0 0 1-.734 1.85l-1.155.77a.25.25 0 0 0-.111.207v.38a.25.25 0 0 0 .111.208l1.155.77a1.75 1.75 0 0 1 .734 1.85l-.263 1.142a.25.25 0 0 0 .066.233l.304.303a.25.25 0 0 0 .233.067l1.143-.263a1.75 1.75 0 0 1 1.85.734l.77 1.155a.25.25 0 0 0 .207.111h.38a.25.25 0 0 0 .208-.111l.77-1.155a1.75 1.75 0 0 1 1.85-.734l1.142.263a.25.25 0 0 0 .233-.066l.303-.304a.25.25 0 0 0 .067-.233l-.263-1.143a1.75 1.75 0 0 1 .734-1.85l1.155-.77a.25.25 0 0 0 .111-.207v-.38a.25.25 0 0 0-.111-.208l-1.155-.77a1.75 1.75 0 0 1-.734-1.85l.263-1.142a.25.25 0 0 0-.066-.233l-.304-.304a.25.25 0 0 0-.233-.066l-1.143.263a1.75 1.75 0 0 1-1.85-.734l-.77-1.155A.25.25 0 0 0 8.19 1.5zM6.354.78A1.75 1.75 0 0 1 7.81 0h.38a1.75 1.75 0 0 1 1.456.78l.77 1.154a.25.25 0 0 0 .264.105l1.143-.264a1.75 1.75 0 0 1 1.63.468l.304.304a1.75 1.75 0 0 1 .468 1.63L13.96 5.32a.25.25 0 0 0 .105.264l1.155.77c.487.325.779.871.779 1.456v.38a1.75 1.75 0 0 1-.78 1.456l-1.154.77a.25.25 0 0 0-.105.264l.264 1.143a1.75 1.75 0 0 1-.468 1.63l-.303.304a1.75 1.75 0 0 1-1.631.468l-1.143-.264a.25.25 0 0 0-.264.105l-.77 1.155A1.75 1.75 0 0 1 8.19 16h-.38a1.75 1.75 0 0 1-1.456-.78l-.77-1.154a.25.25 0 0 0-.264-.105l-1.143.264a1.75 1.75 0 0 1-1.63-.468l-.304-.303a1.75 1.75 0 0 1-.468-1.631l.264-1.143a.25.25 0 0 0-.105-.264l-1.155-.77A1.75 1.75 0 0 1 0 8.19v-.38c0-.585.292-1.131.78-1.456l1.154-.77a.25.25 0 0 0 .105-.264l-.264-1.143a1.75 1.75 0 0 1 .468-1.63l.304-.304a1.75 1.75 0 0 1 1.63-.468l1.143.264a.25.25 0 0 0 .264-.105zM8 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M5 8a3 3 0 1 1 6 0 3 3 0 0 1-6 0" fillRule="evenodd" clipRule="evenodd"></path>
                </g>
                <defs>
                  <clipPath id="settings-clip"><path fill="currentColor" d="M0 0h16v16H0z"></path></clipPath>
                </defs>
              </svg>
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative px-6 pb-6 pt-8">
        {form.questions.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 h-full min-h-[400px]">
            <button 
              onClick={() => useFormStore.getState().setAddContentModalOpen(true)}
              className="w-16 h-16 rounded-2xl bg-white border border-[#e4e4e7] flex items-center justify-center mb-4 shadow-sm cursor-pointer hover:bg-[#f7f5f8] transition-colors"
            >
              <svg width="28" height="28" viewBox="0 0 16 16" fill="none">
                <path fill="#847E85" fillRule="evenodd" clipRule="evenodd" d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2" />
              </svg>
            </button>
            <p className="text-base font-medium text-[#3C323E] mb-1">Start building your form</p>
            <p className="text-sm text-[#847E85]">
              Click &ldquo;Add content&rdquo; in the left panel to add questions
            </p>
          </div>
        ) : (
          <div className={`w-full mx-auto shrink-0 flex flex-col bg-[#F7F7F8] rounded-none shadow-sm border border-[#e4e4e7] overflow-hidden transition-all duration-300 ${isMobileView ? 'max-w-[390px] h-[620px]' : 'max-w-[960px] h-[560px]'}`}>
            <div className="flex-1 overflow-y-auto px-16 py-16 custom-scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="space-y-2 flex flex-col">
        {(() => {
          // Group questions into pages
          const pages: Question[][] = [];
          let currentGroup: Question[] | null = null;
          form.questions.forEach((q) => {
            if (!q.parentId) {
              currentGroup = [q];
              pages.push(currentGroup);
            } else if (currentGroup) {
              currentGroup.push(q);
            } else {
              currentGroup = [q];
              pages.push(currentGroup);
            }
          });

          // Find the page containing the selected question, default to first page
          const activePageIndex = pages.findIndex((p) => p.some((q) => q.id === selectedQuestionId));
          const actualPageIndex = activePageIndex >= 0 ? activePageIndex : 0;
          const activePage = pages[actualPageIndex] || [];

          const firstQ = activePage[0];
          const hasPageHeader = activePage.length >= 2;

          return (
            <div className="flex flex-col mb-8 relative">
              {/* Page Header (only if grouped) */}
              {hasPageHeader && firstQ && (
                <div
                  onClick={() => {
                    setSelectedQuestionId(firstQ.id);
                    setActiveCanvasSection('header');
                  }}
                  className={`py-8 border-b border-[#e4e4e7]/50 mb-4 transition-all duration-200 cursor-text rounded-xl px-3 -mx-3 ${
                    selectedQuestionId === firstQ.id && activeCanvasSection === 'header' ? 'bg-white/60 ring-1 ring-[#e4e4e7]' : 'hover:bg-white/40'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-md shrink-0 bg-[#3C323E] text-white text-xs font-bold">
                      {actualPageIndex + 1}
                    </div>
                  </div>
                  <input
                    type="text"
                    value={firstQ.settings.pageTitle ?? ''}
                    onFocus={() => {
                      setSelectedQuestionId(firstQ.id);
                      setActiveCanvasSection('header');
                    }}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateQuestion(form.id, firstQ.id, {
                        settings: { ...firstQ.settings, pageTitle: e.target.value }
                      });
                    }}
                    placeholder="Page Title"
                    className="w-full text-xl font-medium text-[#3C323E] bg-transparent placeholder:text-[#c4c1c5] outline-none focus:outline-none mb-2 cursor-text"
                  />
                  <input
                    type="text"
                    value={firstQ.settings.pageDescription ?? ''}
                    onFocus={() => {
                      setSelectedQuestionId(firstQ.id);
                      setActiveCanvasSection('header');
                    }}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateQuestion(form.id, firstQ.id, {
                        settings: { ...firstQ.settings, pageDescription: e.target.value }
                      });
                    }}
                    placeholder="Page Description (optional)"
                    className="w-full text-sm text-[#655D67] bg-transparent placeholder:text-[#c4c1c5] outline-none focus:outline-none cursor-text"
                  />
                </div>
              )}

              {/* Page Questions */}
              {activePage.map((question) => {
                  const isSelected = question.id === selectedQuestionId && (question.id !== firstQ.id || activeCanvasSection === 'question' || !hasPageHeader);
                  return (
                    <QuestionCard
                      key={question.id}
                      ref={isSelected ? selectedRef : undefined}
                      question={question}
                      formId={form.id}
                      isSelected={isSelected}
                      onClick={() => {
                        setSelectedQuestionId(question.id);
                        setActiveCanvasSection('question');
                      }}
                      isChild={hasPageHeader}
                      pageIndex={actualPageIndex}
                    />
                  );
                })}
            </div>
          );
        })()}
              </div>
              {/* Bottom padding so last card isn't cut off */}
              <div className="h-32 pointer-events-none shrink-0" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Question card ────────────────────────────────────────────────────────────

import React from 'react';

interface QuestionCardProps {
  question: Question;
  formId: string;
  isSelected: boolean;
  onClick: () => void;
  ref?: React.Ref<HTMLDivElement>;
  isPageParent?: boolean;
  isChild?: boolean;
  pageIndex?: number;
}

const QuestionCard = React.forwardRef<HTMLDivElement, Omit<QuestionCardProps, 'ref'>>(
  function QuestionCard({ question, formId, isSelected, onClick, isPageParent, isChild, pageIndex }, ref) {
    const { updateQuestion, forms } = useFormStore();
    const meta = QUESTION_TYPE_META[question.type];
    const letter = getLetterIndex(question.index);

    const form = forms.find((f) => f.id === formId);

    const updateTitle = (title: string) =>
      updateQuestion(formId, question.id, { title });

    const updateDescription = (description: string) =>
      updateQuestion(formId, question.id, {
        settings: { ...question.settings, description },
      });

    return (
      <div
        ref={ref}
        onPointerDown={(e) => {
          // Fire selection on any pointer down anywhere in the card,
          // even if a child later calls e.stopPropagation() on onClick
          onClick();
        }}
        className={cn(
          'py-8 transition-opacity duration-300',
          isSelected
            ? 'opacity-100'
            : 'opacity-30 hover:opacity-50 cursor-pointer'
        )}
      >
        {/* Card header: type badge + letter + required asterisk */}
        {!isChild && (
          <div className="flex items-center gap-2 mb-3">
            {isPageParent ? (
              <div className="flex items-center justify-center w-6 h-6 rounded-md shrink-0 bg-[#3C323E] text-white text-xs font-bold">
                {pageIndex !== undefined ? pageIndex + 1 : ''}
              </div>
            ) : (
              <div
                className="flex items-center justify-center w-6 h-6 rounded-md shrink-0"
                style={{ backgroundColor: meta.badgeBgHex }}
              >
                <img src={meta.iconPath} alt={meta.label} width={13} height={13} />
              </div>
            )}
            {!isPageParent && (
              <span className="text-xs font-semibold text-[#847E85]">
                {letter}
              </span>
            )}
            {question.settings.required && (
              <span className="text-[#655D67] text-[15px] font-medium">*</span>
            )}
          </div>
        )}

        {/* Editable question title */}
        <div className="relative flex items-start gap-1">
          <input
            type="text"
            value={question.title}
            onChange={(e) => {
              e.stopPropagation();
              updateTitle(e.target.value);
            }}
            placeholder="Your question here. Recall information with @"
            style={{ border: 0, boxShadow: 'none' }}
            className={cn(
              'w-full text-xl font-medium text-[#3C323E] bg-transparent',
              'placeholder:text-[#c4c1c5] outline-none focus:outline-none',
              'transition-colors py-0.5 mb-2'
            )}
            readOnly={!isSelected}
            tabIndex={isSelected ? 0 : -1}
          />
          {isChild && question.settings.required && (
            <span className="text-[#655D67] text-[20px] font-medium leading-none pt-1">*</span>
          )}
        </div>

        {/* Editable description */}
        {(isSelected || question.settings.description) && (
          <input
            type="text"
            value={question.settings.description}
            onChange={(e) => {
              e.stopPropagation();
              updateDescription(e.target.value);
            }}
            placeholder="Description (optional)"
            style={{ border: 0, boxShadow: 'none' }}
            className={cn(
              'w-full text-sm text-[#655D67] bg-transparent',
              'placeholder:text-[#c4c1c5] outline-none focus:outline-none',
              'transition-colors py-0.5 mb-4'
            )}
            readOnly={!isSelected}
            tabIndex={isSelected ? 0 : -1}
          />
        )}
        {isSelected && !question.settings.description && <div className="mb-4" />}

        {/* Type-specific answer preview */}
        {!isPageParent && (
          <div className={cn('pt-4', !isSelected && 'pointer-events-none')}>
            <QuestionAnswerPreview
              question={question}
              formId={formId}
              isSelected={isSelected}
            />
          </div>
        )}
      </div>
    );
  }
);

// ─── Edit Choices Modal (extracted as top-level to prevent state loss) ─────────

function EditChoicesModal({
  options,
  formId,
  questionId,
  onClose,
}: {
  options: { id: string; label: string }[];
  formId: string;
  questionId: string;
  onClose: () => void;
}) {
  const { updateQuestion } = useFormStore();
  const [text, setText] = useState(options.map(o => o.label).join('\n'));

  const save = () => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const newOptions = lines.map((label, i) => ({
      id: options[i]?.id ?? crypto.randomUUID().slice(0, 8),
      label,
    }));
    updateQuestion(formId, questionId, { options: newOptions });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onPointerDown={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        onPointerDown={e => e.stopPropagation()}
      >
        <div className="p-8 pb-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#3C323E]">Edit choices</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#847E85] hover:text-[#3C323E] hover:bg-[#f7f5f8] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <p className="text-sm text-[#655D67] mb-4">
            Write or paste your choices below. Each choice must be on a separate line.
          </p>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={7}
            style={{ border: '1px solid #e4e4e7', borderRadius: 12, padding: '12px 16px', resize: 'none', background: '#fcfcfd' }}
            className="w-full text-sm text-[#3C323E] placeholder:text-[#c4c1c5]"
            placeholder={`choice 1\nchoice 2\nchoice 3`}
            autoFocus
          />
        </div>
        <div className="flex items-center justify-end gap-3 px-8 py-5 bg-[#f9f8f9] border-t border-[#f0eeef]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm text-[#655D67] hover:text-[#3C323E] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="px-5 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-[#2d2d2d] transition-colors"
          >
            Save choices
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Dropdown preview with its own state ────────────────────────────────────

function DropdownPreview({
  question,
  formId,
  isSelected,
}: {
  question: Question;
  formId: string;
  isSelected: boolean;
}) {
  const [showModal, setShowModal] = useState(false);
  const optCount = (question.options ?? []).length;
  return (
    <div className="space-y-2" onClick={e => e.stopPropagation()}>
      {showModal && (
        <EditChoicesModal
          options={question.options ?? []}
          formId={formId}
          questionId={question.id}
          onClose={() => setShowModal(false)}
        />
      )}
      {/* Typeform-style dropdown trigger */}
      <div className={cn(
        "flex items-center justify-between border-b border-[#e4e4e7] pb-2 pt-1 text-[#c4c1c5] text-sm",
        isSelected && "cursor-pointer hover:border-[#c8c4c9] transition-colors"
      )}>
        <span>Type or select an option</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c4c1c5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      {isSelected && (
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setShowModal(true)}
            className="text-xs text-[#655D67] hover:text-[#3C323E] underline transition-colors"
          >
            Edit choices
          </button>
          <span className="text-xs text-[#847E85]">{optCount} option{optCount !== 1 ? 's' : ''} in list</span>
        </div>
      )}
    </div>
  );
}

// ─── Answer preview (type-specific rendering) ─────────────────────────────────

function QuestionAnswerPreview({
  question,
  formId,
  isSelected,
}: {
  question: Question;
  formId: string;
  isSelected: boolean;
}) {
  const { updateQuestion } = useFormStore();

  switch (question.type) {
    case 'short_text':
      return (
        <div className="border-b border-[#e4e4e7] pb-1 pt-1">
          <span className="text-sm text-[#c4c1c5]">Type your answer here...</span>
        </div>
      );

    case 'long_text':
      return (
        <div className="border border-[#e4e4e7] rounded-lg px-3 py-3 min-h-[80px]">
          <span className="text-sm text-[#c4c1c5]">Type your answer here...</span>
        </div>
      );

    case 'email':
      return (
        <div className="border-b border-[#e4e4e7] pb-1 pt-1">
          <span className="text-sm text-[#c4c1c5]">name@example.com</span>
        </div>
      );

    case 'number':
      return (
        <div className="border-b border-[#e4e4e7] pb-1 pt-1">
          <span className="text-sm text-[#c4c1c5]">0</span>
        </div>
      );

    case 'multiple_choice':
      return (
        <SortableOptionsList
          question={question}
          formId={formId}
          isSelected={isSelected}
        />
      );

    case 'dropdown':
      return (
        <DropdownPreview
          question={question}
          formId={formId}
          isSelected={isSelected}
        />
      );

    case 'yes_no':
      return (
        <div className="flex flex-col gap-2 max-w-[280px]">
          {['Yes', 'No'].map((label) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className="flex items-center gap-3 flex-1 bg-[#f0eeef] border border-transparent hover:border-[#c8c4c9] rounded-lg px-2.5 py-2.5 text-base font-medium text-[#3C323E] cursor-pointer transition-colors"
              >
                <div className="w-6 h-6 flex items-center justify-center bg-white border border-[#c4c1c5] rounded text-xs font-bold text-[#3C323E] shrink-0 shadow-sm">
                  {label === 'Yes' ? 'Y' : 'N'}
                </div>
                {label}
              </div>
            </div>
          ))}
        </div>
      );

    case 'rating': {
      const steps = question.typeSettings.ratingSteps ?? 5;
      const shape = question.typeSettings.ratingShape ?? 'star';
      const shapeMap: Record<string, string> = {
        star: '☆', heart: '♡', user: '👤', crown: '♔', cat: '🐱', dog: '🐶', circle: '○', flag: '⚑'
      };
      const icon = shapeMap[shape] || '☆';

      return (
        <div className="flex gap-4 flex-wrap mt-6">
          {Array.from({ length: steps }, (_, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="text-4xl text-[#655D67] cursor-pointer hover:scale-110 hover:text-[#3C323E] transition-transform"
              >
                {icon}
              </button>
              <span className="text-[13px] text-[#655D67] font-medium">{i + 1}</span>
            </div>
          ))}
        </div>
      );
    }

    default:
      return null;
  }
}

// ─── Sortable Options ─────────────────────────────────────────────────────────

function SortableOptionsList({
  question,
  formId,
  isSelected,
}: {
  question: Question;
  formId: string;
  isSelected: boolean;
}) {
  const options = question.options ?? [];
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = options.findIndex((o) => o.id === active.id);
    const newIndex = options.findIndex((o) => o.id === over.id);
    reorderOptionInQuestion(formId, question.id, oldIndex, newIndex);
  };

  return (
    <div className="space-y-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={options.map((o) => o.id)} strategy={verticalListSortingStrategy}>
          {options.map((opt, idx) => (
            <SortableOptionItem
              key={opt.id}
              opt={opt}
              idx={idx}
              question={question}
              formId={formId}
              isSelected={isSelected}
            />
          ))}
        </SortableContext>
      </DndContext>
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            addOptionToQuestion(formId, question.id);
          }}
          className="flex items-center gap-1.5 text-sm text-[#655D67] hover:text-[#3C323E] transition-colors mt-1"
        >
          <IconPlus size={13} />
          Add choice
        </button>
      )}
    </div>
  );
}

function SortableOptionItem({
  opt,
  idx,
  question,
  formId,
  isSelected,
}: {
  opt: QuestionOption;
  idx: number;
  question: Question;
  formId: string;
  isSelected: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: opt.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 group/opt relative bg-white',
        isDragging && 'opacity-40 z-50 shadow-sm rounded-lg'
      )}
    >
      {isSelected && (question.options?.length ?? 0) > 1 && (
        <div
          {...attributes}
          {...listeners}
          className="absolute -left-6 opacity-0 group-hover/opt:opacity-100 p-1 text-[#c4c1c5] cursor-grab active:cursor-grabbing hover:text-[#847E85] transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <IconDragHandle size={14} />
        </div>
      )}
      <span className="w-6 h-6 rounded-md bg-white border border-[#d4d1d5] shadow-sm flex items-center justify-center text-[11px] font-bold text-[#655D67] shrink-0">
        {String.fromCharCode(65 + idx)}
      </span>
      <input
        type="text"
        value={opt.label}
        onChange={(e) => {
          e.stopPropagation();
          updateOptionLabel(formId, question.id, opt.id, e.target.value);
        }}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()} // Prevent dnd-kit from intercepting clicks in the input
        placeholder={`Option ${idx + 1}`}
        className="flex-1 text-[15px] text-[#3C323E] bg-transparent outline-none placeholder:text-[#c4c1c5] border-b border-transparent focus:border-[#c8c4c9] py-1 transition-colors"
        readOnly={!isSelected}
        tabIndex={isSelected ? 0 : -1}
      />
      {isSelected && (
        <div
          className="flex items-center opacity-0 group-hover/opt:opacity-100 transition-opacity"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button className="p-1 text-[#847E85] hover:text-[#3C323E]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
            </svg>
          </button>
          {(question.options?.length ?? 0) > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeOptionFromQuestion(formId, question.id, opt.id);
              }}
              className="p-1 rounded text-[#847E85] hover:text-red-500 ml-1"
            >
              <IconTrash size={14} strokeWidth={1.5} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Tooltip({ children, text }: { children: React.ReactNode, text: string }) {
  return (
    <div className="relative group flex items-center justify-center">
      {children}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-[#443B45] text-white text-[13px] font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-md">
        {text}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-[5px] border-transparent border-b-[#443B45]" />
      </div>
    </div>
  );
}
