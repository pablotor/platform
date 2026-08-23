import Button from '@repo/ui/button';
import { NavSidebarButton } from '@repo/ui/navSidebar';
import Link from 'next/link';

import ROUTES, {
  DEFAULT_AUTHENTICATED_ROUTE,
  DEFAULT_PUBLIC_ROUTE,
} from '../common/routes';
import { UserContextData } from '../lib/userContext';
import PablotorLogo from './logos/pablotor';
import UserMenu from './userMenu';

type HeaderVariant = 'public' | 'authenticated' | 'authFlow';

type HeaderProps = {
  variant: HeaderVariant;
  user?: UserContextData | null;
  logoText?: string;
  logoHref?: string;
  withNavSidebar?: boolean;
};

const Header = ({
  variant,
  logoText,
  logoHref,
  withNavSidebar,
  user,
}: HeaderProps) => (
  <header className="sticky top-0 z-50 shrink-0 w-full border-b border-border bg-background/80 backdrop-blur-md">
    <nav className="mx-auto flex h-(--header-height) max-w-5xl items-center justify-between px-6">
      {withNavSidebar && <NavSidebarButton />}

      <Button
        variant="ghost"
        as={Link}
        href={
          logoHref
            ? logoHref
            : variant === 'authenticated'
              ? DEFAULT_AUTHENTICATED_ROUTE
              : DEFAULT_PUBLIC_ROUTE
        }
        className="flex items-center gap-2"
      >
        <PablotorLogo text={logoText} />
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
