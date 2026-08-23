import { Link } from 'react-router-dom';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cx } from '@/lib/format';

type Variant = 'primary' | 'secondary' | 'ghost' | 'light';
type Size = 'sm' | 'md' | 'lg';

const base =
  'group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full font-semibold tracking-tight transition-[transform,box-shadow,background-color,color] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea-400 focus-visible:ring-offset-2 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<Variant, string> = {
  primary:
    'bg-sea-600 text-white shadow-glow hover:bg-sea-700 hover:shadow-[0_28px_70px_-20px_rgba(2,132,199,0.6)]',
  secondary:
    'border border-sea-200 bg-white/80 text-ink backdrop-blur hover:border-sea-400 hover:bg-white hover:shadow-soft',
  ghost: 'text-sea-700 hover:bg-sea-50',
  light:
    'border border-white/40 bg-white/15 text-white backdrop-blur-md hover:border-white/70 hover:bg-white/25',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm sm:text-[0.95rem]',
  lg: 'px-7 py-3.5 text-base',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

/** Sheen that sweeps across the button on hover. */
function Sheen() {
  return (
    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: CommonProps & ComponentPropsWithoutRef<'button'>) {
  return (
    <button className={cx(base, variants[variant], sizes[size], className)} {...props}>
      <Sheen />
      <span className="relative flex items-center gap-2.5">{children}</span>
    </button>
  );
}

export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: CommonProps & { to: string } & Omit<ComponentPropsWithoutRef<typeof Link>, 'to' | 'className'>) {
  return (
    <Link to={to} className={cx(base, variants[variant], sizes[size], className)} {...props}>
      <Sheen />
      <span className="relative flex items-center gap-2.5">{children}</span>
    </Link>
  );
}

export function ButtonAnchor({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: CommonProps & ComponentPropsWithoutRef<'a'>) {
  return (
    <a className={cx(base, variants[variant], sizes[size], className)} {...props}>
      <Sheen />
      <span className="relative flex items-center gap-2.5">{children}</span>
    </a>
  );
}
