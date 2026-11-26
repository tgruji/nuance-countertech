import { useState } from 'react';
import { Ellipsis, Globe, Image, CalendarDays, MessageCircle, Newspaper, Repeat2, Send, ThumbsUp } from 'lucide-react';
import type { Post } from '../types';
import { ME_ID, getPerson } from '../data/mockData';
import { useApp } from '../store/AppContext';
import { timeAgoShort } from '../lib/utils';
import { Avatar, Button, Card, PersonLink } from './ui';
import { RelationshipBadge } from './RelationshipBadge';

export function PostCard({ post }: { post: Post }) {
  const app = useApp();
  const author = getPerson(post.authorId);
  const liked = app.liked.includes(post.id);
  const conn = app.connectionOf(author.id);
  const showFollow = author.id !== ME_ID && !conn && !app.isFollowing(author.id);

  const action = (Icon: typeof ThumbsUp, label: string, onClick?: () => void, active = false) => (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded py-3 text-sm font-semibold hover:bg-black/5 ${
        active ? 'text-brand' : 'text-black/60'
      }`}
    >
      <Icon size={18} fill={active ? 'currentColor' : 'none'} /> <span className="max-sm:hidden">{label}</span>
    </button>
  );

  return (
    <Card>
      <div className="flex gap-2 px-4 pt-3">
        <a href={`#/profile/${author.id}`}>
          <Avatar person={author} size="sm" />
        </a>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <PersonLink id={author.id} className="text-sm font-semibold">
              {author.name}
            </PersonLink>
            <RelationshipBadge personId={author.id} size="xs" />
          </div>
          <p className="truncate text-xs text-black/60">{author.headline}</p>
          <p className="flex items-center gap-1 text-xs text-black/60">
            {timeAgoShort(post.createdAt)} · <Globe size={12} />
          </p>
        </div>
        {showFollow ? (
          <button onClick={() => app.toggleFollow(author.id)} className="h-fit rounded px-2 py-1 text-sm font-semibold text-brand hover:bg-brand/10">
            + Follow
          </button>
        ) : (
          <Ellipsis size={20} className="text-black/60" />
        )}
      </div>
      {app.redesign && conn && conn.context && (
        <p className="mx-4 mt-2 rounded bg-black/[0.03] px-2 py-1 text-[11px] text-black/60">
          You know {author.name.split(' ')[0]}: {conn.context}
        </p>
      )}
      <p className="whitespace-pre-line px-4 py-3 text-sm leading-relaxed">{post.content}</p>
      <div className="mx-4 flex justify-between border-b border-black/10 pb-2 text-xs text-black/60">
        <span className="flex items-center gap-1">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand text-white">
            <ThumbsUp size={9} fill="currentColor" />
          </span>
          {post.likes + (liked ? 1 : 0)}
        </span>
        <span>
          {post.comments} comments · {post.reposts} reposts
        </span>
      </div>
      <div className="flex px-2">
        {action(ThumbsUp, 'Like', () => app.toggleLike(post.id), liked)}
        {action(MessageCircle, 'Comment')}
        {action(Repeat2, 'Repost')}
        {action(Send, 'Send')}
      </div>
    </Card>
  );
}

const COMPOSER_ACTIONS = [
  { icon: Image, label: 'Media', color: 'text-sky-600' },
  { icon: CalendarDays, label: 'Event', color: 'text-amber-700' },
  { icon: Newspaper, label: 'Write article', color: 'text-orange-700' },
];

export function Composer() {
  const app = useApp();
  const me = getPerson(ME_ID);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');

  return (
    <Card className="px-4 pb-1 pt-3">
      <div className="flex gap-2">
        <Avatar person={me} size="sm" />
        {open ? (
          <textarea
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What do you want to talk about?"
            rows={4}
            className="flex-1 resize-none rounded-lg p-3 text-sm ring-1 ring-black/30 outline-none focus:ring-2 focus:ring-brand"
          />
        ) : (
          <button onClick={() => setOpen(true)} className="flex-1 rounded-full px-4 text-left text-sm font-semibold text-black/60 ring-1 ring-black/30 hover:bg-black/5">
            Start a post
          </button>
        )}
      </div>
      {open ? (
        <div className="flex justify-end gap-2 py-2">
          <Button variant="ghost" size="sm" onClick={() => { setOpen(false); setText(''); }}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!text.trim()}
            onClick={() => {
              app.addPost(text.trim());
              setText('');
              setOpen(false);
            }}
          >
            Post
          </Button>
        </div>
      ) : (
        <div className="flex justify-around py-1">
          {COMPOSER_ACTIONS.map(({ icon: Icon, label, color }) => (
            <button key={label} onClick={() => setOpen(true)} className="flex items-center gap-2 rounded px-2 py-3 text-sm font-semibold text-black/60 hover:bg-black/5">
              <Icon size={20} className={color} /> {label}
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}
