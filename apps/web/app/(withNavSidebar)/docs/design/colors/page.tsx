import Link from 'next/link';

import ROUTES from '../../../../../common/routes';
import CodeDiff from '../../../../../components/codeDiff';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const Divider = () => <hr className="border-border" />;

// ─── Token card ───────────────────────────────────────────────────────────────

const TokenCard = ({
  token,
  role,
  children,
}: {
  token: string | string[];
  role: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap gap-1.5">
        {(Array.isArray(token) ? token : [token]).map((t) => (
          <code key={t} className="text-mono rounded bg-muted px-1.5 py-0.5">
            {t}
          </code>
        ))}
      </div>
      <p className="text-label text-muted-foreground">{role}</p>
    </div>
    <p className="text-body-sm text-muted-foreground">{children}</p>
  </div>
);

// ─── Gradient strip ───────────────────────────────────────────────────────────

const GradientStrip = ({
  className,
  label,
  tokens,
  note,
}: {
  className: string;
  label: string;
  tokens: string[];
  note: string;
}) => (
  <div className="flex flex-col gap-2">
    <div className={`${className} h-14 w-full rounded-xl`} />
    <div className="flex flex-col gap-1 px-1">
      <span className="text-ui">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {tokens.map((t) => (
          <code key={t} className="text-mono text-muted-foreground">
            {t}
          </code>
        ))}
      </div>
      <p className="text-body-xs text-muted-foreground">{note}</p>
    </div>
  </div>
);

// ─── Brand swatch ─────────────────────────────────────────────────────────────

const BrandFamily = ({
  label,
  swatches,
}: {
  label: string;
  swatches: { bg: string; token: string; note: string }[];
}) => (
  <div className="flex flex-col gap-3">
    <span className="text-label text-muted-foreground">{label}</span>
    <div className="grid grid-cols-3 gap-2">
      {swatches.map(({ bg, token, note }) => (
        <div key={token} className="flex flex-col gap-2">
          <div className={`${bg} h-16 w-full rounded-xl`} />
          <div className="flex flex-col gap-0.5 px-0.5">
            <code className="text-mono">{token}</code>
            <span className="text-body-xs text-muted-foreground">{note}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const ColorsPage = () => (
  <main className="mx-auto flex max-w-2xl flex-col gap-16 px-6 pb-32 pt-16">
    {/* ── Opening ──────────────────────────────────────────────────────── */}
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="text-label text-muted-foreground">Design guide</span>
        <h1 className="text-display text-gradient gradient-primary">Colors</h1>
      </div>

      <blockquote className="border-l-2 border-border pl-5">
        <p className="text-lead italic">
          &ldquo;The strength of a color comes from its context.&rdquo;
        </p>
        <footer className="mt-3">
          <span className="text-body-sm text-muted-foreground">
            — Josef Albers, Interaction of Color
          </span>
        </footer>
      </blockquote>

      <p className="text-body">
        Color in a UI isn&apos;t decoration — it&apos;s communication. Every
        choice tells the user something: this is interactive, this is dangerous,
        this is background, this is content. Albers spent a career proving that
        no color exists in isolation. That&apos;s exactly the argument for
        semantic tokens:{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
          text-muted-foreground
        </code>{' '}
        isn&apos;t a color — it&apos;s a relationship. Use raw values and you
        make that relationship accidental. Use tokens and it&apos;s intentional
        by default.
      </p>
    </section>

    <Divider />

    {/* ── Brand colors ─────────────────────────────────────────────────── */}
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-heading">Brand colors</h2>
        <p className="text-body">
          Two families, three roles each. Within each family: a gradient start,
          a gradient end that doubles as the standalone fill, and an accent —
          the text-safe version of that family. Gradient stops are optimized for
          fills and backgrounds; they don&apos;t always carry enough contrast
          for text, which is why the accent exists separately.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <BrandFamily
          label="Primary family"
          swatches={[
            {
              bg: 'bg-brand-primary-from',
              token: 'brand-primary-from',
              note: 'Gradient start',
            },
            {
              bg: 'bg-brand-primary',
              token: 'brand-primary',
              note: 'Gradient end · fill',
            },
            {
              bg: 'bg-brand-primary-accent',
              token: 'brand-primary-accent',
              note: 'Text · accent',
            },
          ]}
        />

        <BrandFamily
          label="Secondary family"
          swatches={[
            {
              bg: 'bg-brand-secondary-from',
              token: 'brand-secondary-from',
              note: 'Gradient start',
            },
            {
              bg: 'bg-brand-secondary',
              token: 'brand-secondary',
              note: 'Gradient end · fill',
            },
            {
              bg: 'bg-brand-secondary-accent',
              token: 'brand-secondary-accent',
              note: 'Text · accent',
            },
          ]}
        />
      </div>
    </section>

    <Divider />

    {/* ── Gradients ────────────────────────────────────────────────────── */}
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-heading">Gradients</h2>
        <p className="text-body">
          Two gradients, one per family. Use them for large surfaces, hero
          backgrounds, and primary buttons. Avoid them on small UI elements,
          body text, or anything that needs to stay legible at small sizes.{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            text-gradient
          </code>{' '}
          is a composition utility — it clips a gradient background to the text
          outline. It&apos;s not a standalone class; pair it with{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            gradient-primary
          </code>{' '}
          or{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            gradient-secondary
          </code>
          .
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <GradientStrip
          className="gradient-primary"
          label="gradient-primary"
          tokens={['brand-primary-from', '→', 'brand-primary']}
          note="Primary buttons, hero fills, active nav items."
        />
        <GradientStrip
          className="gradient-secondary"
          label="gradient-secondary"
          tokens={['brand-secondary-from', '→', 'brand-secondary']}
          note="Accent buttons, decorative surfaces, gradient borders."
        />
      </div>
    </section>

    <Divider />

    {/* ── Semantic tokens ──────────────────────────────────────────────── */}
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-heading">Semantic tokens</h2>
        <p className="text-body">
          These six are the ones that require a judgment call. The rest —{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            border
          </code>
          ,{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            ring
          </code>
          ,{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            input
          </code>
          ,{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            popover
          </code>{' '}
          — are self-explanatory. Use them as named and move on.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <TokenCard
          token={['background', 'card']}
          role="Page surface vs raised surface"
        >
          Both resolve to white in light mode, but they mean different things.{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            background
          </code>{' '}
          is the page itself.{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            card
          </code>{' '}
          is a surface that sits on top of it. Use{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            card
          </code>{' '}
          for any contained element — panels, modals, form sections. The
          distinction matters in dark mode and on any future theme change.
        </TokenCard>

        <TokenCard
          token={['foreground', 'muted-foreground']}
          role="Primary content vs supporting content"
        >
          The most-used pair in the system.{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            foreground
          </code>{' '}
          is for content that needs to be read.{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            muted-foreground
          </code>{' '}
          is for content that supports it — timestamps, descriptions, helper
          text, labels. If you&apos;re unsure which to reach for, ask whether
          the text is the point or the context. The point gets{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            foreground
          </code>
          .
        </TokenCard>

        <TokenCard
          token={['secondary', 'muted']}
          role="Component background vs subdued surface"
        >
          Currently the same value — that&apos;s not a mistake, it&apos;s a
          starting point. They represent different concepts:{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            secondary
          </code>{' '}
          is the background for secondary buttons and similar components.{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            muted
          </code>{' '}
          is a subdued surface for static fills — code blocks, input
          backgrounds, tag chips. Use the right one for the right context so a
          future theme change can differentiate them without breaking
          everything.
        </TokenCard>

        <TokenCard
          token={['muted', 'accent']}
          role="Static fill vs interaction target"
        >
          The one people get wrong most often.{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            muted
          </code>{' '}
          is a static fill — it never changes in response to user interaction.{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            accent
          </code>{' '}
          is the hover color — deliberately a step darker so the state change is
          visible when coming from either{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            background
          </code>{' '}
          or{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            secondary
          </code>
          . If you&apos;re writing a hover state, it&apos;s{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            accent
          </code>
          . Always.
        </TokenCard>

        <TokenCard token="primary" role="Brand color · positive signal">
          In most systems,{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            primary
          </code>{' '}
          is just the brand color. Here it also carries the positive/success
          signal — the role a green would play elsewhere. That&apos;s a
          deliberate aesthetic choice: the brand blue reads as confident and
          constructive, the gradients carry in-between states, and adding a
          separate success green would introduce a third color family the system
          doesn&apos;t need. It trades convention for visual coherence. If you
          know the Bootstrap conventions, you&apos;ll notice — now you know it
          was intentional.
        </TokenCard>

        <TokenCard token="destructive" role="Irreversible actions only">
          Not a general warning color. Use it for actions that can&apos;t be
          undone — deleting an account, removing a record, revoking access. Form
          validation errors are fine too, since a failed submission blocks
          progress rather than destroying data. Avoid it for cautionary states,
          disabled actions, or anything the user can recover from without
          consequences. If it feels like it needs to be red but isn&apos;t
          irreversible, it probably just needs{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            muted-foreground
          </code>
          .
        </TokenCard>
      </div>
    </section>

    <Divider />

    {/* ── Do / don't ───────────────────────────────────────────────────── */}
    <section className="flex flex-col gap-6">
      <h2 className="text-heading">Do / don&apos;t</h2>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-label">Token over value</span>
          <div className="grid gap-3 sm:grid-cols-2">
            <CodeDiff
              badCode={[
                `<div className="`,
                `  bg-white`,
                `  text-gray-500`,
                `">`,
              ]}
              goodCode={[
                `<div className="`,
                `  bg-card`,
                `  text-muted-foreground`,
                `">`,
              ]}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-label">accent is for hover, not fill</span>
          <div className="grid gap-3 sm:grid-cols-2">
            <CodeDiff
              badCode={[
                `<div className="bg-accent">`,
                `  <p>Static content</p>`,
                `</div>`,
              ]}
              goodCode={[
                `<div className="`,
                `  bg-muted`,
                `  hover:bg-accent`,
                `">`,
                `  <p>Interactive content</p>`,
                `</div>`,
              ]}
            />
          </div>
        </div>
      </div>
    </section>

    {/* ── Next ─────────────────────────────────────────────────────────── */}
    <Link
      href={ROUTES.public.docs.design.composition}
      className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 transition-colors duration-200 hover:bg-accent"
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-label">Up next</span>
        <span className="text-subtitle">Composition</span>
        <p className="text-body-sm">
          Real UI patterns built from nothing but the system.
        </p>
      </div>
      <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-1">
        →
      </span>
    </Link>
  </main>
);

export default ColorsPage;
