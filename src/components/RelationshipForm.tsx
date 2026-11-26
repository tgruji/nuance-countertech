import { useState } from 'react';
import { Hourglass } from 'lucide-react';
import type { Person, RelationshipType } from '../types';
import { RELATIONSHIPS, SELECTABLE_TYPES, TIERS, tierOf } from '../lib/relationships';
import { firstName } from '../lib/utils';
import type { RelationshipDetails } from '../store/AppContext';
import { Button } from './ui';

const MIN_CONTEXT = 8;

/**
 * Deliberate friction: a connection can't be created or changed without
 * choosing a relationship type and saying, in your own words, what it rests on.
 */
export function RelationshipForm({
  person,
  initial,
  showNote = false,
  submitLabel,
  onSubmit,
  onCancel,
  onFollowInstead,
}: {
  person: Person;
  initial?: Partial<RelationshipDetails>;
  showNote?: boolean;
  submitLabel: string;
  onSubmit: (d: RelationshipDetails) => void;
  onCancel: () => void;
  onFollowInstead?: () => void;
}) {
  const [type, setType] = useState<RelationshipType | null>(
    initial?.type && initial.type !== 'unspecified' ? initial.type : null,
  );
  const [context, setContext] = useState(initial?.context ?? '');
  const [note, setNote] = useState(initial?.note ?? '');
  const name = firstName(person.name);
  const valid = type !== null && context.trim().length >= MIN_CONTEXT;
  const info = type ? RELATIONSHIPS[type] : null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) onSubmit({ type: type!, context: context.trim(), note: note.trim() || undefined });
      }}
    >
      <p className="mb-3 text-sm font-semibold">How do you know {name}?</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {SELECTABLE_TYPES.map((t) => {
          const r = RELATIONSHIPS[t];
          const Icon = r.icon;
          const selected = t === type;
          return (
            <button
              type="button"
              key={t}
              onClick={() => setType(t)}
              className={`flex gap-2.5 rounded-lg p-2.5 text-left ring-1 transition ${
                selected ? 'bg-brand/5 ring-2 ring-brand' : 'ring-black/15 hover:bg-black/[0.03]'
              }`}
            >
              <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ${TIERS[r.tier].badge}`}>
                <Icon size={15} />
              </span>
              <span>
                <span className="block text-sm font-semibold">{r.label}</span>
                <span className="block text-xs leading-snug text-black/60">{r.description}</span>
              </span>
            </button>
          );
        })}
      </div>

      {info && (
        <div className="mt-4">
          <label className="text-sm font-semibold" htmlFor="rel-context">
            {info.contextPrompt} <span className="text-red-700">*</span>
          </label>
          <textarea
            id="rel-context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder={info.placeholder}
            rows={2}
            maxLength={160}
            className="mt-1 w-full resize-none rounded-md px-3 py-2 text-sm ring-1 ring-black/30 outline-none focus:ring-2 focus:ring-brand"
          />
          <div className="flex justify-between text-xs text-black/50">
            <span>{name} will see this and can describe it in their own words.</span>
            <span>{context.length}/160</span>
          </div>
        </div>
      )}

      {type && tierOf(type) === 'light' && (
        <div className="mt-3 flex gap-2.5 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
          <Hourglass size={18} className="mt-0.5 shrink-0" />
          <div>
            Brief encounters are welcome — but this connection will be shown as one, and Nuance will ask
            you to revisit it in {TIERS.light.reviewMonths} months.
            {onFollowInstead && (
              <>
                {' '}If you mainly want to see {name}’s posts,{' '}
                <button type="button" onClick={onFollowInstead} className="font-semibold text-brand hover:underline">
                  follow instead
                </button>
                .
              </>
            )}
          </div>
        </div>
      )}

      {showNote && info && (
        <div className="mt-4">
          <label className="text-sm font-semibold" htmlFor="rel-note">
            Add a note <span className="font-normal text-black/50">(optional)</span>
          </label>
          <textarea
            id="rel-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            maxLength={300}
            placeholder={`e.g. Great to meet you — I'd love to hear more about your work.`}
            className="mt-1 w-full resize-none rounded-md px-3 py-2 text-sm ring-1 ring-black/30 outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!valid}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
