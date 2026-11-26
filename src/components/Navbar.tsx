import { useEffect, useRef, useState } from 'react';
import { Bell, ChevronDown, House, Layers, MessageSquare, Search, Users, type LucideIcon } from 'lucide-react';
import { ME_ID, PEOPLE, getPerson } from '../data/mockData';
import { useApp } from '../store/AppContext';
import { navigate } from '../lib/utils';
import type { Route } from '../App';
import { useNotifications } from '../pages/Notifications';
import { Avatar, Button } from './ui';
import { RelationshipBadge } from './RelationshipBadge';

export function Logo({ size = 34 }: { size?: number }) {
  return (
    <a href="#/" aria-label="Nuance home" className="flex shrink-0 items-center justify-center rounded bg-brand text-white" style={{ width: size, height: size }}>
      <Layers size={size * 0.62} strokeWidth={2.4} />
    </a>
  );
}

function NavItem({
  icon: Icon,
  label,
  href,
  active,
  badge,
}: {
  icon: LucideIcon;
  label: string;
  href: string;
  active: boolean;
  badge?: number;
}) {
  return (
    <a
      href={href}
      className={`relative flex h-[52px] min-w-[64px] flex-col items-center justify-center border-b-2 px-2 text-xs ${
        active ? 'border-black/90 text-black/90' : 'border-transparent text-black/60 hover:text-black/90'
      }`}
    >
      <span className="relative">
        <Icon size={24} strokeWidth={active ? 2.2 : 1.8} />
        {!!badge && (
          <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
            {badge}
          </span>
        )}
      </span>
      <span className="hidden md:block">{label}</span>
    </a>
  );
}

function SearchBox() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const query = q.trim().toLowerCase();
  const results = query
    ? PEOPLE.filter((p) => p.id !== ME_ID && (p.name + ' ' + p.headline).toLowerCase().includes(query)).slice(0, 6)
    : [];

  return (
    <div className="relative">
      <div className="flex h-[34px] w-[280px] items-center gap-2 rounded bg-[#edf3f8] px-3 focus-within:ring-2 focus-within:ring-black/70 max-lg:w-[180px]">
        <Search size={16} className="text-black/60" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search"
          className="w-full bg-transparent text-sm outline-none placeholder:text-black/60"
        />
      </div>
      {open && query && (
        <div className="absolute left-0 top-10 w-[360px] overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/10">
          {results.length === 0 && <p className="p-3 text-sm text-black/60">No people match “{q}”.</p>}
          {results.map((p) => (
            <button
              key={p.id}
              onMouseDown={() => {
                navigate(`/profile/${p.id}`);
                setQ('');
              }}
              className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-black/5"
            >
              <Avatar person={p} size="xs" />
              <span className="min-w-0">
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  {p.name} <RelationshipBadge personId={p.id} size="xs" />
                </span>
                <span className="block truncate text-xs text-black/60">{p.headline}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MeMenu() {
  const app = useApp();
  const me = getPerson(ME_ID);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="flex h-[52px] min-w-[64px] flex-col items-center justify-center text-xs text-black/60 hover:text-black/90">
        <Avatar person={me} size="xs" className="!h-6 !w-6 !text-[10px]" />
        <span className="hidden items-center md:flex">
          Me <ChevronDown size={14} />
        </span>
      </button>
      {open && (
        <div className="absolute right-0 top-12 w-72 rounded-lg bg-white p-3 shadow-lg ring-1 ring-black/10">
          <div className="flex gap-2">
            <Avatar person={me} size="md" />
            <div>
              <p className="font-semibold">{me.name}</p>
              <p className="text-sm text-black/70">{me.headline}</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" className="mt-3 w-full" onClick={() => { navigate(`/profile/${ME_ID}`); setOpen(false); }}>
            View profile
          </Button>
          <div className="mt-3 border-t border-black/10 pt-2 text-sm">
            <a href="#/about" onClick={() => setOpen(false)} className="block py-1 text-black/70 hover:underline">
              About this countertechnology
            </a>
            <button
              className="block py-1 text-black/70 hover:underline"
              onClick={() => {
                if (confirm('Reset all demo data to its original state?')) app.resetDemo();
                setOpen(false);
              }}
            >
              Reset demo data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Switch between the conventional platform and Nuance's redesign, for side-by-side demonstration. */
function ModeToggle() {
  const { redesign, setMode } = useApp();
  return (
    <button
      onClick={() => setMode(redesign ? 'standard' : 'redesign')}
      className="ml-2 flex items-center gap-2 border-l border-black/10 pl-4 text-xs text-black/70"
      title="Toggle between a conventional connection model and the Nuance redesign"
    >
      <span className="hidden text-right leading-tight xl:block">
        {redesign ? 'Nuance redesign' : 'Standard mode'}
        <span className="block text-[10px] text-black/50">click to compare</span>
      </span>
      <span className={`relative h-6 w-11 rounded-full transition ${redesign ? 'bg-emerald-600' : 'bg-black/30'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${redesign ? 'left-[22px]' : 'left-0.5'}`} />
      </span>
    </button>
  );
}

export function Navbar({ route }: { route: Route }) {
  const app = useApp();
  const notifications = useNotifications();
  const networkBadge = app.incoming.length + (app.redesign ? app.dueConnections.length : 0);

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white">
      <div className="mx-auto flex h-[52px] max-w-[1128px] items-center gap-2 px-4">
        <Logo />
        <SearchBox />
        <nav className="ml-auto flex items-center">
          <NavItem icon={House} label="Home" href="#/" active={route.page === 'home'} />
          <NavItem icon={Users} label="My Network" href="#/network" active={route.page === 'network'} badge={networkBadge} />
          <NavItem icon={MessageSquare} label="Messaging" href="#/messaging" active={route.page === 'messaging'} />
          <NavItem icon={Bell} label="Notifications" href="#/notifications" active={route.page === 'notifications'} badge={notifications.length} />
          <MeMenu />
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
