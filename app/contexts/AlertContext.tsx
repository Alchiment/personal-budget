'use client';

import React, { createContext, useState, useCallback, useContext } from 'react';
import { AlertBannerVariant } from '../components/molecules/AlertBanner';

interface AlertState {
  message: string;
  variant: AlertBannerVariant;
}

interface AlertContextValue {
  alert: AlertState | null;
  showAlert: (message: string, variant?: AlertBannerVariant) => void;
  clearAlert: () => void;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = useState<AlertState | null>(null);

  const showAlert = useCallback((message: string, variant: AlertBannerVariant = 'error') => {
    setAlert({ message, variant });
  }, []);

  const clearAlert = useCallback(() => {
    setAlert(null);
  }, []);

  return (
    <AlertContext.Provider value={{ alert, showAlert, clearAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}
