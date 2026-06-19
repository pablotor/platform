'use client';

import { ToastMode, ToastRecord } from './types';
import * as store from './store';
import React from 'react';

type ToastOptions = {
  toastKey?: string;
  mode?: ToastMode;
  content?: string | React.ReactNode;
  duration?: number;
};

const DEFAULT_DURATIONS: Record<ToastMode, number> = {
  loading: Infinity, // loading toasts wait to be updated, not timed out
  info: 4000,
  success: 4000,
  error: 6000,
};

let count = 0;
const genId = (): string => `toast-${++count}`;

// keeps "key" -> "id" so calling toast() again with the same key updates
// the existing toast instead of creating a new one
const keyToId = new Map<string, string>();

interface ToastHandle {
  id: string;
  update: (props: Partial<Omit<ToastRecord, 'id'>>) => void;
  dismiss: () => void;
}

/**
 * Show a toast. Returns handles to imperatively update or dismiss it later.
 *
 *   const t = toast({ mode: 'loading', content: 'Saving…', key: 'save' })
 *   // later, from anywhere:
 *   toast({ key: 'save', mode: 'success', content: 'Saved' })
 *   // or:
 *   t.update({ mode: 'success', content: 'Saved' })
 */
const toast = ({
  toastKey,
  mode = 'info',
  content,
  duration,
}: ToastOptions): ToastHandle => {
  const id =
    toastKey && keyToId.has(toastKey)
      ? (keyToId.get(toastKey) as string)
      : genId();
  if (toastKey) keyToId.set(toastKey, id);

  const resolvedDuration = duration ?? DEFAULT_DURATIONS[mode];
  const exists = store.exists(id);

  if (exists) {
    store.dispatch({
      type: 'UPDATE_TOAST',
      toast: { id, mode, content, duration: resolvedDuration, open: true },
    });
  } else {
    store.dispatch({
      type: 'ADD_TOAST',
      toast: {
        id,
        toastKey,
        mode,
        content,
        duration: resolvedDuration,
        open: true,
      },
    });
  }

  return {
    id,
    update: (props) =>
      store.dispatch({ type: 'UPDATE_TOAST', toast: { ...props, id } }),
    dismiss: () => store.dismiss(id),
  };
};

export const useToast = () => {
  const state = React.useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
  return { toasts: state.toasts, toast, dismiss: store.dismiss };
};
