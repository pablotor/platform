import type { PostResponse } from '@repo/contracts';
import Link from 'next/link';

import ROUTES from '../../../../../../common/routes';
import PostRowActions from './postRowActions';

const EXCERPT_LENGTH = 160;

// Plain substring truncation, not markdown-aware — deliberately simple per
// the confirmed decision that excerpt quality doesn't matter for now.
const excerpt = (content: string): string =>
  content.length > EXCERPT_LENGTH
    ? `${content.slice(0, EXCERPT_LENGTH).trimEnd()}…`
    : content;

const formatDate = (isoDate: string): string =>
  new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

type PostListItemProps = {
  post: PostResponse;
};

// Title links to Edit — the most common action an author takes on their own
// post. A judgment call, not an obvious default; easy to point at Info
// instead if that reads better in practice.
const PostListItem = ({ post }: PostListItemProps) => (
  <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-5">
    <div className="flex min-w-0 flex-col gap-1.5">
      <Link
        href={ROUTES.authenticated.dashboard.posts.edit(post.slug)}
        className="text-link text-subtitle"
      >
        {post.title}
      </Link>
      <p className="text-body-sm text-muted-foreground line-clamp-2">
        {excerpt(post.content)}
      </p>
      <span className="text-body-xs text-muted-foreground">
        Updated {formatDate(post.updatedAt)}
      </span>
    </div>
    <PostRowActions post={post} />
  </div>
);

export default PostListItem;
