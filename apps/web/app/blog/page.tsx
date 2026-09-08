import { PostPublicQueryResponse } from '@repo/contracts';
import { Fragment } from 'react';

import apiClient from '../../lib/apiClient';
import LatestPost from './components/latestPost';
import { PostRow } from './components/postRow';

const BlogPage = async () => {
  const posts = await apiClient
    .get<PostPublicQueryResponse>('public/posts')
    .then(({ data }) => data);

  const [latest, ...rest] = posts;
  if (!latest) return;

  return (
    <main>
      {/* ── Hero section ───────────────────────────────────────────── */}
      <div className="relative w-full">
        {/* Subtle gradient wash — 6% opacity so it reads as a tint,
            not a band. Sits behind the content, not on top of it. */}
        <div
          className="pointer-events-none absolute inset-0 bg-linear-120 from-brand-primary-from/10 to-transparent"
          aria-hidden
        />

        <div className="relative mx-auto flex max-w-5xl flex-row-reverse flex-nowrap gap-12 px-6 py-16 sm:py-20">
          {/* Latest post — right side on large screens */}
          <div className="flex-1 lg:w-1/2">
            <LatestPost post={latest} />
          </div>

          {/* Secondary stack — left side, separated by hairlines */}
          <div className="hidden lg:flex lg:w-5/12 flex-col justify-center gap-6">
            {rest.slice(0, 3).map((post, index, array) => (
              <Fragment key={`post-${post.slug}-key`}>
                <PostRow post={post} variant="secondary" hideExcerpt />
                {index + 1 !== array.length && (
                  <div className="h-px w-8 bg-border" />
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ── Older posts ────────────────────────────────────────────── */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-label text-muted-foreground mb-10">
            Older posts
          </h2>
          <div className="flex flex-col gap-8">
            {rest.slice(0, 3).map((post, index, array) => (
              <div key={`post-${post.slug}-key`} className="lg:hidden">
                <PostRow post={post} variant="secondary" />
                {index + 1 !== array.length && (
                  <div className="h-px w-8 bg-border" />
                )}
              </div>
            ))}
            {rest.slice(3).map((post, index, array) => (
              <Fragment key={`post-${post.slug}-key`}>
                <PostRow post={post} variant="primary" />
                {index + 1 !== array.length && (
                  <div className="h-px w-8 bg-border" />
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default BlogPage;
