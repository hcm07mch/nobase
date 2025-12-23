'use client';

import { ReactNode } from 'react';
import { ToastProvider } from '@/components/Toast';
import { ModalProvider } from '@/components/Modal';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <ModalProvider>
        {children}
      </ModalProvider>
    </ToastProvider>
  );
}
