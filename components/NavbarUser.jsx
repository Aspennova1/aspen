"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LoginModal } from './Login/LoginModal';
import { useAuth } from "./context/AuthContext";
// import { useAuthModal } from "@/components/context/AuthModalContext";
import { usePathname, useRouter } from 'next/navigation';

export function NavbarUser() {
  const {user, loading, loadUser, setUser} = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  async function handleLogout() {
    await fetch("/api/logout", { method: "GET" });
    setUser(null);
    router.push('/');
  }

  if (loading) return null;

  // ⭐ NOT LOGGED IN → show login modal
  if (!user) {

    return <LoginModal />;
  }

  // ⭐ LOGGED IN → show user info + logout
  return (
    <div className="flex items-center gap-4">
      <div
      className={`text-sm font-medium ${
        pathname === '/' ? 'text-white' : ''
      }`}
    >
        {user.name} — {user.role}
      </div>
      <Button variant="outline" size="sm" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}
