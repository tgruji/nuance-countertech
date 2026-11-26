import type { Tier } from '../types';
import { TIERS, TIER_ORDER } from '../lib/relationships';

/**
 * Replaces the single "500+ connections" number with a breakdown by depth.
 */
export function Spectrum({
  counts,
  compact = false,
}: {
  counts: Partial<Record<Tier, number>>;
  compact?: boolean;
}) {
  // Every depth is listed (zeros included) so "Undescribed" is always visible.
  const tiers = TIER_ORDER;
  const total = tiers.reduce((sum, t) => sum + (counts[t] ?? 0), 0);

  return (
    <div>
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-black/5">
        {tiers.filter((t) => (counts[t] ?? 0) > 0).map((t) => (
          <div
            key={t}
            className={TIERS[t].bar}
            style={{ width: `${((counts[t] ?? 0) / total) * 100}%` }}
            title={`${TIERS[t].label}: ${counts[t]}`}
          />
        ))}
      </div>
      <ul className={`mt-2 ${compact ? 'space-y-0.5' : 'space-y-1'} text-xs text-black/70`}>
        {tiers.map((t) => (
          <li key={t} className="flex items-center gap-2">
            <span className={`h-2 w-2 shrink-0 rounded-full ${TIERS[t].bar}`} />
            <span className="flex-1">{compact ? TIERS[t].short : TIERS[t].label}</span>
            <span className="font-semibold text-black/80">{counts[t] ?? 0}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
