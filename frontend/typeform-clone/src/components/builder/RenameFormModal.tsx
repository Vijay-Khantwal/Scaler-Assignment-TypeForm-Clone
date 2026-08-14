import { useState, useEffect, useRef } from 'react';

interface RenameFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTitle: string;
  onSave: (newTitle: string) => void;
}

export function RenameFormModal({ isOpen, onClose, currentTitle, onSave }: RenameFormModalProps) {
  const [title, setTitle] = useState(currentTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(currentTitle);
    if (isOpen) {
      // Focus and select all text when modal opens
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
    }
  }, [currentTitle, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-[20px] w-[540px] shadow-2xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-[#847E85] hover:text-[#3C323E] transition-colors p-1 cursor-pointer"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        
        <div className="px-8 pt-8 pb-6">
          <h2 className="text-[24px] text-[#3C323E] font-normal tracking-tight mb-5">Rename this typeform</h2>
          <div className="w-full mb-2">
            <input 
              ref={inputRef}
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSave(title);
                  onClose();
                } else if (e.key === 'Escape') {
                  onClose();
                }
              }}
              className="w-full rounded-[8px] px-4 py-2.5 text-[15px] text-[#3C323E] outline-none transition-all"
              style={{ border: '1px solid #d4d1d5', backgroundColor: '#fcfcfc' }}
            />
          </div>
        </div>

        <div className="px-8 py-5 bg-[#faf9fa] flex items-center justify-end gap-3 rounded-b-[20px] border-t border-[#e4e4e7]">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-[14px] font-semibold text-[#655D67] hover:bg-[#e4e4e7] rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={() => { onSave(title); onClose(); }}
            className="px-5 py-2.5 text-[14px] font-semibold text-white bg-[#3A323D] hover:bg-[#2A232D] rounded-xl transition-colors cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
