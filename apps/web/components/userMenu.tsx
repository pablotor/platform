'use client';

import BaseUserMenu, { UserMenuItem } from '@repo/ui/userMenu/userMenu';
import { LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import ROUTES from '../common/routes';
import authClient from '../lib/authClient';
import { UserContextData } from '../lib/userContext';

type UserMenuProps = {
  user: UserContextData;
};

const UserMenu = ({ user }: UserMenuProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.refresh();
    router.push('/');
  };

  const items: UserMenuItem = [
    {
      asChild: true,
      disabled: true,
      children: (
        <Link href={ROUTES.authenticated.dashboard.root}>
          <Settings size={15} strokeWidth={2} /> Settings
        </Link>
      ),
    },
    {
      label: 'Log out',
      icon: <LogOut size={15} strokeWidth={2} />,
      onSelect: handleSignOut,
      variant: 'destructive',
      separatorBefore: true,
    },
  ];

  return <BaseUserMenu user={user} items={items} currentPath={pathname} />;
};

export default UserMenu;
