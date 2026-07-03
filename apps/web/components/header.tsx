import Button from '@repo/ui/button';
import { NavSidebarButton } from '@repo/ui/navSidebar';

import ROUTES, {
  DEFAULT_AUTHENTICATED_ROUTE,
  DEFAULT_PUBLIC_ROUTE,
} from '../common/routes';
import { UserContextData } from '../lib/userContext';
import UserMenu from './userMenu';

type HeaderVariant = 'public' | 'authenticated' | 'authFlow';

type HeaderProps = {
  variant: HeaderVariant;
  user?: UserContextData | null;
};

const Header = ({ variant, user }: HeaderProps) => (
  <header className="sticky top-0 z-50 shrink-0 w-full border-b border-border bg-background/80 backdrop-blur-md">
    <nav className="mx-auto flex h-(--header-height) max-w-5xl items-center justify-between px-6">
      {variant === 'authenticated' && <NavSidebarButton />}

      <Button
        variant="ghost"
        href={
          variant === 'authenticated'
            ? DEFAULT_AUTHENTICATED_ROUTE
            : DEFAULT_PUBLIC_ROUTE
        }
        className="flex items-center gap-2"
      >
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
              as="nextLink"
              href={ROUTES.public.auth.signin}
            >
              Sign in
            </Button>
            <Button as="nextLink" href={ROUTES.public.auth.signup}>
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
