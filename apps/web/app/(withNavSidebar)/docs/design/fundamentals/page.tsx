import Link from 'next/link';

import ROUTES from '../../../../../common/routes';
import CodeDiff from '../../../../../components/codeDiff';

const Divider = () => <hr className="border-border" />;

const Rule = ({
  number,
  title,
  rationale,
  children,
}: {
  number: string;
  title: string;
  rationale: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-1">
      <span className="text-label text-muted-foreground">{number}</span>
      <h3 className="text-subheading">{title}</h3>
      <p className="text-body-sm text-muted-foreground">{rationale}</p>
    </div>
    {children}
  </div>
);

const FundamentalsPage = () => (
  <main className="mx-auto flex max-w-2xl flex-col gap-16 px-6 pb-32 pt-16">
    {/* ── Opening ─────────────────────────────────────────────────────── */}
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="text-label text-muted-foreground">Design guide</span>
        <h1 className="text-display text-gradient gradient-primary">
          Fundamentals
        </h1>
      </div>

      <blockquote className="border-l-2 border-border pl-5">
        <p className="text-lead italic text-muted-foreground">
          &ldquo;You didn&apos;t come here to make the choice, you&apos;ve
          already made it. You&apos;re here to understand why you made
          it.&rdquo;
        </p>
        <footer className="mt-3">
          <span className="text-body-sm text-muted-foreground">
            — The Oracle, The Matrix Reloaded
          </span>
        </footer>
      </blockquote>
    </section>

    <Divider />

    {/* ── The trap ─────────────────────────────────────────────────────── */}
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h2 className="text-heading">The trap</h2>
        <div className="text-body-sm text-muted-foreground">
          <p>
            Tailwind gives you thirty shades of gray and ten font sizes.
            That&apos;s not a design system. That&apos;s a palette of decisions
            waiting to diverge.
          </p>
          <p>
            In an ideal world, a designer hands you a framework before you write
            a single line. Two font sizes, one gray scale, a spacing grid.
            You&apos;d take the time to set it up properly. That has never
            happened to anyone, ever.
          </p>
          <p>
            Instead you open the repo, pick a text size that looks about right,
            and move on. If you&apos;re working alone, you might stay consistent
            — you&apos;ll at least imitate yourself. Add one more person and
            you&apos;ve already forked. Everyone makes slightly different calls,
            none of them wrong exactly, all of them quietly incompatible.
          </p>
          <p>
            Three weeks later you have twenty variations of body text, fifteen
            hardcoded colors, and a codebase that&apos;s already teaching bad
            habits to the next person who opens it. Technical debt before
            you&apos;ve built a single form.
          </p>
          <p>
            The PabloTor Platform does the heavy lifting upfront. Sensible
            defaults that cover ninety percent of what you need — and a clear
            path to expand the other ten when you get there.
          </p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <CodeDiff
          badCode={[
            `<div className="`,
            `  bg-white`,
            `  rounded-[8px]`,
            `  p-[18px]`,
            `">`,
            `  <p className="`,
            `    text-[15px]`,
            `    text-gray-500`,
            `    leading-6`,
            `  ">`,
          ]}
          goodCode={[
            `<div className="`,
            `  bg-card`,
            `  rounded-lg`,
            `  p-4`,
            `">`,
            `  <p className="`,
            `    text-body-sm`,
            `    text-muted-foreground`,
            `  ">`,
          ]}
          labels={{
            bad: 'Chaos',
            good: 'Choice',
          }}
        />
      </div>

      <p className="text-body-sm text-muted-foreground">
        The right side isn&apos;t shorter by accident. Fewer decisions made
        means fewer decisions that can drift.
      </p>
    </section>

    <Divider />

    {/* ── Three rules ──────────────────────────────────────────────────── */}
    <section className="flex flex-col gap-12">
      <h2 className="text-heading">Three rules. That&apos;s it.</h2>

      <Rule
        number="01"
        title="Tokens over values"
        rationale="bg-card survives a rebrand. bg-white doesn't. Semantic tokens describe role, not appearance — which means they stay correct when the design changes underneath them."
      >
        <CodeDiff
          badCode={[`<div className="bg-white text-gray-900">`]}
          goodCode={[`<div className="bg-card text-card-foreground">`]}
        />
      </Rule>

      <Rule
        number="02"
        title="Scale over sizes"
        rationale="text-subtitle and text-body-sm were designed to coexist. text-[18px] and text-[13px] are a coincidence waiting to be noticed."
      >
        <CodeDiff
          badCode={[`<h2 className="text-[22px] font-semibold leading-7">`]}
          goodCode={[`<h2 className="text-subheading">`]}
        />
      </Rule>

      <Rule
        number="03"
        title="System spacing over gut feeling"
        rationale="rounded-md is a decision. rounded-[6px] is a guess. The radius scale exists so every surface in the UI feels like it belongs to the same object."
      >
        <CodeDiff
          badCode={[`<div className="rounded-[6px] p-[14px]">`]}
          goodCode={[`<div className="rounded-md p-3.5">`]}
        />
      </Rule>
    </section>

    <Divider />

    {/* ── What this guide covers ───────────────────────────────────────── */}
    <section className="flex flex-col gap-6">
      <h2 className="text-heading">What&apos;s next</h2>
      <div className="flex flex-col gap-2">
        {[
          {
            href: ROUTES.public.docs.design.typography,
            label: 'Typography',
            description:
              'The scale, the classes, how to combine them without thinking.',
          },
          {
            href: ROUTES.public.docs.design.colors,
            label: 'Colors',
            description:
              'Brand tokens, semantic tokens, when each one applies.',
          },
          {
            href: ROUTES.public.docs.design.composition,
            label: 'Composition',
            description: 'Real UI patterns built from nothing but the system.',
          },
        ].map(({ href, label, description }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 transition-colors duration-200 hover:bg-accent"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-ui font-semibold">{label}</span>
              <span className="text-body-sm text-muted-foreground">
                {description}
              </span>
            </div>
            <span className="shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  </main>
);

export default FundamentalsPage;
