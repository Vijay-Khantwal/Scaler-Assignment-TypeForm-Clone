'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Form, Question, QuestionAnswer } from '@/types';
import { useFormStore } from '@/store/useFormStore';

interface RespondentAppProps {
  form: Form;
  isPreview?: boolean;
  onClose?: () => void;
}

export function RespondentApp({ form, isPreview = false, onClose }: RespondentAppProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [direction, setDirection] = useState(1);
  const { submitForm } = useFormStore();

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

  const isFinished = pages.length > 0 && currentIdx >= pages.length;



  const handleNext = async () => {
    // Validate current page questions
    let newErrors: Record<string, string> = {};
    if (pages[currentIdx]) {
      for (const q of pages[currentIdx]) {
        const value = answers[q.id];
        
        // Required check
        if (q.settings.required) {
          if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
            newErrors[q.id] = "Please fill this in";
            continue; // Stop checking further for this question
          }
        }
        
        // Type-specific validations
        if (value !== undefined && value !== null && value !== '') {
           if ((q.type === 'short_text' || q.type === 'long_text') && q.typeSettings.maxLength) {
             if (String(value).length > q.typeSettings.maxLength) {
               newErrors[q.id] = `Must be at most ${q.typeSettings.maxLength} characters`;
               continue;
             }
           }
           
           if (q.type === 'email') {
             const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
             if (!emailRegex.test(String(value))) {
               newErrors[q.id] = `Hmm... that email doesn't look right`;
               continue;
             }
           }
           
           if (q.type === 'number') {
             const num = Number(value);
             if (isNaN(num)) {
               newErrors[q.id] = `Please enter a valid number`;
               continue;
             }
             if (q.typeSettings.minValue !== undefined && num < q.typeSettings.minValue) {
               newErrors[q.id] = `Minimum value is ${q.typeSettings.minValue}`;
               continue;
             }
             if (q.typeSettings.maxValue !== undefined && num > q.typeSettings.maxValue) {
               newErrors[q.id] = `Maximum value is ${q.typeSettings.maxValue}`;
               continue;
             }
           }
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (currentIdx < pages.length - 1) {
      setDirection(1);
      setCurrentIdx(currentIdx + 1);
    } else if (currentIdx === pages.length - 1) {
      handleSubmit();
    }
  };

  const handleNextRef = useRef(handleNext);
  useEffect(() => {
    handleNextRef.current = handleNext;
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        if (document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          handleNextRef.current();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePrev = () => {
    if (currentIdx > 0) {
      setDirection(-1);
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (errors[questionId]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    }
  };

  const handleSubmit = () => {
    if (!isPreview) {
      const formattedAnswers: QuestionAnswer[] = Object.entries(answers).map(([questionId, value]) => ({
        questionId,
        value,
      }));
      submitForm(form.id, { formId: form.id, answers: formattedAnswers });
    }
    setIsSubmitted(true);
  };

  // ── Thank you / Submitted screen ─────────────────────────────────────────
  if (isSubmitted) {
    return (
      <div className="flex flex-col h-full w-full bg-[#f5f5f5]">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-3xl px-8">
            {/* Checkmark icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-full border-2 border-[#3C323E] flex items-center justify-center">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3C323E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>
            <p className="text-3xl text-[#3C323E] mb-2">Thanks for completing this typeform</p>
            <p className="text-3xl text-[#3C323E] mb-8">
              Now <strong>create your own</strong> — it&apos;s free, easy &amp; beautiful
            </p>
            <button
              onClick={isPreview && onClose ? onClose : () => window.location.href = '/'}
              className="px-6 py-3 bg-[#3C323E] text-white text-[15px] font-bold rounded-md hover:bg-[#2A232B] transition-colors"
            >
              {isPreview ? 'Back to builder' : 'Create a typeform'}
            </button>
          </div>
        </div>
        {/* Bottom bar */}
        <div className="flex items-center justify-end px-6 py-3 bg-[#f0eeef] border-t border-[#e4e4e7] gap-3">
          <span className="text-[13px] text-[#3C323E]">How you ask is everything</span>
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center text-[13px] text-white bg-[#2A232B] px-3 py-1.5 rounded-md hover:bg-[#1a151b] transition-colors tracking-wide"
          >
            Create a <strong className="ml-1">typeform</strong>
          </button>
        </div>
      </div>
    );
  }

  const currentPage = pages[currentIdx];
  const progressPercent = pages.length > 0 ? (currentIdx / pages.length) * 100 : 0;

  return (
    <div className="relative flex flex-col h-full w-full bg-[#f9f8f9] overflow-hidden text-[#3C323E]">
      {/* Top Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#e4e4e7] z-50">
        <div 
          className="h-full bg-[#3C323E] transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="flex flex-col relative w-full max-w-3xl mx-auto pt-8 pb-24 min-h-full">
          <AnimatePresence mode="wait" custom={direction}>
          {currentPage ? (
            <motion.div
              key={currentIdx}
              custom={direction}
              initial={{ y: 40 * direction, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40 * direction, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex-1 flex flex-col justify-center px-12 py-12"
            >
              <div className="space-y-16">
                {currentPage.length >= 2 && currentPage[0]?.settings?.pageTitle && (
                  <div className="mb-4">
                    <h1 className="text-3xl font-medium text-[#3C323E] leading-snug">{currentPage[0].settings.pageTitle}</h1>
                    {currentPage[0].settings.pageDescription && (
                      <p className="text-lg text-[#655D67] mt-3">{currentPage[0].settings.pageDescription}</p>
                    )}
                  </div>
                )}
                {currentPage.map((q, qIndex) => (
                  <div key={q.id}>
                    {/* Question number + arrow + title row */}
                    <div className="flex items-start gap-4 mb-8">
                      <div className="flex items-center gap-1.5 shrink-0 mt-1.5">
                        <span className="text-sm font-semibold bg-[#3C323E] text-white rounded px-1.5 py-0.5 leading-none">{qIndex + 1}</span>
                        <span className="text-[#3C323E] text-sm font-medium">→</span>
                      </div>
                      <div className="flex-1">
                        <h1 className="text-2xl font-normal text-[#3C323E] leading-snug">
                          {q.title || '...'}
                          {q.settings?.required && <span className="ml-1">*</span>}
                        </h1>
                        {q.settings?.description && (
                          <p className="text-lg text-[#655D67] mt-2">{q.settings.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Answer area */}
                    <div className="pl-[56px] w-full">
                      <QuestionInput
                        question={q}
                        value={answers[q.id]}
                        onChange={(v) => handleAnswer(q.id, v)}
                        onNext={() => {
                          if (qIndex === currentPage.length - 1) {
                            handleNext();
                          }
                        }}
                      />
                      {errors[q.id] && (
                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-[#fce8e8] text-[#c23b33] rounded-md text-[13px] font-medium">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                          {errors[q.id]}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* OK button */}
              <div className="mt-12 pl-[56px]">
                <div className="mt-6 flex items-center gap-4">
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 text-lg bg-[#3C323E] text-white font-bold rounded-md hover:bg-[#2A232B] transition-colors cursor-pointer"
                  >
                    {currentIdx === pages.length - 1 ? 'Submit' : 'OK'}
                    {currentIdx !== pages.length - 1 && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-1">
                        <path fill="white" fillRule="evenodd" clipRule="evenodd" d="M6.22 3.22a.75.75 0 0 1 1.06 0l4 4a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06z"/>
                      </svg>
                    )}
                  </button>
                  <span className="text-xs text-[#847E85]">press <kbd className="font-mono bg-white border border-[#e4e4e7] px-1 rounded text-[#3C323E]">Enter</kbd> ↵</span>
                </div>

                <p className="text-xs text-[#847E85] mt-4">
                  Never submit passwords! - <button className="underline hover:text-[#3C323E] transition-colors">Report abuse</button>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="submit"
              custom={direction}
              initial={{ y: 40 * direction, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40 * direction, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex-1 flex flex-col justify-center px-12 text-center items-center"
            >
              <h1 className="text-2xl font-medium text-[#3C323E] mb-6">You&apos;ve answered all the questions</h1>
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-[#2d2d2d] transition-colors"
              >
                Submit
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>

      {/* Bottom-right navigation + powered by badge */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2 z-40">
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className={`w-8 h-8 flex items-center justify-center rounded-md border transition-colors ${
            currentIdx === 0
              ? 'text-[#c4c1c5] border-[#e4e4e7] cursor-not-allowed bg-white'
              : 'text-[#3C323E] border-[#e4e4e7] hover:bg-[#f2f0f3] bg-white'
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m18 15-6-6-6 6"/>
          </svg>
        </button>
        <button
          onClick={handleNext}
          disabled={isFinished}
          className={`w-8 h-8 flex items-center justify-center rounded-md border transition-colors ${
            isFinished
              ? 'text-[#c4c1c5] border-[#e4e4e7] cursor-not-allowed bg-white'
              : 'text-[#3C323E] border-[#e4e4e7] hover:bg-[#f2f0f3] bg-white'
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
        <div className="flex items-center gap-1.5 bg-white border border-[#e4e4e7] px-3 py-1.5 rounded-full text-xs font-medium text-[#3C323E] shadow-sm ml-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
          Powered by&nbsp;<span className="font-bold">Typeform</span>
        </div>
      </div>
    </div>
  );
}

// ── Per-type input components ─────────────────────────────────────────────────

function QuestionInput({
  question,
  value,
  onChange,
  onNext,
}: {
  question: Form['questions'][0];
  value: any;
  onChange: (v: any) => void;
  onNext: () => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-focus text inputs when question changes
    if (inputRef.current) inputRef.current.focus();
  }, [question.id]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  switch (question.type) {
    case 'short_text':
    case 'email':
    case 'number':
      return (
        <input
          ref={inputRef}
          type={question.type === 'email' ? 'email' : question.type === 'number' ? 'number' : 'text'}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.type === 'email' ? 'name@example.com' : 'Type your answer here...'}
          className="w-full text-2xl border-b border-[#3C323E] focus:border-[#3C323E] focus:border-b-2 bg-transparent py-3 outline-none focus:outline-none transition-colors placeholder:text-[#c4c1c5]"
          autoFocus
        />
      );

    case 'long_text':
      return (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full text-2xl border-b border-[#3C323E] focus:border-[#3C323E] focus:border-b-2 bg-transparent py-3 outline-none focus:outline-none transition-colors min-h-[80px] resize-none placeholder:text-[#c4c1c5]"
          autoFocus
        />
      );

    case 'multiple_choice':
      return (
        <div className="flex flex-col gap-2 mt-2">
          {question.options?.map((opt, i) => {
            const isSelected = value === opt.label;
            const letter = String.fromCharCode(65 + i);
            return (
              <button
                key={opt.id}
                onClick={() => {
                  onChange(opt.label);
                  setTimeout(onNext, 400);
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all text-sm ${
                  isSelected
                    ? 'border-[#3C323E] bg-[#3C323E]/5'
                    : 'border-[#e4e4e7] bg-white hover:bg-[#f7f5f8]'
                }`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold border shrink-0 ${
                  isSelected ? 'bg-[#3C323E] border-[#3C323E] text-white' : 'bg-white border-[#c8c4c9] text-[#655D67]'
                }`}>{letter}</div>
                <span className={isSelected ? 'text-[#3C323E] font-medium' : 'text-[#3C323E]'}>{opt.label}</span>
              </button>
            );
          })}
        </div>
      );

    case 'dropdown': {
      const options = question.options ?? [];
      const filtered = options.filter(o => o.label.toLowerCase().includes(dropdownSearch.toLowerCase()));
      return (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between border-b-2 border-[#3C323E]/20 hover:border-[#3C323E]/40 bg-transparent py-2 text-left transition-colors outline-none focus:outline-none"
          >
            <span className={value ? 'text-[#3C323E] text-lg' : 'text-[#c4c1c5] text-lg'}>
              {value || 'Type or select an option'}
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="p-2 border-b border-[#f0eeef]">
                <input
                  type="text"
                  value={dropdownSearch}
                  onChange={(e) => setDropdownSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full text-sm px-2 py-1.5 bg-[#f7f5f8] rounded-lg outline-none focus:outline-none placeholder:text-[#c4c1c5]"
                  autoFocus
                />
              </div>
              <div className="max-h-48 overflow-y-auto py-1">
                {filtered.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-[#847E85] text-center">No options found</div>
                ) : (
                  filtered.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => { onChange(opt.label); setDropdownOpen(false); setDropdownSearch(''); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#f7f5f8] transition-colors ${value === opt.label ? 'text-[#3C323E] font-medium bg-[#f7f5f8]' : 'text-[#655D67]'}`}
                    >
                      {opt.label}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    case 'yes_no':
      return (
        <div className="flex flex-col gap-2 mt-2 max-w-[320px]">
          {['Yes', 'No'].map((label) => {
            const isSelected = value === label;
            return (
              <button
                key={label}
                onClick={() => { onChange(label); setTimeout(onNext, 400); }}
                className={`flex items-center gap-3 w-full border rounded-lg px-2.5 py-2.5 text-lg font-medium transition-all ${
                  isSelected ? 'border-[#3C323E] bg-[#3C323E]/5 text-[#3C323E]' : 'border-transparent bg-[#f0eeef] text-[#3C323E] hover:border-[#c8c4c9]'
                }`}
              >
                <div className={`w-7 h-7 flex items-center justify-center rounded text-sm font-bold shrink-0 transition-colors ${
                  isSelected ? 'bg-[#3C323E] text-white border-transparent' : 'bg-white border border-[#c4c1c5] text-[#3C323E]'
                }`}>
                  {label === 'Yes' ? 'Y' : 'N'}
                </div>
                {label}
              </button>
            );
          })}
        </div>
      );

      case 'rating': {
        const steps = question.typeSettings?.ratingSteps ?? 5;
        const shape = question.typeSettings?.ratingShape ?? 'star';
        const shapeMap: Record<string, string> = {
          star: '☆', heart: '♡', user: '👤', crown: '♔', cat: '🐱', dog: '🐶', circle: '○', flag: '⚑'
        };
        const icon = shapeMap[shape] || '☆';

        return (
          <div className="flex gap-4 flex-wrap mt-8 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            {Array.from({ length: steps }, (_, i) => {
              const isSelected = Number(value) >= i + 1;
              return (
                <div key={i} className="flex flex-col items-center gap-3">
                  <button
                    type="button"
                    onClick={() => { onChange(i + 1); setTimeout(onNext, 400); }}
                    className={`text-4xl transition-transform hover:scale-110 ${
                      isSelected ? "text-[#3C323E]" : "text-[#c4c1c5] hover:text-[#847E85]"
                    }`}
                  >
                    {icon}
                  </button>
                  <span className="text-[13px] text-[#655D67] font-medium">{i + 1}</span>
                </div>
              );
            })}
          </div>
        );
      }

    default:
      return (
        <div className="py-3 text-sm text-[#847E85] italic">
          Input for this question type is not yet implemented.
        </div>
      );
  }
}
