import { useState } from 'react';
import { Send } from 'lucide-react';
import type { Conversation } from '../types';
import { CONVERSATIONS, getPerson } from '../data/mockData';
import { timeAgoShort } from '../lib/utils';
import { Avatar, Button, Card, PersonLink } from '../components/ui';
import { RelationshipBadge } from '../components/RelationshipBadge';

export function Messaging() {
  // Messages are kept in component state only; they reset on reload.
  const [threads, setThreads] = useState<Conversation[]>(CONVERSATIONS);
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].personId);
  const [draft, setDraft] = useState('');
  const active = threads.find((t) => t.personId === activeId)!;
  const person = getPerson(active.personId);

  const send = () => {
    if (!draft.trim()) return;
    setThreads((ts) =>
      ts.map((t) =>
        t.personId === activeId
          ? { ...t, messages: [...t.messages, { from: 'me', text: draft.trim(), at: new Date().toISOString() }] }
          : t,
      ),
    );
    setDraft('');
  };

  return (
    <Card className="grid h-[calc(100vh-110px)] min-h-[480px] grid-cols-[minmax(0,320px)_1fr] overflow-hidden">
      <div className="border-r border-black/10">
        <h2 className="border-b border-black/10 px-4 py-3 font-semibold">Messaging</h2>
        <ul>
          {threads.map((t) => {
            const p = getPerson(t.personId);
            const last = t.messages[t.messages.length - 1];
            return (
              <li key={t.personId}>
                <button
                  onClick={() => setActiveId(t.personId)}
                  className={`flex w-full gap-2 border-l-4 px-3 py-3 text-left hover:bg-black/5 ${
                    t.personId === activeId ? 'border-emerald-700 bg-emerald-50/60' : 'border-transparent'
                  }`}
                >
                  <Avatar person={p} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="flex justify-between text-sm font-semibold">
                      {p.name} <span className="text-xs font-normal text-black/50">{timeAgoShort(last.at)}</span>
                    </span>
                    <span className="block truncate text-sm text-black/60">
                      {last.from === 'me' ? 'You: ' : ''}
                      {last.text}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex min-w-0 flex-col">
        <div className="border-b border-black/10 px-4 py-3">
          <p className="flex items-center gap-2">
            <PersonLink id={person.id} className="font-semibold">{person.name}</PersonLink>
            <RelationshipBadge personId={person.id} size="xs" />
          </p>
          <p className="truncate text-xs text-black/60">{person.headline}</p>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
          {active.messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : ''}`}>
              <p className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${m.from === 'me' ? 'bg-brand text-white' : 'bg-black/5'}`}>
                {m.text}
              </p>
            </div>
          ))}
        </div>
        <form
          className="flex items-end gap-2 border-t border-black/10 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={2}
            placeholder="Write a message…"
            className="flex-1 resize-none rounded-md bg-black/[0.04] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand"
          />
          <Button size="sm" type="submit" disabled={!draft.trim()}>
            <Send size={14} /> Send
          </Button>
        </form>
      </div>
    </Card>
  );
}
