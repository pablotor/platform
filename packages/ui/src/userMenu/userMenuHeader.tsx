/**
 * Shared components between the mobile and the desktop version
 */

import UserAvatar from './userAvatar';

export type UserMenuUser = {
  name: string;
  email: string;
  image?: string | null;
};

const UserMenuHeader = ({ user }: { user: UserMenuUser }) => (
  <div className="flex items-center gap-2.5 px-2 pb-2.5 pt-2">
    <UserAvatar imageUrl={user.image || undefined} name={user.name} size="lg" />
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="truncate text-sm font-semibold text-popover-foreground">
        {user.name}
      </span>
      <span className="truncate text-xs text-muted-foreground">
        {user.email}
      </span>
    </div>
  </div>
);

export default UserMenuHeader;
