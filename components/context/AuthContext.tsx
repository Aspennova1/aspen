"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: any;
  loading: boolean;
  loadUser: () => Promise<void>;
  setUser: (u: any) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    try {
      const res = await fetch("/api/me");
      const data = await res.json();
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  }

  // load once on mount
  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, loadUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
