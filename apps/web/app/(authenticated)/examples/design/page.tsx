import Button from '@repo/ui/button';
import Link from 'next/link';

// ─────────────────────────────────────────────────────────────────────────
// Layout helpers
// ─────────────────────────────────────────────────────────────────────────

const Divider = () => <hr className="border-border" />;

const Section = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <section className="flex flex-col gap-10 py-16">
    <span className="text-label text-muted-foreground">{label}</span>
    {children}
  </section>
);

// ─────────────────────────────────────────────────────────────────────────
// Typography specimen row
// ─────────────────────────────────────────────────────────────────────────

const TypeRow = ({
  className,
  sample,
  meta,
}: {
  className: string;
  sample: string;
  meta: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <span className={className}>{sample}</span>
    <span className="text-mono text-muted-foreground">{meta}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────
// Color swatch — explicit classes listed so Tailwind doesn't purge them
// ─────────────────────────────────────────────────────────────────────────

const BRAND_SWATCHES = [
  { bg: 'bg-brand-primary-from', label: 'brand-primary-from', hex: '#3b82f6' },
  { bg: 'bg-brand-primary', label: 'brand-primary', hex: '#4338ca' },
  {
    bg: 'bg-brand-primary-accent',
    label: 'brand-primary-accent',
    hex: '#4f46e5',
  },
  {
    bg: 'bg-brand-secondary-from',
    label: 'brand-secondary-from',
    hex: '#a855f7',
  },
  { bg: 'bg-brand-secondary', label: 'brand-secondary', hex: '#be185d' },
  {
    bg: 'bg-brand-secondary-accent',
    label: 'brand-secondary-accent',
    hex: '#ec4899',
  },
] as const;

const SEMANTIC_SWATCHES = [
  { bg: 'bg-background border border-border', label: 'background' },
  { bg: 'bg-foreground', label: 'foreground' },
  { bg: 'bg-card border border-border', label: 'card' },
  { bg: 'bg-primary', label: 'primary' },
  { bg: 'bg-secondary border border-border', label: 'secondary' },
  { bg: 'bg-muted border border-border', label: 'muted' },
  { bg: 'bg-accent border border-border', label: 'accent' },
  { bg: 'bg-destructive', label: 'destructive' },
] as const;

const Swatch = ({
  bg,
  label,
  hex,
}: {
  bg: string;
  label: string;
  hex?: string;
}) => (
  <div className="flex flex-col gap-2">
    <div className={`h-12 w-full rounded-lg ${bg}`} />
    <div className="flex flex-col">
      <span className="text-body-xs font-medium">{label}</span>
      {hex && <span className="text-mono text-muted-foreground">{hex}</span>}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────

const DesignPage = () => (
  <main className="mx-auto max-w-4xl px-6 pb-32">
    {/* ── Hero ─────────────────────────────────────────────────────────── */}
    <div className="flex flex-col gap-5 py-20">
      <span className="text-label text-muted-foreground">
        pablotor.dev / examples
      </span>
      <h1 className="text-display text-gradient gradient-primary">
        Design system
      </h1>
      <p className="text-lead text-muted-foreground max-w-lg">
        How type, color, and gradient utilities compose — from individual tokens
        to finished UI patterns.
      </p>
    </div>

    <Divider />

    {/* ── Typography: headings ─────────────────────────────────────────── */}
    <Section label="01 — Typography · Display & Headings">
      <div className="flex flex-col gap-12">
        <TypeRow
          className="text-display"
          sample="The interface is the argument."
          meta=".text-display — 6xl · bold · tracking −0.03em · leading 1.05"
        />
        <TypeRow
          className="text-h1"
          sample="The interface is the argument."
          meta=".text-h1 — 4xl · bold · tracking −0.02em · leading 1.15"
        />
        <TypeRow
          className="text-h2"
          sample="The interface is the argument."
          meta=".text-h2 — 3xl · semibold · tracking −0.015em"
        />
        <TypeRow
          className="text-h3"
          sample="The interface is the argument."
          meta=".text-h3 — 2xl · semibold · tracking −0.01em · leading 1.3"
        />
        <TypeRow
          className="text-h4"
          sample="The interface is the argument."
          meta=".text-h4 — xl · semibold · leading 1.4"
        />
      </div>
    </Section>

    <Divider />

    {/* ── Typography: body & utility ───────────────────────────────────── */}
    <Section label="02 — Typography · Body & Utility">
      <div className="flex flex-col gap-10">
        <TypeRow
          className="text-lead"
          sample="Every spacing decision either supports the content or quietly fights it. Most interfaces fight it."
          meta=".text-lead — xl · normal · leading relaxed"
        />
        <TypeRow
          className="text-body"
          sample="Every spacing decision either supports the content or quietly fights it. Most interfaces fight it. The ones that don't make the writing feel like it was always meant to live there — as if the layout arrived first and the words simply settled in."
          meta=".text-body — base · normal · leading 1.7"
        />
        <TypeRow
          className="text-body-sm text-muted-foreground"
          sample="Every spacing decision either supports the content or quietly fights it. Most interfaces fight it. The ones that don't make the writing feel like it was always meant to live there."
          meta=".text-body-sm — sm · normal · leading 1.65"
        />
        <TypeRow
          className="text-body-xs text-muted-foreground"
          sample="Last updated 26 June 2026 · 4 min read · Typography"
          meta=".text-body-xs — xs · normal · leading 1.6"
        />

        <div className="flex flex-col gap-5 border-t border-border pt-8">
          <TypeRow
            className="text-label text-muted-foreground"
            sample="Section label or eyebrow"
            meta=".text-label — xs · semibold · uppercase · tracking 0.07em"
          />
          <TypeRow
            className="text-ui"
            sample="Button · Nav item · Tab"
            meta=".text-ui — sm · medium"
          />
          <TypeRow
            className="text-mono text-muted-foreground"
            sample="const base = '/examples'"
            meta=".text-mono — font-mono · sm"
          />
        </div>
      </div>
    </Section>

    <Divider />

    {/* ── Gradients: backgrounds ───────────────────────────────────────── */}
    <Section label="03 — Gradients · Backgrounds">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="gradient-primary flex h-40 flex-col justify-end gap-1 rounded-2xl p-6">
          <span className="text-h3 text-white">.gradient-primary</span>
          <span className="text-body-xs text-white/70">
            brand-primary-from → brand-primary
          </span>
        </div>
        <div className="gradient-secondary flex h-40 flex-col justify-end gap-1 rounded-2xl p-6">
          <span className="text-h3 text-white">.gradient-secondary</span>
          <span className="text-body-xs text-white/70">
            brand-secondary-from → brand-secondary
          </span>
        </div>
      </div>
    </Section>

    <Divider />

    {/* ── Gradients: text ──────────────────────────────────────────────── */}
    <Section label="04 — Gradients · Text clipping">
      <div className="flex flex-col gap-3">
        <p className="text-body-sm text-muted-foreground">
          <span className="text-mono">.text-gradient</span> clips a gradient
          background to the text outline. Compose it with{' '}
          <span className="text-mono">.gradient-primary</span> or{' '}
          <span className="text-mono">.gradient-secondary</span>.
        </p>
        <div className="flex flex-col gap-2 pt-4">
          <span className="text-mono text-muted-foreground text-xs">
            .text-display .text-gradient .gradient-primary
          </span>
          <span className="text-display text-gradient gradient-primary">
            Craft.
          </span>
        </div>
        <div className="flex flex-col gap-2 pt-4">
          <span className="text-mono text-muted-foreground text-xs">
            .text-h1 .text-gradient .gradient-primary
          </span>
          <span className="text-h1 text-gradient gradient-primary">
            Built with intention.
          </span>
        </div>
        <div className="flex flex-col gap-2 pt-4">
          <span className="text-mono text-muted-foreground text-xs">
            .text-h1 .text-gradient .gradient-secondary
          </span>
          <span className="text-h1 text-gradient gradient-secondary">
            Designed to last.
          </span>
        </div>
        <div className="flex flex-col gap-2 pt-4">
          <span className="text-mono text-muted-foreground text-xs">
            .text-h2 .text-gradient .gradient-secondary
          </span>
          <span className="text-h2 text-gradient gradient-secondary">
            Every pixel earns its place.
          </span>
        </div>
      </div>
    </Section>

    <Divider />

    {/* ── Links ────────────────────────────────────────────────────────── */}
    <Section label="05 — Links">
      <div className="flex flex-col gap-6 max-w-2xl">
        <p className="text-body-sm text-muted-foreground">
          Links use <span className="text-mono">text-brand-primary-accent</span>{' '}
          at rest and shift to{' '}
          <span className="text-mono">text-brand-secondary-accent</span>
          with an underline on hover — color alone never carries the signal, the
          underline confirms it. Just{' '}
          <span className="text-mono">className=&quot;text-link&quot;</span> on
          an anchor or <span className="text-mono">next/link</span> — no
          component needed.
        </p>

        <p className="text-lead">
          We obsess over{' '}
          <a href="#" className="text-link">
            typography
          </a>{' '}
          so your readers never have to think about it.
        </p>

        <p className="text-body text-muted-foreground">
          Inline links sit naturally inside a paragraph, like this{' '}
          <Link href="/examples/design" className="text-link">
            link to this very page
          </Link>
          , without breaking the reading flow or needing extra spacing.
        </p>

        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6">
          <span className="text-label text-muted-foreground">
            Standalone link
          </span>
          <Link href="/dashboard" className="text-link text-h4 w-fit">
            Go to dashboard →
          </Link>
        </div>
      </div>
    </Section>

    <Divider />

    {/* ── Buttons ──────────────────────────────────────────────────────── */}
    <Section label="06 — Buttons">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <span className="text-label text-muted-foreground">Primary</span>
          <p className="text-body-sm text-muted-foreground max-w-md">
            Brand gradients. Hover intensifies the existing gradient via
            saturate + brightness rather than swapping it — gradients can&apos;t
            crossfade cleanly between two different backgrounds.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="default">Default</Button>
            <Button variant="accent">Accent</Button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-label text-muted-foreground">
            Secondary &amp; neutral
          </span>
          <p className="text-body-sm text-muted-foreground max-w-md">
            White or transparent backgrounds converge on one rule: switch to{' '}
            <span className="text-mono">muted</span> on hover.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-label text-muted-foreground">Destructive</span>
          <p className="text-body-sm text-muted-foreground max-w-md">
            Darkens rather than lightens on hover — signals weight and caution
            instead of inviting the click.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="destructive">Delete account</Button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-label text-muted-foreground">Sizes</span>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="xs">Extra small</Button>
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-label text-muted-foreground">States</span>
          <div className="flex flex-wrap items-center gap-3">
            <Button>Rest / hover / press me</Button>
            <Button disabled>Disabled</Button>
            <Button aria-expanded="true" variant="outline">
              Open (aria-expanded)
            </Button>
          </div>
        </div>
      </div>
    </Section>

    <Divider />

    {/* ── Color: brand ─────────────────────────────────────────────────── */}
    <Section label="07 — Color · Brand palette">
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        {BRAND_SWATCHES.map((s) => (
          <Swatch key={s.label} {...s} />
        ))}
      </div>
    </Section>

    <Divider />

    {/* ── Color: semantic ──────────────────────────────────────────────── */}
    <Section label="08 — Color · Semantic tokens">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {SEMANTIC_SWATCHES.map((s) => (
          <Swatch key={s.label} {...s} />
        ))}
      </div>
    </Section>

    <Divider />

    {/* ── Composition: hero ────────────────────────────────────────────── */}
    <Section label="09 — Composition · Hero pattern">
      <div className="rounded-2xl border border-border bg-card p-10 flex flex-col gap-6">
        <span className="text-label text-muted-foreground">New release</span>
        <h2 className="text-display text-gradient gradient-primary max-w-sm leading-[1.05]">
          Build for the long run.
        </h2>
        <p className="text-lead text-muted-foreground max-w-md">
          A type system and color language designed to stay out of the way —
          until the moment it needs to say something.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button variant="default">Get started</Button>
          <Button as="nextLink" href="/examples/design" variant="outline">
            Read the docs
          </Button>
        </div>
      </div>
    </Section>

    <Divider />

    {/* ── Composition: article cards ───────────────────────────────────── */}
    <Section label="10 — Composition · Article card pattern">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          {
            eyebrow: 'Typography',
            eyebrowClass: 'text-gradient gradient-primary',
            title: 'Why type scale matters more than typeface',
            body: 'Most teams agonize over font selection and breeze past the scale. The opposite order produces better results.',
            meta: '5 min read',
          },
          {
            eyebrow: 'Color',
            eyebrowClass: 'text-gradient gradient-secondary',
            title: 'Semantic tokens over raw values',
            body: 'Naming colors by role rather than value is the single change that makes a design system actually portable.',
            meta: '4 min read',
          },
        ].map((card) => (
          <article
            key={card.title}
            className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
          >
            <span className={`text-label ${card.eyebrowClass}`}>
              {card.eyebrow}
            </span>
            <h3 className="text-h4">{card.title}</h3>
            <p className="text-body-sm text-muted-foreground flex-1">
              {card.body}
            </p>
            <span className="text-body-xs text-muted-foreground">
              {card.meta}
            </span>
          </article>
        ))}
      </div>
    </Section>

    <Divider />

    {/* ── Composition: gradient border callout ─────────────────────────── */}
    <Section label="11 — Composition · Gradient border callout">
      <div className="flex flex-col gap-3">
        <p className="text-body-sm text-muted-foreground">
          Wrap a <span className="text-mono">bg-card</span> element in a{' '}
          <span className="text-mono">gradient-secondary p-px</span> container.
          The 1 px gradient shell reads as a border.
        </p>
        <div className="gradient-secondary rounded-2xl p-px">
          <div className="flex flex-col gap-3 rounded-[calc(1rem-1px)] bg-card p-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-label text-gradient gradient-secondary">
                Pro tip
              </span>
              <p className="text-h4">
                Pair{' '}
                <Link href="#" className="text-link text-h4">
                  .text-gradient
                </Link>{' '}
                with a 1 px gradient border.
              </p>
              <p className="text-body-sm text-muted-foreground max-w-sm">
                The outer shell carries the color; the inner surface stays
                neutral. Draws the eye without competing with the content.
              </p>
            </div>
            <Button variant="accent" className="shrink-0 whitespace-nowrap">
              See source ↑
            </Button>
          </div>
        </div>
      </div>
    </Section>
  </main>
);

export default DesignPage;
