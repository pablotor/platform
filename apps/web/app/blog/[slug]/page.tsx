import Link from 'next/link';

import ROUTES from '../../../common/routes';
import { Byline, Kicker, Post } from '../components/postCardsCommon';
import content from './content';

/**
 * Swap for a real data fetch (DB query / API call). Shape matches the
 * `Post` interface: title, excerpt, kicker, author.name, createdAt.
 */
async function getPost(slug: string): Promise<Post & { content: string }> {
  return {
    slug: 'edge-runtimes-are-eating-the-backend',
    kicker: 'Infrastructure',
    title: 'Edge runtimes are quietly eating the backend',
    excerpt:
      'A wave of frameworks now assume your server code runs a few milliseconds from the user, not in a single data center. Here is what that shift actually breaks — and what it fixes.',
    author: { name: 'Priya Shah' },
    createdAt: '2026-08-19T09:12:00Z',
    content,
  };
}

const PostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const post = await getPost(slug);

  return (
    <main>
      <article>
        {/* ── Hero section ───────────────────────────────────────────── */}
        <div className="relative w-full">
          {/* Subtle gradient wash — 6% opacity so it reads as a tint,
            not a band. Sits behind the content, not on top of it. */}
          <div
            className="pointer-events-none absolute inset-0 bg-linear-120 from-brand-primary-from/10 to-transparent"
            aria-hidden
          />

          <div className="relative mx-auto flex max-w-3xl flex-nowrap gap-12 px-6 py-16 sm:py-20">
            <div
              id={`card-${post.slug}`}
              data-id={post.slug}
              className="relative flex flex-col gap-3 flex-1 border-l-2 border-transparent pl-6"
              style={{
                borderImage: 'linear-gradient(to bottom, #3b82f6, #4338ca) 1',
              }}
            >
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
                  <p className="text-lead text-muted-foreground">
                    {post.excerpt}
                  </p>
                )}
                <Byline
                  author={post.author.name}
                  date={post.createdAt}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Older posts ────────────────────────────────────────────── */}
        <div className="border-t border-border">
          <div className="mx-auto max-w-3xl px-6 py-16">{post.content}</div>
        </div>
      </article>
    </main>
  );
};

export default PostPage;
