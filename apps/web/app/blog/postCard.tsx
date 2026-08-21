import clsx from 'clsx';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

import ROUTES from '../../common/routes';

export interface Post {
  slug: string;
  title: string;
  excerpt?: string;
  kicker?: string;
  author: { name: string };
  createdAt: string | Date;
}

const formatDate = (date: string | Date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
};

const Kicker = ({ children }: PropsWithChildren) => (
  <span className="text-label text-brand-primary-accent">{children}</span>
);

const Byline = ({
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

/**
 * Featured post — the single lead story at the top of the page.
 * Accented with a left gradient border that echoes the header wordmark.
 * Sits on --background, not a colored band, for cohesion with the rest
 * of the platform.
 */
export const FeaturedPost = ({ post }: { post: Post }) => (
  <article
    id={`card-${post.slug}`}
    data-id={post.slug}
    className="relative flex flex-col gap-3 border-l-2 border-transparent pl-6"
    style={{
      borderImage: 'linear-gradient(to bottom, #3b82f6, #4338ca) 1',
    }}
  >
    {/* Featured badge — uses primary-foreground on brand-primary surface,
        the correct token pairing for light text on a brand-colored bg */}
    <div className="flex items-center gap-1.5 self-start rounded-full gradient-primary px-3 py-1 text-label text-primary-foreground">
      <Star className="size-3" />
      Featured
    </div>

    <div className="flex flex-col gap-2">
      {post.kicker && <Kicker>{post.kicker}</Kicker>}
      <h2 className="text-display">
        <Link
          className="text-link decoration-transparent hover:decoration-current"
          href={ROUTES.public.blog.post(post.slug)}
        >
          {post.title}
        </Link>
      </h2>
      {post.excerpt && (
        <p className="text-lead text-muted-foreground">{post.excerpt}</p>
      )}
      <Byline
        author={post.author.name}
        date={post.createdAt}
        className="mt-1"
      />
    </div>
  </article>
);

/**
 * Standard row — used for every post in the list beneath the lead story.
 * Two visual weights: primary (foreground text) for the main feed,
 * secondary (muted) for posts sitting alongside the featured story.
 */
export const PostRow = ({
  post,
  variant = 'primary',
}: {
  post: Post;
  variant: 'primary' | 'secondary';
}) => (
  <article
    id={`card-${post.slug}`}
    data-id={post.slug}
    className="flex flex-col gap-1.5"
  >
    {post.kicker && <Kicker>{post.kicker}</Kicker>}
    <h2
      className={clsx(
        'text-subheading',
        variant === 'secondary' && 'text-muted-foreground',
      )}
    >
      <Link
        className="text-link decoration-transparent hover:decoration-current"
        href={ROUTES.public.blog.post(post.slug)}
      >
        {post.title}
      </Link>
    </h2>
    {post.excerpt && (
      <p
        className={clsx(
          'text-body-sm',
          variant === 'primary' ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {post.excerpt}
      </p>
    )}
    <Byline
      author={post.author.name}
      date={post.createdAt}
      className="mt-0.5"
    />
  </article>
);
