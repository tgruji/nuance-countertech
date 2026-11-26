import { useState } from 'react';
import { Coffee, RotateCcw } from 'lucide-react';
import type { MetEntry } from '../types';
import { getPerson } from '../data/mockData';
import { useApp } from '../store/AppContext';
import { MET_REFLECTION_DAYS } from '../lib/relationships';
import { daysUntil, formatDate, timeAgoShort } from '../lib/utils';
import { Avatar, Button, Card, PersonLink } from './ui';
import { ConnectModal } from './ConnectButton';

const isLapsed = (m: MetEntry) => new Date(m.expiresAt).getTime() <= Date.now();

/**
 * The reflection buffer. Clicking Connect (with the buffer on) puts someone here
 * instead of sending an invitation. Each encounter has a seven-day reflection
 * period in which it can be confirmed (→ normal invitation step), dismissed, or
 * left pending. If left until the period ends it lapses — nothing is ever sent
 * automatically.
 */
export function MetList() {
  const app = useApp();
  const [confirming, setConfirming] = useState<string | null>(null);
  const pending = app.metList.filter((m) => !isLapsed(m));
  const lapsed = app.metList.filter(isLapsed);

  return (
    <Card>
      <div id="met-list" className="flex items-start gap-3 px-4 py-3">
        <Coffee size={20} className="mt-0.5 text-amber-700" />
        <div className="flex-1">
          <h2 className="font-semibold">Met list{pending.length ? ` (${pending.length})` : ''}</h2>
          <p className="text-sm text-black/60">
            People you’ve met but haven’t yet invited. Nothing is sent until you confirm. Each encounter has a{' '}
            {MET_REFLECTION_DAYS}-day reflection period.
          </p>
          {!app.reflectionBuffer && (
            <p className="mt-1 text-xs text-black/50">
              The reflection buffer is off, so Connect goes straight to the invitation step. Turn it on under
              “Reflection settings”.
            </p>
          )}
        </div>
      </div>

      <ul className="border-t border-black/10">
        {pending.length === 0 && (
          <li className="px-4 py-3 text-sm text-black/60">No encounters waiting for reflection.</li>
        )}
        {pending.map((m) => {
          const p = getPerson(m.personId);
          const left = daysUntil(m.expiresAt);
          return (
            <li key={m.personId} className="flex gap-3 border-t border-black/10 px-4 py-3 first:border-t-0">
              <Avatar person={p} size="md" />
              <div className="min-w-0 flex-1">
                <PersonLink id={p.id} className="font-semibold">{p.name}</PersonLink>
                <p className="truncate text-sm text-black/60">{p.headline}</p>
                <p className="text-xs text-black/50">
                  Added {timeAgoShort(m.metAt)} ago · {left} day{left === 1 ? '' : 's'} left to reflect (until{' '}
                  {new Date(m.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })})
                  {m.leftPending && <span className="ml-1 font-semibold text-black/60">· Left pending</span>}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button variant="ghost" size="sm" onClick={() => app.dismissMet(p.id)}>Dismiss</Button>
                  {!m.leftPending && (
                    <Button variant="muted" size="sm" onClick={() => app.leaveMetPending(p.id)}>Leave pending</Button>
                  )}
                  <Button size="sm" onClick={() => setConfirming(p.id)}>Confirm & describe</Button>
                  <button
                    className="ml-auto text-xs text-black/40 hover:text-black/70 hover:underline"
                    title="Demo only: end the reflection period now"
                    onClick={() => app.expireMetNow(p.id)}
                  >
                    Expire now (demo)
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {lapsed.length > 0 && (
        <div className="border-t border-black/10 px-4 py-3">
          <p className="mb-2 text-sm font-semibold text-black/60">Lapsed — no invitation was sent</p>
          <ul className="space-y-2">
            {lapsed.map((m) => {
              const p = getPerson(m.personId);
              return (
                <li key={m.personId} className="flex flex-wrap items-center gap-2 text-sm opacity-80">
                  <Avatar person={p} size="xs" />
                  <PersonLink id={p.id} className="font-semibold">{p.name}</PersonLink>
                  <span className="text-xs text-black/50">period ended {formatDate(m.expiresAt)}</span>
                  <span className="ml-auto flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => app.dismissMet(p.id)}>Remove</Button>
                    <Button variant="muted" size="sm" onClick={() => app.restartMet(p.id)}>
                      <RotateCcw size={14} /> Restart {MET_REFLECTION_DAYS} days
                    </Button>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {confirming && (
        <ConnectModal
          personId={confirming}
          onSend={(d) => app.confirmMet(confirming, d)}
          onClose={() => setConfirming(null)}
        />
      )}
    </Card>
  );
}

/** Opt-in/opt-out switches for the two reflection mechanisms. */
export function ReflectionSettings() {
  const app = useApp();
  const row = (label: string, desc: string, on: boolean, set: (v: boolean) => void) => (
    <label className="flex cursor-pointer gap-3 px-4 py-2.5 hover:bg-black/5">
      <input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} className="mt-1 accent-emerald-700" />
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-xs text-black/60">{desc}</span>
      </span>
    </label>
  );
  return (
    <Card className="overflow-hidden">
      <h2 className="px-4 py-3 font-semibold">Reflection settings</h2>
      {row(
        'Reflection buffer',
        `Connect adds people to your Met list for ${MET_REFLECTION_DAYS} days before any invitation is sent.`,
        app.reflectionBuffer,
        app.setReflectionBuffer,
      )}
      {row(
        'Renewal reminders',
        'Periodically ask whether connections still describe a real relationship. Reminders never remove or downgrade anything on their own.',
        app.renewalReminders,
        app.setRenewalReminders,
      )}
    </Card>
  );
}
