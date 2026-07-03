'use client';

import { useRouter } from 'next/navigation';
import { LogOut, Settings } from 'lucide-react';
import BaseUserMenu, {
  type UserMenuItem,
} from '../../../packages/ui/dist/userMenu/userMenu';
import authClient from '../lib/authClient';
import { UserContextData } from '../lib/userContext';

type UserMenuProps = {
  user: UserContextData;
};

const UserMenu = ({ user }: UserMenuProps) => {
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

  return <BaseUserMenu user={user} items={items} />;
};

export default UserMenu;
