import { useState, type ReactNode } from 'react';
import { ArrowLeftRight, Check, Pencil, UserMinus, Eye } from 'lucide-react';
import { getPerson } from '../data/mockData';
import { useApp } from '../store/AppContext';
import { descriptionsDiffer } from '../lib/relationships';
import { duration, firstName } from '../lib/utils';
import { Avatar, Modal } from './ui';
import { TypePill } from './RelationshipBadge';
import { RelationshipForm } from './RelationshipForm';

/**
 * Revisiting a connection: is this still an accurate description of the relationship?
 * Every outcome — confirm, redescribe, downgrade to follow, remove — is equally easy.
 */
export function ReflectModal({
  personId,
  onClose,
  startEditing = false,
}: {
  personId: string;
  onClose: () => void;
  /** Open directly on the edit form (the "Edit" button), rather than on the reflection question. */
  startEditing?: boolean;
}) {
  const app = useApp();
  const conn = app.connectionOf(personId);
  const person = getPerson(personId);
  const name = firstName(person.name);
  // Without facets there is nothing to describe: only keep / follow / remove are offered.
  const [editing, setEditing] = useState(app.faceted && (startEditing || conn?.type === 'unspecified'));

  if (!conn) return null;

  const option = (icon: ReactNode, title: string, desc: string, onClick: () => void, danger = false) => (
    <button
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-lg p-3 text-left ring-1 ring-black/15 transition hover:bg-black/[0.03] ${
        danger ? 'hover:ring-red-300' : 'hover:ring-brand/40'
      }`}
    >
      <span className={`mt-0.5 ${danger ? 'text-red-700' : 'text-brand'}`}>{icon}</span>
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs text-black/60">{desc}</span>
      </span>
    </button>
  );

  return (
    <Modal title={startEditing ? 'Edit relationship' : 'Reflect on this connection'} onClose={onClose} wide>
      <div className="flex items-center gap-3">
        <Avatar person={person} size="md" />
        <div>
          <p className="font-semibold">{person.name}</p>
          <p className="text-sm text-black/60">{person.headline}</p>
          <p className="text-xs text-black/50">
            Connected {duration(conn.since)} ago · last reflected on {duration(conn.lastReviewed)} ago
          </p>
        </div>
      </div>

      {app.faceted && (
      <div className="mt-4 space-y-2 rounded-lg bg-black/[0.03] p-3 text-sm">
        {conn.type === 'unspecified' ? (
          <p>
            You connected with {name} with one click, without saying how you know each other. What is this
            relationship, really?
          </p>
        ) : (
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-black/50">You described it as</p>
            <div className="flex flex-wrap items-center gap-2">
              <TypePill type={conn.type} />
              <span className="italic text-black/70">“{conn.context}”</span>
            </div>
          </div>
        )}
        {conn.theirType && (
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-black/50">{name} described it as</p>
            <div className="flex flex-wrap items-center gap-2">
              <TypePill type={conn.theirType} />
              {conn.theirContext && <span className="italic text-black/70">“{conn.theirContext}”</span>}
            </div>
          </div>
        )}
        {descriptionsDiffer(conn) && (
          <p className="flex items-center gap-1.5 text-xs text-amber-800">
            <ArrowLeftRight size={13} /> You see this relationship differently. Both descriptions are kept —
            neither overrides the other.
          </p>
        )}
      </div>
      )}

      {editing ? (
        <div className="mt-4">
          <RelationshipForm
            person={person}
            initial={conn}
            submitLabel="Save description"
            onCancel={() => (startEditing || conn.type === 'unspecified' ? onClose() : setEditing(false))}
            onSubmit={(d) => {
              app.redescribeConnection(personId, d);
              onClose();
            }}
          />
          {conn.type === 'unspecified' && (
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-black/10 pt-3 text-sm">
              <span className="text-black/60">Not a real relationship?</span>
              <button className="font-semibold text-brand hover:underline" onClick={() => { app.removeConnection(personId, true); onClose(); }}>
                Follow instead
              </button>
              <button className="font-semibold text-red-700 hover:underline" onClick={() => { app.removeConnection(personId, false); onClose(); }}>
                Remove connection
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <p className="mb-2 mt-4 text-sm font-semibold">
            {app.faceted ? 'Does this still describe your relationship?' : `Do you want to keep this connection with ${name}?`}
          </p>
          <div className="space-y-2">
            {option(<Check size={18} />, app.faceted ? 'Yes, still accurate' : 'Yes, keep it', 'Keep the connection as it is.', () => {
              app.confirmConnection(personId);
              onClose();
            })}
            {app.faceted &&
              option(<Pencil size={18} />, 'It has changed', 'Relationships deepen and fade. Update the description.', () => setEditing(true))}
            {option(<Eye size={18} />, 'Follow instead', `Keep seeing ${name}’s posts without claiming a relationship.`, () => {
              app.removeConnection(personId, true);
              onClose();
            })}
            {option(<UserMinus size={18} />, 'Remove connection', `${name} won’t be notified.`, () => {
              app.removeConnection(personId, false);
              onClose();
            }, true)}
          </div>
        </>
      )}
    </Modal>
  );
}
