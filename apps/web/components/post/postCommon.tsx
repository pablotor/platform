import clsx from 'clsx';
import { PropsWithChildren } from 'react';

import formatDate from '../../lib/formatDate';

export const Kicker = ({ children }: PropsWithChildren) => (
  <span className="text-label text-brand-primary-accent">{children}</span>
);

export const Byline = ({
  author,
  date,
  className,
}: {
  author: string;
  date: string | Date;
  className?: string;
}) => (
  <div className={clsx('text-label text-muted-foreground', className)}>
    {author}
    {' · '}
    <time dateTime={new Date(date).toISOString()}>{formatDate(date)}</time>
  </div>
);
