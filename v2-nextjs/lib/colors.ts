/**
 * Rorschach Scoring Table Colors
 */

export const HEADER_ACCENT = {
  light: {
    basic: '#2A5F7F',
    location: '#2A5F7F',
    dq: '#2A5F7F',
    determinants: '#2A5F7F',
    fq: '#2A5F7F',
    pair: '#2A5F7F',
    contents: '#2A5F7F',
    popular: '#2A5F7F',
    z: '#2A5F7F',
    score: '#2A5F7F',
    gphr: '#2A5F7F',
    special: '#2A5F7F',
  },
} as const;

export const ROW_COLORS = {
  light: {
    header: '#F7F9FB',
    odd: '#FFFFFF',
    even: '#F7F9FB',
  },
} as const;

export const GROUP_COLORS = {
  header: {
    basic: '#C1D2DC',
    location: '#C1D2DC',
    dq: '#C1D2DC',
    determinants: '#C1D2DC',
    fq: '#C1D2DC',
    pair: '#C1D2DC',
    contents: '#C1D2DC',
    popular: '#C1D2DC',
    z: '#C1D2DC',
    score: '#C1D2DC',
    gphr: '#C1D2DC',
    special: '#C1D2DC',
  },
} as const;

export const CATEGORY_BG_CLASSES: Record<string, string> = {
  card: 'bg-[#C1D2DC]/30',
  location: 'bg-[#C1D2DC]/30',
  dq: 'bg-[#C1D2DC]/30',
  determinants: 'bg-[#C1D2DC]/30',
  fq: 'bg-[#C1D2DC]/30',
  pair: 'bg-[#C1D2DC]/30',
  contents: 'bg-[#C1D2DC]/30',
  popular: 'bg-[#C1D2DC]/30',
  z: 'bg-[#C1D2DC]/30',
  score: 'bg-[#C1D2DC]/30',
  gphr: 'bg-[#C1D2DC]/30',
  special: 'bg-[#C1D2DC]/30',
};
