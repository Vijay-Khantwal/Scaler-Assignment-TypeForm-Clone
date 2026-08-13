'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useFormStore } from '@/store/useFormStore';
import { RespondentApp } from '@/components/respondent/RespondentApp';

export default function SharePage() {
  const params = useParams();
  const shareId = params?.shareId as string;
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch(`/api/public/forms/${shareId}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setForm(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [shareId]);

  if (!mounted || loading) return null;

  if (error || !form || form.status !== 'published') {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f2f0f3] flex-col gap-4 text-center">
        <h1 className="text-2xl font-light text-[#3C323E]">Form not found</h1>
        <p className="text-[#655D67]">This form may have been deleted or is not currently active.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <RespondentApp form={form} isPreview={false} />
    </div>
  );
}
