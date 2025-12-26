"use client";

import { createContext, useContext, useState } from "react";

interface AuthModalContextType {
  open: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | null>(null);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  function openAuthModal() {
    setOpen(true);
  }

  function closeAuthModal() {
    setOpen(false);
  }

  return (
    <AuthModalContext.Provider value={{ open, openAuthModal, closeAuthModal }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used inside AuthModalProvider");
  return ctx;
}
