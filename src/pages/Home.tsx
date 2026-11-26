import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { TIERS, tierOf } from '../lib/relationships';
import type { Post, Tier } from '../types';
import { ME_ID } from '../data/mockData';
import { Composer, PostCard } from '../components/PostCard';
import { ProfileSidebar, SuggestionsSidebar } from '../components/Sidebars';

type FeedFilter = 'all' | Tier | 'following';

const FILTERS: { id: FeedFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'deep', label: TIERS.deep.short },
  { id: 'working', label: TIERS.working.short },
  { id: 'light', label: TIERS.light.short },
  { id: 'following', label: 'Following only' },
];

export function Home() {
  const app = useApp();
  const [filter, setFilter] = useState<FeedFilter>('all');

  const matches = (p: Post) => {
    if (filter === 'all' || !app.redesign) return true;
    if (p.authorId === ME_ID) return false;
    const conn = app.connectionOf(p.authorId);
    if (filter === 'following') return !conn;
    return !!conn && tierOf(conn.type) === filter;
  };
  const posts = app.posts.filter(matches);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[225px_1fr] lg:grid-cols-[225px_1fr_300px]">
      <aside className="max-md:hidden">
        <ProfileSidebar />
      </aside>
      <main className="min-w-0 space-y-2">
        <Composer />
        {app.redesign && (
          <div className="flex flex-wrap items-center gap-1.5 py-1">
            <span className="mr-1 text-xs text-black/60">Show posts from:</span>
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                  filter === f.id ? 'bg-emerald-700 text-white ring-emerald-700' : 'bg-white text-black/70 ring-black/30 hover:bg-black/5'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
        {posts.length === 0 && <p className="py-8 text-center text-sm text-black/60">No posts from this group yet.</p>}
      </main>
      <aside className="max-lg:hidden">
        <SuggestionsSidebar />
      </aside>
    </div>
  );
}
