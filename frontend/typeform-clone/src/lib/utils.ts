// =============================================================================
// TYPEFORM CLONE — UTILITY HELPERS
// =============================================================================

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { QuestionType, QuestionTypeMeta } from '@/types';

// ---------------------------------------------------------------------------
// Tailwind class merger (standard pattern)
// ---------------------------------------------------------------------------

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// ID generation
// ---------------------------------------------------------------------------

/**
 * Generates a short, URL-safe unique ID.
 * Uses crypto.randomUUID() with a prefix for readability.
 * Falls back gracefully in non-secure contexts (shouldn't happen in Next.js).
 */
export function generateId(prefix = 'id'): string {
  const uuid =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 10)
      : Math.random().toString(36).slice(2, 12);
  return `${prefix}_${uuid}`;
}

// ---------------------------------------------------------------------------
// Date formatting
// ---------------------------------------------------------------------------

/**
 * Formats an ISO date string to "MMM D, YYYY" (e.g. "Aug 13, 2026")
 * Matches the "Updated" column format in the dashboard reference.
 */
export function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(isoString));
}

// ---------------------------------------------------------------------------
// Share link generation
// ---------------------------------------------------------------------------

/**
 * Generates the public respondent URL for a published form.
 * Feature 3 will serve this route: /r/[shareId]
 */
export function getShareUrl(shareId: string): string {
  if (typeof window === 'undefined') return `/r/${shareId}`;
  return `${window.location.origin}/r/${shareId}`;
}

// ---------------------------------------------------------------------------
// Letter index (A, B, C...) for question list items
// ---------------------------------------------------------------------------

/** Returns the uppercase letter for a 0-based index (0→A, 1→B, ..., 25→Z, 26→AA...) */
export function getLetterIndex(idx: number): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (idx < 26) return alphabet[idx];
  return alphabet[Math.floor(idx / 26) - 1] + alphabet[idx % 26];
}

// ---------------------------------------------------------------------------
// Question type metadata registry
// ---------------------------------------------------------------------------
// Maps each QuestionType to its display label, icon path, and badge colors.
// Colors are extracted from AddContentUI.png.
// All badge colors marked /* ASSUMED_COLOR */ should be confirmed visually.
// ---------------------------------------------------------------------------

export const QUESTION_TYPE_META: Record<QuestionType, QuestionTypeMeta> = {
  short_text: {
    type: 'short_text',
    label: 'Short Text',
    iconPath: '/icons/icon-short-text.svg',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-600',
    badgeBgHex: '#dbeafe', /* ASSUMED_COLOR — tuned from AddContentUI.png */
  },
  long_text: {
    type: 'long_text',
    label: 'Long Text',
    iconPath: '/icons/icon-long-text.svg',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-600',
    badgeBgHex: '#e0f2fe', /* ASSUMED_COLOR */
  },
  multiple_choice: {
    type: 'multiple_choice',
    label: 'Multiple Choice',
    iconPath: '/icons/icon-multiple-choice.svg',
    badgeBg: 'bg-violet-100',
    badgeText: 'text-violet-600',
    badgeBgHex: '#ede9fe', /* ASSUMED_COLOR */
  },
  dropdown: {
    type: 'dropdown',
    label: 'Dropdown',
    iconPath: '/icons/icon-dropdown-type.svg',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-600',
    badgeBgHex: '#e0e7ff', /* ASSUMED_COLOR */
  },
  email: {
    type: 'email',
    label: 'Email',
    iconPath: '/icons/icon-email.svg',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-500',
    badgeBgHex: '#ffe4e6', /* ASSUMED_COLOR — matches pink email icon in reference */
  },
  number: {
    type: 'number',
    label: 'Number',
    iconPath: '/icons/icon-number.svg',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-600',
    badgeBgHex: '#fef3c7', /* ASSUMED_COLOR — matches gold # icon in reference */
  },
  yes_no: {
    type: 'yes_no',
    label: 'Yes / No',
    iconPath: '/icons/icon-yes-no.svg',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-500',
    badgeBgHex: '#f3e8ff', /* ASSUMED_COLOR — matches purple No-entry icon in reference */
  },
  rating: {
    type: 'rating',
    label: 'Rating',
    iconPath: '/icons/icon-rating.svg',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-600',
    badgeBgHex: '#dcfce7', /* ASSUMED_COLOR */
  },
};

/**
 * Returns the display label for a given question type.
 */
export function getQuestionTypeLabel(type: QuestionType): string {
  return QUESTION_TYPE_META[type].label;
}

// ---------------------------------------------------------------------------
// Thumbnail colors for forms (cycling palette matching dashboard reference)
// ---------------------------------------------------------------------------

const THUMBNAIL_COLORS = [
  '#C68642', // warm brown — matches the form thumbnails in home.png
  '#7C6F8E', // muted violet
  '#3D7EAA', // steel blue
  '#6B9E6E', // muted green
  '#B56576', // dusty rose
  '#9B7950', // tan
];

export function getThumbnailColor(index: number): string {
  return THUMBNAIL_COLORS[index % THUMBNAIL_COLORS.length];
}
