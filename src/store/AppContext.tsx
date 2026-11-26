import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Connection, Invitation, MetEntry, Mode, Post, RelationshipType } from '../types';
import {
  ME_ID,
  initialConnections,
  initialFollowers,
  initialFollowing,
  initialMetList,
  initialInvitations,
  initialPosts,
} from '../data/mockData';
import { MET_REFLECTION_DAYS, isReflectionDue } from '../lib/relationships';
import { addDays } from '../lib/utils';

const STORAGE_KEY = 'nuance-demo-v1';
// The prototype was first called "Strata"; data saved under the old key is carried over once.
const LEGACY_STORAGE_KEY = 'strata-demo-v1';

interface AppState {
  mode: Mode;
  connections: Connection[];
  invitations: Invitation[];
  following: string[];
  /** Mock-network people who follow me (connections follow each other). */
  followers: string[];
  posts: Post[];
  liked: string[];
  /** Reflection buffer: people met but not yet invited. */
  metList: MetEntry[];
  /** When on (redesign only), Connect adds to the Met list instead of opening the invitation form. */
  reflectionBuffer: boolean;
  /** When off, connections are never resurfaced for periodic reflection. */
  renewalReminders: boolean;
}

export interface RelationshipDetails {
  type: RelationshipType;
  context: string;
  note?: string;
}

function initialState(): AppState {
  const connections = initialConnections();
  return {
    mode: 'redesign',
    connections,
    invitations: initialInvitations(),
    following: initialFollowing(),
    followers: initialFollowers(connections),
    posts: initialPosts(),
    liked: [],
    metList: initialMetList(),
    reflectionBuffer: true,
    renewalReminders: true,
  };
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
    if (raw) {
      // Fields added in later versions get defaults; everything already saved is kept.
      const saved = JSON.parse(raw);
      const merged: AppState = { ...initialState(), ...saved };
      if (!saved.followers) merged.followers = initialFollowers(merged.connections);
      return merged;
    }
  } catch {
    // ignore corrupt or unavailable storage
  }
  return initialState();
}

function useAppStore() {
  const [state, setState] = useState<AppState>(loadState);
  // Bumped on reset so pages remount and drop their local UI state (filters, searches, drafts).
  const [resetCount, setResetCount] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // storage unavailable; the demo still works in-memory
    }
  }, [state]);

  const update = (fn: (s: AppState) => Partial<AppState>) => setState((s) => ({ ...s, ...fn(s) }));
  const now = () => new Date().toISOString();
  const addFollow = (list: string[], id: string) => (list.includes(id) ? list : [...list, id]);
  const newInvitation = (personId: string, details?: RelationshipDetails): Invitation => ({
    id: `inv-${Date.now()}`,
    personId,
    direction: 'outgoing',
    type: details?.type ?? 'unspecified',
    context: details?.context ?? '',
    note: details?.note,
    sentAt: now(),
  });
  /**
   * Requests sent with one click in standard mode carry no description. When the
   * reflection buffer applies (redesign + buffer on), they are treated as encounters
   * still awaiting reflection: moved to the Met list, with the 7 days counted from the click.
   */
  const absorbUndescribedInvitations = (s: AppState): Partial<AppState> => {
    const undescribed = s.invitations.filter((i) => i.direction === 'outgoing' && i.type === 'unspecified');
    if (undescribed.length === 0) return {};
    const fresh = undescribed.filter((i) => !s.metList.some((m) => m.personId === i.personId));
    return {
      invitations: s.invitations.filter((i) => !undescribed.includes(i)),
      metList: [
        ...s.metList,
        ...fresh.map((i) => ({ personId: i.personId, metAt: i.sentAt, expiresAt: addDays(i.sentAt, MET_REFLECTION_DAYS) })),
      ],
    };
  };
  const updateMet = (personId: string, patch: Partial<MetEntry>) =>
    update((s) => ({ metList: s.metList.map((m) => (m.personId === personId ? { ...m, ...patch } : m)) }));

  const actions = {
    setMode: (mode: Mode) =>
      update((s) => ({
        mode,
        ...(mode === 'redesign' && s.reflectionBuffer ? absorbUndescribedInvitations(s) : {}),
      })),

    sendInvitation: (personId: string, details?: RelationshipDetails) =>
      update((s) => ({ invitations: [...s.invitations, newInvitation(personId, details)] })),

    setReflectionBuffer: (on: boolean) =>
      update((s) => ({
        reflectionBuffer: on,
        ...(on && s.mode === 'redesign' ? absorbUndescribedInvitations(s) : {}),
      })),
    setRenewalReminders: (on: boolean) => update(() => ({ renewalReminders: on })),

    addToMetList: (personId: string) =>
      update((s) =>
        s.metList.some((m) => m.personId === personId)
          ? {}
          : { metList: [...s.metList, { personId, metAt: now(), expiresAt: addDays(now(), MET_REFLECTION_DAYS) }] },
      ),

    /** Confirm an encounter: leaves the Met list and enters the normal invitation workflow. */
    confirmMet: (personId: string, details: RelationshipDetails) =>
      update((s) => ({
        metList: s.metList.filter((m) => m.personId !== personId),
        invitations: [...s.invitations, newInvitation(personId, details)],
      })),

    dismissMet: (personId: string) =>
      update((s) => ({ metList: s.metList.filter((m) => m.personId !== personId) })),

    leaveMetPending: (personId: string) => updateMet(personId, { leftPending: true }),

    restartMet: (personId: string) =>
      updateMet(personId, { metAt: now(), expiresAt: addDays(now(), MET_REFLECTION_DAYS), leftPending: false }),

    /** Demo helper: end the reflection period now instead of waiting seven days. */
    expireMetNow: (personId: string) => updateMet(personId, { expiresAt: now() }),

    withdrawInvitation: (id: string) =>
      update((s) => ({ invitations: s.invitations.filter((i) => i.id !== id) })),

    /** Accept an incoming invitation. Pass details to describe it differently from the sender. */
    acceptInvitation: (id: string, details?: RelationshipDetails) =>
      update((s) => {
        const inv = s.invitations.find((i) => i.id === id);
        if (!inv) return {};
        const standard = s.mode === 'standard' && !details;
        const conn: Connection = {
          personId: inv.personId,
          type: standard ? 'unspecified' : details?.type ?? inv.type,
          context: standard ? '' : details?.context ?? inv.context,
          theirType: inv.type === 'unspecified' ? null : inv.type,
          theirContext: inv.context || undefined,
          since: now(),
          lastReviewed: now(),
        };
        return {
          invitations: s.invitations.filter((i) => i.id !== id),
          connections: [conn, ...s.connections],
          following: addFollow(s.following, inv.personId),
          followers: addFollow(s.followers, inv.personId),
        };
      }),

    ignoreInvitation: (id: string) =>
      update((s) => ({ invitations: s.invitations.filter((i) => i.id !== id) })),

    followInstead: (id: string) =>
      update((s) => {
        const inv = s.invitations.find((i) => i.id === id);
        return {
          invitations: s.invitations.filter((i) => i.id !== id),
          following: inv ? addFollow(s.following, inv.personId) : s.following,
        };
      }),

    /** Demo helper: pretend the recipient accepted (and agreed with) an outgoing invitation. */
    simulateAcceptance: (id: string) =>
      update((s) => {
        const inv = s.invitations.find((i) => i.id === id);
        if (!inv) return {};
        const conn: Connection = {
          personId: inv.personId,
          type: inv.type,
          context: inv.context,
          theirType: inv.type === 'unspecified' ? null : inv.type,
          theirContext: inv.context || undefined,
          since: now(),
          lastReviewed: now(),
        };
        return {
          invitations: s.invitations.filter((i) => i.id !== id),
          connections: [conn, ...s.connections],
          following: addFollow(s.following, inv.personId),
          followers: addFollow(s.followers, inv.personId),
        };
      }),

    redescribeConnection: (personId: string, details: RelationshipDetails) =>
      update((s) => ({
        connections: s.connections.map((c) =>
          c.personId === personId
            ? { ...c, type: details.type, context: details.context, lastReviewed: now() }
            : c,
        ),
      })),

    confirmConnection: (personId: string) =>
      update((s) => ({
        connections: s.connections.map((c) =>
          c.personId === personId ? { ...c, lastReviewed: now() } : c,
        ),
      })),

    /** Remove, or with keepFollowing downgrade to Follow. Either way their connection-follow of me ends. */
    removeConnection: (personId: string, keepFollowing: boolean) =>
      update((s) => ({
        connections: s.connections.filter((c) => c.personId !== personId),
        followers: s.followers.filter((f) => f !== personId),
        following: keepFollowing
          ? addFollow(s.following, personId)
          : s.following.filter((f) => f !== personId),
      })),

    toggleFollow: (personId: string) =>
      update((s) => ({
        following: s.following.includes(personId)
          ? s.following.filter((f) => f !== personId)
          : [...s.following, personId],
      })),

    toggleLike: (postId: string) =>
      update((s) => ({
        liked: s.liked.includes(postId) ? s.liked.filter((p) => p !== postId) : [...s.liked, postId],
      })),

    addPost: (content: string) =>
      update((s) => ({
        posts: [
          { id: `post-${Date.now()}`, authorId: ME_ID, createdAt: now(), content, likes: 0, comments: 0, reposts: 0 },
          ...s.posts,
        ],
      })),

    resetDemo: () => {
      setState(initialState());
      setResetCount((n) => n + 1);
    },
  };

  const helpers = useMemo(
    () => ({
      redesign: state.mode === 'redesign',
      /** Reflection buffer is a redesign feature; standard mode always uses the baseline flow. */
      bufferActive: state.mode === 'redesign' && state.reflectionBuffer,
      isDue: (c: Connection) => state.renewalReminders && isReflectionDue(c),
      metEntryFor: (id: string) => state.metList.find((m) => m.personId === id),
      connectionOf: (id: string) => state.connections.find((c) => c.personId === id),
      incomingInvitationFrom: (id: string) =>
        state.invitations.find((i) => i.personId === id && i.direction === 'incoming'),
      outgoingInvitationTo: (id: string) =>
        state.invitations.find((i) => i.personId === id && i.direction === 'outgoing'),
      isFollowing: (id: string) => state.following.includes(id),
      dueConnections: state.renewalReminders ? state.connections.filter((c) => isReflectionDue(c)) : [],
      incoming: state.invitations.filter((i) => i.direction === 'incoming'),
      outgoing: state.invitations.filter((i) => i.direction === 'outgoing'),
    }),
    [state],
  );

  return { ...state, ...actions, ...helpers, resetCount };
}

type AppStore = ReturnType<typeof useAppStore>;
const AppContext = createContext<AppStore | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const store = useAppStore();
  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
}

export function useApp(): AppStore {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
