// =============================================================================
// TYPEFORM CLONE — CORE TYPE DEFINITIONS
// =============================================================================
// These types are the single source of truth for the entire app.
// Features 3 (Respondent Flow) and 4 (Results) can be added without
// modifying these core interfaces — they extend via new files.
// =============================================================================

// ---------------------------------------------------------------------------
// Question Types
// ---------------------------------------------------------------------------

/**
 * All supported question types in the builder.
 * Matches the question picker shown in AddContentUI.png.
 */
export type QuestionType =
  | 'short_text'
  | 'long_text'
  | 'multiple_choice'
  | 'dropdown'
  | 'email'
  | 'number'
  | 'yes_no'
  | 'rating';

// ---------------------------------------------------------------------------
// Question Option (for multiple_choice and dropdown)
// ---------------------------------------------------------------------------

export interface QuestionOption {
  id: string;
  label: string;
}

// ---------------------------------------------------------------------------
// Question Settings
// ---------------------------------------------------------------------------

/**
 * Universal per-question settings present on every question type.
 * Type-specific extra settings are handled in QuestionTypeSettings.
 */
export interface QuestionSettings {
  /** Whether the question must be answered before proceeding */
  required: boolean;
  /** Optional help text / description shown below the question title */
  description: string;
  /** Optional dedicated page title for grouped questions */
  pageTitle?: string;
  /** Optional dedicated page description for grouped questions */
  pageDescription?: string;
}

/**
 * Type-specific settings keyed by question type.
 * Only relevant fields will be populated depending on QuestionType.
 */
export interface QuestionTypeSettings {
  // multiple_choice / dropdown
  allowMultipleSelection?: boolean;
  randomizeOptions?: boolean;
  hasOtherOption?: boolean;
  hasNoneOption?: boolean;
  verticalAlignment?: boolean;

  // text
  maxLength?: number;

  // rating
  ratingSteps?: number; // 1–10, default 5
  ratingShape?: 'star' | 'heart' | 'user' | 'crown' | 'cat' | 'dog' | 'circle' | 'flag';

  // number
  minValue?: number;
  maxValue?: number;
}

// ---------------------------------------------------------------------------
// Question
// ---------------------------------------------------------------------------

export interface Question {
  id: string;

  /** The question type — drives rendering in builder and respondent flow */
  type: QuestionType;

  /** The question label/title shown to the respondent */
  title: string;

  /** Universal settings (required, description) */
  settings: QuestionSettings;

  /** Type-specific settings */
  typeSettings: QuestionTypeSettings;

  /**
   * Answer options — only used when type === 'multiple_choice' | 'dropdown'
   * Undefined for all other question types.
   */
  options?: QuestionOption[];

  /**
   * Sequential letter index (A, B, C...) assigned at render time.
   * Stored here as a convenience so the store owns the ordering.
   * Recalculated whenever questions are reordered.
   */
  index: number;

  /**
   * Optional parent ID. If set, this question is grouped under the parent
   * question (forming a "Page"). If null/undefined, it acts as its own page
   * or a top-level item.
   */
  parentId?: string | null;
}

// ---------------------------------------------------------------------------
// Form Status
// ---------------------------------------------------------------------------

export type FormStatus = 'draft' | 'published';

// ---------------------------------------------------------------------------
// Form
// ---------------------------------------------------------------------------

export interface Form {
  id: string;

  /** Display title — editable via Rename action */
  title: string;

  /** draft or published */
  status: FormStatus;

  /** Ordered list of questions */
  questions: Question[];

  /** Mock response count (will be replaced by real API data in Feature 4) */
  responseCount: number;

  /**
   * Number of completed responses.
   */
  completedCount: number;

  /** ISO timestamp strings */
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;

  /**
   * Unique share token — present when status === 'published'.
   * Used to construct the respondent URL: /r/[shareId]
   * Null when draft.
   */
  shareId: string | null;

  /**
   * Colour / thumbnail represented as a hex or HSL string.
   * Used for the small colored square icon on the dashboard.
   * Matches the brown/orange square in the reference home.png.
   */
  thumbnailColor: string;
}

// ---------------------------------------------------------------------------
// Form Store State
// ---------------------------------------------------------------------------

export interface FormStoreState {
  /** All forms owned by the (currently single, hardcoded) creator */
  forms: Form[];

  /**
   * The form currently open in the builder.
   * Null when on the dashboard.
   */
  activeFormId: string | null;

  /**
   * The question currently selected / highlighted in the builder.
   * Null when no question is selected (e.g. empty form or just opened).
   */
  selectedQuestionId: string | null;

  isAddContentModalOpen: boolean;
  isPreviewMode: boolean;
  
  /**
   * All form submissions indexed by formId.
   */
  submissions: Record<string, FormSubmission[]>;
}

// ---------------------------------------------------------------------------
// Form Store Actions
// ---------------------------------------------------------------------------

export interface FormStoreActions {
  // --- Form-level CRUD ---
  createForm: () => Form;
  deleteForm: (formId: string) => void;
  duplicateForm: (formId: string) => Form;
  renameForm: (formId: string, newTitle: string) => void;
  publishForm: (formId: string) => void;
  unpublishForm: (formId: string) => void;

  // --- Navigation state ---
  setActiveFormId: (formId: string | null) => void;
  setAddContentModalOpen: (open: boolean) => void;
  setPreviewMode: (open: boolean) => void;

  // --- Question management ---
  addQuestion: (formId: string, type: QuestionType) => Question;
  deleteQuestion: (formId: string, questionId: string) => void;
  updateQuestion: (
    formId: string,
    questionId: string,
    patch: Partial<Pick<Question, 'title' | 'settings' | 'typeSettings' | 'options' | 'parentId'>>
  ) => void;
  reorderQuestions: (formId: string, orderedIds: string[]) => void;
  duplicateQuestion: (formId: string, questionId: string) => void;

  // --- Question selection (builder UI state) ---
  setSelectedQuestionId: (questionId: string | null) => void;

  // --- API Sync ---
  loadForms: () => Promise<void>;
  loadForm: (formId: string) => Promise<void>;
  loadSubmissions: (formId: string) => Promise<void>;

  // --- Submissions ---
  submitForm: (formId: string, submission: Omit<FormSubmission, 'id' | 'submittedAt'>) => Promise<void>;
}

// ---------------------------------------------------------------------------
// Full Store Type (State + Actions combined)
// ---------------------------------------------------------------------------

export type FormStore = FormStoreState & FormStoreActions;

// ---------------------------------------------------------------------------
// Respondent Flow Types (stubs — implemented in Feature 3)
// ---------------------------------------------------------------------------

/**
 * A single respondent's answer to one question.
 * Feature 3 will populate and submit these.
 */
export interface QuestionAnswer {
  questionId: string;
  value: string | string[] | number | boolean | null;
}

/**
 * A complete form submission.
 * Feature 4 (Results) will read and display these.
 */
export interface FormSubmission {
  id: string;
  formId: string;
  answers: QuestionAnswer[];
  submittedAt: string;
  /** Duration in seconds from first question view to submit */
  completionTimeSecs?: number;
}

// ---------------------------------------------------------------------------
// UI Helper Types
// ---------------------------------------------------------------------------

/**
 * Metadata for each question type — used to render the Add Content modal
 * and the type badges in the question list sidebar.
 */
export interface QuestionTypeMeta {
  type: QuestionType;
  label: string;
  /** Path to the SVG icon in /public/icons/ */
  iconPath: string;
  /** Tailwind bg color class for the badge container — e.g. "bg-blue-100" */
  badgeBg: string;
  /** Tailwind text color class for the icon — e.g. "text-blue-600" */
  badgeText: string;
  /** Hex color for the badge background (used for inline style fallback) */
  badgeBgHex: string; /* ASSUMED_COLOR — tuned from reference AddContentUI.png */
}
