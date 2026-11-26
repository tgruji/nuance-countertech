import { Bookmark, Hourglass, Info } from 'lucide-react';
import { ME_ID, PEOPLE, getPerson } from '../data/mockData';
import { useApp } from '../store/AppContext';
import { tierOf } from '../lib/relationships';
import type { Tier } from '../types';
import { Avatar, Card, PersonLink } from './ui';
import { Spectrum } from './Spectrum';
import { ConnectButton, FollowButton } from './ConnectButton';

export function useMySpectrum(): Record<Tier, number> {
  const { connections } = useApp();
  const counts: Record<Tier, number> = { deep: 0, working: 0, light: 0, unknown: 0 };
  connections.forEach((c) => counts[tierOf(c.type)]++);
  return counts;
}

export function ProfileSidebar() {
  const app = useApp();
  const me = getPerson(ME_ID);
  const spectrum = useMySpectrum();

  return (
    <div className="space-y-2">
      <Card className="overflow-hidden">
        <div className="h-14 bg-gradient-to-r from-sky-200 via-indigo-200 to-emerald-100" />
        <a href={`#/profile/${ME_ID}`} className="block px-4 pb-4">
          <Avatar person={me} size="lg" className="-mt-9 border-2 border-white" />
          <p className="mt-2 text-lg font-semibold hover:underline">{me.name}</p>
          <p className="text-xs text-black/70">{me.headline}</p>
          <p className="mt-1 text-xs text-black/50">{me.location}</p>
        </a>
        <div className="border-t border-black/10 px-4 py-3">
          {app.redesign ? (
            <a href="#/network" className="block">
              <p className="mb-2 text-xs font-semibold text-black/60">Your connections by relationship depth</p>
              <Spectrum counts={spectrum} compact />
            </a>
          ) : (
            <a href="#/network" className="flex justify-between text-xs hover:bg-black/5">
              <span>
                <span className="block font-semibold text-black/60">Connections</span>
                <span className="text-black/90">Grow your network</span>
              </span>
              <span className="font-semibold text-brand">{app.connections.length}</span>
            </a>
          )}
        </div>
        {app.redesign && app.dueConnections.length > 0 && (
          <a href="#/network" className="flex items-center gap-2 border-t border-black/10 px-4 py-3 text-xs font-semibold text-amber-800 hover:bg-amber-50">
            <Hourglass size={14} />
            {app.dueConnections.length} connection{app.dueConnections.length === 1 ? '' : 's'} due for reflection
          </a>
        )}
        <div className="flex items-center gap-2 border-t border-black/10 px-4 py-3 text-xs font-semibold text-black/70">
          <Bookmark size={14} /> Saved items
        </div>
      </Card>
    </div>
  );
}

export function SuggestionsSidebar() {
  const app = useApp();
  const suggestions = PEOPLE.filter(
    (p) => p.id !== ME_ID && !app.connectionOf(p.id) && !app.incomingInvitationFrom(p.id),
  ).slice(0, 4);

  return (
    <div className="space-y-2">
      <Card className="p-4">
        <h2 className="mb-3 font-semibold">People you may know</h2>
        <ul className="space-y-4">
          {suggestions.map((p) => (
            <li key={p.id} className="flex gap-2">
              <Avatar person={p} size="sm" />
              <div className="min-w-0 flex-1">
                <PersonLink id={p.id} className="text-sm font-semibold">
                  {p.name}
                </PersonLink>
                <p className="line-clamp-2 text-xs text-black/60">{p.headline}</p>
                {app.redesign && p.suggestionReason && (
                  <p className="mt-0.5 text-[11px] text-black/50">{p.suggestionReason}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <ConnectButton personId={p.id} size="sm" />
                  {app.redesign && !app.outgoingInvitationTo(p.id) && <FollowButton personId={p.id} size="sm" />}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>
      {app.redesign && (
        <Card className="p-4 text-xs text-black/70">
          <p className="mb-1 flex items-center gap-1.5 font-semibold text-black/90">
            <Info size={14} /> Why does Nuance ask how you know people?
          </p>
          A connection here is a claim that a professional relationship exists. Describing it keeps a ten-minute
          conference chat and a year-long collaboration from looking the same.{' '}
          <a href="#/about" className="font-semibold text-brand hover:underline">
            Learn more
          </a>
        </Card>
      )}
      <footer className="px-4 text-center text-xs text-black/50">
        <a href="#/about" className="hover:text-brand hover:underline">About</a> · Accessibility · Privacy & Terms
        <p className="mt-1">Nuance — a speculative redesign for the R175 Countertechnologies project. All profiles are fictional.</p>
      </footer>
    </div>
  );
}
