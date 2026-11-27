import { CircleExclamationPoint } from 'lucide-react';
import type { RelationshipType } from '../types';
import { RELATIONSHIPS, TIERS, descriptionsDiffer } from '../lib/relationships';
import { useApp } from '../store/AppContext';

/** A pill showing a single relationship type. */
export function TypePill({ type, size = 'sm' }: { type: RelationshipType; size?: 'xs' | 'sm' }) {
  const info = RELATIONSHIPS[type];
  const Icon = info.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full font-medium ring-1 ring-inset ${TIERS[info.tier].badge} ${
        size === 'xs' ? 'px-1.5 py-0 text-[11px]' : 'px-2 py-0.5 text-xs'
      }`}
    >
      <Icon size={size === 'xs' ? 11 : 13} />
      {info.label}
    </span>
  );
}

/**
 * How a person relates to the viewer.
 * Standard mode, or faceted connections off: the familiar undifferentiated "· 1st".
 * Redesign: the described relationship, flagged when the two sides describe it differently.
 */
export function RelationshipBadge({ personId, size = 'sm' }: { personId: string; size?: 'xs' | 'sm' }) {
  const { faceted, connectionOf } = useApp();
  const conn = connectionOf(personId);
  if (!conn) return null;

  if (!faceted) return <span className="text-sm font-normal text-black/60">· 1st</span>;

  return (
    <span className="inline-flex items-center gap-1" title={conn.context || undefined}>
      <TypePill type={conn.type} size={size} />
      {descriptionsDiffer(conn) && (
        <span title="You and they describe this relationship differently">
          <CircleExclamationPoint size={14} className="text-amber-600" />
        </span>
      )}
    </span>
  );
}
