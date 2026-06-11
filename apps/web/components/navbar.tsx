'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Settings } from 'lucide-react';
import Button from '@repo/ui/button';
import UserMenu, { type UserMenuItem } from '@repo/ui/userMenu';
import authClient from '../lib/auth-client';

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.refresh();
    router.push('/');
  };

  const items: UserMenuItem = [
    {
      label: 'Settings',
      icon: <Settings size={15} strokeWidth={2} />,
      // onSelect: () => router.push('/settings'),
      disabled: true,
    },
    {
      label: 'Log out',
      icon: <LogOut size={15} strokeWidth={2} />,
      onSelect: handleSignOut,
      variant: 'destructive',
      separatorBefore: true,
    },
  ];

  return (
    <header className="sticky top-0 z-10 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight">
            <span className="gradient-a gradient-text">PabloTor</span>{' '}
            <span className="text-muted-foreground font-light">Platform</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {isPending ? (
            <div
              className="h-8 w-20 animate-pulse rounded-lg bg-muted"
              aria-hidden="true"
            />
          ) : session?.user ? (
            <UserMenu user={session.user} items={items} />
          ) : (
            <>
              <Button variant="ghost" as="nextLink" href="/signin">
                Sign in
              </Button>
              <Button as="nextLink" href="/signup">
                Sign up
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
