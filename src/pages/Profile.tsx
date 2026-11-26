import { useState } from 'react';
import { ArrowLeftRight, Briefcase, GraduationCap, MapPin, MessageSquare, Pencil, RefreshCw } from 'lucide-react';
import { ME_ID, PEOPLE, getPerson } from '../data/mockData';
import { useApp } from '../store/AppContext';
import { descriptionsDiffer, nextReflectionDate, tierOf } from '../lib/relationships';
import { duration, firstName, formatDate, navigate } from '../lib/utils';
import { Avatar, Button, Card, PersonLink } from '../components/ui';
import { RelationshipBadge, TypePill } from '../components/RelationshipBadge';
import { Spectrum } from '../components/Spectrum';
import { ConnectButton, FollowButton } from '../components/ConnectButton';
import { ReflectModal } from '../components/ReflectModal';
import { useMySpectrum } from '../components/Sidebars';

function RelationshipCard({ personId }: { personId: string }) {
  const app = useApp();
  const [reflecting, setReflecting] = useState<{ edit: boolean } | null>(null);
  const conn = app.connectionOf(personId);
  if (!conn) return null;
  const person = getPerson(personId);
  const name = firstName(person.name);
  const next = nextReflectionDate(conn);

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-xl font-semibold">How you know each other</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => setReflecting({ edit: true })}>
            <Pencil size={14} /> Edit
          </Button>
          <Button size="sm" variant={app.isDue(conn) ? 'primary' : 'secondary'} onClick={() => setReflecting({ edit: false })}>
            <RefreshCw size={14} /> Reflect
          </Button>
        </div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-black/[0.03] p-3">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-black/50">Your description</p>
          <TypePill type={conn.type} />
          <p className="mt-1.5 text-sm italic text-black/70">
            {conn.context ? `“${conn.context}”` : 'Not described yet.'}
          </p>
        </div>
        <div className="rounded-lg bg-black/[0.03] p-3">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-black/50">{name}’s description</p>
          {conn.theirType ? (
            <>
              <TypePill type={conn.theirType} />
              {conn.theirContext && <p className="mt-1.5 text-sm italic text-black/70">“{conn.theirContext}”</p>}
            </>
          ) : (
            <p className="text-sm text-black/60">{name} hasn’t described this relationship.</p>
          )}
        </div>
      </div>
      {descriptionsDiffer(conn) && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-amber-800">
          <ArrowLeftRight size={15} /> You describe this relationship differently. Nuance shows both rather than
          collapsing them into one “connection”.
        </p>
      )}
      <p className="mt-3 text-xs text-black/50">
        Connected {formatDate(conn.since)} ({duration(conn.since)}) · Last reflected {formatDate(conn.lastReviewed)}
        {!app.renewalReminders
          ? ' · Renewal reminders off'
          : next && (app.isDue(conn) ? ' · Reflection due now' : ` · Next reflection ${formatDate(next)}`)}
      </p>
      {reflecting && <ReflectModal personId={personId} startEditing={reflecting.edit} onClose={() => setReflecting(null)} />}
    </Card>
  );
}

export function Profile({ id }: { id: string }) {
  const app = useApp();
  const person = PEOPLE.find((p) => p.id === id);
  const mySpectrum = useMySpectrum();
  if (!person) return <Card className="p-6">Profile not found.</Card>;

  const isMe = person.id === ME_ID;
  const conn = app.connectionOf(person.id);
  // Mock profiles store counts excluding Jordan; Jordan's own side comes from live state,
  // so accepting, removing or downgrading updates every count shown here.
  const spectrum = isMe ? mySpectrum : { ...person.spectrum, unknown: 0 };
  if (!isMe && conn) spectrum[tierOf(conn.theirType ?? conn.type)]++;
  const connectionCount = isMe ? app.connections.length : Object.values(spectrum).reduce((a, b) => a + b, 0);
  const followerCount = isMe
    ? person.followers + app.followers.length
    : person.followers + (app.isFollowing(person.id) ? 1 : 0);
  const others = PEOPLE.filter((p) => p.id !== person.id && p.id !== ME_ID).slice(0, 5);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
      <main className="min-w-0 space-y-2">
        <Card className="overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-slate-300 via-sky-200 to-indigo-200 sm:h-48" />
          <div className="px-6 pb-6">
            <Avatar person={person} size="xl" className="-mt-20 border-4 border-white max-sm:!h-28 max-sm:!w-28" />
            <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_auto]">
              <div>
                <h1 className="flex flex-wrap items-center gap-2 text-2xl font-semibold">
                  {person.name} <RelationshipBadge personId={person.id} />
                </h1>
                <p className="mt-0.5 text-base">{person.headline}</p>
                <p className="mt-1 flex items-center gap-1 text-sm text-black/60">
                  <MapPin size={14} /> {person.location} ·{' '}
                  <span className="font-semibold text-brand">Contact info</span>
                </p>
                <p className="mt-1 text-sm">
                  <span className="text-black/60">{followerCount.toLocaleString()} followers</span>
                  <span className="text-black/60"> · </span>
                  <a href={isMe ? '#/network' : undefined} className="font-semibold text-brand">
                    {!app.redesign && connectionCount >= 500 ? '500+' : connectionCount.toLocaleString()} connections
                  </a>
                </p>
              </div>
              <ul className="space-y-2 text-sm font-semibold max-sm:hidden">
                {person.experience[0] && (
                  <li className="flex items-center gap-2"><Briefcase size={16} className="text-black/60" /> {person.experience[0].org}</li>
                )}
                {person.education[0] && (
                  <li className="flex items-center gap-2"><GraduationCap size={16} className="text-black/60" /> {person.education[0].school}</li>
                )}
              </ul>
            </div>

            {app.redesign && (
              <div className="mt-3 max-w-sm">
                <p className="mb-1 text-xs font-semibold text-black/60">
                  {isMe ? 'Your' : `${firstName(person.name)}’s`} connections by relationship depth
                </p>
                <Spectrum counts={spectrum} compact />
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {isMe ? (
                <>
                  <Button><Pencil size={16} /> Open to</Button>
                  <Button variant="secondary">Add profile section</Button>
                </>
              ) : conn ? (
                <>
                  <Button onClick={() => navigate('/messaging')}><MessageSquare size={16} /> Message</Button>
                  {!app.redesign && (
                    <Button variant="muted" onClick={() => confirm(`Remove ${person.name} from your connections?`) && app.removeConnection(person.id, false)}>
                      Remove connection
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <ConnectButton personId={person.id} />
                  <FollowButton personId={person.id} />
                </>
              )}
            </div>
          </div>
        </Card>

        {app.redesign && !isMe && <RelationshipCard personId={person.id} />}

        <Card className="p-6">
          <h2 className="mb-2 text-xl font-semibold">About</h2>
          <p className="text-sm leading-relaxed">{person.about}</p>
        </Card>

        <Card className="p-6">
          <h2 className="mb-3 text-xl font-semibold">Experience</h2>
          <ul className="space-y-4">
            {person.experience.map((e) => (
              <li key={e.title + e.org} className="flex gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-slate-100 text-slate-500"><Briefcase size={22} /></span>
                <div>
                  <p className="font-semibold">{e.title}</p>
                  <p className="text-sm">{e.org}</p>
                  <p className="text-sm text-black/60">{e.period}</p>
                  {e.description && <p className="mt-1 text-sm">{e.description}</p>}
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="mb-3 text-xl font-semibold">Education</h2>
          <ul className="space-y-4">
            {person.education.map((e) => (
              <li key={e.school + e.degree} className="flex gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-slate-100 text-slate-500"><GraduationCap size={22} /></span>
                <div>
                  <p className="font-semibold">{e.school}</p>
                  <p className="text-sm">{e.degree}</p>
                  <p className="text-sm text-black/60">{e.period}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="mb-3 text-xl font-semibold">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {person.skills.map((s) => (
              <span key={s} className="rounded-full px-3 py-1 text-sm ring-1 ring-black/20">{s}</span>
            ))}
          </div>
        </Card>
      </main>

      <aside className="space-y-2">
        <Card className="p-4">
          <h2 className="mb-3 font-semibold">People also viewed</h2>
          <ul className="space-y-4">
            {others.map((p) => (
              <li key={p.id} className="flex gap-2">
                <Avatar person={p} size="sm" />
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-1.5">
                    <PersonLink id={p.id} className="text-sm font-semibold">{p.name}</PersonLink>
                    <RelationshipBadge personId={p.id} size="xs" />
                  </p>
                  <p className="line-clamp-2 text-xs text-black/60">{p.headline}</p>
                  <div className="mt-2"><ConnectButton personId={p.id} size="sm" /></div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </aside>
    </div>
  );
}
