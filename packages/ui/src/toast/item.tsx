import * as RadixToast from '@radix-ui/react-toast';
import clsx from 'clsx';
import {
  CheckCircle2,
  Info,
  Loader2,
  LucideIcon,
  X,
  XCircle,
} from 'lucide-react';

import { dismiss } from './store';
import { ToastMode, ToastRecord } from './types';

const MODE_CONFIG: Record<
  ToastMode,
  { icon: LucideIcon; iconClassName: string }
> = {
  loading: {
    icon: Loader2,
    iconClassName: 'animate-spin text-muted-foreground',
  },
  info: {
    icon: Info,
    iconClassName: 'text-muted-foreground',
  },
  success: {
    icon: CheckCircle2,
    iconClassName: 'text-brand-indigo',
  },
  error: {
    icon: XCircle,
    iconClassName: 'text-destructive',
  },
};

const ToastItem = ({
  id,
  mode,
  content,
  duration,
  open,
}: Omit<ToastRecord, 'key'>) => {
  const { icon: Icon, iconClassName } = MODE_CONFIG[mode];

  return (
    <RadixToast.Root
      open={open}
      duration={duration === Infinity ? undefined : duration}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) dismiss(id);
      }}
      className={clsx(
        'group pointer-events-auto relative flex items-center gap-3',
        'rounded-xl border border-border bg-card p-4 text-card-foreground shadow-lg',
        'transition-all duration-200',
        'data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-2 data-[state=open]:fade-in',
        'data-[state=closed]:opacity-0 data-[state=closed]:translate-x-4',
        'data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x)',
        'data-[swipe=cancel]:translate-x-0',
        'data-[swipe=end]:animate-out data-[swipe=end]:slide-out-to-right-full',
        content ? 'w-full' : 'w-fit',
      )}
    >
      <Icon
        className={clsx('mt-0.5 size-4 shrink-0', iconClassName)}
        aria-hidden="true"
      />

      {content && (
        <RadixToast.Description asChild>
          <div className="text-body-sm flex-1 text-foreground">{content}</div>
        </RadixToast.Description>
      )}

      {mode !== 'loading' && content && (
        <RadixToast.Close
          aria-label="Dismiss"
          className={clsx(
            'shrink-0 rounded-md p-1 text-muted-foreground transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          )}
        >
          <X className="size-3.5" />
        </RadixToast.Close>
      )}
    </RadixToast.Root>
  );
};

export default ToastItem;
