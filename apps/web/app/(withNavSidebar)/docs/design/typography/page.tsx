// ─── Helpers ─────────────────────────────────────────────────────────────────

import Link from 'next/link';

import ROUTES from '../../../../../common/routes';
import CodeDiff from '../../../../../components/codeDiff';

const Divider = () => <hr className="border-border" />;

type ScaleItem = {
  className: string;
  sample: string;
  class: string;
  description: string;
};

const ScaleGroup = ({
  title,
  items,
}: {
  title: string;
  items: ScaleItem[];
}) => (
  <div className="flex flex-col gap-2">
    <span className="text-label text-muted-foreground">{title}</span>
    <div className="rounded-xl border border-border bg-card px-5">
      {items.map((item) => (
        <div
          key={item.class}
          className="flex flex-col gap-1 border-b border-border py-4 last:border-0"
        >
          <div className="flex items-start justify-between gap-4">
            <span className={item.className}>{item.sample}</span>
            <code className="text-mono text-muted-foreground shrink-0 mt-0.5">
              .{item.class}
            </code>
          </div>
          <p className="text-body-xs text-muted-foreground">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  </div>
);

// ─── Pairing card ─────────────────────────────────────────────────────────────

const PairingCard = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border border-border bg-card p-6">{children}</div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const TypographyPage = () => (
  <main className="mx-auto flex max-w-2xl flex-col gap-16 px-6 pb-32 pt-16">
    {/* ── Opening ──────────────────────────────────────────────────────── */}
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="text-label text-muted-foreground">Design guide</span>
        {/* Adding some padding to the bottom, we make sure the box size covers
            the entire letters, so the y, p and g don't get clipped */}
        <h1 className="text-display text-gradient gradient-primary pb-2">
          Typography
        </h1>
      </div>

      <blockquote className="border-l-2 border-border pl-5">
        <p className="text-lead italic">
          &ldquo;Learn the rules like a pro, so you can break them like an
          artist.&rdquo;
        </p>
        <footer className="mt-3">
          <span className="text-body-sm text-muted-foreground">
            — Pablo Picasso
          </span>
        </footer>
      </blockquote>

      <p className="text-body">
        Typography isn&apos;t about picking a nice font. It&apos;s about making
        hierarchy legible without the reader noticing it exists. When the scale
        works, people read. When it doesn&apos;t, they scan, lose the thread,
        and leave. The classes below are the rules. Learn them first — the
        artist part comes later.
      </p>
    </section>

    <Divider />

    {/* ── The scale: headings ──────────────────────────────────────────── */}
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-heading">The scale</h2>
        <p className="text-body">
          Thirteen classes. Every typographic need in the system covered. If you
          find yourself reaching for an arbitrary size, the scale probably has
          what you need and you haven&apos;t found it yet.
        </p>
      </div>

      <ScaleGroup
        title="Headings"
        items={[
          {
            className: 'text-display',
            sample: 'Display',
            class: 'text-display',
            description:
              'One per page. Headlines that stop scrolling. Never inside a card.',
          },
          {
            className: 'text-title',
            sample: 'Title',
            class: 'text-title',
            description: 'Section openers, hero subheads, page-level headings.',
          },
          {
            className: 'text-heading',
            sample: 'Heading',
            class: 'text-heading',
            description: 'Major content divisions. The h2 of the system.',
          },
          {
            className: 'text-subheading',
            sample: 'Subheading',
            class: 'text-subheading',
            description: 'Card headers, sidebar titles, modal headings.',
          },
          {
            className: 'text-subtitle',
            sample: 'Subtitle',
            class: 'text-subtitle',
            description:
              'The smallest heading that still reads as a heading. Use below subheading.',
          },
        ]}
      />

      <ScaleGroup
        title="Body"
        items={[
          {
            className: 'text-lead',
            sample: 'The first paragraph sets the pace. Give it room.',
            class: 'text-lead',
            description:
              'The first paragraph after a heading. One per section.',
          },
          {
            className: 'text-body',
            sample: 'The main content voice. Comfortable to read at length.',
            class: 'text-body',
            description: 'Everything that needs to be read, not just scanned.',
          },
          {
            className: 'text-body-sm',
            sample: 'Secondary text, descriptions, helper copy.',
            class: 'text-body-sm',
            description: 'Supporting text. Never for primary content.',
          },
          {
            className: 'text-body-xs',
            sample: 'Timestamps, metadata, fine print.',
            class: 'text-body-xs',
            description: 'The floor. Anything smaller stops being readable.',
          },
        ]}
      />

      <ScaleGroup
        title="Utility"
        items={[
          {
            className: 'text-label',
            sample: 'Section label',
            class: 'text-label',
            description:
              'Eyebrows, tags, category markers. Always uppercase, always small.',
          },
          {
            className: 'text-ui',
            sample: 'Button · Nav item · Tab',
            class: 'text-ui',
            description: 'Interactive elements. Not for static content.',
          },
          {
            className: 'text-mono',
            sample: 'const scale = "intentional"',
            class: 'text-mono',
            description:
              'Code, technical values, numeric data that needs to align.',
          },
        ]}
      />
    </section>

    <Divider />

    {/* ── Pairings ─────────────────────────────────────────────────────── */}
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-heading">Pairing</h2>
        <p className="text-body">
          Individual classes are the vocabulary. Pairing is the grammar. These
          three combinations cover most of what you&apos;ll build — the scale
          was designed so any heading naturally accepts any body class without
          adjustment.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Pairing 1: hero */}
        <PairingCard>
          <span className="text-label">Landing / hero</span>
          <div className="mt-3 flex flex-col gap-2">
            <h2 className="text-title">The interface is the argument.</h2>
            <p className="text-lead">
              Every layout decision either supports the content or quietly
              fights it. The ones that don&apos;t make the writing feel like it
              was always meant to live there.
            </p>
          </div>
          <div className="mt-4 flex gap-3">
            <code className="text-mono text-muted-foreground">text-title</code>
            <span className="text-muted-foreground/40">+</span>
            <code className="text-mono text-muted-foreground">text-lead</code>
          </div>
        </PairingCard>

        {/* Pairing 2: card */}
        <PairingCard>
          <span className="text-label">Card / panel</span>
          <div className="mt-3 flex flex-col gap-1.5">
            <h3 className="text-subheading">Semantic tokens</h3>
            <p className="text-body-sm">
              Tokens describe role, not appearance. When the theme changes, your
              component doesn&apos;t.
            </p>
          </div>
          <div className="mt-4 flex gap-3">
            <code className="text-mono text-muted-foreground">
              text-subheading
            </code>
            <span className="text-muted-foreground/40">+</span>
            <code className="text-mono text-muted-foreground">
              text-body-sm
            </code>
          </div>
        </PairingCard>

        {/* Pairing 3: eyebrow + display */}
        <PairingCard>
          <span className="text-label">Eyebrow / statement</span>
          <div className="mt-3 flex flex-col gap-2">
            <span className="text-label text-muted-foreground">
              Design guide
            </span>
            <p className="text-display leading-none">Typography</p>
          </div>
          <div className="mt-4 flex gap-3">
            <code className="text-mono text-muted-foreground">text-label</code>
            <span className="text-muted-foreground/40">+</span>
            <code className="text-mono text-muted-foreground">
              text-display
            </code>
          </div>
        </PairingCard>
      </div>
    </section>

    <Divider />

    {/* ── Rhythm ───────────────────────────────────────────────────────── */}
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-heading">Rhythm</h2>
        <p className="text-body">
          Each class ships with a{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            leading
          </code>{' '}
          value tuned to sit correctly next to the classes above and below it in
          the scale. Don&apos;t override line height unless you&apos;re certain
          you know why.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <CodeDiff
          badCode={[
            `<h2 className="text-subheading`,
            `          leading-none">`,
            `  Semantic tokens`,
            `</h2>`,
            `<p className="text-body-sm`,
            `   leading-10">`,
            `  Tokens describe role...`,
            `</p>`,
          ]}
          goodCode={[
            `<h2 className="text-subheading">`,
            `  Semantic tokens`,
            `</h2>`,
            ``,
            `<p className="text-body-sm`,
            `   text-muted-foreground">`,
            `  Tokens describe role...`,
            `</p>`,
          ]}
        />
      </div>
    </section>

    <Divider />

    {/* ── When to break the rules ──────────────────────────────────────── */}
    <section className="flex flex-col gap-4">
      <h2 className="text-heading">When to break the rules</h2>
      <p className="text-body">
        Sometimes a marketing hero, a pull quote, or a data dashboard needs
        something the scale doesn&apos;t cover. That&apos;s fine — the rule
        isn&apos;t &ldquo;never use arbitrary sizes,&rdquo; it&apos;s
        &ldquo;know exactly why you&apos;re doing it and do it once.&rdquo; When
        you go off-scale, say so:
      </p>
      <div className="rounded-xl border border-border bg-card">
        <div className="py-2">
          {[
            `{/* one-off: marketing hero needs more weight than text-display`,
            `    provides — intentional, do not refactor */}`,
            `<h1 className="text-[80px] font-black tracking-[-0.04em]">`,
            `  Ship faster.`,
            `</h1>`,
          ].map((line, i) => (
            <div key={i} className="flex gap-3 px-4 py-0.5">
              <code className="whitespace-pre font-mono text-xs leading-6 text-muted-foreground">
                {line}
              </code>
            </div>
          ))}
        </div>
      </div>
      <p className="text-body-sm">
        The comment is not optional. It tells the next person — and future you —
        that this wasn&apos;t a mistake or a gap in the system. It was a choice.
      </p>
    </section>

    {/* ── Next ─────────────────────────────────────────────────────────── */}
    <Link
      href={ROUTES.public.docs.design.colors}
      className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 transition-colors duration-200 hover:bg-accent"
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-label text-muted-foreground">Up next</span>
        <span className="text-subtitle">Colors</span>
        <p className="text-body-sm">
          Brand tokens, semantic tokens, when each one applies.
        </p>
      </div>
      <span className="shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1">
        →
      </span>
    </Link>
  </main>
);

export default TypographyPage;
