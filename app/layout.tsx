import React from 'react';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';
import '@/styles/index.scss';
import { cn } from '@/lib/utils';
import NavigationMenu from '@/components/Layout/NavigationMenu';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'LinkedIn Project',
  description: 'LinkedIn Clone',
  icons: {
    icon: '/icon.ico',
  },
};

/* ROOT SHARED NEXT.JS LAYOUT */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <NavigationMenu>{children}</NavigationMenu>
      </body>
    </html>
  );
}
