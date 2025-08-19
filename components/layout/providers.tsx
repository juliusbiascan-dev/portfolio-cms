'use client';

import React from 'react';
import { ActiveThemeProvider } from '../active-theme';
import { SessionProvider } from 'next-auth/react';
import { ModalProvider } from './modal-provider';

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <ActiveThemeProvider initialTheme={activeThemeValue}>
        <SessionProvider>

          {children}
          <ModalProvider />
        </SessionProvider>

      </ActiveThemeProvider>
    </>
  );
}
