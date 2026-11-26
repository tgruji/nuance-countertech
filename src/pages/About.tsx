import { ArrowLeftRight, Hourglass, Layers, ListChecks, SlidersHorizontal, UserCheck } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Button, Card } from '../components/ui';

const FEATURES = [
  {
    icon: ListChecks,
    title: 'Typed relationships, not one “connection”',
    body: 'Every connection carries a type — collaborator, mentor, colleague, classmate, met briefly, online acquaintance — so a ten-minute conversation and a year-long collaboration are no longer represented identically.',
  },
  {
    icon: UserCheck,
    title: 'Intentional reflection at the moment of connecting',
    body: 'Connecting requires choosing a type and stating, in your own words, what the relationship rests on. Brief encounters are nudged towards “follow” as a lighter-weight alternative.',
  },
  {
    icon: ArrowLeftRight,
    title: 'Both sides keep their own description',
    body: 'If you call someone a collaborator and they call you a classmate, Nuance shows both. Neither description overrides the other, making asymmetric relationships visible rather than flattening them.',
  },
  {
    icon: Hourglass,
    title: 'Reconsidering connections over time',
    body: 'Connections are periodically resurfaced for reflection — brief encounters after 6 months, shared workplaces after 12, close relationships after 18. Confirming, redescribing, downgrading to follow, and removing are all equally easy.',
  },
  {
    icon: Layers,
    title: 'A spectrum instead of a count',
    body: 'Profiles replace “500+ connections” with a breakdown of relationships by depth, removing the incentive to accumulate connections as a status metric.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Relationship-aware feed',
    body: 'The feed can be filtered by relationship depth, and posts from connections show how you actually know the author.',
  },
];

export function About() {
  const { redesign, setMode } = useApp();
  return (
    <div className="mx-auto max-w-3xl space-y-2">
      <Card className="p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-black/50">R175 Countertechnologies · University of Cambridge</p>
        <h1 className="mt-1 text-2xl font-semibold">Nuance: professional relationships, in context</h1>
        <p className="mt-3 text-sm leading-relaxed text-black/80">
          Mainstream professional networks standardise professional relationships by representing very different
          interpersonal encounters as a single, equivalent “connection”. Someone met briefly at a conference and
          someone collaborated with for years appear identically — and the act of connecting is presented as evidence
          that a substantive professional relationship exists.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-black/80">
          Nuance is a speculative countertechnology that refuses that equivalence. It encourages intentional
          reflection when connecting, distinguishes relationship types, and invites users to reconsider their
          connections as relationships change.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg bg-black/[0.03] p-3 text-sm">
          <span className="flex-1">
            You are currently viewing <b>{redesign ? 'the Nuance redesign' : 'standard mode'}</b>. Switch modes to compare
            the same network under both models.
          </span>
          <Button size="sm" onClick={() => setMode(redesign ? 'standard' : 'redesign')}>
            Switch to {redesign ? 'standard mode' : 'Nuance redesign'}
          </Button>
        </div>
      </Card>
      <Card className="divide-y divide-black/10">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-4 p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200">
              <Icon size={20} />
            </span>
            <div>
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-black/70">{body}</p>
            </div>
          </div>
        ))}
      </Card>
      <p className="px-2 text-xs text-black/50">
        Demo prototype. All people, organisations and posts are fictional. Data is stored only in this browser’s
        localStorage; use “Me → Reset demo data” to start over.
      </p>
    </div>
  );
}
