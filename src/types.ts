// The core of the countertechnology: a connection is not one undifferentiated
// thing, but a described relationship of a particular type.
export type RelationshipType =
  | 'collaborator'
  | 'mentor'
  | 'mentee'
  | 'colleague'
  | 'classmate'
  | 'met-briefly'
  | 'online-only'
  | 'unspecified'; // created in "standard" mode, or before the redesign

/** Depth tiers group relationship types and set how often they are revisited. */
export type Tier = 'deep' | 'working' | 'light' | 'unknown';

/** 'redesign' = Nuance's countertechnology; 'standard' = conventional one-click connections. */
export type Mode = 'redesign' | 'standard';

export interface Experience {
  title: string;
  org: string;
  period: string;
  description?: string;
}

export interface Education {
  school: string;
  degree: string;
  period: string;
}

export interface Person {
  id: string;
  name: string;
  headline: string;
  location: string;
  avatarColor: string; // Tailwind bg class
  about: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  /** Followers outside the mock network (excluding the viewer, who is counted from follow state). */
  followers: number;
  /** Their connections by depth, excluding the viewer (who is counted from connection state). */
  spectrum: { deep: number; working: number; light: number };
  suggestionReason?: string;
}

export interface Connection {
  personId: string;
  /** How *I* describe the relationship. */
  type: RelationshipType;
  context: string;
  /** How *they* describe it (expressed from my point of view). null = not described. */
  theirType: RelationshipType | null;
  theirContext?: string;
  since: string; // ISO date
  lastReviewed: string; // ISO date
}

export interface Invitation {
  id: string;
  personId: string;
  direction: 'incoming' | 'outgoing';
  type: RelationshipType; // the sender's description, from the recipient's point of view
  context: string;
  note?: string;
  sentAt: string;
}

/**
 * Reflection buffer: someone you've met but haven't yet decided to connect with.
 * Nothing is sent until the encounter is confirmed.
 */
export interface MetEntry {
  personId: string;
  metAt: string;
  expiresAt: string; // end of the reflection period
  leftPending?: boolean; // user explicitly chose to keep thinking
}

export interface Post {
  id: string;
  authorId: string;
  createdAt: string;
  content: string;
  likes: number;
  comments: number;
  reposts: number;
}

export interface Message {
  from: 'me' | 'them';
  text: string;
  at: string;
}

export interface Conversation {
  personId: string;
  messages: Message[];
}
