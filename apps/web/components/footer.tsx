import Link from 'next/link';

import ROUTES from '../common/routes';
import GithubLogo from './logos/github';
import PablotorLogo from './logos/pablotor';
import PoweredBy from './poweredBy';

const Footer = () => {
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL;

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 pt-6 pb-12">
        {/* Top row: wordmark + nav */}
        <div className="flex justify-between items-center">
          {/* Nav links */}
          <nav aria-label="Footer navigation" className="flex flex-col">
            <Link
              href={ROUTES.public.blog.root}
              className="text-link text-body-sm"
            >
              Blog
            </Link>
            <Link
              href={ROUTES.public.docs.root}
              className="text-link text-body-sm"
            >
              Docs
            </Link>
            <Link
              href={ROUTES.authenticated.dashboard.root}
              className="text-link text-body-sm"
            >
              Dashboard
            </Link>
          </nav>
          <PablotorLogo variant="vertical" />
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-border" />

        {/* Bottom row: copyright + powered by + github */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-col gap-1 sm:flex-row flex sm:items-center sm:gap-3">
            <span className="text-body-xs text-muted-foreground">
              © 2026 PabloTor. All rights reserved.
            </span>
            <span className="hidden text-muted-foreground/40 sm:inline">·</span>
            <PoweredBy />
          </div>

          {githubUrl && (
            <Link
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:focusable-outline rounded-lg"
            >
              <GithubLogo className="size-4" />
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
