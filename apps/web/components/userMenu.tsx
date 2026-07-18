'use client';

import BaseUserMenu, { UserMenuItem } from '@repo/ui/userMenu/userMenu';
import { LogOut, Settings } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

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

  return <BaseUserMenu user={user} items={items} currentPath={pathname} />;
};

export default UserMenu;
