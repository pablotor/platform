import Button from '@repo/ui/button';
import { ArrowRight, Settings, Trash2 } from 'lucide-react';
import Link from 'next/link';

import ROUTES from '../../../../../common/routes';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const Divider = () => <hr className="border-border" />;

const Pattern = ({
  number,
  title,
  description,
  preview,
  code,
}: {
  number: string;
  title: string;
  description: string;
  preview: React.ReactNode;
  code: string[];
}) => (
  <div className="flex flex-col gap-6">
    <div className="flex flex-col gap-1">
      <span className="text-label text-muted-foreground">{number}</span>
      <h2 className="text-heading">{title}</h2>
      <p className="text-body">{description}</p>
    </div>

    {/* Live preview */}
    <div className="rounded-xl border border-border bg-muted/50 p-6">
      {preview}
    </div>

    {/* Code */}
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border bg-muted/50 px-4 py-2">
        <span className="text-label text-muted-foreground">JSX</span>
      </div>
      <div className="py-2">
        {code.map((line, i) => (
          <div key={i} className="flex px-4 py-0.5">
            <code className="whitespace-pre font-mono text-xs leading-6 text-foreground">
              {line}
            </code>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const CompositionPage = () => (
  <main className="mx-auto flex max-w-2xl flex-col gap-16 px-6 pb-32 pt-16">
    {/* ── Opening ──────────────────────────────────────────────────────── */}
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="text-label text-muted-foreground">Design guide</span>
        <h1 className="text-display text-gradient gradient-primary">
          Composition
        </h1>
      </div>

      <blockquote className="border-l-2 border-border pl-5">
        <p className="text-lead italic">
          &ldquo;Great things are not done by impulse, but by a series of small
          things brought together.&rdquo;
        </p>
        <footer className="mt-3">
          <span className="text-body-sm text-muted-foreground">
            — Vincent van Gogh
          </span>
        </footer>
      </blockquote>

      <p className="text-body">
        Fundamentals gave you the rules. Typography and Colors gave you the
        vocabulary. This is where it pays off. Each pattern below is a finished
        UI fragment built exclusively from system primitives — no arbitrary
        values, no one-off decisions. Read the preview, then read the code. The
        point isn&apos;t to copy it verbatim, it&apos;s to see which pieces were
        combined and in what order.
      </p>
    </section>

    <Divider />

    {/* ── 01 Links ─────────────────────────────────────────────────────── */}
    <Pattern
      number="01"
      title="Links"
      description="The text-link class handles three contexts: inline inside a paragraph, standalone as a navigational element, and scaled up to heading size. One class, three jobs. Color alone never carries the signal — the underline on hover confirms it."
      preview={
        <div className="flex flex-col gap-6">
          {/* Inline */}
          <div>
            <span className="text-label text-muted-foreground mb-2 block">
              Inline
            </span>
            <p className="text-body">
              Typography isn&apos;t about picking a nice font. It&apos;s about
              making{' '}
              <Link
                href={ROUTES.public.docs.design.typography}
                className="text-link"
              >
                hierarchy legible
              </Link>{' '}
              without the reader noticing it exists.
            </p>
          </div>

          {/* Standalone */}
          <div>
            <span className="text-label text-muted-foreground mb-2 block">
              Standalone
            </span>
            <Link
              href={ROUTES.public.docs.design.fundamentals}
              className="text-link text-body-sm"
            >
              ← Back to fundamentals
            </Link>
          </div>

          {/* At scale */}
          <div>
            <span className="text-label text-muted-foreground mb-2 block">
              At heading scale
            </span>
            <Link
              href={ROUTES.public.docs.design.colors}
              className="text-link text-subtitle"
            >
              Explore the color system →
            </Link>
          </div>
        </div>
      }
      code={[
        `{/* Inline */}`,
        `<p className="text-body">`,
        `  Typography isn't about picking a nice font. It's about making{' '}`,
        `  <Link href={ROUTES.design.typography} className="text-link">`,
        `    hierarchy legible`,
        `  </Link>{' '}`,
        `  without the reader noticing it exists.`,
        `</p>`,
        ``,
        `{/* Standalone */}`,
        `<Link href={ROUTES.design.fundamentals} className="text-link text-body-sm">`,
        `  ← Back to fundamentals`,
        `</Link>`,
        ``,
        `{/* At scale */}`,
        `<Link href={ROUTES.design.colors} className="text-link text-subtitle">`,
        `  Explore the color system →`,
        `</Link>`,
      ]}
    />

    <Divider />

    {/* ── 02 Card ──────────────────────────────────────────────────────── */}
    <Pattern
      number="02"
      title="Card"
      description="The most reusable atom in the system. A bg-card shell with the right border and radius, then content inside. The interactive variant adds hover:bg-accent, focus:focusable-outline and a transition — everything else stays the same. One addition, zero rework."
      preview={
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Static */}
          <div>
            <span className="text-label text-brand-primary-from mb-3 block">
              Static
            </span>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-subtitle">Semantic tokens</h3>
              <p className="text-body-sm text-muted-foreground mt-1">
                Tokens describe role, not appearance. When the theme changes,
                your component doesn&apos;t.
              </p>
            </div>
          </div>

          {/* Interactive */}
          <div>
            <span className="text-label text-brand-secondary-from mb-3 block">
              Interactive
            </span>
            <button
              className="
              rounded-xl border border-border bg-card p-5 text-left transition-colors
              duration-200 hover:bg-accent focus-visible:focusable-outline cursor-pointer
              "
            >
              <h3 className="text-subtitle">Semantic tokens</h3>
              <p className="text-body-sm text-muted-foreground mt-1">
                Tokens describe role, not appearance. When the theme changes,
                your component doesn&apos;t.
              </p>
            </button>
          </div>
        </div>
      }
      code={[
        `{/* Static */}`,
        `<div className="rounded-xl border border-border bg-card p-5">`,
        `  <h3 className="text-subtitle">Semantic tokens</h3>`,
        `  <p className="text-body-sm text-muted-foreground mt-1">`,
        `    Tokens describe role, not appearance.`,
        `  </p>`,
        `</div>`,
        ``,
        `{/* Interactive — one addition */}`,
        `<button className="`,
        `  rounded-xl border border-border bg-card p-5`,
        `  transition-colors duration-200 hover:bg-accent hover:border-primary`,
        `  focus-visible:focusable-outline text-left cursor-pointer`,
        `">`,
        `  <h3 className="text-subtitle">Semantic tokens</h3>`,
        `  <p className="text-body-sm text-muted-foreground mt-1">`,
        `    Tokens describe role, not appearance.`,
        `  </p>`,
        `</button>`,
      ]}
    />

    <Divider />

    {/* ── 03 Blog preview card ─────────────────────────────────────────── */}
    <Pattern
      number="03"
      title="Blog preview card"
      description="Four levels of type hierarchy, each doing a distinct job. The eyebrow sets the category, the title is the destination, the description is the pitch, the footer is the metadata. None of them compete because the scale was designed to coexist."
      preview={
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
          <span className="text-label text-muted-foreground">Typography</span>
          <div className="flex flex-col gap-1.5">
            <Link
              href={ROUTES.public.docs.design.typography}
              className="text-link text-subtitle"
            >
              Why type scale matters more than typeface
            </Link>
            <p className="text-body-sm">
              Most teams agonize over font selection and breeze past the scale.
              The opposite order produces better results.
            </p>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <span className="text-body-xs text-muted-foreground">
              26 Jun 2026
            </span>
            <span className="text-muted-foreground/30">·</span>
            <span className="text-body-xs text-muted-foreground">
              5 min read
            </span>
          </div>
        </div>
      }
      code={[
        `<div className="rounded-xl border border-border bg-card p-5`,
        `             flex flex-col gap-3">`,
        ``,
        `  <span className="text-label text-muted-foreground">`,
        `    Typography`,
        `  </span>`,
        ``,
        `  <div className="flex flex-col gap-1.5">`,
        `    <Link`,
        `      href={ROUTES.design.typography}`,
        `      className="text-link text-subtitle"`,
        `    >`,
        `      Why type scale matters more than typeface`,
        `    </Link>`,
        `    <p className="text-body-sm">`,
        `      Most teams agonize over font selection...`,
        `    </p>`,
        `  </div>`,
        ``,
        `  <div className="flex items-center gap-3 pt-1">`,
        `    <span className="text-body-xs text-muted-foreground">`,
        `      26 Jun 2026`,
        `    </span>`,
        `    <span className="text-muted-foreground/30">·</span>`,
        `    <span className="text-body-xs text-muted-foreground">`,
        `      5 min read`,
        `    </span>`,
        `  </div>`,
        `</div>`,
      ]}
    />

    <Divider />

    {/* ── 04 Settings row ──────────────────────────────────────────────── */}
    <Pattern
      number="04"
      title="Settings row"
      description="A horizontal layout that's harder to get right than it looks — the label needs to breathe, the action needs to stay anchored right, and the separator between rows needs to feel like rhythm, not a wall. All of it resolves with system tokens and a single flex container."
      preview={
        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          {[
            {
              label: 'Notifications',
              description: 'Manage how and when you receive alerts.',
              action: (
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              ),
            },
            {
              label: 'Connected accounts',
              description: 'Link third-party services to your account.',
              action: (
                <Button variant="outline" size="sm">
                  <>
                    <Settings />
                    Manage
                  </>
                </Button>
              ),
            },
            {
              label: 'Delete account',
              description: 'Permanently remove your account and all data.',
              action: (
                <Button variant="destructive" size="sm">
                  <Trash2 className="size-3.5" />
                  Delete
                </Button>
              ),
            },
          ].map(({ label, description, action }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 p-5"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-ui font-semibold">{label}</span>
                <p className="text-body-sm">{description}</p>
              </div>
              <div className="shrink-0">{action}</div>
            </div>
          ))}
        </div>
      }
      code={[
        `<div className="rounded-xl border border-border bg-card`,
        `             divide-y divide-border">`,
        ``,
        `  {rows.map(({ label, description, action }) => (`,
        `    <div`,
        `      key={label}`,
        `      className="flex items-center justify-between gap-4 p-5"`,
        `    >`,
        `      <div className="flex flex-col gap-0.5 min-w-0">`,
        `        <span className="text-ui font-semibold">{label}</span>`,
        `        <p className="text-body-sm">`,
        `          {description}`,
        `        </p>`,
        `      </div>`,
        `      <div className="shrink-0">{action}</div>`,
        `    </div>`,
        `  ))}`,
        ``,
        `  {/* action examples */}`,
        `  <Button variant="outline" size="sm">Configure</Button>`,
        `  <Button variant="destructive" size="sm">`,
        `    <Trash2 className="size-3.5" />`,
        `    Delete`,
        `  </Button>`,
        `</div>`,
      ]}
    />

    <Divider />

    {/* ── 05 Hero block ────────────────────────────────────────────────── */}
    <Pattern
      number="05"
      title="Hero block"
      description="The full system in one view. Gradient text for the headline, lead for the opening paragraph, two button variants for the CTA pair. The primary button drives the main action, the outline button offers the alternative. No color outside the system, no size outside the scale."
      preview={
        <div className="flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-2">
            <span className="text-label text-muted-foreground">
              Design guide
            </span>
            <h2 className="text-title text-gradient gradient-primary">
              Build UI that holds together.
            </h2>
          </div>
          <p className="text-lead max-w-md">
            A type system and color language designed to stay out of the way —
            until the moment it needs to say something.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="default">
              Get started
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="outline">Read the docs</Button>
          </div>
        </div>
      }
      code={[
        `<div className="flex flex-col gap-6 py-4">`,
        ``,
        `  <div className="flex flex-col gap-2">`,
        `    <span className="text-label text-muted-foreground">`,
        `      Design guide`,
        `    </span>`,
        `    <h2 className="text-title text-gradient gradient-primary">`,
        `      Build UI that holds together.`,
        `    </h2>`,
        `  </div>`,
        ``,
        `  <p className="text-lead max-w-md">`,
        `    A type system and color language designed to stay`,
        `    out of the way — until the moment it needs to`,
        `    say something.`,
        `  </p>`,
        ``,
        `  <div className="flex flex-wrap gap-3">`,
        `    <Button variant="default">`,
        `      Get started`,
        `      <ArrowRight className="size-4" />`,
        `    </Button>`,
        `    <Button variant="outline">`,
        `      Read the docs`,
        `    </Button>`,
        `  </div>`,
        `</div>`,
      ]}
    />

    {/* ── End of guide ─────────────────────────────────────────────────── */}
    <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-2">
      <span className="text-label text-muted-foreground">You made it</span>
      <h2 className="text-subtitle">That&apos;s the system.</h2>
      <p className="text-body-sm">
        Tokens, scale, and composition. Everything else in the codebase is these
        three ideas applied repeatedly. When something feels off, it&apos;s
        almost always one of the three rules from{' '}
        <Link
          href={ROUTES.public.docs.design.fundamentals}
          className="text-link"
        >
          Fundamentals
        </Link>{' '}
        being skipped.
      </p>
    </div>
  </main>
);

export default CompositionPage;
