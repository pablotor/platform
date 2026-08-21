import Button from '@repo/ui/button';
import { NavSidebarButton } from '@repo/ui/navSidebar';
import Link from 'next/link';

import ROUTES, {
  DEFAULT_AUTHENTICATED_ROUTE,
  DEFAULT_PUBLIC_ROUTE,
} from '../common/routes';
import { UserContextData } from '../lib/userContext';
import UserMenu from './userMenu';

type HeaderVariant = 'public' | 'authenticated' | 'authFlow';

type HeaderProps = {
  variant: HeaderVariant;
  withNavSidebar?: boolean;
  user?: UserContextData | null;
};

const Header = ({ variant, withNavSidebar, user }: HeaderProps) => (
  <header className="sticky top-0 z-50 shrink-0 w-full border-b border-border bg-background/80 backdrop-blur-md">
    <nav className="mx-auto flex h-(--header-height) max-w-5xl items-center justify-between px-6">
      {withNavSidebar && <NavSidebarButton />}

      <Button
        variant="ghost"
        as={Link}
        href={
          variant === 'authenticated'
            ? DEFAULT_AUTHENTICATED_ROUTE
            : DEFAULT_PUBLIC_ROUTE
        }
        className="flex items-center gap-2"
      >
        {/* one-off: logo — intentional, do not refactor */}
        <span className="text-lg font-bold tracking-tight">
          <span className="gradient-primary text-gradient">PabloTor</span>{' '}
          <span className="text-muted-foreground font-light">Platform</span>
        </span>
      </Button>

      <div className="flex items-center gap-2">
        {variant === 'public' ? (
          <>
            <Button
              variant="outline"
              as={Link}
              href={ROUTES.public.auth.signin}
            >
              Sign in
            </Button>
            <Button as={Link} href={ROUTES.public.auth.signup}>
              Sign up
            </Button>
          </>
        ) : (
          variant === 'authenticated' && user && <UserMenu user={user} />
        )}
      </div>
    </nav>
  </header>
);

export default Header;
