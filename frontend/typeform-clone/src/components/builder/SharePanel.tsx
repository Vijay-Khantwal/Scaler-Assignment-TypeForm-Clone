import { useState, useEffect } from 'react';
import type { Form } from '@/types';
import { IconLink, IconEmail, IconAI, IconMic, IconSend, IconHelp, IconSettings, IconForms, IconGrid } from '@/components/icons';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export function SharePanel({ form }: { form: Form }) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = () => {
    const url = `${window.location.origin}/to/${form.shareId || form.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComingSoon = () => {
    toast('Coming soon', { icon: '🚧' });
  };

  const shareUrl = mounted ? `${window.location.origin}/to/${form.shareId || form.id}` : '';

  return (
    <div className="flex w-full h-full bg-white overflow-hidden">
      
      {/* Left Sidebar */}
      <aside className="w-[260px] shrink-0 bg-[#faf9fa] border-r border-[#e4e4e7] flex flex-col h-full relative p-4">
        <div className="flex flex-col gap-1">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#e4e4e7] text-[13px] font-medium text-[#3C323E] transition-colors">
            <IconLink size={16} />
            Share the link
          </button>
          <button onClick={handleComingSoon} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#655D67] hover:bg-[#f0eeef] hover:text-[#3C323E] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            Embed in an email
          </button>
          <button onClick={handleComingSoon} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#655D67] hover:bg-[#f0eeef] hover:text-[#3C323E] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            Embed in a web page
          </button>
          <button onClick={handleComingSoon} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#655D67] hover:bg-[#f0eeef] hover:text-[#3C323E] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Get targeted respondents
          </button>
        </div>

        {/* AI Box */}
        <div className="absolute bottom-4 left-4 right-4 bg-white border border-[#e4e4e7] rounded-xl p-2 flex items-center shadow-sm">
          <button className="text-[#847E85] p-1.5 hover:text-[#3C323E] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
          </button>
          <input type="text" placeholder="Ask Typeform AI" className="flex-1 bg-transparent text-[13px] outline-none px-2 placeholder:text-[#c4c1c5] text-[#3C323E]" readOnly onClick={handleComingSoon} />
          <button className="text-[#847E85] p-1.5 hover:text-[#3C323E] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>
      </aside>

      {/* Center Main Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZTRlNGU3IiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZTRlNGU3IiBmaWxsLW9wYWNpdHk9IjAuNCIvPjwvc3ZnPg==')]">
        
        {/* Top Link Bar */}
        <div className="bg-white px-8 py-6 flex items-center justify-center">
          <div className="flex items-center w-full max-w-4xl bg-white border border-[#e4e4e7] rounded-xl shadow-sm p-1">
            <div className="relative">
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white text-[13px] font-medium rounded-lg hover:bg-[#2d2d2d] transition-colors"
              >
                {copied ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <IconLink size={14} />
                )}
                Copy link
              </button>
              {copied && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[#443B45] text-white text-[13px] font-medium py-1.5 px-3 rounded-lg shadow-xl z-50 pointer-events-none">
                  Copied!
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-[5px] border-transparent border-b-[#443B45]" />
                </div>
              )}
            </div>
            
            <div className="flex-1 px-4 text-[14px] text-[#3C323E] truncate font-mono">
              {shareUrl}
            </div>

            <div className="flex items-center gap-2 pr-2">
              <button onClick={handleComingSoon} className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-[#655D67] hover:text-[#3C323E] hover:bg-[#f7f5f8] rounded-lg transition-colors border border-transparent hover:border-[#e4e4e7]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                Edit
              </button>
              <div className="w-px h-4 bg-[#e4e4e7]" />
              <button onClick={handleComingSoon} className="p-2 text-[#655D67] hover:text-[#3C323E] hover:bg-[#f7f5f8] rounded-lg transition-colors">
                <IconEmail size={16} />
              </button>
              <button onClick={handleComingSoon} className="p-2 text-[#655D67] hover:text-[#3C323E] hover:bg-[#f7f5f8] rounded-lg transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><rect x="7" y="7" width="3" height="3"/><rect x="14" y="7" width="3" height="3"/><rect x="7" y="14" width="3" height="3"/><rect x="14" y="14" width="3" height="3"/></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-md border border-[#e4e4e7] overflow-hidden flex flex-col">
            <div className="h-[280px] bg-[#f7f5f8] flex items-center justify-center">
              {/* Dummy thumbnail area */}
            </div>
            <div className="p-5 flex flex-col gap-1 border-t border-[#e4e4e7]">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center gap-1 opacity-80">
                  <svg viewBox="0 0 100 100" width="16" height="16"><rect x="5" y="15" width="22" height="70" rx="11" fill="#1A1A1A" /><rect x="35" y="15" width="60" height="70" rx="20" fill="#1A1A1A" /></svg>
                  <span className="text-[13px] font-bold text-[#1A1A1A] tracking-tight">Typeform</span>
                </div>
              </div>
              <h3 className="text-[15px] font-semibold text-[#3C323E] truncate">{form.title || 'New form'}</h3>
              <p className="text-[13px] text-[#655D67] truncate">Turn data collection into an experience with Typeform. Create beautiful online forms, surv...</p>
              <p className="text-[12px] text-[#847E85] mt-1">form.typeform.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="w-[280px] shrink-0 bg-[#faf9fa] border-l border-[#e4e4e7] flex flex-col h-full overflow-y-auto p-6 gap-8">
        
        <div className="flex flex-col gap-4">
          <h3 className="text-[13px] font-semibold text-[#3C323E]">Share in:</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={handleComingSoon} className="w-9 h-9 flex items-center justify-center bg-white border border-[#e4e4e7] rounded-lg shadow-sm text-[#3C323E] hover:bg-[#f7f5f8] transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></button>
            <button onClick={handleComingSoon} className="w-9 h-9 flex items-center justify-center bg-white border border-[#e4e4e7] rounded-lg shadow-sm text-[#3C323E] hover:bg-[#f7f5f8] transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></button>
            <button onClick={handleComingSoon} className="w-9 h-9 flex items-center justify-center bg-white border border-[#e4e4e7] rounded-lg shadow-sm text-[#3C323E] hover:bg-[#f7f5f8] transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg></button>
            <button onClick={handleComingSoon} className="w-9 h-9 flex items-center justify-center bg-white border border-[#e4e4e7] rounded-lg shadow-sm text-[#3C323E] hover:bg-[#f7f5f8] transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg></button>
            <button onClick={handleComingSoon} className="w-9 h-9 flex items-center justify-center bg-white border border-[#e4e4e7] rounded-lg shadow-sm text-[#3C323E] hover:bg-[#f7f5f8] transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg></button>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <h3 className="text-[13px] font-semibold text-[#3C323E]">Link preview</h3>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6BB6AA" strokeWidth="2"><path d="M2 12l10-10 10 10-10 10Z"/></svg>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-medium text-[#655D67] flex items-center gap-1">Thumbnail <IconHelp size={12} /></label>
            <button onClick={handleComingSoon} className="self-start px-3 py-1.5 border border-[#e4e4e7] bg-white rounded-lg text-[13px] font-medium text-[#655D67] shadow-sm hover:bg-[#f7f5f8] transition-colors">
              Upload
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-medium text-[#655D67]">Title</label>
            <input type="text" readOnly onClick={handleComingSoon} value={form.title || 'New form'} className="w-full bg-white border border-[#e4e4e7] rounded-lg px-3 py-2 text-[13px] text-[#3C323E] outline-none shadow-sm" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-medium text-[#655D67] flex items-center gap-1">Description <IconHelp size={12} /></label>
            <textarea readOnly onClick={handleComingSoon} className="w-full bg-white border border-[#e4e4e7] rounded-lg px-3 py-2 text-[13px] text-[#3C323E] outline-none shadow-sm min-h-[100px] resize-none" value="Turn data collection into an experience with Typeform. Create beautiful online forms, surveys, quizzes, and so much more. Try it for FREE." />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="text-[12px] font-medium text-[#655D67] flex items-center gap-1">Show in search results <IconHelp size={12} /></label>
            <button onClick={handleComingSoon} className="w-8 h-5 rounded-full bg-[#e4e4e7] relative transition-colors shadow-inner">
              <div className="absolute left-[2px] top-[2px] w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        </div>

      </aside>
    </div>
  );
}
