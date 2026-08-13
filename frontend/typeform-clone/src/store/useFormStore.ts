// =============================================================================
// TYPEFORM CLONE — ZUSTAND FORM STORE
// =============================================================================
// Client-side state manager for all form data.
// Uses zustand/middleware `persist` so data survives page refreshes
// without any backend. When Feature 4 (backend) is wired up, the persist
// middleware can be removed and actions replaced with API calls.
// =============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Form,
  FormStore,
  Question,
  QuestionType,
  QuestionOption,
  FormSubmission,
} from '@/types';

interface ExtendedFormStore extends FormStore {
  targetParentIdForNewQuestion?: string | null;
  setTargetParentIdForNewQuestion?: (id: string | null) => void;
  addQuestion: (formId: string, type: QuestionType, targetParentId?: string | null) => Question;
}
import { generateId, getThumbnailColor } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Rebuilds the sequential `index` field on every question in a list.
 * Called after add / delete / reorder to keep indices fresh.
 */
function reindex(questions: Question[]): Question[] {
  return questions.map((q, i) => ({ ...q, index: i }));
}

/**
 * Creates a fresh Question with sensible defaults for its type.
 */
function createQuestion(type: QuestionType, index: number): Question {
  const base: Question = {
    id: generateId('q'),
    type,
    title: '',
    index,
    settings: {
      required: false,
      description: '',
    },
    typeSettings: {},
    options: undefined,
  };

  // Type-specific defaults
  switch (type) {
    case 'multiple_choice':
      return {
        ...base,
        title: '',
        typeSettings: {
          allowMultipleSelection: false,
          randomizeOptions: false,
          hasOtherOption: false,
          hasNoneOption: false,
          verticalAlignment: true,
        },
        options: [
          { id: generateId('opt'), label: '' },
          { id: generateId('opt'), label: '' },
        ],
      };

    case 'dropdown':
      return {
        ...base,
        typeSettings: {
          randomizeOptions: false,
        },
        options: [
          { id: generateId('opt'), label: '' },
          { id: generateId('opt'), label: '' },
        ],
      };

    case 'rating':
      return {
        ...base,
        typeSettings: {
          ratingSteps: 5,
        },
      };

    case 'number':
      return {
        ...base,
        typeSettings: {
          minValue: undefined,
          maxValue: undefined,
        },
      };

    default:
      return base;
  }
}

/**
 * Creates a brand-new empty form.
 */
function createEmptyForm(index: number): Form {
  const now = new Date().toISOString();
  return {
    id: generateId('form'),
    title: 'New form',
    status: 'draft',
    questions: [],
    responseCount: 0,
    completedCount: 0,
    createdAt: now,
    updatedAt: now,
    shareId: null,
    thumbnailColor: getThumbnailColor(index),
  };
}

// ---------------------------------------------------------------------------
// Mock Data — 2 pre-seeded forms
// ---------------------------------------------------------------------------
// Form 1: "Customer Feedback Survey" — published, 12 responses, mixed types
// Form 2: "Product Onboarding" — draft, 0 responses
// ---------------------------------------------------------------------------

const MOCK_FORMS: Form[] = [
  {
    id: 'form_mock_001',
    title: 'Customer Feedback Survey',
    status: 'published',
    responseCount: 12,
    completedCount: 10,
    createdAt: '2026-08-01T09:00:00.000Z',
    updatedAt: '2026-08-10T14:30:00.000Z',
    shareId: 'share_cfs_2026',
    thumbnailColor: '#C68642',
    questions: reindex([
      {
        id: 'q_001',
        type: 'short_text',
        title: 'What is your name?',
        index: 0,
        settings: { required: true, description: 'Please enter your full name.' },
        typeSettings: {},
        options: undefined,
      },
      {
        id: 'q_002',
        parentId: 'q_001',
        type: 'email',
        title: 'What is your email address?',
        index: 1,
        settings: { required: true, description: '' },
        typeSettings: {},
        options: undefined,
      },
      {
        id: 'q_003',
        parentId: 'q_001',
        type: 'multiple_choice',
        title: 'Which products have you used?',
        index: 2,
        settings: {
          required: false,
          description: 'Select all that apply.',
        },
        typeSettings: {
          allowMultipleSelection: true,
          randomizeOptions: false,
          hasOtherOption: true,
          hasNoneOption: false,
          verticalAlignment: true,
        },
        options: [
          { id: 'opt_001', label: 'Starter Plan' },
          { id: 'opt_002', label: 'Pro Plan' },
          { id: 'opt_003', label: 'Enterprise' },
        ],
      },
      {
        id: 'q_004',
        parentId: 'q_001',
        type: 'rating',
        title: 'How would you rate your overall experience?',
        index: 3,
        settings: { required: true, description: '1 = Poor, 5 = Excellent' },
        typeSettings: { ratingSteps: 5 },
        options: undefined,
      },
      {
        id: 'q_005',
        parentId: 'q_001',
        type: 'yes_no',
        title: 'Would you recommend us to a friend?',
        index: 4,
        settings: { required: false, description: '' },
        typeSettings: {},
        options: undefined,
      },
      {
        id: 'q_006',
        parentId: 'q_001',
        type: 'long_text',
        title: 'Any additional comments or suggestions?',
        index: 5,
        settings: {
          required: false,
          description: 'We read every response carefully.',
        },
        typeSettings: {},
        options: undefined,
      },
    ]),
  },
  {
    id: 'form_mock_002',
    title: 'Product Onboarding',
    status: 'draft',
    responseCount: 0,
    completedCount: 0,
    createdAt: '2026-08-12T11:00:00.000Z',
    updatedAt: '2026-08-13T08:15:00.000Z',
    shareId: null,
    thumbnailColor: '#7C6F8E',
    questions: reindex([
      {
        id: 'q_101',
        type: 'short_text',
        title: 'What is your role?',
        index: 0,
        settings: { required: true, description: 'e.g. Designer, Engineer, Product Manager' },
        typeSettings: {},
        options: undefined,
      },
      {
        id: 'q_102',
        parentId: 'q_101',
        type: 'dropdown',
        title: 'Which industry do you work in?',
        index: 1,
        settings: { required: true, description: '' },
        typeSettings: { randomizeOptions: false },
        options: [
          { id: 'opt_101', label: 'Technology' },
          { id: 'opt_102', label: 'Finance' },
          { id: 'opt_103', label: 'Healthcare' },
          { id: 'opt_104', label: 'Education' },
          { id: 'opt_105', label: 'Other' },
        ],
      },
      {
        id: 'q_103',
        parentId: 'q_101',
        type: 'number',
        title: 'How many people are on your team?',
        index: 2,
        settings: { required: false, description: '' },
        typeSettings: { minValue: 1, maxValue: 10000 },
        options: undefined,
      },
      {
        id: 'q_104',
        type: 'multiple_choice',
        title: 'What is your primary goal with our product?',
        index: 3,
        settings: { required: true, description: '' },
        typeSettings: {
          allowMultipleSelection: false,
          randomizeOptions: false,
          hasOtherOption: true,
          hasNoneOption: false,
          verticalAlignment: true,
        },
        options: [
          { id: 'opt_111', label: 'Collect customer feedback' },
          { id: 'opt_112', label: 'Run internal surveys' },
          { id: 'opt_113', label: 'Lead generation' },
          { id: 'opt_114', label: 'Research & analytics' },
        ],
      },
    ]),
  },
];

// ---------------------------------------------------------------------------
// API Helpers
// ---------------------------------------------------------------------------

const syncFormWithBackend = async (form: Form) => {
  try {
    await fetch(`/api/forms/${form.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
  } catch (err) {
    console.error('Failed to sync form', err);
  }
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useFormStore = create<ExtendedFormStore>()(
  persist(
    (set, get) => ({
      // -----------------------------------------------------------------------
      // Initial State
      // -----------------------------------------------------------------------
      forms: MOCK_FORMS,
      activeFormId: null,
      selectedQuestionId: null,
      isAddContentModalOpen: false,
      targetParentIdForNewQuestion: null,
      isPreviewMode: false,
      submissions: {},

      // -----------------------------------------------------------------------
      // API Data Loading
      // -----------------------------------------------------------------------
      
      loadForms: async () => {
        try {
          const res = await fetch('/api/forms');
          if (res.ok) {
            const data = await res.json();
            const normalized = data.map((f: any) => ({
              ...f,
              responseCount: f.responseCount ?? f.responsecount ?? 0,
              completedCount: f.completedCount ?? f.completedcount ?? 0,
            }));
            set({ forms: normalized });
          }
        } catch (err) {
          console.error(err);
        }
      },

      loadForm: async (formId: string) => {
        try {
          const res = await fetch(`/api/forms/${formId}`);
          if (res.ok) {
            const data = await res.json();
            const normalized = {
              ...data,
              responseCount: data.responseCount ?? data.responsecount ?? 0,
              completedCount: data.completedCount ?? data.completedcount ?? 0,
            };
            set(state => ({ forms: state.forms.map(f => f.id === formId ? normalized : f) }));
          }
        } catch (err) {
          console.error(err);
        }
      },

      loadSubmissions: async (formId: string) => {
        try {
          const res = await fetch(`/api/forms/${formId}/submissions`);
          if (res.ok) {
            const data = await res.json();
            set(state => ({ submissions: { ...state.submissions, [formId]: data } }));
          }
        } catch (err) {
          console.error(err);
        }
      },

      // -----------------------------------------------------------------------
      // Form-level CRUD
      // -----------------------------------------------------------------------

      createForm: () => {
        const { forms } = get();
        const newForm = createEmptyForm(forms.length);
        set((state) => ({
          forms: [newForm, ...state.forms],
          activeFormId: newForm.id,
          selectedQuestionId: null,
        }));
        
        fetch('/api/forms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newForm)
        }).catch(console.error);
        
        return newForm;
      },

      deleteForm: (formId: string) => {
        set((state) => ({
          forms: state.forms.filter((f) => f.id !== formId),
          activeFormId: state.activeFormId === formId ? null : state.activeFormId,
          selectedQuestionId: state.activeFormId === formId ? null : state.selectedQuestionId,
        }));
        fetch(`/api/forms/${formId}`, { method: 'DELETE' }).catch(console.error);
      },

      duplicateForm: (formId: string) => {
        const { forms } = get();
        const source = forms.find((f) => f.id === formId);
        if (!source) throw new Error(`Form ${formId} not found`);

        const now = new Date().toISOString();
        const duplicate: Form = {
          ...source,
          id: generateId('form'),
          title: `${source.title} (copy)`,
          status: 'draft',
          responseCount: 0,
          completedCount: 0,
          createdAt: now,
          updatedAt: now,
          shareId: null,
          thumbnailColor: getThumbnailColor(forms.length),
          questions: source.questions.map((q) => ({
            ...q,
            id: generateId('q'),
            options: q.options?.map((o) => ({ ...o, id: generateId('opt') })),
          })),
        };

        set((state) => {
          const idx = state.forms.findIndex((f) => f.id === formId);
          const updated = [...state.forms];
          updated.splice(idx + 1, 0, duplicate);
          return { forms: updated };
        });

        // Backend only needs the base creation followed by full sync, but we can just use our PUT
        fetch('/api/forms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(duplicate) })
          .then(() => syncFormWithBackend(duplicate))
          .catch(console.error);

        return duplicate;
      },

      renameForm: (formId: string, newTitle: string) => {
        set((state) => {
          const nextForms = state.forms.map((f) =>
            f.id === formId ? { ...f, title: newTitle.trim() || 'Untitled form', updatedAt: new Date().toISOString() } : f
          );
          const updated = nextForms.find(f => f.id === formId);
          if (updated) syncFormWithBackend(updated);
          return { forms: nextForms };
        });
      },

      publishForm: async (formId: string) => {
        const { forms } = get();
        const formToSync = forms.find((f) => f.id === formId);
        
        set((state) => {
          const nextForms = state.forms.map((f) => {
            if (f.id !== formId) return f;
            const now = new Date().toISOString();
            return {
              ...f,
              status: 'published' as const,
              shareId: f.shareId,
              updatedAt: now,
              publishedAt: now,
            };
          });
          return { forms: nextForms };
        });

        if (formToSync) {
          try {
            await syncFormWithBackend(formToSync);
            const res = await fetch(`/api/forms/${formId}/publish`, { method: 'POST' });
            if (res.ok) {
              const publishedData = await res.json();
              set((state) => ({
                forms: state.forms.map((f) => 
                  f.id === formId ? { 
                    ...f, 
                    shareId: publishedData.shareId,
                    publishedAt: publishedData.publishedAt
                  } : f
                ),
              }));
            }
          } catch (err) {
            console.error('Failed to publish form:', err);
          }
        }
      },

      unpublishForm: (formId: string) => {
        set((state) => {
          const nextForms = state.forms.map((f) =>
            f.id === formId ? { ...f, status: 'draft' as const, updatedAt: new Date().toISOString() } : f
          );
          const updated = nextForms.find(f => f.id === formId);
          if (updated) syncFormWithBackend(updated);
          return { forms: nextForms };
        });
      },

      // -----------------------------------------------------------------------
      // Navigation State
      // -----------------------------------------------------------------------

      setActiveFormId: (formId: string | null) => {
        set({ activeFormId: formId, selectedQuestionId: null });
      },
      setAddContentModalOpen: (open: boolean) => {
        set({ isAddContentModalOpen: open });
        if (!open) set({ targetParentIdForNewQuestion: null });
      },
      setTargetParentIdForNewQuestion: (id: string | null) => {
        set({ targetParentIdForNewQuestion: id });
      },
      setPreviewMode: (open: boolean) => {
        set({ isPreviewMode: open });
      },

      // -----------------------------------------------------------------------
      // Question Management
      // -----------------------------------------------------------------------

      addQuestion: (formId: string, type: QuestionType, targetParentId?: string | null) => {
        const { forms, targetParentIdForNewQuestion } = get() as ExtendedFormStore;
        const form = forms.find((f) => f.id === formId);
        if (!form) throw new Error(`Form ${formId} not found`);

        const newQuestion = createQuestion(type, form.questions.length);
        
        let insertIndex = form.questions.length;
        const effectiveTarget = targetParentId !== undefined ? targetParentId : targetParentIdForNewQuestion;

        if (effectiveTarget !== undefined && effectiveTarget !== null) {
          newQuestion.parentId = effectiveTarget;
          const family = form.questions.filter(q => q.id === effectiveTarget || q.parentId === effectiveTarget);
          if (family.length > 0) {
            const lastFamilyMember = family[family.length - 1];
            insertIndex = form.questions.findIndex(q => q.id === lastFamilyMember.id) + 1;
          }
        } else {
          const lastQ = form.questions[form.questions.length - 1];
          if (lastQ) {
            newQuestion.parentId = lastQ.parentId || lastQ.id;
          } else {
            newQuestion.parentId = null;
          }
        }

        let updatedForm: Form | undefined;
        set((state) => {
          const nextForms = state.forms.map((f) => {
            if (f.id !== formId) return f;
            
            const updatedQuestions = [...f.questions];
            updatedQuestions.splice(insertIndex, 0, newQuestion);

            const uf = {
              ...f,
              questions: reindex(updatedQuestions),
              updatedAt: new Date().toISOString(),
            };
            updatedForm = uf;
            return uf;
          });
          return { forms: nextForms, selectedQuestionId: newQuestion.id, targetParentIdForNewQuestion: null };
        });
        if (updatedForm) syncFormWithBackend(updatedForm);

        return newQuestion;
      },

      deleteQuestion: (formId: string, questionId: string) => {
        let updatedForm: Form | undefined;
        set((state) => {
          const form = state.forms.find((f) => f.id === formId);
          if (!form) return state;

          const remaining = reindex(form.questions.filter((q) => q.id !== questionId && q.parentId !== questionId));

          let newSelectedId = state.selectedQuestionId;
          if (state.selectedQuestionId === questionId || form.questions.find(q => q.id === state.selectedQuestionId)?.parentId === questionId) {
            const deletedIdx = form.questions.findIndex((q) => q.id === questionId);
            newSelectedId = remaining[deletedIdx]?.id ?? remaining[deletedIdx - 1]?.id ?? null;
          }

          const nextForms = state.forms.map((f) => {
            if (f.id !== formId) return f;
            const uf = { ...f, questions: remaining, updatedAt: new Date().toISOString() };
            updatedForm = uf;
            return uf;
          });

          return { forms: nextForms, selectedQuestionId: newSelectedId };
        });
        if (updatedForm) syncFormWithBackend(updatedForm);
      },

      updateQuestion: (
        formId: string,
        questionId: string,
        patch: Partial<Pick<Question, 'title' | 'settings' | 'typeSettings' | 'options' | 'parentId'>>
      ) => {
        let updatedForm: Form | undefined;
        set((state) => {
          const nextForms = state.forms.map((f) => {
            if (f.id !== formId) return f;
            const uf = {
              ...f,
              updatedAt: new Date().toISOString(),
              questions: f.questions.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      ...patch,
                      settings: patch.settings ? { ...q.settings, ...patch.settings } : q.settings,
                      typeSettings: patch.typeSettings ? { ...q.typeSettings, ...patch.typeSettings } : q.typeSettings,
                    }
                  : q
              ),
            };
            updatedForm = uf;
            return uf;
          });
          return { forms: nextForms };
        });
        if (updatedForm) syncFormWithBackend(updatedForm);
      },

      reorderQuestions: (formId: string, orderedIds: string[]) => {
        let updatedForm: Form | undefined;
        set((state) => {
          const nextForms = state.forms.map((f) => {
            if (f.id !== formId) return f;
            const questionMap = new Map(f.questions.map((q) => [q.id, q]));
            const reordered = orderedIds.map((id) => questionMap.get(id)).filter(Boolean) as Question[];
            const uf = { ...f, questions: reindex(reordered), updatedAt: new Date().toISOString() };
            updatedForm = uf;
            return uf;
          });
          return { forms: nextForms };
        });
        if (updatedForm) syncFormWithBackend(updatedForm);
      },

      duplicateQuestion: (formId: string, questionId: string) => {
        const { forms } = get();
        const form = forms.find((f) => f.id === formId);
        if (!form) return;
        const original = form.questions.find((q) => q.id === questionId);
        if (!original) return;
        const originalIdx = form.questions.findIndex((q) => q.id === questionId);

        const isParent = !original.parentId;
        const children = isParent ? form.questions.filter((q) => q.parentId === original.id) : [];

        const duplicateId = crypto.randomUUID().slice(0, 10);
        const duplicate: Question = {
          ...original,
          id: duplicateId,
          options: original.options ? original.options.map((o) => ({ ...o, id: crypto.randomUUID().slice(0, 8) })) : undefined,
        };

        const duplicatedChildren = children.map((c) => ({
          ...c,
          id: crypto.randomUUID().slice(0, 10),
          parentId: duplicateId,
          options: c.options ? c.options.map((o) => ({ ...o, id: crypto.randomUUID().slice(0, 8) })) : undefined,
        }));

        const insertIdx = isParent 
          ? form.questions.findIndex(q => q.id === (children.length > 0 ? children[children.length - 1].id : original.id)) + 1
          : originalIdx + 1;

        const updated = [...form.questions];
        updated.splice(insertIdx, 0, duplicate, ...duplicatedChildren);

        let updatedForm: Form | undefined;
        set((state) => {
          const nextForms = state.forms.map((f) => {
            if (f.id !== formId) return f;
            const uf = { ...f, questions: reindex(updated), updatedAt: new Date().toISOString() };
            updatedForm = uf;
            return uf;
          });
          return { forms: nextForms, selectedQuestionId: duplicate.id };
        });
        if (updatedForm) syncFormWithBackend(updatedForm);
      },

      // -----------------------------------------------------------------------
      // Question Selection (Builder UI state)
      // -----------------------------------------------------------------------

      setSelectedQuestionId: (questionId: string | null) => {
        set({ selectedQuestionId: questionId });
      },

      // -----------------------------------------------------------------------
      // Submissions
      // -----------------------------------------------------------------------

      submitForm: async (formId, submissionData) => {
        const { forms } = get();
        const form = forms.find(f => f.id === formId);
        if (!form || !form.shareId) return;

        try {
          const res = await fetch(`/api/public/forms/${form.shareId}/submissions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submissionData)
          });
          if (!res.ok) throw new Error('Submission failed');
          
          // Optimistically update local form analytics so the dashboard reflects the new submission immediately
          set(state => ({
            forms: state.forms.map(f => 
              f.id === formId 
                ? { ...f, responseCount: (f.responseCount || 0) + 1, completedCount: (f.completedCount || 0) + 1 }
                : f
            )
          }));
        } catch (err) {
          console.error(err);
        }
      },
    }),

    // -------------------------------------------------------------------------
    // Persistence configuration
    // -------------------------------------------------------------------------
    {
      name: 'typeform-clone-store',
      storage: createJSONStorage(() => localStorage),
      // Persist only the form data and submissions, not transient UI state
      partialize: (state) => ({
        forms: state.forms,
        submissions: state.submissions,
      }),
      // If mock data changes in a new code deploy, the version bump
      // will clear old persisted data. Increment when MOCK_FORMS changes.
      version: 2,
    }
  )
);

// ---------------------------------------------------------------------------
// Selector hooks (convenience — avoids inline selector boilerplate in components)
// ---------------------------------------------------------------------------

/** Returns the currently active form object, or null */
export const useActiveForm = () =>
  useFormStore((s) =>
    s.activeFormId ? s.forms.find((f) => f.id === s.activeFormId) ?? null : null
  );

/** Returns the currently selected question in the builder, or null */
export const useSelectedQuestion = () =>
  useFormStore((s) => {
    const form = s.activeFormId
      ? s.forms.find((f) => f.id === s.activeFormId)
      : null;
    if (!form || !s.selectedQuestionId) return null;
    return form.questions.find((q) => q.id === s.selectedQuestionId) ?? null;
  });

/** Returns all forms for the dashboard */
export const useForms = () => useFormStore((s) => s.forms);

/** Returns a specific form by ID */
export const useForm = (formId: string) =>
  useFormStore((s) => s.forms.find((f) => f.id === formId) ?? null);

/** Convenience: add a QuestionOption to a multiple_choice / dropdown question */
export function addOptionToQuestion(
  formId: string,
  questionId: string,
  label = ''
): QuestionOption {
  const store = useFormStore.getState();
  const form = store.forms.find((f) => f.id === formId);
  const question = form?.questions.find((q) => q.id === questionId);
  if (!question) throw new Error('Question not found');

  const newOpt: QuestionOption = { id: generateId('opt'), label };
  store.updateQuestion(formId, questionId, {
    options: [...(question.options ?? []), newOpt],
  });
  return newOpt;
}

/** Convenience: remove a QuestionOption by id */
export function removeOptionFromQuestion(
  formId: string,
  questionId: string,
  optionId: string
): void {
  const store = useFormStore.getState();
  const form = store.forms.find((f) => f.id === formId);
  const question = form?.questions.find((q) => q.id === questionId);
  if (!question) return;

  store.updateQuestion(formId, questionId, {
    options: (question.options ?? []).filter((o) => o.id !== optionId),
  });
}

/** Convenience: update the label of a specific option */
export function updateOptionLabel(
  formId: string,
  questionId: string,
  optionId: string,
  label: string
): void {
  const store = useFormStore.getState();
  const form = store.forms.find((f) => f.id === formId);
  const question = form?.questions.find((q) => q.id === questionId);
  if (!question) return;

  store.updateQuestion(formId, questionId, {
    options: (question.options ?? []).map((o) =>
      o.id === optionId ? { ...o, label } : o
    ),
  });
}

/** Convenience: reorder options */
export function reorderOptionInQuestion(
  formId: string,
  questionId: string,
  oldIndex: number,
  newIndex: number
): void {
  const store = useFormStore.getState();
  const form = store.forms.find((f) => f.id === formId);
  const question = form?.questions.find((q) => q.id === questionId);
  if (!question || !question.options) return;

  const newOptions = [...question.options];
  const [moved] = newOptions.splice(oldIndex, 1);
  newOptions.splice(newIndex, 0, moved);

  store.updateQuestion(formId, questionId, { options: newOptions });
}
