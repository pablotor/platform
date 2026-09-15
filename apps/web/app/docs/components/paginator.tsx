import clsx from 'clsx';
import Link from 'next/link';

type PaginatorItem = {
  label: string;
  group?: string;
  href: string;
};

type PaginatorCardProps = {
  item: PaginatorItem;
  variant: 'next' | 'prev';
};

const PaginatorCard = ({ item, variant }: PaginatorCardProps) => (
  <Link
    className="
  group rounded-xl border border-border bg-card p-5 pb-7
  transition-colors duration-200 hover:border-brand-secondary-accent
  focus-visible:focusable-outline text-left cursor-pointer
"
    href={item.href}
  >
    <span className="text-label text-muted-foreground">
      {variant === 'next' ? 'Next' : 'Prev'}
    </span>
    <h3 className="text-subtitle underline-offset-4 decoration-transparent transition-colors duration-200 group-hover:text-brand-secondary-accent group-hover:underline group-hover:decoration-current">
      {item.label}
    </h3>
  </Link>
);

type PaginatorProps = {
  prev?: PaginatorItem;
  next?: PaginatorItem;
  className?: string;
};

const Paginator = ({ prev, next, className }: PaginatorProps) => (
  <div
    className={clsx(
      'flex w-full',
      prev && next && 'justify-between',
      !prev && next && 'justify-end',
      className,
    )}
  >
    {prev && <PaginatorCard variant="prev" item={prev} />}
    {next && <PaginatorCard variant="next" item={next} />}
  </div>
);

export default Paginator;
