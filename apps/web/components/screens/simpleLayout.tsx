import Button from '@repo/ui/button';
import Link from 'next/link';

import ROUTES from '../../common/routes';

type SimpleLayoutProps = {
  title: string;
  content: string;
};

const SimpleLayout = ({ title, content }: SimpleLayoutProps) => (
  <section className="mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-6 py-10 text-center">
    <h4 className="max-w-2xl text-balance text-title sm:text-display">
      {title}
    </h4>

    <p className="mt-6 max-w-xl text-pretty text-body sm:text-lead text-muted-foreground">
      {content}
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
      <Button size="lg" as={Link} href={ROUTES.public.blog.root}>
        Blog
      </Button>
    </div>
  </section>
);

export default SimpleLayout;
