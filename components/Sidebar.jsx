'use client';
import Logo from '@/assets/logo.png';
import links from '@/utils/links';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import AGLogo from './AGLogo';
import { usePathname } from 'next/navigation';
import { useAuth } from "./context/AuthContext";
import { useEffect, useState } from 'react';

function Sidebar() {
  const pathname = usePathname();
  const [filteredLinks, Setlinks] = useState();
  const {user} = useAuth();

  useEffect(()=>{
    Setlinks(links.filter(link =>
      link.roles.includes(user?.roleId)
    ));
  },[user])
  return (
    <aside className='py-4 bg-muted px-8 h-full'>
        <div className="flex items-center gap-3">
          <AGLogo />
          {/* <Image src={Logo} alt="Aspen Logo" width={50} height={50} /> */}
          <Link href='/'>
            <h3 className="text-xl font-semibold">Aspen Group</h3>
          </Link>
        </div>
      {/* <Image src={Logo} className='mx-auto'  alt="Aspen Logo" width={50} height={50}  /> */}
      <div className='flex flex-col mt-20 gap-y-4'>
        {(filteredLinks && filteredLinks.length) && filteredLinks.map((link) => {
          return (
            <Button
              asChild
              key={link.href}
              variant={pathname === link.href ? 'default' : 'link'}
            >
              <Link href={link.href} className='flex items-center gap-x-2'>
                {link.icon} <span className='capitalize'>{link.label}</span>
              </Link>
            </Button>
          );
        })}
      </div>
    </aside>
  );
}
export default Sidebar;