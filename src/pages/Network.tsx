import { useState } from 'react';
import { ArrowLeftRight, Coffee, Hourglass, MessageSquare, Pencil, RefreshCw, Search, UserMinus, Users } from 'lucide-react';
import type { Connection, Invitation, RelationshipType } from '../types';
import { getPerson } from '../data/mockData';
import { useApp } from '../store/AppContext';
import { RELATIONSHIPS, SELECTABLE_TYPES, TIERS, descriptionsDiffer, tierOf, TIER_ORDER } from '../lib/relationships';
import { duration, firstName, formatDate, navigate, timeAgoShort } from '../lib/utils';
import { Avatar, Button, Card, Modal, PersonLink } from '../components/ui';
import { TypePill } from '../components/RelationshipBadge';
import { Spectrum } from '../components/Spectrum';
import { RelationshipForm } from '../components/RelationshipForm';
import { ReflectModal } from '../components/ReflectModal';
import { useMySpectrum } from '../components/Sidebars';
import { MetList, ReflectionSettings } from '../components/MetList';

type SortKey = 'recent' | 'type' | 'reflected';

function IncomingInvitation({ inv, onRedescribe }: { inv: Invitation; onRedescribe: () => void }) {
  const app = useApp();
  const p = getPerson(inv.personId);
  const name = firstName(p.name);

  return (
    <li className="flex gap-3 border-t border-black/10 px-4 py-3 first:border-t-0">
      <Avatar person={p} size="md" />
      <div className="min-w-0 flex-1">
        <PersonLink id={p.id} className="font-semibold">
          {p.name}
        </PersonLink>
        <p className="text-sm text-black/60">{p.headline}</p>
        <p className="text-xs text-black/50">{timeAgoShort(inv.sentAt)} ago</p>

        {app.redesign && inv.type !== 'unspecified' && (
          <div className="mt-2 rounded-md bg-black/[0.03] p-2.5 text-sm">
            <span className="text-black/70">{name} describes your relationship as </span>
            <TypePill type={inv.type} />
            <p className="mt-1 italic text-black/70">“{inv.context}”</p>
          </div>
        )}
        {inv.note && <p className="mt-2 border-l-2 border-black/20 pl-2 text-sm text-black/70">{inv.note}</p>}

        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={() => app.ignoreInvitation(inv.id)}>
            Ignore
          </Button>
          {app.redesign ? (
            <>
              <Button variant="muted" size="sm" onClick={() => app.followInstead(inv.id)}>
                Follow instead
              </Button>
              <Button variant="secondary" size="sm" onClick={onRedescribe}>
                I’d describe it differently
              </Button>
              <Button size="sm" onClick={() => app.acceptInvitation(inv.id)} disabled={inv.type === 'unspecified'}>
                Agree & accept
              </Button>
            </>
          ) : (
            <Button variant="secondary" size="sm" onClick={() => app.acceptInvitation(inv.id)}>
              Accept
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}

function ConnectionRow({ conn, onReflect, onEdit }: { conn: Connection; onReflect: () => void; onEdit: () => void }) {
  const app = useApp();
  const p = getPerson(conn.personId);
  const due = app.isDue(conn);

  if (!app.redesign) {
    return (
      <li className="flex items-center gap-3 border-t border-black/10 px-4 py-3 first:border-t-0">
        <Avatar person={p} size="md" />
        <div className="min-w-0 flex-1">
          <PersonLink id={p.id} className="font-semibold">{p.name}</PersonLink>
          <p className="truncate text-sm text-black/60">{p.headline}</p>
          <p className="text-xs text-black/50">Connected on {formatDate(conn.since)}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate('/messaging')}>Message</Button>
        <button
          className="rounded-full p-2 text-black/60 hover:bg-black/5"
          title="Remove connection"
          onClick={() => confirm(`Remove ${p.name} from your connections?`) && app.removeConnection(p.id, false)}
        >
          <UserMinus size={18} />
        </button>
      </li>
    );
  }

  return (
    <li className="flex gap-3 border-t border-black/10 px-4 py-3 first:border-t-0">
      <Avatar person={p} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <PersonLink id={p.id} className="font-semibold">{p.name}</PersonLink>
          <TypePill type={conn.type} />
        </div>
        <p className="truncate text-sm text-black/60">{p.headline}</p>
        {conn.context ? (
          <p className="mt-1 text-sm italic text-black/70">“{conn.context}”</p>
        ) : (
          <p className="mt-1 text-sm text-black/50">You haven’t described how you know {firstName(p.name)}.</p>
        )}
        {descriptionsDiffer(conn) && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-amber-800">
            <ArrowLeftRight size={13} /> {firstName(p.name)} describes this as{' '}
            <TypePill type={conn.theirType!} size="xs" />
          </p>
        )}
        <p className="mt-1 text-xs text-black/50">
          Connected {formatDate(conn.since)} · Reflected {duration(conn.lastReviewed) === 'today' ? 'today' : `${duration(conn.lastReviewed)} ago`}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <Button variant={due ? 'primary' : 'secondary'} size="sm" onClick={onReflect}>
          <RefreshCw size={14} /> Reflect
        </Button>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Pencil size={14} /> Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={() => navigate('/messaging')}>
          <MessageSquare size={14} /> Message
        </Button>
      </div>
    </li>
  );
}

export function Network() {
  const app = useApp();
  const spectrum = useMySpectrum();
  const [typeFilter, setTypeFilter] = useState<RelationshipType | 'all'>('all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<SortKey>('recent');
  const [reflecting, setReflecting] = useState<{ id: string; edit: boolean } | null>(null);
  const [redescribing, setRedescribing] = useState<Invitation | null>(null);

  const countOf = (t: RelationshipType) => app.connections.filter((c) => c.type === t).length;

  const shown = app.connections
    .filter((c) => !app.redesign || typeFilter === 'all' || c.type === typeFilter)
    .filter((c) => {
      const p = getPerson(c.personId);
      return (p.name + p.headline + c.context).toLowerCase().includes(q.toLowerCase());
    })
    .sort((a, b) => {
      if (sort === 'type') return TIER_ORDER.indexOf(tierOf(a.type)) - TIER_ORDER.indexOf(tierOf(b.type));
      if (sort === 'reflected') return a.lastReviewed.localeCompare(b.lastReviewed);
      return b.since.localeCompare(a.since);
    });

  const filterButton = (id: RelationshipType | 'all', label: string, count: number, Icon = Users) => (
    <button
      key={id}
      onClick={() => setTypeFilter(id)}
      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-black/5 ${
        typeFilter === id ? 'font-semibold text-black/90' : 'text-black/70'
      }`}
    >
      <Icon size={18} /> <span className="flex-1">{label}</span> <span>{count}</span>
    </button>
  );

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[300px_1fr]">
      <aside>
        <Card className="overflow-hidden">
          <h2 className="px-4 py-3 font-semibold">Manage my network</h2>
          {app.redesign ? (
            <>
              {filterButton('all', 'All relationships', app.connections.length)}
              {[...SELECTABLE_TYPES, 'unspecified' as const].map((t) =>
                filterButton(t, RELATIONSHIPS[t].label, countOf(t), RELATIONSHIPS[t].icon),
              )}
            </>
          ) : (
            filterButton('all', 'Connections', app.connections.length)
          )}
          {app.bufferActive && (
            <button
              onClick={() => document.getElementById('met-list')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              className="flex w-full items-center gap-3 border-t border-black/10 px-4 py-2.5 text-left text-sm text-black/70 hover:bg-black/5"
            >
              <Coffee size={18} /> <span className="flex-1">Met list</span> <span>{app.metList.length}</span>
            </button>
          )}
          <div className="border-t border-black/10 px-4 py-2.5 text-sm text-black/70">
            Following <span className="float-right">{app.following.length}</span>
          </div>
        </Card>
        {app.redesign && (
          <div className="mt-2">
            <ReflectionSettings />
          </div>
        )}
      </aside>

      <main className="min-w-0 space-y-2">
        <Card>
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="font-semibold">Invitations{app.incoming.length ? ` (${app.incoming.length})` : ''}</h2>
          </div>
          {app.incoming.length === 0 ? (
            <p className="border-t border-black/10 px-4 py-4 text-sm text-black/60">No pending invitations.</p>
          ) : (
            <ul className="border-t border-black/10">
              {app.incoming.map((inv) => (
                <IncomingInvitation key={inv.id} inv={inv} onRedescribe={() => setRedescribing(inv)} />
              ))}
            </ul>
          )}
          {app.outgoing.length > 0 && (
            <div className="border-t border-black/10 px-4 py-3">
              <p className="mb-2 text-sm font-semibold text-black/70">Sent</p>
              <ul className="space-y-2">
                {app.outgoing.map((inv) => {
                  const p = getPerson(inv.personId);
                  return (
                    <li key={inv.id} className="flex flex-wrap items-center gap-2 text-sm">
                      <Avatar person={p} size="xs" />
                      <PersonLink id={p.id} className="font-semibold">{p.name}</PersonLink>
                      {app.redesign && inv.type !== 'unspecified' && <TypePill type={inv.type} size="xs" />}
                      <span className="text-xs text-black/50">sent {timeAgoShort(inv.sentAt)} ago</span>
                      <span className="ml-auto flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => app.withdrawInvitation(inv.id)}>Withdraw</Button>
                        <Button variant="muted" size="sm" title="Demo only: pretend they accepted" onClick={() => app.simulateAcceptance(inv.id)}>
                          Simulate acceptance
                        </Button>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </Card>

        {/* Hidden while the buffer is off; entries are kept and reappear when it's turned back on. */}
        {app.bufferActive && <MetList />}

        {app.redesign && app.dueConnections.length > 0 && (
          <Card className="ring-1 ring-amber-300">
            <div className="flex items-start gap-3 px-4 py-3">
              <Hourglass size={20} className="mt-0.5 text-amber-700" />
              <div>
                <h2 className="font-semibold">Due for reflection ({app.dueConnections.length})</h2>
                <p className="text-sm text-black/60">
                  Relationships change. Nuance periodically asks whether a connection still describes something real —
                  brief encounters after {TIERS.light.reviewMonths} months, shared workplaces after {TIERS.working.reviewMonths}, close relationships after {TIERS.deep.reviewMonths}.
                </p>
              </div>
            </div>
            <ul className="border-t border-black/10">
              {app.dueConnections.map((c) => {
                const p = getPerson(c.personId);
                return (
                  <li key={c.personId} className="flex items-center gap-3 border-t border-black/10 px-4 py-2.5 first:border-t-0">
                    <Avatar person={p} size="xs" />
                    <div className="min-w-0 flex-1 text-sm">
                      <span className="font-semibold">{p.name}</span>{' '}
                      <TypePill type={c.type} size="xs" />
                      <p className="truncate text-xs text-black/60">
                        {c.type === 'unspecified'
                          ? `Connected ${duration(c.since)} ago with no description`
                          : `Last reflected on ${duration(c.lastReviewed)} ago · “${c.context}”`}
                      </p>
                    </div>
                    <Button size="sm" onClick={() => setReflecting({ id: c.personId, edit: false })}>Reflect</Button>
                  </li>
                );
              })}
            </ul>
          </Card>
        )}

        <Card>
          <div className="px-4 py-3">
            {app.redesign ? (
              <div className="grid gap-4 sm:grid-cols-[1fr_260px]">
                <div>
                  <h2 className="font-semibold">Your connections by relationship depth</h2>
                  <p className="text-sm text-black/60">
                    Not “{app.connections.length} connections” — {app.connections.length} relationships of different kinds.
                  </p>
                </div>
                <Spectrum counts={spectrum} compact />
              </div>
            ) : (
              <h2 className="font-semibold">{app.connections.length} Connections</h2>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="flex flex-1 items-center gap-2 rounded px-2 ring-1 ring-black/30 focus-within:ring-2 focus-within:ring-brand">
                <Search size={16} className="text-black/50" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or context" className="w-full py-1.5 text-sm outline-none" />
              </div>
              {app.redesign && (
                <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="rounded px-2 py-1.5 text-sm ring-1 ring-black/30">
                  <option value="recent">Recently added</option>
                  <option value="type">Relationship depth</option>
                  <option value="reflected">Least recently reflected</option>
                </select>
              )}
            </div>
            {app.redesign && typeFilter !== 'all' && (
              <p className="mt-2 text-xs text-black/60">
                Showing: {RELATIONSHIPS[typeFilter].label} ·{' '}
                <button className="font-semibold text-brand hover:underline" onClick={() => setTypeFilter('all')}>show all</button>
              </p>
            )}
          </div>
          <ul className="border-t border-black/10">
            {shown.map((c) => (
              <ConnectionRow
                key={c.personId}
                conn={c}
                onReflect={() => setReflecting({ id: c.personId, edit: false })}
                onEdit={() => setReflecting({ id: c.personId, edit: true })}
              />
            ))}
            {shown.length === 0 && <li className="px-4 py-4 text-sm text-black/60">No connections match.</li>}
          </ul>
        </Card>
      </main>

      {reflecting && (
        <ReflectModal personId={reflecting.id} startEditing={reflecting.edit} onClose={() => setReflecting(null)} />
      )}
      {redescribing && (
        <Modal title={`Describe your relationship with ${firstName(getPerson(redescribing.personId).name)}`} onClose={() => setRedescribing(null)} wide>
          <p className="mb-4 text-sm text-black/70">
            {firstName(getPerson(redescribing.personId).name)} described it as <TypePill type={redescribing.type} />. You can
            accept while describing it your own way — both descriptions are kept, and neither overrides the other.
          </p>
          <RelationshipForm
            person={getPerson(redescribing.personId)}
            initial={{ type: redescribing.type, context: '' }}
            submitLabel="Accept with my description"
            onCancel={() => setRedescribing(null)}
            onSubmit={(d) => {
              app.acceptInvitation(redescribing.id, d);
              setRedescribing(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
