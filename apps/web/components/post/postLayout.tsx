import { PostPublicResponse, PostResponse } from '@repo/contracts';
import Link from 'next/link';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

import { Byline, Kicker } from './postCommon';

const PostLayout = ({
  title,
  content,
  excerpt,
  kicker,
  category,
  slug,
  publishedAt,
  updatedAt,
  ...rest
}: PostPublicResponse | PostResponse) => (
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
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: (props) => (
              <h1 className="text-display mt-10 mb-6" {...props} />
            ),
            h2: (props) => <h2 className="text-title mt-10 mb-4" {...props} />,
            h3: (props) => <h3 className="text-heading mt-8 mb-3" {...props} />,
            h4: (props) => (
              <h4 className="text-subheading mt-6 mb-2" {...props} />
            ),
            h5: (props) => (
              <h5 className="text-subtitle mt-4 mb-1" {...props} />
            ),
            h6: (props) => (
              <h6
                className="text-subtitle text-muted-foreground mt-4 mb-1"
                {...props}
              />
            ),
            p: (props) => (
              <p className="text-body mt-4 first:mt-0" {...props} />
            ),
            a: ({ href, ...props }) => (
              <Link className="text-link" href={href ?? '/blog'} {...props} />
            ),
            strong: (props) => (
              <strong className="font-semibold text-foreground" {...props} />
            ),
            em: (props) => <em className="italic" {...props} />,
            ul: (props) => (
              <ul
                className="text-body mt-4 mb-4 space-y-1.5 list-disc pl-6"
                {...props}
              />
            ),
            ol: (props) => (
              <ol
                className="text-body mt-4 mb-4 space-y-1.5 list-decimal pl-6"
                {...props}
              />
            ),
            li: (props) => <li className="pl-1.5" {...props} />,
            blockquote: (props) => (
              <blockquote
                className="my-6 border-l-2 border-border pl-5 italic text-lead text-muted-foreground"
                {...props}
              />
            ),
            code: (props) => {
              const { children, className, ...rest } = props;
              const match = /language-(\w+)/.exec(className || '');
              return match ? (
                <SyntaxHighlighter
                  PreTag="pre"
                  className="my-6 overflow-x-auto rounded-md border border-border relative"
                  language={match[1]}
                  style={vscDarkPlus}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              );
            },
            hr: (props) => <hr className="my-8 border-border" {...props} />,
            table: (props) => (
              <div className="my-6 overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-body-sm" {...props} />
              </div>
            ),
            thead: (props) => (
              <thead
                className="border-b border-border bg-muted/50"
                {...props}
              />
            ),
            th: (props) => (
              <th
                className="px-4 py-2.5 text-left text-label text-muted-foreground font-semibold"
                {...props}
              />
            ),
            td: (props) => (
              <td
                className="px-4 py-2.5 border-t border-border first:border-t-0"
                {...props}
              />
            ),
            tr: (props) => (
              <tr className="not-first:border-t border-border" {...props} />
            ),
            img: ({ src, alt, ...props }) => (
              // Placeholder treatment until image upload is implemented.
              // rounded-xl matches the platform's card radius.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={alt ?? ''}
                className="my-6 w-full rounded-xl border border-border object-cover"
                {...props}
              />
            ),
          }}
        >
          {content}
        </Markdown>
      </div>
    </div>
  </article>
);

export default PostLayout;
