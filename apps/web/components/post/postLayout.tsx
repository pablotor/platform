import { PostPublicResponse, PostResponse } from '@repo/contracts';

import BackTo, { BackToProps } from '../backTo';
import MarkdownFormatter from '../markdownFormatter';
import { Byline, Kicker } from './postCommon';

type PostLayoutProps = {
  post: PostPublicResponse | PostResponse;
  backTo?: BackToProps;
};

const PostLayout = ({
  post: {
    title,
    content,
    excerpt,
    kicker,
    category,
    slug,
    publishedAt,
    updatedAt,
    ...rest
  },
  backTo,
}: PostLayoutProps) => (
  <article>
    {/* ── Hero section ───────────────────────────────────────────── */}
    <div className="relative w-full">
      {/* Subtle gradient wash — 10% opacity so it reads as a tint,
            not a band. Sits behind the content, not on top of it. */}
      <div
        className="pointer-events-none absolute inset-0 bg-linear-120 from-brand-primary-from/10 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-3xl flex-nowrap gap-12 px-6 py-16 sm:py-20">
        {backTo && (
          <div className="absolute top-10 right-0">
            <BackTo {...backTo} />
          </div>
        )}
        <div
          id={`card-${slug}`}
          data-id={slug}
          className="relative flex flex-col gap-3 flex-1 border-l-2 border-transparent"
        >
          <div className="flex flex-col gap-2">
            {kicker || (category && <Kicker>{kicker || category}</Kicker>)}
            <h2 className="text-display text-gradient bg-linear-to-b from-brand-primary-from to-brand-primary pb-2">
              {title}
            </h2>
            {excerpt && (
              <p className="text-lead text-muted-foreground">{excerpt}</p>
            )}
            <Byline
              author={'author' in rest ? rest.author.name : ''}
              date={publishedAt || updatedAt}
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>

    {/* ── Content ────────────────────────────────────────────── */}
    <div className="border-t border-border">
      <div className="mx-auto text-lg font-light max-w-3xl px-6 py-16">
        <MarkdownFormatter>{content}</MarkdownFormatter>
      </div>
    </div>
  </article>
);

export default PostLayout;
