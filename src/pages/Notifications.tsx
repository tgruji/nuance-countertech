import type { ReactNode } from 'react';
import { Hourglass, ThumbsUp, UserPlus, Eye } from 'lucide-react';
import { getPerson } from '../data/mockData';
import { useApp } from '../store/AppContext';
import { RELATIONSHIPS } from '../lib/relationships';
import { duration, firstName, navigate, timeAgoShort } from '../lib/utils';
import { Avatar, Card } from '../components/ui';
import { ProfileSidebar } from '../components/Sidebars';

interface Notice {
  key: string;
  icon: ReactNode;
  text: ReactNode;
  when: string;
  href: string;
}

export function useNotifications(): Notice[] {
  const app = useApp();
  const list: Notice[] = app.incoming.map((inv) => {
    const p = getPerson(inv.personId);
    return {
      key: inv.id,
      icon: <Avatar person={p} size="sm" />,
      text: (
        <>
          <b>{p.name}</b> wants to connect
          {app.faceted && inv.type !== 'unspecified' && (
            <> and describes you as: <b>{RELATIONSHIPS[inv.type].label.toLowerCase()}</b> — “{inv.context}”</>
          )}
        </>
      ),
      when: timeAgoShort(inv.sentAt),
      href: '/network',
    };
  });

  if (app.redesign) {
    app.dueConnections.forEach((c) => {
      const p = getPerson(c.personId);
      list.push({
        key: `due-${c.personId}`,
        icon: <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800"><Hourglass size={22} /></span>,
        text: !app.faceted ? (
            <>It’s been {duration(c.lastReviewed)} since you last reconsidered your connection with <b>{p.name}</b>. Do you want to keep it?</>
          ) : c.type === 'unspecified' ? (
            <>You connected with <b>{p.name}</b> {duration(c.since)} ago without describing how you know each other. Is this a real relationship?</>
          ) : (
            <>It’s been {duration(c.lastReviewed)} since you reflected on your connection with <b>{p.name}</b> (“{c.context}”). Does it still describe your relationship?</>
          ),
        when: '',
        href: `/profile/${p.id}`,
      });
    });
  }

  list.push(
    {
      key: 'static-likes',
      icon: <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-brand"><ThumbsUp size={22} /></span>,
      text: <><b>{firstName(getPerson('p1').name)}</b> and 12 others reacted to your comment on open-sourcing accessibility tools.</>,
      when: '1d',
      href: '/',
    },
    {
      key: 'static-views',
      icon: <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800"><Eye size={22} /></span>,
      text: <>Your profile was viewed by 14 people this week.</>,
      when: '3d',
      href: '/profile/me',
    },
  );
  return list;
}

export function Notifications() {
  const notices = useNotifications();
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[225px_1fr]">
      <aside className="max-md:hidden"><ProfileSidebar /></aside>
      <Card className="overflow-hidden">
        <h2 className="flex items-center gap-2 px-4 py-3 font-semibold"><UserPlus size={18} /> Notifications</h2>
        <ul>
          {notices.map((n) => (
            <li key={n.key}>
              <button onClick={() => navigate(n.href)} className="flex w-full items-start gap-3 border-t border-black/10 bg-sky-50/50 px-4 py-3 text-left text-sm hover:bg-black/5">
                {n.icon}
                <span className="flex-1 text-black/80">{n.text}</span>
                <span className="text-xs text-black/50">{n.when}</span>
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
