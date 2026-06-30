'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { useSidebar } from './provider';
import { NavGroupItem, NavItem, NavLinkItem } from './item';

const SidebarPanel = ({ items }: { items: NavItem[] }) => (
  <div className="flex h-full w-60 flex-col border-r border-sidebar-border bg-sidebar px-3 py-4">
    <nav className="flex flex-col gap-0.5">
      {items.map((item) =>
        item.type === 'group' ? (
          <NavGroupItem key={item.label} item={item} />
        ) : (
          <NavLinkItem key={item.href} item={item} />
        ),
      )}
    </nav>
  </div>
);

// Spring that mimics a native mobile sheet feel
const drawerSpring = {
  type: 'spring',
  damping: 28,
  stiffness: 220,
  mass: 0.8,
} as const;

type SidebarProps = {
  items: NavItem[];
};

const Sidebar = ({ items }: SidebarProps) => {
  const { open, close } = useSidebar();

  // drag-to-close: dismiss when swiped left beyond 80px
  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -80) close();
  };

  return (
    <>
      {/* ── Desktop: always visible in the document flow ── */}
      <aside className="hidden w-full sm:w-60 shrink-0 md:flex overflow-y-auto">
        <SidebarPanel items={items} />
      </aside>

      <Dialog.Root
        open={open}
        onOpenChange={(next) => {
          if (!next) close();
        }}
      >
        <AnimatePresence>
          {open && (
            <Dialog.Portal forceMount>
              <Dialog.Title className="sr-only">Navigation</Dialog.Title>

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

              <Dialog.Content
                asChild
                forceMount
                onPointerDownOutside={(e) => {
                  if (
                    e.target &&
                    'id' in e.target &&
                    e.target.id === 'sidebar-toggle-button'
                  ) {
                    e.preventDefault();
                  }
                }}
              >
                <motion.aside
                  aria-label="Navigation"
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={drawerSpring}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={{ left: 0.25, right: 0 }}
                  onDragEnd={handleDragEnd}
                  className="fixed bottom-0 left-0 top-(--header-height) z-40 md:hidden"
                >
                  <SidebarPanel items={items} />
                </motion.aside>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </>
  );
};

export default Sidebar;
