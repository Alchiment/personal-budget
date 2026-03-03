'use client';

import React, { createContext, useContext } from 'react';

interface UserContextValue {
  name?: string;
  email: string;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
  name?: string;
  email: string;
}

export function UserProvider({ children, name, email }: UserProviderProps) {
  return (
    <UserContext.Provider value={{ name, email }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
