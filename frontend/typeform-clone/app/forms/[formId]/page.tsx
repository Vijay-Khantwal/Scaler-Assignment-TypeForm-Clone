'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFormStore, useActiveForm, useSelectedQuestion } from '@/store/useFormStore';
import { BuilderHeader } from '@/components/builder/BuilderHeader';
import { LeftPanel } from '@/components/builder/LeftPanel';
import { CenterCanvas } from '@/components/builder/CenterCanvas';
import { RightSettingsPanel } from '@/components/builder/RightSettingsPanel';
import { SharePanel } from '@/components/builder/SharePanel';
import { ResultsPanel } from '@/components/builder/ResultsPanel';
import { PreviewOverlay } from '@/components/builder/PreviewOverlay';
import { cn } from '@/lib/utils';

export default function BuilderPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params?.formId as string;

  const { setActiveFormId, publishForm, unpublishForm, isPreviewMode, setPreviewMode } = useFormStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  // Avoid Zustand localStorage hydration mismatch on first render
  useEffect(() => {
    setMounted(true);
    useFormStore.getState().loadForm(formId);
    useFormStore.getState().loadSubmissions(formId);
  }, [formId]);

  // Set this form as active whenever the page mounts / formId changes
  useEffect(() => {
    if (mounted && formId) {
      setActiveFormId(formId);
    }
  }, [mounted, formId, setActiveFormId]);

  const form = useActiveForm();
  const selectedQuestion = useSelectedQuestion();

  // Loading state
  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f2f0f3]">
        <div className="w-5 h-5 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Invalid form ID — redirect to dashboard
  if (!form) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f2f0f3] flex-col gap-4">
        <p className="text-[#655D67] text-sm">Form not found.</p>
        <button
          onClick={() => router.push('/')}
          className="text-sm text-[#3C323E] underline hover:no-underline"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  const handlePublish = () => {
    publishForm(form.id);
  };

  const [mobilePanel, setMobilePanel] = useState<'left' | 'right' | null>(null);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top header */}
      <BuilderHeader 
        form={form} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onPublish={handlePublish} 
      />

      {/* Main content area */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative bg-[#f2f0f3] lg:bg-white">
        {activeTab === 'content' && (
          <>
            {/* Desktop & Mobile Slide-over for Left Panel */}
            <div className={cn(
              "absolute inset-y-0 left-0 z-40 transform transition-transform duration-300 lg:relative lg:translate-x-0 bg-white shadow-xl lg:shadow-none",
              mobilePanel === 'left' ? "translate-x-0" : "-translate-x-full lg:flex"
            )}>
              <LeftPanel form={form} />
              {/* Close button for mobile */}
              {mobilePanel === 'left' && (
                <button onClick={() => setMobilePanel(null)} className="absolute top-4 right-4 lg:hidden p-2 bg-gray-100 rounded-full">
                  ✕
                </button>
              )}
            </div>
            
            {/* Overlay for mobile when panel is open */}
            {mobilePanel && (
              <div 
                className="fixed inset-0 bg-black/20 z-30 lg:hidden" 
                onClick={() => setMobilePanel(null)}
              />
            )}

            <CenterCanvas form={form} />

            {/* Desktop & Mobile Slide-over for Right Panel */}
            <div className={cn(
              "absolute inset-y-0 right-0 z-40 transform transition-transform duration-300 lg:relative lg:translate-x-0 bg-white shadow-xl lg:shadow-none",
              mobilePanel === 'right' ? "translate-x-0" : "translate-x-full lg:flex"
            )}>
              <RightSettingsPanel form={form} selectedQuestion={selectedQuestion} />
              {/* Close button for mobile */}
              {mobilePanel === 'right' && (
                <button onClick={() => setMobilePanel(null)} className="absolute top-4 left-4 lg:hidden p-2 bg-gray-100 rounded-full z-50">
                  ✕
                </button>
              )}
            </div>

            {/* Mobile Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#e4e4e7] p-3 flex justify-between z-20">
              <button 
                onClick={() => setMobilePanel('left')}
                className="flex-1 flex justify-center py-2 text-sm font-medium text-[#3C323E] bg-[#f7f5f8] rounded-lg mr-2"
              >
                Questions
              </button>
              <button 
                onClick={() => setMobilePanel('right')}
                className="flex-1 flex justify-center py-2 text-sm font-medium text-[#3C323E] bg-[#f7f5f8] rounded-lg ml-2"
              >
                Settings
              </button>
            </div>
          </>
        )}
        {activeTab === 'share' && (
          <SharePanel form={form} />
        )}
        {activeTab === 'results' && (
          <ResultsPanel form={form} />
        )}
        {/* Placeholders for workflow & connect */}
        {(activeTab === 'workflow' || activeTab === 'connect') && (
          <div className="flex-1 flex items-center justify-center bg-[#f2f0f3]">
            <p className="text-[#655D67] text-sm">This feature is coming soon.</p>
          </div>
        )}

        {/* Preview Overlay — full screen takeover */}
        {isPreviewMode && (
          <PreviewOverlay
            form={form}
            onClose={() => setPreviewMode(false)}
          />
        )}
      </div>
    </div>
  );
}
