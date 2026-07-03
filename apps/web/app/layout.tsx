import './globals.css';

import { ToastProvider } from '@repo/ui/toast/provider';
import clsx from 'clsx';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { PropsWithChildren } from 'react';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});
const ubuntuSans = localFont({
  src: [
    {
      path: './fonts/Ubuntu-100.ttf',
      weight: '100',
    },
    {
      path: './fonts/Ubuntu-300.ttf',
      weight: '300',
    },
    {
      path: './fonts/Ubuntu-400.ttf',
      weight: '400',
    },
    {
      path: './fonts/Ubuntu-500.ttf',
      weight: '500',
    },
    {
      path: './fonts/Ubuntu-700.ttf',
      weight: '700',
    },
  ],
  variable: '--font-ubuntu-sans',
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_META_TITLE,
  description: process.env.NEXT_PUBLIC_META_DESCRIPTION,
};

const RootLayout = async ({ children }: Readonly<PropsWithChildren>) => (
  <html lang="en">
    <body
      className={clsx(
        geistMono.variable,
        geistSans.variable,
        ubuntuSans.variable,
      )}
    >
      <ToastProvider>{children}</ToastProvider>
    </body>
  </html>
);

export default RootLayout;
