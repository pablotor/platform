'use client';

import * as RadixToast from '@radix-ui/react-toast';
import ToastItem from './item';
import { useToast } from './handler';
import { PropsWithChildren } from 'react';

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const { toasts } = useToast();

  return (
    <RadixToast.Provider swipeDirection="right">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} />
      ))}
      <RadixToast.Viewport
        className="
          fixed bottom-4 right-4 z-100 flex w-full max-w-sm
          flex-col items-end gap-2 outline-none
        "
      />
      {children}
    </RadixToast.Provider>
  );
};
