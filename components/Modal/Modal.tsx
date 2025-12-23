'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import styles from './Modal.module.css';

// Alert Modal
interface AlertOptions {
  title?: string;
  message: string;
  confirmText?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

// Confirm Modal
interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'error';
  danger?: boolean;
}

interface ModalContextValue {
  alert: (options: AlertOptions | string) => Promise<void>;
  confirm: (options: ConfirmOptions | string) => Promise<boolean>;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

type ModalState = 
  | { type: 'alert'; options: AlertOptions; resolve: () => void }
  | { type: 'confirm'; options: ConfirmOptions; resolve: (value: boolean) => void }
  | null;

const typeIcons = {
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.icon}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
  success: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.icon}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.icon}>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.icon}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
};

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalState>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const alert = useCallback((options: AlertOptions | string): Promise<void> => {
    return new Promise((resolve) => {
      const opts = typeof options === 'string' ? { message: options } : options;
      previousFocusRef.current = document.activeElement as HTMLElement;
      setModal({ type: 'alert', options: opts, resolve });
    });
  }, []);

  const confirm = useCallback((options: ConfirmOptions | string): Promise<boolean> => {
    return new Promise((resolve) => {
      const opts = typeof options === 'string' ? { message: options } : options;
      previousFocusRef.current = document.activeElement as HTMLElement;
      setModal({ type: 'confirm', options: opts, resolve });
    });
  }, []);

  const handleClose = useCallback(() => {
    if (modal?.type === 'alert') {
      modal.resolve();
    } else if (modal?.type === 'confirm') {
      modal.resolve(false);
    }
    setModal(null);
    previousFocusRef.current?.focus();
  }, [modal]);

  const handleConfirm = useCallback(() => {
    if (modal?.type === 'alert') {
      modal.resolve();
    } else if (modal?.type === 'confirm') {
      modal.resolve(true);
    }
    setModal(null);
    previousFocusRef.current?.focus();
  }, [modal]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modal) {
        handleClose();
      }
    };

    if (modal) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [modal, handleClose]);

  // Focus trap
  useEffect(() => {
    if (modal && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[focusableElements.length - 1].focus();
      }
    }
  }, [modal]);

  const renderModal = () => {
    if (!modal) return null;

    const isAlert = modal.type === 'alert';
    const options = modal.options;
    const type = options.type || 'info';
    const isDanger = !isAlert && (options as ConfirmOptions).danger;

    return (
      <div className={styles.overlay} onClick={handleClose}>
        <div 
          ref={modalRef}
          className={styles.modal} 
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby={options.title ? 'modal-title' : undefined}
          aria-describedby="modal-message"
        >
          <div className={`${styles.iconContainer} ${styles[type]}`}>
            {typeIcons[type]}
          </div>
          
          <div className={styles.content}>
            {options.title && (
              <h2 id="modal-title" className={styles.title}>
                {options.title}
              </h2>
            )}
            <p id="modal-message" className={styles.message}>
              {options.message}
            </p>
          </div>

          <div className={styles.actions}>
            {!isAlert && (
              <button
                className={styles.cancelButton}
                onClick={handleClose}
              >
                {(options as ConfirmOptions).cancelText || '취소'}
              </button>
            )}
            <button
              className={`${styles.confirmButton} ${isDanger ? styles.danger : ''}`}
              onClick={handleConfirm}
            >
              {options.confirmText || '확인'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ModalContext.Provider value={{ alert, confirm }}>
      {children}
      {renderModal()}
    </ModalContext.Provider>
  );
}
