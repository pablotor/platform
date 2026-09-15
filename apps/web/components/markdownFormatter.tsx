import Link from 'next/link';
import { PropsWithChildren } from 'react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

type MarkdownFormatterProps = PropsWithChildren<{
  children: string;
  variant?: 'post' | 'documentation';
  category?: string;
}>;

/**
 * @variant documentation variant formats the h1 as a header
 * @returns the formatted markdown as html code
 */
const MarkdownFormatter = ({
  variant = 'post',
  category,
  children,
}: MarkdownFormatterProps) => (
  <Markdown
    remarkPlugins={[remarkGfm]}
    components={{
      h1: (props) =>
        variant === 'post' ? (
          <h1 className="text-title mt-10 mb-6" {...props} />
        ) : (
          <div className="flex flex-col gap-3 mb-6">
            <span className="text-label text-muted-foreground">{category}</span>
            <h1
              // extra bottom padding so g and j letters are not clipped
              className="text-display text-gradient gradient-primary pb-2"
              {...props}
            />
          </div>
        ),
      h2: (props) => <h2 className="text-title mt-10 mb-4" {...props} />,
      h3: (props) => <h3 className="text-heading mt-8 mb-3" {...props} />,
      h4: (props) => <h4 className="text-subheading mt-6 mb-2" {...props} />,
      h5: (props) => <h5 className="text-subtitle mt-4 mb-1" {...props} />,
      h6: (props) => (
        <h6
          className="text-subtitle text-muted-foreground mt-4 mb-1"
          {...props}
        />
      ),
      p: (props) => <p className="text-body mt-4 first:mt-0" {...props} />,
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
        const { children, ...rest } = props;
        const match = /language-(\w+)/.exec(rest.className || '');
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
          <code {...rest}>{children}</code>
        );
      },
      hr: (props) => <hr className="my-8 border-border" {...props} />,
      table: (props) => (
        <div className="my-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-body-sm" {...props} />
        </div>
      ),
      thead: (props) => (
        <thead className="border-b border-border bg-muted/50" {...props} />
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
    {children}
  </Markdown>
);

export default MarkdownFormatter;
