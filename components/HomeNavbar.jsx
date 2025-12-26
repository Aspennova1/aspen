'use client'
import LinksDropdown from './LinksDropdown';
// import { UserButton } from '@clerk/nextjs';
import Logo from '../assets/logo.png';
import Image from 'next/image';
import {ModeToggle} from './ThemeToggle';
import AGLogo from './AGLogo';
import { LoginModal } from './Login/LoginModal';
import {NavbarUser} from './NavbarUser';
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from 'react';
import { useAuthModal } from "@/components/context/AuthModalContext";
import Link from 'next/link';
import { NAV_LINKS } from '@/utils/links';
import { useAuth } from './context/AuthContext';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';


function HomeNavbar() {
  const {openAuthModal, closeAuthModal, open} = useAuthModal();
  const {user} = useAuth();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    if (searchParams.get("login") === "true") {
      openAuthModal(); // ⭐ opens global login modal
    }
  }, [searchParams]);

  return (
    <nav
      className="
        fixed top-0 left-0 w-full h-20 z-50
        px-4 sm:px-16 lg:px-24
        flex items-center justify-between
        backdrop-blur-sm shadow-sm
      "
      style={{
        background:
          'linear-gradient(180deg, rgba(0,0,0,0.4), transparent, rgba(0,54,70,0.8))',
        backgroundColor: 'rgba(0, 54, 70, 0.6)',
      }}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <AGLogo />

        <Link href="/">
          <h3 className="text-xl font-semibold text-white">
            Aspen Group
          </h3>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center ml-6">
          {NAV_LINKS.map(link => {
            if (link.requiresAuth && !user) return null;
            if (!link.requiresAuth && user) return null;

            return (
              <Link
                key={link.href}
                href={link.href}
                className="
                  relative inline-flex items-center gap-x-2 mr-6
                  text-sm font-medium text-white
                  after:absolute after:left-0 after:-bottom-1
                  after:h-[2px] after:w-0 after:bg-green-500
                  after:transition-all after:duration-300
                  hover:text-green-500 hover:after:w-full
                "
              >
                {link.icon}
                <span className="capitalize">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* RIGHT (DESKTOP) */}
      <div className="hidden md:flex items-center gap-x-4">
        <NavbarUser />
      </div>

      {/* HAMBURGER (MOBILE) */}
      <button
        className="md:hidden text-white"
        onClick={() => setMobileOpen(prev => !prev)}
      >
        {mobileOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div
          className="
            absolute top-20 left-0 w-full
            bg-slate-900/95 backdrop-blur-md
            border-t border-white/10
            px-6 py-6 space-y-5
            md:hidden
          "
        >
          {NAV_LINKS.map(link => {
            if (link.requiresAuth && !user) return null;
            if (!link.requiresAuth && user) return null;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-x-3 text-white text-sm font-medium"
              >
                {link.icon}
                <span className="capitalize">{link.label}</span>
              </Link>
            );
          })}

          <NavbarUser />
        </div>
      )}
    </nav>
  );
}
export default HomeNavbar;