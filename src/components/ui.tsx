import { useEffect, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { X } from 'lucide-react';
import type { Person } from '../types';
import { initials } from '../lib/utils';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-lg bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] ${className}`}>
      {children}
    </section>
  );
}

type Variant = 'primary' | 'secondary' | 'muted' | 'ghost';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark disabled:bg-black/10 disabled:text-black/40',
  secondary: 'text-brand ring-1 ring-brand hover:ring-2 hover:bg-brand/5 disabled:opacity-40',
  muted: 'text-black/60 ring-1 ring-black/60 hover:ring-2 hover:bg-black/5 hover:text-black/80',
  ghost: 'text-black/60 hover:bg-black/5 hover:text-black/80',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: 'sm' | 'md' }) {
  const sizing = size === 'sm' ? 'px-3 py-1 text-sm' : 'px-4 py-1.5 text-[15px]';
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full font-semibold transition-colors disabled:cursor-not-allowed ${sizing} ${VARIANTS[variant]} ${className}`}
    />
  );
}

const AVATAR_SIZES = {
  xs: 'h-8 w-8 text-xs',
  sm: 'h-12 w-12 text-base',
  md: 'h-14 w-14 text-lg',
  lg: 'h-18 w-18 text-2xl',
  xl: 'h-36 w-36 text-5xl',
};

export function Avatar({
  person,
  size = 'sm',
  className = '',
}: {
  person: Person;
  size?: keyof typeof AVATAR_SIZES;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`flex shrink-0 select-none items-center justify-center rounded-full font-semibold text-white ${person.avatarColor} ${AVATAR_SIZES[size]} ${className}`}
    >
      {initials(person.name)}
    </div>
  );
}

export function PersonLink({ id, children, className = '' }: { id: string; children: ReactNode; className?: string }) {
  return (
    <a href={`#/profile/${id}`} className={`hover:text-brand hover:underline ${className}`}>
      {children}
    </a>
  );
}

export function Modal({
  title,
  onClose,
  children,
  footer,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-[8vh]"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div role="dialog" aria-modal className={`w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} rounded-lg bg-white shadow-xl`}>
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="rounded-full p-1.5 text-black/60 hover:bg-black/5" aria-label="Close">
            <X size={22} />
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-black/10 px-6 py-3">{footer}</div>}
      </div>
    </div>
  );
}
