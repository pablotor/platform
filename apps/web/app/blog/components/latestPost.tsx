import { Star } from 'lucide-react';
import Link from 'next/link';

import ROUTES from '../../../common/routes';
import { Byline, Kicker, type Post } from './postCardsCommon';

/**
 * Latest post — the single lead story at the top of the page.
 * Accented with a left gradient border that echoes the header wordmark.
 * Sits on --background, not a colored band, for cohesion with the rest
 * of the platform.
 */
const LatestPost = ({ post }: { post: Post }) => (
  <article
    id={`card-${post.slug}`}
    data-id={post.slug}
    className="relative flex flex-col gap-3 border-l-2 border-transparent pl-6"
    style={{
      borderImage: 'linear-gradient(to bottom, #3b82f6, #4338ca) 1',
    }}
  >
    {/* Latest badge — uses primary-foreground on brand-primary surface,
        the correct token pairing for light text on a brand-colored bg */}
    <div className="flex items-center gap-1.5 self-start rounded-full gradient-primary px-3 py-1 text-label text-primary-foreground">
      <Star className="size-3" />
      Latest
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

export default LatestPost;
