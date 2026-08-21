import { Fragment } from 'react';

import { FeaturedPost, Post, PostRow } from './postCard';

/**
 * Swap for a real data fetch (DB query / API call). Shape matches the
 * `Post` interface: title, excerpt, kicker, author.name, createdAt.
 */
async function getPosts(): Promise<Post[]> {
  return [
    {
      slug: 'edge-runtimes-are-eating-the-backend',
      kicker: 'Infrastructure',
      title: 'Edge runtimes are quietly eating the backend',
      excerpt:
        'A wave of frameworks now assume your server code runs a few milliseconds from the user, not in a single data center. Here is what that shift actually breaks — and what it fixes.',
      author: { name: 'Priya Shah' },
      createdAt: '2026-08-19T09:12:00Z',
    },
    {
      slug: 'the-quiet-return-of-static-sites',
      kicker: 'Web Dev',
      title: 'The quiet return of static sites',
      excerpt:
        'After a decade chasing server-rendered everything, teams are rediscovering that most pages never needed to be dynamic in the first place.',
      author: { name: 'Marcus Webb' },
      createdAt: '2026-08-18T14:40:00Z',
    },
    {
      slug: 'what-postgres-17-changes-for-you',
      kicker: 'Databases',
      title: 'What Postgres 17 actually changes for you',
      excerpt:
        'Skip the changelog. We tested the incremental backup and vacuum improvements against a 40M-row production table so you do not have to.',
      author: { name: 'Elena Ruiz' },
      createdAt: '2026-08-17T11:05:00Z',
    },
    {
      slug: 'reading-cpu-flame-graphs-like-a-map',
      kicker: 'Performance',
      title: 'Reading a CPU flame graph like a map, not a chart',
      excerpt:
        'Most engineers glance at flame graphs and give up. A short mental model that makes width and depth click permanently.',
      author: { name: 'Tomás Ferreira' },
      createdAt: '2026-08-16T08:00:00Z',
    },
    {
      slug: 'the-case-against-microservices-at-ten-people',
      kicker: 'Architecture',
      title: 'The case against microservices at ten people',
      excerpt:
        'Splitting a service too early costs more than the monolith it replaced. A field report from three startups that reversed course.',
      author: { name: 'Priya Shah' },
      createdAt: '2026-08-15T16:22:00Z',
    },
    {
      slug: 'type-safe-forms-without-the-boilerplate',
      kicker: 'Frontend',
      title: 'Type-safe forms without the boilerplate',
      excerpt:
        'A minimal pattern for validating forms end-to-end with your existing schema library, no extra state management required.',
      author: { name: 'Jonah Lindqvist' },
      createdAt: '2026-08-14T10:30:00Z',
    },
    {
      slug: 'what-broke-when-we-turned-off-cookies',
      kicker: 'Privacy',
      title: 'What broke when we turned off third-party cookies',
      excerpt:
        'We disabled third-party cookies across our stack for a week. Analytics dropped, but not where we expected.',
      author: { name: 'Elena Ruiz' },
      createdAt: '2026-08-13T13:15:00Z',
    },
  ];
}

const BlogPage = async () => {
  const posts = await getPosts();
  const [featured, ...rest] = posts;

  if (!featured) return;

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
          {/* Featured post — right side on large screens */}
          <div className="flex-1 lg:w-1/2">
            <FeaturedPost post={featured} />
          </div>

          {/* Secondary stack — left side, separated by hairlines */}
          <div className="hidden lg:flex lg:w-5/12 flex-col justify-center gap-6">
            {rest.slice(0, 3).map((post, index, array) => (
              <Fragment key={`post-${post.slug}-key`}>
                <PostRow post={post} variant="secondary" />
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
