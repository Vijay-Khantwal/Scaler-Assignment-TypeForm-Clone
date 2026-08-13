import { useFormStore } from '@/store/useFormStore';
import type { Form } from '@/types';
import { IconEmail, IconSettings, IconFilter, IconDate, IconYesNo, IconShortText, IconNumber, IconMultipleChoice, IconDropdownType } from '@/components/icons';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export function ResultsPanel({ form }: { form: Form }) {
  const { submissions, loadSubmissions } = useFormStore();
  const formSubmissions = submissions[form.id] || [];
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  useEffect(() => {
    loadSubmissions(form.id);
  }, [form.id, loadSubmissions]);

  const handleComingSoon = () => toast('Coming soon', { icon: '🚧' });

  // Helper to format date like "13 Aug 2026 16:49"
  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="flex w-full h-full bg-[#f9f8f9] flex-col overflow-hidden">
      
      {/* Top Sub-nav */}
      <div className="flex items-center gap-6 px-8 border-b border-[#e4e4e7] bg-white pt-2">
        <button onClick={handleComingSoon} className="flex items-center gap-2 pb-3 text-[14px] font-medium text-[#655D67] hover:text-[#3C323E] transition-colors border-b-2 border-transparent">
          Smart Insights <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6BB6AA" strokeWidth="2"><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z"/></svg>
        </button>
        <button onClick={handleComingSoon} className="pb-3 text-[14px] font-medium text-[#655D67] hover:text-[#3C323E] transition-colors border-b-2 border-transparent">
          Insights
        </button>
        <button onClick={handleComingSoon} className="pb-3 text-[14px] font-medium text-[#655D67] hover:text-[#3C323E] transition-colors border-b-2 border-transparent">
          Summary
        </button>
        <button className="pb-3 text-[14px] font-medium text-[#3C323E] border-b-2 border-[#3C323E]">
          Responses [{formSubmissions.length}]
        </button>
      </div>

      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white rounded-lg border border-[#e4e4e7] shadow-sm p-1">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-[#f7f5f8] rounded-md text-[13px] font-medium text-[#3C323E]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="M2 15h10"/><path d="m9 18 3-3-3-3"/></svg>
                Responses
              </button>
              <button onClick={handleComingSoon} className="flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-[#655D67] hover:text-[#3C323E] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Spam [0]
              </button>
            </div>

            <div className="flex items-center bg-white rounded-lg border border-[#e4e4e7] shadow-sm px-3 py-2 w-[240px]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#847E85" strokeWidth="2" className="mr-2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input type="text" placeholder="Search responses" className="bg-transparent border-none outline-none text-[13px] text-[#3C323E] placeholder:text-[#847E85] w-full" onClick={handleComingSoon} readOnly />
            </div>

            <button onClick={handleComingSoon} className="flex items-center gap-2 bg-white rounded-lg border border-[#e4e4e7] shadow-sm px-3 py-2 text-[13px] font-medium text-[#655D67] hover:text-[#3C323E] transition-colors">
              <IconDate size={14} />
              All time
            </button>

            <button onClick={handleComingSoon} className="flex items-center gap-2 bg-white rounded-lg border border-[#e4e4e7] shadow-sm px-3 py-2 text-[13px] font-medium text-[#655D67] hover:text-[#3C323E] transition-colors">
              <IconFilter size={14} />
              Filters
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleComingSoon} className="p-2 text-[#655D67] hover:text-[#3C323E] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </button>
            <button onClick={handleComingSoon} className="p-2 text-[#655D67] hover:text-[#3C323E] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="M2 15h10"/><path d="m9 18 3-3-3-3"/></svg>
            </button>
            <button onClick={handleComingSoon} className="px-4 py-2 bg-white rounded-lg border border-[#e4e4e7] shadow-sm text-[13px] font-medium text-[#3C323E] hover:bg-[#f7f5f8] transition-colors">
              Generate test response
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-[#e4e4e7] overflow-hidden flex flex-col">
          <div className="overflow-auto flex-1 relative">
            <table className="w-full text-left border-collapse min-w-max text-[13px]">
              <thead className="sticky top-0 bg-white shadow-sm z-10">
                <tr className="border-b border-[#e4e4e7]">
                  <th className="py-3 px-4 w-12 text-center border-r border-[#e4e4e7]">
                    <input type="checkbox" className="rounded-sm border-[#c4c1c5] text-[#196042] focus:ring-[#196042] w-4 h-4" onClick={handleComingSoon} />
                  </th>
                  <th className="py-3 px-4 font-semibold text-[#655D67] border-r border-[#e4e4e7] min-w-[200px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-[#FCE8F3] text-[#D84C8F] flex items-center justify-center">
                          <IconEmail size={12} />
                        </div>
                        Email
                      </div>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </th>
                  <th className="py-3 px-4 font-medium text-[#655D67] border-r border-[#e4e4e7] min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#f4f2f4] flex items-center justify-center text-[#847E85]">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      </div>
                      <div className="leading-tight">Response<br/>time</div>
                    </div>
                  </th>
                  <th className="py-3 px-4 font-medium text-[#655D67] border-r border-[#e4e4e7] min-w-[140px]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#f4f2f4] flex items-center justify-center text-[#847E85]">
                        <IconFilter size={12} />
                      </div>
                      Response type
                    </div>
                  </th>
                  {form.questions.filter(q => q.type !== 'email').map((q) => (
                    <th key={q.id} className="py-3 px-4 font-medium text-[#655D67] border-r border-[#e4e4e7] min-w-[150px] max-w-[200px] truncate">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#f4f2f4] flex items-center justify-center text-[#847E85]">
                          {q.type === 'short_text' || q.type === 'long_text' ? <IconShortText size={12} /> :
                           q.type === 'number' || q.type === 'rating' ? <IconNumber size={12} /> :
                           q.type === 'yes_no' ? <IconYesNo size={12} /> :
                           q.type === 'dropdown' ? <IconDropdownType size={12} /> :
                           <IconMultipleChoice size={12} />}
                        </div>
                        <span className="truncate" title={q.title}>{q.title || 'Untitled'}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {formSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={100} className="py-12 text-center text-[#847E85]">
                      No responses yet. Share your form to start collecting data!
                    </td>
                  </tr>
                ) : (
                  formSubmissions.map((sub) => {
                    const emailAns = sub.answers.find(a => {
                      const q = form.questions.find(fq => fq.id === a.questionId);
                      return q?.type === 'email';
                    });
                    const emailVal = emailAns && emailAns.value ? String(emailAns.value) : 'Anonymous';

                    return (
                      <tr key={sub.id} className="border-b border-[#e4e4e7] hover:bg-[#f7f5f8] transition-colors group">
                        <td className="py-3 px-4 text-center border-r border-[#e4e4e7]">
                          <input type="checkbox" className="rounded-sm border-[#c4c1c5] text-[#196042] focus:ring-[#196042] w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleComingSoon} />
                        </td>
                        <td className="py-3 px-4 text-[#3C323E] font-medium border-r border-[#e4e4e7] truncate uppercase tracking-tight relative group/cell">
                          <div className="flex items-center justify-between">
                            <span className="truncate">{emailVal}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedSubmission(sub); }}
                              className="absolute right-2 opacity-0 group-hover/cell:opacity-100 p-1.5 bg-[#387567] text-white rounded shadow-md transition-all hover:bg-[#3C323E]"
                              title="View response"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 3 21 3 21 9"/><line x1="9" y1="21" x2="21" y2="3"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="3" y2="21"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[#655D67] border-r border-[#e4e4e7] whitespace-nowrap">
                          {formatDate(sub.submittedAt)}
                        </td>
                        <td className="py-3 px-4 border-r border-[#e4e4e7]">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-[#6BB6AA] text-[#196042] text-[12px] font-medium bg-[#E5F3F1]/50">
                            Completed
                          </span>
                        </td>
                        {form.questions.filter(q => q.type !== 'email').map((q) => {
                          const ansObj = sub.answers.find(a => a.questionId === q.id);
                          const val = ansObj ? ansObj.value : undefined;
                          let displayVal = val !== undefined && val !== null && val !== '' ? String(val) : '-';
                          if (Array.isArray(val)) {
                            displayVal = val.join(', ');
                          }
                          const isPill = q.type === 'multiple_choice' || q.type === 'dropdown' || q.type === 'yes_no';

                          return (
                            <td key={q.id} className="py-3 px-4 text-[#3C323E] border-r border-[#e4e4e7] truncate">
                              {displayVal !== '-' && isPill ? (
                                <span className="inline-block px-2 py-1 rounded-md border border-[#e4e4e7] bg-white text-[13px] shadow-sm">
                                  {displayVal}
                                </span>
                              ) : (
                                displayVal
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setSelectedSubmission(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[85vh] flex flex-col m-4" 
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#e4e4e7]">
                <div className="flex flex-col">
                  <h2 className="text-lg font-medium text-[#3C323E]">Response Details</h2>
                  <p className="text-sm text-[#655D67]">Submitted on {formatDate(selectedSubmission.submittedAt)}</p>
                </div>
                <button onClick={() => setSelectedSubmission(null)} className="text-[#847E85] hover:text-[#3C323E] p-2 bg-[#f4f2f4] rounded-full transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex flex-col gap-6 bg-[#f9f8f9]">
                {form.questions.map((q) => {
                   const ans = selectedSubmission.answers.find((a: any) => a.questionId === q.id);
                   let val = ans ? ans.value : '-';
                   if (Array.isArray(val)) val = val.join(', ');
                   
                   const isBlank = val === undefined || val === null || val === '';
                   const displayVal = !isBlank ? String(val) : '-';

                   return (
                     <div key={q.id} className="bg-white p-4 rounded-lg border border-[#e4e4e7] shadow-sm">
                       <p className="text-[14px] font-medium text-[#655D67] mb-2">{q.title || 'Untitled question'}</p>
                       <div className="text-[15px] text-[#3C323E] whitespace-pre-wrap">{displayVal}</div>
                     </div>
                   )
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
