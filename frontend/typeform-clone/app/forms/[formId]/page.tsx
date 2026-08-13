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
      <div className="flex flex-1 min-h-0 overflow-hidden relative bg-white">
        {activeTab === 'content' && (
          <>
            <LeftPanel form={form} />
            <CenterCanvas form={form} />
            <RightSettingsPanel form={form} selectedQuestion={selectedQuestion} />
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
