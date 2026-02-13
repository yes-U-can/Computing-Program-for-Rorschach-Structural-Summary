/**
 * Rorschach Scoring Table Colors
 *
 * Design philosophy: Clean, clinical aesthetic with a soft, professional palette.
 * A smooth, gradient-like transition of colors is used for header accents.
 */

export const HEADER_ACCENT = {
  light: {
    basic:        '#6366f1', // indigo-500
    location:     '#3b82f6', // blue-500
    dq:           '#0ea5e9', // sky-500
    determinants: '#06b6d4', // cyan-500
    fq:           '#14b8a6', // teal-500
    pair:         '#10b981', // emerald-500
    contents:     '#8b5cf6', // violet-500
    popular:      '#a855f7', // purple-500
    z:            '#d946ef', // fuchsia-500
    score:        '#ec4899', // pink-500
    gphr:         '#f43f5e', // rose-500
    special:      '#ef4444', // red-500
  },
} as const;

export const ROW_COLORS = {
  light: {
    header: '#f8fafc',   // slate-50
    odd:    '#ffffff',
    even:   '#f8fafc',   // slate-50
  },
} as const;

export const GROUP_COLORS = {
  header: {
    basic: '#e0e7ff',        // indigo-100
    location: '#dbeafe',        // blue-100
    dq: '#e0f2fe',        // sky-100
    determinants: '#cffafe',        // cyan-100
    fq: '#ccfbf1',        // teal-100
    pair: '#d1fae5',        // emerald-100
    contents: '#ede9fe',        // violet-100
    popular: '#f3e8ff',        // purple-100
    z: '#fae8ff',        // fuchsia-100
    score: '#fce7f3',        // pink-100
    gphr: '#ffe4e6',        // rose-100
    special: '#fee2e2',        // red-100
  },
} as const;

export const CATEGORY_BG_CLASSES: Record<string, string> = {
  card: 'bg-[#e0e7ff]',
  location: 'bg-[#dbeafe]',
  dq: 'bg-[#e0f2fe]',
  determinants: 'bg-[#cffafe]',
  fq: 'bg-[#ccfbf1]',
  pair: 'bg-[#d1fae5]',
  contents: 'bg-[#ede9fe]',
  popular: 'bg-[#f3e8ff]',
  z: 'bg-[#fae8ff]',
  score: 'bg-[#fce7f3]',
  gphr: 'bg-[#ffe4e6]',
  special: 'bg-[#fee2e2]',
};
