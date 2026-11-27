import {
  BadgeQuestionMark,
  Briefcase,
  Coffee,
  Compass,
  Globe,
  GraduationCap,
  Handshake,
  Sprout,
  type LucideIcon,
} from 'lucide-react';
import type { Connection, RelationshipType, Tier } from '../types';
import { monthsBetween } from './utils';

export interface RelationshipInfo {
  label: string;
  description: string;
  contextPrompt: string;
  placeholder: string;
  icon: LucideIcon;
  tier: Tier;
}

// Edit this table to change the relationship vocabulary of the whole app.
export const RELATIONSHIPS: Record<RelationshipType, RelationshipInfo> = {
  collaborator: {
    label: 'Collaborator',
    description: 'We have worked closely together on shared projects or outputs.',
    contextPrompt: 'What did you work on together?',
    placeholder: 'e.g. Co-authored the 2025 report on urban mobility data',
    icon: Handshake,
    tier: 'deep',
  },
  mentor: {
    label: 'Mentor',
    description: 'They have guided my professional development.',
    contextPrompt: 'How have they mentored you?',
    placeholder: 'e.g. Supervised my undergraduate dissertation',
    icon: Compass,
    tier: 'deep',
  },
  mentee: {
    label: 'Mentee',
    description: 'I have guided their professional development.',
    contextPrompt: 'How have you mentored them?',
    placeholder: 'e.g. Mentored them during their summer internship',
    icon: Sprout,
    tier: 'deep',
  },
  colleague: {
    label: 'Colleague',
    description: 'We worked at the same organisation, but not necessarily closely.',
    contextPrompt: 'Where did you work together?',
    placeholder: 'e.g. Both at Northwind Analytics in 2023, different teams',
    icon: Briefcase,
    tier: 'working',
  },
  classmate: {
    label: 'Classmate',
    description: 'We studied on the same course or programme.',
    contextPrompt: 'Where did you study together?',
    placeholder: 'e.g. Same MPhil cohort at Cambridge',
    icon: GraduationCap,
    tier: 'working',
  },
  'met-briefly': {
    label: 'Met briefly',
    description: 'We met once or twice, e.g. at an event or conference.',
    contextPrompt: 'Where did you meet?',
    placeholder: 'e.g. Chatted after a panel at the Digital Futures Summit',
    icon: Coffee,
    tier: 'light',
  },
  'online-only': {
    label: 'Online acquaintance',
    description: "We've interacted online but haven't met or worked together.",
    contextPrompt: 'How have you interacted?',
    placeholder: "e.g. We've discussed each other's posts on open data",
    icon: Globe,
    tier: 'light',
  },
  unspecified: {
    label: 'Not described',
    description: 'Connected without describing the relationship.',
    contextPrompt: '',
    placeholder: '',
    icon: BadgeQuestionMark,
    tier: 'unknown',
  },
};

export const SELECTABLE_TYPES: RelationshipType[] = [
  'collaborator',
  'mentor',
  'mentee',
  'colleague',
  'classmate',
  'met-briefly',
  'online-only',
];

export interface TierInfo {
  label: string;
  short: string;
  badge: string; // classes for pills
  bar: string; // classes for spectrum bars
  /** How many months until Nuance asks you to reconsider the connection. */
  reviewMonths: number;
}

export const TIERS: Record<Tier, TierInfo> = {
  deep: {
    label: 'Close working relationships',
    short: 'Close',
    badge: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    bar: 'bg-emerald-600',
    reviewMonths: 18,
  },
  working: {
    label: 'Shared workplace or study',
    short: 'Shared context',
    badge: 'bg-sky-50 text-sky-800 ring-sky-200',
    bar: 'bg-sky-600',
    reviewMonths: 12,
  },
  light: {
    label: 'Brief or online encounters',
    short: 'Brief',
    badge: 'bg-amber-50 text-amber-800 ring-amber-200',
    bar: 'bg-amber-500',
    reviewMonths: 6,
  },
  unknown: {
    label: 'Undescribed',
    short: 'Undescribed',
    badge: 'bg-gray-100 text-gray-700 ring-gray-300',
    bar: 'bg-gray-400',
    reviewMonths: 0,
  },
};

export const TIER_ORDER: Tier[] = ['deep', 'working', 'light', 'unknown'];

/** Renewal interval when faceted connections are off: no depth to vary it by, so one cycle for all. */
export const UNFACETED_REVIEW_MONTHS = 6;

/** Length of the Met list reflection period before an encounter lapses. */
export const MET_REFLECTION_DAYS = 7;

export const tierOf = (t: RelationshipType): Tier => RELATIONSHIPS[t].tier;

/** Re-express a relationship from the other person's point of view. */
export function reciprocal(t: RelationshipType): RelationshipType {
  if (t === 'mentor') return 'mentee';
  if (t === 'mentee') return 'mentor';
  return t;
}

/** With `faceted` false, depth is ignored and every connection is on the same cycle. */
export function isReflectionDue(c: Connection, faceted = true, now = new Date()): boolean {
  if (!faceted) return monthsBetween(c.lastReviewed, now) >= UNFACETED_REVIEW_MONTHS;
  if (c.type === 'unspecified') return true;
  return monthsBetween(c.lastReviewed, now) >= TIERS[tierOf(c.type)].reviewMonths;
}

export function nextReflectionDate(c: Connection): Date | null {
  if (c.type === 'unspecified') return null;
  const d = new Date(c.lastReviewed);
  d.setMonth(d.getMonth() + TIERS[tierOf(c.type)].reviewMonths);
  return d;
}

export function descriptionsDiffer(c: Connection): boolean {
  return c.theirType !== null && c.theirType !== c.type && c.type !== 'unspecified';
}
