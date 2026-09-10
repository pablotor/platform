import Button from '@repo/ui/button';
import Link from 'next/link';

import ROUTES from '../common/routes';

type HeroProps = {
  isAuthenticated?: boolean;
};

const Hero = ({ isAuthenticated }: HeroProps) => (
  <section className="mx-auto flex max-w-5xl flex-col items-center justify-center px-6 py-10 text-center">
    <span className="mb-6 inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-ui text-muted-foreground animate-fade-in">
      An elegant platform... for a more civilized age
    </span>

    <h1 className="max-w-3xl text-balance text-title sm:text-display">
      Build, ship and scale the platform of your{' '}
      {/* gradient that cycles blue→indigo then purple→pink */}
      <span className="text-gradient animate-switch-gradient">tech utopia</span>
      .
    </h1>

    <p className="mt-6 max-w-xl text-pretty text-lead text-muted-foreground">
      PabloTor Platform Demo is a tiny showcase of authentication and clean,
      developer-first design. Create an account to see it in action.
    </p>

    <div className="mt-8 flex items-center gap-3">
      <Button
        variant="outline"
        size="lg"
        as={Link}
        href={ROUTES.public.docs.root}
      >
        Docs
      </Button>
      <Button
        variant={isAuthenticated ? 'outline' : 'default'}
        size="lg"
        as={Link}
        href={ROUTES.public.blog.root}
      >
        Blog
      </Button>
      {isAuthenticated && (
        <Button size="lg" as={Link} href={ROUTES.authenticated.dashboard.root}>
          Dashboard
        </Button>
      )}
    </div>

    <div className="mt-14 grid w-full max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
      {[
        {
          title: 'Open-source',
          body: 'Fully transparent codebase you can inspect, extend, and contribute to freely.',
        },
        {
          title: 'Self-hosted',
          body: 'Run everything on your own infrastructure with full control over data and deployment.',
        },
        {
          title: 'Opinionated',
          body: 'Strong defaults and structure that guide decisions and reduce setup friction.',
        },
      ].map((f) => (
        <div key={f.title} className="bg-background p-6 text-left">
          <h3 className="text-subtitle">{f.title}</h3>
          <p className="text-body-sm text-muted-foreground mt-2">{f.body}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Hero;
