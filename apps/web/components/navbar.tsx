'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import Button from '@repo/ui/button';
import authClient from '../lib/auth-client';

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.refresh();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
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
            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
                <User className="size-4" aria-hidden="true" />
                {session.user.name || session.user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut aria-hidden="true" />
                Sign out
              </Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" as="nextLink" href="/signin">
                Sign in
              </Button>
              <Button size="sm" as="nextLink" href="/signup">
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
