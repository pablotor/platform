'use client';

import clsx from 'clsx';
import { useSidebar } from './provider';

const HamburgerButton = ({ className }: { className?: string }) => {
  const { open, toggle } = useSidebar();

  return (
    <button
      id="sidebar-toggle-button" // if you edit this id, update the sidebar component
      type="button"
      aria-label={open ? 'Close navigation' : 'Open navigation'}
      aria-expanded={open}
      onClick={toggle}
      className={clsx(
        'flex size-9 flex-col items-center justify-center gap-1.25 rounded-md md:hidden',
        'text-muted-foreground transition-colors cursor-pointer',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    >
      <span
        className={clsx(
          'block h-0.5 w-5 rounded-full bg-current transition-transform duration-300',
          open && 'translate-y-[6.5px] rotate-45',
        )}
      />
      <span
        className={clsx(
          'block h-0.5 w-5 rounded-full bg-current transition-opacity duration-300',
          open && 'opacity-0',
        )}
      />
      <span
        className={clsx(
          'block h-0.5 w-5 rounded-full bg-current transition-transform duration-300',
          open && 'translate-y-[-6.5px] -rotate-45',
        )}
      />
    </button>
  );
};

export default HamburgerButton;
