import clsx from 'clsx';
import Link from 'next/link';

import ROUTES from '../../../common/routes';
import { Byline, Kicker, type Post } from './postCardsCommon';

type PostRowType = {
  post: Post;
  variant: 'primary' | 'secondary';
  hideExcerpt?: boolean;
};

export const PostRow = ({
  post,
  variant = 'primary',
  hideExcerpt = false,
}: PostRowType) => (
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
          hideExcerpt && 'hidden',
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
