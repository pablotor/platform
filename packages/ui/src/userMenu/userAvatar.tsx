import * as Avatar from '@radix-ui/react-avatar';
import clsx from 'clsx';

const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

const UserAvatar = ({
  imageUrl,
  name,
  size = 'sm',
}: {
  imageUrl?: string;
  name: string;
  size?: 'sm' | 'lg';
}) => (
  <Avatar.Root
    className={clsx(
      'inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full',
      size === 'lg' ? 'size-10' : 'size-8',
    )}
  >
    <Avatar.Image
      className="h-full w-full object-cover"
      src={imageUrl}
      alt={name}
    />
    <Avatar.Fallback
      delayMs={0}
      className={clsx(
        'flex h-full w-full items-center justify-center bg-primary text-label text-primary-foreground',
        size === 'lg' && 'text-sm',
      )}
    >
      {getInitials(name)}
    </Avatar.Fallback>
  </Avatar.Root>
);

export default UserAvatar;
