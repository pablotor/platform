'use client';

import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';

export interface SidebarContextValue {
  open: boolean;
  toggle: () => void;
  close: () => void;
}

type DrawerProps = {
  children: ReactNode;
  label: string;
  side?: 'left' | 'right';
};

const drawerSpring = {
  type: 'spring',
  damping: 28,
  stiffness: 220,
  mass: 0.8,
} as const;

export const createSidebar = (key: string) => {
  const Context = createContext<SidebarContextValue | null>(null);
  Context.displayName = `SidebarContext(${key})`;

  // Used to prevent Radix from treating the toggle button as an
  // "outside click" and immediately re-closing the drawer it just opened.
  const toggleButtonId = `${key}-sidebar-toggle-button`;

  const useSidebar = (): SidebarContextValue => {
    const ctx = useContext(Context);
    if (!ctx)
      throw new Error(
        `useSidebar must be used inside <Provider> for sidebar "${key}"`,
      );
    return ctx;
  };

  const Provider = ({ children }: PropsWithChildren) => {
    const [open, setOpen] = useState(false);
    const toggle = useCallback(() => setOpen((prev) => !prev), []);
    const close = useCallback(() => setOpen(false), []);

    return (
      <Context.Provider value={{ open, toggle, close }}>
        {children}
      </Context.Provider>
    );
  };
  Provider.displayName = `SidebarProvider(${key})`;

  const Drawer = ({ children, label, side = 'left' }: DrawerProps) => {
    const { open, close } = useSidebar();

    const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
      const threshold = 80;
      if (side === 'left' && info.offset.x < -threshold) close();
      if (side === 'right' && info.offset.x > threshold) close();
    };

    // Drive both enter and exit from the same value so the slide
    // direction is always correct regardless of which side we're on.
    const hiddenX = side === 'left' ? '-100%' : '100%';

    return (
      <Dialog.Root
        open={open}
        onOpenChange={(next) => {
          if (!next) close();
        }}
      >
        {/*
          AnimatePresence watches the open flag and lets Framer play the
          exit animation before the Portal unmounts.
          Without this, closing removes the DOM node instantly and no
          exit animation runs.
        */}
        <AnimatePresence>
          {open && (
            <Dialog.Portal forceMount>
              <Dialog.Title className="sr-only">{label}</Dialog.Title>

              {/* Backdrop */}
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="fixed inset-x-0 bottom-0 top-(--header-height) z-30 bg-black/40 backdrop-blur-sm md:hidden"
                />
              </Dialog.Overlay>

              {/* Drawer */}
              <Dialog.Content
                asChild
                forceMount
                onPointerDownOutside={(e) => {
                  // Suppress the Radix outside-click close when the event
                  // target is the toggle button — the button's own onClick
                  // already handles closing, and letting Radix also fire
                  // onOpenChange(false) here causes a double-toggle glitch.
                  const target = e.target as HTMLElement | null;
                  if (target?.id === toggleButtonId) e.preventDefault();
                }}
              >
                <motion.aside
                  aria-label={label}
                  // initial/animate/exit replace the open-ternary pattern.
                  // Since this node only exists while open === true (AnimatePresence
                  // controls mounting), we just describe where it comes from and
                  // where it goes — Framer handles the rest.
                  initial={{ x: hiddenX }}
                  animate={{ x: 0 }}
                  exit={{ x: hiddenX }}
                  transition={drawerSpring}
                  drag={open ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={{
                    left: side === 'left' ? 0.25 : 0,
                    right: side === 'right' ? 0.25 : 0,
                  }}
                  onDragEnd={handleDragEnd}
                  className={clsx(
                    // No hardcoded left-0 here — positionClass owns the
                    // horizontal anchor so right-side drawers actually work.
                    'fixed bottom-0 top-(--header-height) z-40 md:hidden',
                    side === 'left' ? 'left-0' : 'right-0',
                  )}
                >
                  {children}
                </motion.aside>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    );
  };
  Drawer.displayName = `SidebarDrawer(${key})`;

  return { Provider, Drawer, useSidebar, toggleButtonId };
};
